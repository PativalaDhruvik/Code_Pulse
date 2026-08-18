import urllib.request
import json
import logging
import ast
from django.conf import settings

logger = logging.getLogger(__name__)

# List of all 19 Error Library titles in CodePulse
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

def extract_error_word(line_text, column=None):
    """Helper to pinpoint the exact token/word where the error cursor is located in a code line."""
    if not line_text:
        return ""
    line_str = line_text.strip("\r\n")
    if not line_str:
        return ""

    if column is not None and column > 0:
        col_idx = min(max(0, column - 1), len(line_str) - 1)
        # If character at col_idx is alphanumeric or '_'
        if line_str[col_idx].isalnum() or line_str[col_idx] == '_':
            start = col_idx
            while start > 0 and (line_str[start - 1].isalnum() or line_str[start - 1] == '_'):
                start -= 1
            end = col_idx
            while end < len(line_str) - 1 and (line_str[end + 1].isalnum() or line_str[end + 1] == '_'):
                end += 1
            return line_str[start:end + 1]
        
        # If character is punctuation/operator
        if not line_str[col_idx].isspace():
            return line_str[col_idx]

        # If whitespace, check immediately left
        left_part = line_str[:col_idx].rstrip()
        if left_part:
            words = [w.strip("():,") for w in left_part.split() if w.strip("():,")]
            if words:
                return words[-1]

    # Fallback to last token in line
    words = [w.strip("():,") for w in line_str.split() if w.strip("():,")]
    return words[-1] if words else line_str.strip()


# Purpose: Main diagnostics engine that combines Python AST for syntax validation and Gemini LLM for code analysis.
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

    api_key = getattr(settings, "GEMINI_API_KEY", "") or os.environ.get("GEMINI_API_KEY", "")
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
      "column": <1-based column position where error starts (integer)>,
      "error_word": "<exact erroneous variable/keyword/token in the line e.g. 'item_name', 'threshold', ':'>",
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
2. Provide exact line number, column cursor offset, and error_word for every issue.
3. If an issue matches one of the Error Library Titles, set in_library to true and provide full newbie/comfortable/facts explanations.
4. If an issue is NOT in the Error Library Titles (e.g. 'SyntaxError: invalid syntax', 'NameError: name is not defined', etc.), set title to the exact error name (e.g. "SyntaxError: invalid syntax"), set in_library to false, and set summary, details.newbie, details.comfortable, and details.facts to EXACTLY "This error is not mentioned in errorlibrary".
5. Output valid raw JSON matching the schema.
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

    code_lines = code.splitlines()

    # Backup Python AST parser to catch syntax errors if AI failed or missed a line
    ast_issue = None
    try:
        ast.parse(code)
    except SyntaxError as e:
        err_msg = e.msg or "invalid syntax"
        err_line = e.lineno or 1
        err_column = e.offset or 1
        err_text = e.text or (code_lines[err_line - 1] if 0 <= err_line - 1 < len(code_lines) else "")
        error_word = extract_error_word(err_text, err_column)
        ast_title = f"SyntaxError: {err_msg}"
        ast_issue = {
            "line": err_line,
            "column": err_column,
            "error_word": error_word,
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

    # Hydrates 3-Tier Educational Explanations & Error Cursor Word
    formatted_issues = []
    for issue in raw_issues:
        title = issue.get("title", "SyntaxError: invalid syntax")
        line = issue.get("line", 1)
        column = issue.get("column", 1)
        error_word = issue.get("error_word") or issue.get("word")

        line_code = code_lines[line - 1] if 0 <= line - 1 < len(code_lines) else ""
        if not error_word:
            error_word = extract_error_word(line_code, column)

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
            "column": column,
            "error_word": error_word,
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
# for calculating the Score
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
# for return the data
def analyze_code(code, error_definitions=None):
    return analyze_code_with_ast_and_gemini(code, error_definitions)
