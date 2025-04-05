# RefactorMate

A lightweight code refactoring assistant that helps identify code smells and suggests improvements.

## Features

- ✅ Static analysis for JavaScript/TypeScript and Python
- ✅ Detection of common code smells:
  - Long methods (>20 lines)
  - Long parameter lists (>4 parameters)
- ✅ Command-line interface with formatted output
- 🔄 Web-based report viewer (coming soon)
- 🔄 More refactoring patterns (coming soon)

## Installation

```bash
npm install -g refactormate
```

## Usage

### Analyze a directory
```bash
refactormate analyze ./src
```

### Analyze a single file
```bash
refactormate analyze ./src/myfile.js
```

### Example Output

```
📄 /path/to/examples/bad_code.js
   Lines: 45 (50 total)
   🟡 Line 3: Function has too many parameters (8). Consider using an object.
   🟡 Line 12: Method is too long (30 lines). Consider breaking it down.

📄 /path/to/examples/bad_code.py
   Lines: 62 (70 total)
   🟢 Line 3: Function has too many parameters (8). Consider using a config object.
   🟡 Line 10: Method is too long (45 lines). Consider refactoring.
```

## Try it out

Run the analyzer on the included examples:

```bash
node index.js analyze ./examples
```

## Supported File Types

- JavaScript (`.js`)
- TypeScript (`.ts`)
- Python (`.py`)