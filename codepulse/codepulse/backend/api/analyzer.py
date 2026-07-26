import urllib.request
import json
import logging
import ast
from django.conf import settings

logger = logging.getLogger(__name__)

# List of all 15 Error Library titles in CodePulse
KNOWN_LIBRARY_ERRORS = [
    "Unused Local Variable",
    "SyntaxError: Missing Colon",
    "IndentationError: Mismatched Blocks",
    "NameError: Undefined Variable",
    "Shadowing Builtin Name",
    "ZeroDivisionError Risk",
    "Mutable Default Argument",
    "Unreachable Code",
    "TypeError: Operation Mismatch",
    "Infinite Loop Risk",
    "Excessive Block Nesting",
    "Deprecated Syntax Warning",
    "Implicit None Return Value",
    "Redundant Boolean Comparison",
    "Duplicate Library Import"
]

def analyze_code_with_ast_and_gemini(code, error_definitions=None):
    if not code or not code.strip():
        return {
            "code": code,
            "errors": 0,
            "warnings": 0,
            "score": 100,
            "status": "Clean",
            "issues": []
        }

    known_titles = KNOWN_LIBRARY_ERRORS
    if error_definitions:
        known_titles = [v["name"] for v in error_definitions.values() if "name" in v]

    api_key = getattr(settings, "GEMINI_API_KEY", "")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"

    system_prompt = f"""You are an expert Python code diagnostic tool.
Analyze the provided Python code for ALL syntax errors, indentation errors, invalid statements, undefined variables, type mismatches, logic bugs, and style issues.

Here is the list of Error Library Titles in our database:
{json.dumps(known_titles, indent=2)}

Return a JSON object with this EXACT structure:
{{
  "errors": <integer count of errors>,
  "warnings": <integer count of warnings>,
  "score": <calculated score from 0 to 100>,
  "status": "<'Needs Work' if errors > 0 else 'Clean'>",
  "issues": [
    {{
      "line": <1-based line number (integer)>,
      "type": "<'error' or 'warning'>",
      "title": "<Exact Error Title e.g. 'SyntaxError: invalid syntax' or one of the Error Library Titles>",
      "in_library": <true if title matches an Error Library Title, false otherwise>,
      "summary": "<Concise summary if in_library is true, OR 'This error is not mentioned in errorlibrary' if in_library is false>",
      "details": {{
        "newbie": "<Beginner explanation if in_library is true, OR 'This error is not mentioned in errorlibrary' if in_library is false>",
        "comfortable": "<Technical explanation if in_library is true, OR 'This error is not mentioned in errorlibrary' if in_library is false>",
        "facts": "<Solution fix if in_library is true, OR 'This error is not mentioned in errorlibrary' if in_library is false>"
      }}
    }}
  ]
}}

CRITICAL RULES:
1. Thoroughly inspect EVERY line of code for invalid Python syntax, loose keywords (like standalone 'hello' or 'def'), broken indentation, missing colons, undefined variables, etc.
2. If an issue matches one of the Error Library Titles, set in_library to true and provide full newbie/comfortable/facts explanations.
3. If an issue is NOT in the Error Library Titles (e.g. 'SyntaxError: invalid syntax', 'NameError: name is not defined', etc.), set title to the exact error name (e.g. "SyntaxError: invalid syntax"), set in_library to false, and set summary, details.newbie, details.comfortable, and details.facts to EXACTLY "This error is not mentioned in errorlibrary".
4. Output valid raw JSON matching the schema.
"""

    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"{system_prompt}\n\nCode to analyze:\n```python\n{code}\n```"}]}
        ],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    ai_result = None
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            text_content = res['candidates'][0]['content']['parts'][0]['text'].strip()
            if text_content.startswith("```"):
                lines = text_content.splitlines()
                if lines and lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                text_content = "\n".join(lines).strip()
            ai_result = json.loads(text_content)
    except Exception as e:
        logger.error("Gemini API call error: %s", e)

    # Backup Python AST parser to catch syntax errors if AI failed or missed a line
    ast_issue = None
    try:
        ast.parse(code)
    except SyntaxError as e:
        err_msg = e.msg or "invalid syntax"
        err_line = e.lineno or 1
        ast_title = f"SyntaxError: {err_msg}"
        ast_issue = {
            "line": err_line,
            "type": "error",
            "title": ast_title,
            "summary": "This error is not mentioned in errorlibrary",
            "details": {
                "newbie": "This error is not mentioned in errorlibrary",
                "comfortable": "This error is not mentioned in errorlibrary",
                "facts": "This error is not mentioned in errorlibrary"
            }
        }

    raw_issues = ai_result.get("issues", []) if ai_result else []

    if ast_issue and not any(i.get("line") == ast_issue["line"] for i in raw_issues):
        raw_issues.insert(0, ast_issue)

    formatted_issues = []
    for issue in raw_issues:
        title = issue.get("title", "SyntaxError: invalid syntax")
        line = issue.get("line", 1)
        issue_type = issue.get("type", "error").lower()
        is_error = issue_type == "error"

        matched_library = None
        for known_title in known_titles:
            if known_title.lower() in title.lower() or title.lower() in known_title.lower():
                matched_library = known_title
                break

        if matched_library:
            title = matched_library
            summary = issue.get("summary") or "An anomaly matching the Error Library was detected."
            if "not in library" in summary.lower() or "not mentioned" in summary.lower():
                summary = f"{matched_library} detected."

            details = issue.get("details", {})
            newbie = details.get("newbie") if isinstance(details, dict) else str(details)
            comfortable = details.get("comfortable") if isinstance(details, dict) else str(details)
            facts = details.get("facts") if isinstance(details, dict) else str(details)

            if not newbie or "not in library" in newbie.lower() or "not mentioned" in newbie.lower():
                if error_definitions:
                    for eid, edef in error_definitions.items():
                        if edef.get("name") == matched_library:
                            def_details = edef.get("details", {})
                            newbie = def_details.get("newbie", summary)
                            comfortable = def_details.get("comfortable", summary)
                            facts = def_details.get("facts", summary)
                            break
        else:
            summary = "This error is not mentioned in errorlibrary"
            newbie = "This error is not mentioned in errorlibrary"
            comfortable = "This error is not mentioned in errorlibrary"
            facts = "This error is not mentioned in errorlibrary"

        formatted_issues.append({
            "line": line,
            "type": issue_type,
            "color": "var(--accent-danger)" if is_error else "var(--accent-warning)",
            "badge": "Error" if is_error else "Warning",
            "title": title,
            "summary": summary,
            "details": {
                "newbie": newbie,
                "comfortable": comfortable,
                "facts": facts
            }
        })

    errors_count = len([i for i in formatted_issues if i["type"] == "error"])
    warnings_count = len([i for i in formatted_issues if i["type"] == "warning"])
    score = max(0, 100 - (errors_count * 20 + warnings_count * 10))
    status = "Needs Work" if errors_count > 0 else "Clean"

    return {
        "code": code,
        "errors": errors_count,
        "warnings": warnings_count,
        "score": score,
        "status": status,
        "issues": formatted_issues
    }

def analyze_code(code, error_definitions=None):
    return analyze_code_with_ast_and_gemini(code, error_definitions)
