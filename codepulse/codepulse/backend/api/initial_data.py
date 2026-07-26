INITIAL_ERRORS = [
  {
    "id": "unused_variable",
    "name": "Unused Local Variable",
    "severity": "Warning",
    "category": "Style",
    "description": "Variable is declared but its value is never referenced in subsequent calculations.",
    "details_newbie": "You set aside a label but never actually used it. It's like buying a tool and keeping it in the box. Declutter by removing it!",
    "details_comfortable": "Local variable is instantiated but never read in the current scope. This creates dead variables and wastes stack allocations.",
    "details_facts": "Remove the variable declaration entirely, or ensure it is used in subsequent operations.",
    "broken": "def calculate_area(r):\n    pi = 3.14\n    factor = 1.2  # Unused\n    return pi * r * r",
    "fixed": "def calculate_area(r):\n    pi = 3.14\n    return pi * r * r"
  },
  {
    "id": "missing_colon",
    "name": "SyntaxError: Missing Colon",
    "severity": "Error",
    "category": "Syntax",
    "description": "Expected a colon ':' at the end of control flow statements (if, for, while, def).",
    "details_newbie": "In Python, a colon is like saying 'then do the following:'. The computer needs this colon to understand where the header ends and your steps begin.",
    "details_comfortable": "Python grammar demands a colon punctuation mark at the termination of block headers (functions, conditional blocks, loop statements).",
    "details_facts": "Append a colon ':' to the end of the header line.",
    "broken": "def check_positive(num)\n    if num > 0\n        return True",
    "fixed": "def check_positive(num):\n    if num > 0:\n        return True"
  },
  {
    "id": "indentation_error",
    "name": "IndentationError: Mismatched Blocks",
    "severity": "Error",
    "category": "Syntax",
    "description": "Indentation level does not match any outer indentation levels inside block hierarchies.",
    "details_newbie": "Python uses alignment spaces to group code lines together. If one line starts further left or right than its siblings in the same block, Python gets confused.",
    "details_comfortable": "In Python, blocks of code are defined by indentation rather than brackets. Inconsistent indentation offsets trigger IndentationError during compilation.",
    "details_facts": "Align siblings in a block to identical spacing offsets (typically 4 spaces).",
    "broken": "def double_value(x):\n  val = x * 2\n    return val  # Mismatched indent",
    "fixed": "def double_value(x):\n    val = x * 2\n    return val"
  },
  {
    "id": "undefined_variable",
    "name": "NameError: Undefined Variable",
    "severity": "Error",
    "category": "Logic",
    "description": "Referencing a local or global identifier name that does not exist in active memory scope namespaces.",
    "details_newbie": "You are asking the computer to lookup a word it has never heard before. Ensure you declared it or spelled the name correctly!",
    "details_comfortable": "The identifier is referenced prior to binding or falls outside the lookup hierarchy of local, enclosed, global, and builtin (LEGB) scopes.",
    "details_facts": "Define the variable before reading it, or fix spellings in the reference.",
    "broken": "def apply_coefficient(val):\n    return val * multiplier  # multiplier is not defined",
    "fixed": "def apply_coefficient(val):\n    multiplier = 1.05\n    return val * multiplier"
  },
  {
    "id": "shadowing_builtin",
    "name": "Shadowing Builtin Name",
    "severity": "Warning",
    "category": "Style",
    "description": "Defining a variable naming convention that conflicts with built-in functions (e.g. list, dict, type).",
    "details_newbie": "You named your variable 'list'. This causes problems because Python already has a built-in helper named 'list'. Use a more specific name like 'user_list'!",
    "details_comfortable": "Local assignment overrides a builtin function name in the local namespace. This prevents calling the global builtin utility in this context.",
    "details_facts": "Rename local identifier to avoid conflicts with global builtins (e.g., rename 'list' to 'items').",
    "broken": "def build_roster():\n    list = ['Alex', 'Morgan']  # Shadows builtin list()\n    return list",
    "fixed": "def build_roster():\n    roster_list = ['Alex', 'Morgan']\n    return roster_list"
  },
  {
    "id": "division_by_zero",
    "name": "ZeroDivisionError Risk",
    "severity": "Error",
    "category": "Logic",
    "description": "Evaluating numerical division where divisor operand defaults to zero without bounds checks.",
    "details_newbie": "Splitting an item into 0 groups is mathematically impossible. The computer will crash! Protect it by checking if the divisor is zero first.",
    "details_comfortable": "Expression evaluation leads to a zero value in the denominator during runtime. Safe guards must check divisor boundaries before executing division operations.",
    "details_facts": "Prepend division with a conditional block checking if the divisor is not equal to zero.",
    "broken": "def compute_ratio(total, count):\n    return total / count",
    "fixed": "def compute_ratio(total, count):\n    if count == 0:\n        return 0\n    return total / count"
  },
  {
    "id": "mutable_default_argument",
    "name": "Mutable Default Argument",
    "severity": "Warning",
    "category": "Logic",
    "description": "Using mutable datatypes (lists, dicts) as default arguments in function definitions.",
    "details_newbie": "If you set a default list in a function, Python reuses the same list every time you call it! Modifications in call #1 bleed into call #2. Set default to 'None' instead.",
    "details_comfortable": "Default parameter bindings are evaluated once at function definition time. Subsequent invocations share the same mutable object reference.",
    "details_facts": "Replace default parameter value with `None` and instantiate mutable inside function body.",
    "broken": "def append_node(val, nodes=[]):\n    nodes.append(val)\n    return nodes",
    "fixed": "def append_node(val, nodes=None):\n    if nodes is None:\n        nodes = []\n    nodes.append(val)\n    return nodes"
  },
  {
    "id": "unreachable_code",
    "name": "Unreachable Code",
    "severity": "Warning",
    "category": "Style",
    "description": "Statements existing post return, break, continue, or raise keywords within a block hierarchy.",
    "details_newbie": "You wrote statements after a 'return'. Since return finishes the function, the computer exits before ever reading your statements.",
    "details_comfortable": "Static syntax paths indicate statements located after an unconditional branch instruction, meaning they can never be executed.",
    "details_facts": "Remove dead statements post branch instruction, or move them before the branch control statement.",
    "broken": "def check_status(active):\n    if active:\n        return 'Online'\n        print('Status confirmed')  # Unreachable\n    return 'Offline'",
    "fixed": "def check_status(active):\n    if active:\n        print('Status confirmed')\n        return 'Online'\n    return 'Offline'"
  },
  {
    "id": "type_mismatch",
    "name": "TypeError: Operation Mismatch",
    "severity": "Error",
    "category": "Logic",
    "description": "Combining incompatible data types in an operator expression (e.g. concatenating string and integer).",
    "details_newbie": "You are attempting to add a number directly to text. The computer doesn't know whether to treat this as math or writing. Cast the number to text first!",
    "details_comfortable": "Operator execution is invalid on operands of these incompatible types. Python does not support implicit coercions for distinct type systems.",
    "details_facts": "Explicitly cast operands before evaluation (e.g., wrap numeric values in `str()`).",
    "broken": "def print_score(name, score):\n    print(name + ' scored: ' + score)  # score is an int",
    "fixed": "def print_score(name, score):\n    print(name + ' scored: ' + str(score))"
  },
  {
    "id": "infinite_loop",
    "name": "Infinite Loop Risk",
    "severity": "Error",
    "category": "Logic",
    "description": "Control loops lacking updating constraints in exit conditions, leading to thread locking.",
    "details_newbie": "You created a loop that runs as long as a condition is true, but nothing changes that condition inside the loop! Your code will run forever and freeze.",
    "details_comfortable": "The loop invariant does not progress toward boundary termination triggers, preventing loop bounds closure.",
    "details_facts": "Update iteration values inside loop body or add explicit conditional breaks.",
    "broken": "def run_timer(limit):\n    count = 0\n    while count < limit:\n        print(count)\n        # count is never updated",
    "fixed": "def run_timer(limit):\n    count = 0\n    while count < limit:\n        print(count)\n        count += 1"
  },
  {
    "id": "nested_blocks",
    "name": "Excessive Block Nesting",
    "severity": "Warning",
    "category": "Style",
    "description": "Deeply nested conditional block configurations, reducing readability metrics.",
    "details_newbie": "Your code is sliding off the right side of the screen due to too many nested if-statements. Use 'guard clauses' to return early and simplify visual structure.",
    "details_comfortable": "Nesting depth exceeds recommended limits. Refactor logic branches using guard conditions or extract nested structures into sub-routines.",
    "details_facts": "Restructure conditionals to return early, or unpack statements into helper functions.",
    "broken": "def process_data(data):\n    if data:\n        if 'status' in data:\n            if data['status'] == 'active':\n                # Nesting is too deep\n                return True",
    "fixed": "def process_data(data):\n    if not data or 'status' not in data:\n        return False\n    if data['status'] == 'active':\n        return True"
  },
  {
    "id": "deprecated_syntax",
    "name": "Deprecated Syntax Warning",
    "severity": "Warning",
    "category": "Syntax",
    "description": "Using outdated or discouraged operators/functions (e.g. old string interpolation formatting).",
    "details_newbie": "You are using older formats to merge text. Modern Python uses 'f-strings' which are cleaner, faster, and much easier to read!",
    "details_comfortable": "Code contains formatting syntax superseded in modern specifications. Restructuring to f-strings offers improved performance.",
    "details_facts": "Replace old percent '%' operator formatting with clean f-string syntaxes.",
    "broken": "def greet_user(name):\n    return 'Hello %s' % name",
    "fixed": "def greet_user(name):\n    return f'Hello {name}'"
  },
  {
    "id": "missing_return",
    "name": "Implicit None Return Value",
    "severity": "Warning",
    "category": "Logic",
    "description": "Function leaves execution paths without returning a value, implicitly returning None.",
    "details_newbie": "Your function performs calculations but forgets to send the results back to the caller! Add a 'return' statement at the bottom.",
    "details_comfortable": "Function ends implicitly without executing a return statement, returning None back to the caller scope. Specify returns explicitly.",
    "details_facts": "Add an explicit return statement at the bottom of the execution branch.",
    "broken": "def sum_values(a, b):\n    result = a + b\n    # Forgotten return",
    "fixed": "def sum_values(a, b):\n    result = a + b\n    return result"
  },
  {
    "id": "comparative_truth",
    "name": "Redundant Boolean Comparison",
    "severity": "Warning",
    "category": "Style",
    "description": "Comparing variables explicitly with True/False literals instead of checking truthiness.",
    "details_newbie": "Saying 'if active == True:' is repetitive. Just say 'if active:'—it means the exact same thing but is cleaner!",
    "details_comfortable": "Boolean expressions contain redundant comparison operations. Use variable truthiness tests directly.",
    "details_facts": "Remove explicit truth validations (e.g., simplify `if x == True:` to `if x:`).",
    "broken": "def verify_access(admin):\n    if admin == True:\n        return True",
    "fixed": "def verify_access(admin):\n    if admin:\n        return True"
  },
  {
    "id": "duplicate_import",
    "name": "Duplicate Library Import",
    "severity": "Warning",
    "category": "Style",
    "description": "Importing the identical library module multiple times inside a single file scope.",
    "details_newbie": "You imported the same package twice! The computer already remembers it from the first time, so you can delete the second import.",
    "details_comfortable": "Duplicate import statement overrides existing module reference in global context, which is redundant.",
    "details_facts": "Remove the secondary import statement to clean global namespace declarations.",
    "broken": "import os\nimport math\nimport os  # Duplicate\n",
    "fixed": "import os\nimport math\n"
  }
]

