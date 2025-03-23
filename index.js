#!/usr/bin/env node

const CodeAnalyzer = require('./analyzer');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('RefactorMate - Code Refactoring Assistant');
    console.log('Usage: refactormate <command> [options]');
    console.log('');
    console.log('Commands:');
    console.log('  analyze <path>    Analyze code for refactoring opportunities');
    console.log('  --help           Show this help message');
    console.log('  --version        Show version');
    process.exit(0);
}

const command = args[0];

switch (command) {
    case 'analyze':
        if (args.length < 2) {
            console.error('Error: Please specify a path to analyze');
            process.exit(1);
        }

        const analyzer = new CodeAnalyzer();
        try {
            const results = analyzer.analyzeDirectory(args[1]);

            if (results.length === 0) {
                console.log('No issues found! Your code looks good.');
            } else {
                console.log(`\nFound ${results.length} files with issues:\n`);

                results.forEach(result => {
                    console.log(`📄 ${result.file}`);
                    console.log(`   Lines: ${result.metrics.codeLines} (${result.metrics.totalLines} total)`);

                    result.issues.forEach(issue => {
                        const severity = issue.severity === 'high' ? '🔴' :
                                       issue.severity === 'medium' ? '🟡' : '🟢';
                        console.log(`   ${severity} Line ${issue.line}: ${issue.message}`);
                    });
                    console.log('');
                });
            }
        } catch (err) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
        }
        break;

    case '--version':
        const pkg = require('./package.json');
        console.log(pkg.version);
        break;

    case '--help':
        console.log('RefactorMate - Code Refactoring Assistant');
        console.log('Usage: refactormate <command> [options]');
        break;

    default:
        console.error(`Unknown command: ${command}`);
        console.log('Use --help for available commands');
        process.exit(1);
}