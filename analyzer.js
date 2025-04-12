const fs = require('fs');
const path = require('path');
const ConfigManager = require('./config');

class CodeAnalyzer {
    constructor(config = null) {
        const configManager = new ConfigManager();
        this.config = config || configManager.loadConfig();
        this.supportedExtensions = this.config.supportedExtensions;
        this.results = [];
    }

    analyzeDirectory(dirPath) {
        console.log(`Starting analysis of: ${dirPath}`);

        if (!fs.existsSync(dirPath)) {
            throw new Error(`Path does not exist: ${dirPath}`);
        }

        const stats = fs.statSync(dirPath);
        if (stats.isFile()) {
            this.analyzeFile(dirPath);
        } else if (stats.isDirectory()) {
            this.walkDirectory(dirPath);
        }

        return this.results;
    }

    walkDirectory(dirPath) {
        const entries = fs.readdirSync(dirPath);

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                // skip node_modules and hidden directories
                if (entry !== 'node_modules' && !entry.startsWith('.')) {
                    this.walkDirectory(fullPath);
                }
            } else if (stats.isFile()) {
                const ext = path.extname(entry);
                if (this.supportedExtensions.includes(ext)) {
                    this.analyzeFile(fullPath);
                }
            }
        }
    }

    analyzeFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const analysis = {
                file: filePath,
                issues: [],
                metrics: this.calculateMetrics(content)
            };

            const ext = path.extname(filePath);

            // Language-specific code smell detection
            if (ext === '.js' || ext === '.ts') {
                this.detectJSLongMethods(content, analysis);
                this.detectJSLongParameterLists(content, analysis);
            } else if (ext === '.py') {
                this.detectPythonLongMethods(content, analysis);
                this.detectPythonLongParameterLists(content, analysis);
            }

            if (analysis.issues.length > 0) {
                this.results.push(analysis);
            }
        } catch (err) {
            console.warn(`Could not analyze ${filePath}: ${err.message}`);
        }
    }

    calculateMetrics(content) {
        const lines = content.split('\n');
        return {
            totalLines: lines.length,
            blankLines: lines.filter(line => line.trim() === '').length,
            codeLines: lines.filter(line => line.trim() !== '' && !line.trim().startsWith('//')).length
        };
    }

    detectJSLongMethods(content, analysis) {
        const functionPattern = /function\s+\w+\s*\([^)]*\)\s*\{/g;
        let match;

        while ((match = functionPattern.exec(content)) !== null) {
            const startPos = match.index;
            const methodContent = this.extractMethodContent(content, startPos);
            const lineCount = methodContent.split('\n').length;

            if (lineCount > this.config.rules.longMethodThreshold) {
                analysis.issues.push({
                    type: 'long_method',
                    severity: 'medium',
                    message: `Method is too long (${lineCount} lines). Consider breaking it down.`,
                    line: this.getLineNumber(content, startPos)
                });
            }
        }
    }

    detectJSLongParameterLists(content, analysis) {
        const functionPattern = /function\s+\w+\s*\(([^)]*)\)/g;
        let match;

        while ((match = functionPattern.exec(content)) !== null) {
            const params = match[1].split(',').filter(p => p.trim().length > 0);

            if (params.length > this.config.rules.longParameterListThreshold) {
                analysis.issues.push({
                    type: 'long_parameter_list',
                    severity: 'low',
                    message: `Function has too many parameters (${params.length}). Consider using an object.`,
                    line: this.getLineNumber(content, match.index)
                });
            }
        }
    }

    detectPythonLongMethods(content, analysis) {
        const methodPattern = /def\s+\w+\s*\([^)]*\):/g;
        let match;

        while ((match = methodPattern.exec(content)) !== null) {
            const startPos = match.index;
            const methodContent = this.extractPythonMethodContent(content, startPos);
            const lineCount = methodContent.split('\n').length;

            if (lineCount > this.config.rules.longMethodThreshold) {
                analysis.issues.push({
                    type: 'long_method',
                    severity: 'medium',
                    message: `Method is too long (${lineCount} lines). Consider refactoring.`,
                    line: this.getLineNumber(content, startPos)
                });
            }
        }
    }

    detectPythonLongParameterLists(content, analysis) {
        const methodPattern = /def\s+\w+\s*\(([^)]*)\):/g;
        let match;

        while ((match = methodPattern.exec(content)) !== null) {
            const params = match[1].split(',')
                .filter(p => p.trim().length > 0 && p.trim() !== 'self');

            if (params.length > this.config.rules.longParameterListThreshold) {
                analysis.issues.push({
                    type: 'long_parameter_list',
                    severity: 'low',
                    message: `Function has too many parameters (${params.length}). Consider using a config object.`,
                    line: this.getLineNumber(content, match.index)
                });
            }
        }
    }

    extractMethodContent(content, startPos) {
        let braceCount = 0;
        let pos = content.indexOf('{', startPos);
        let endPos = pos;

        for (let i = pos; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') braceCount--;
            if (braceCount === 0) {
                endPos = i;
                break;
            }
        }

        return content.substring(pos, endPos + 1);
    }

    extractPythonMethodContent(content, startPos) {
        const lines = content.split('\n');
        const startLine = this.getLineNumber(content, startPos) - 1;
        let endLine = startLine;
        let baseIndent = null;

        for (let i = startLine + 1; i < lines.length; i++) {
            const line = lines[i];

            if (line.trim() === '') continue;

            const indent = line.length - line.trimLeft().length;

            if (baseIndent === null && line.trim() !== '') {
                baseIndent = indent;
            }

            if (baseIndent !== null && indent <= baseIndent && line.trim() !== '') {
                if (i > startLine + 1) {
                    endLine = i - 1;
                    break;
                }
            }
            endLine = i;
        }

        return lines.slice(startLine, endLine + 1).join('\n');
    }

    getLineNumber(content, position) {
        return content.substring(0, position).split('\n').length;
    }
}

module.exports = CodeAnalyzer;