INITIAL_PUZZLES = [
  {
    "key": "undefined_variable",
    "error_name": "NameError: Undefined Variable",
    "broken": "def compute_ratio(speed, time):\n    # multiplier is missing!\n    return speed * time * multiplier",
    "hint": "Declare a local variable 'multiplier' (e.g. set it to 1.15) before returning the value.",
    "solution": "def compute_ratio(speed, time):\n    multiplier = 1.15\n    return speed * time * multiplier"
  },
  {
    "key": "missing_colon",
    "error_name": "SyntaxError: Missing Colon",
    "broken": "def apply_offset(x, offset)\n    if x > 100\n        return x + offset\n    return x",
    "hint": "Make sure all function definitions and conditional branch headers end with a colon ':'.",
    "solution": "def apply_offset(x, offset):\n    if x > 100:\n        return x + offset\n    return x"
  },
  {
    "key": "indentation_error",
    "error_name": "IndentationError: Mismatched Blocks",
    "broken": "def run_analysis(data):\n    count = len(data)\n  print(\"Analysing...\") # Inconsistent spacing\n    return count",
    "hint": "Match the indentation level of print statement (4 spaces) with the other lines inside function body.",
    "solution": "def run_analysis(data):\n    count = len(data)\n    print(\"Analysing...\")\n    return count"
  }
]
