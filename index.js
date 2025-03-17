#!/usr/bin/env node

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
        console.log(`Analyzing: ${args[1]}`);
        console.log('Analysis feature not implemented yet.');
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