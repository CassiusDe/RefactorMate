const fs = require('fs');
const path = require('path');

class ConfigManager {
    constructor() {
        this.defaultConfig = {
            rules: {
                longMethodThreshold: 20,
                longParameterListThreshold: 4,
                enableLongMethodDetection: true,
                enableLongParameterDetection: true
            },
            ignorePatterns: [
                'node_modules/**',
                '*.test.js',
                '*.spec.js',
                '*.test.py',
                '__pycache__/**'
            ],
            supportedExtensions: ['.js', '.ts', '.py']
        };
    }

    loadConfig(configPath = null) {
        const possiblePaths = [
            configPath,
            '.refactormaterc.json',
            '.refactormate.json',
            'refactormate.config.json'
        ].filter(Boolean);

        for (const configFile of possiblePaths) {
            if (fs.existsSync(configFile)) {
                try {
                    const userConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                    return this.mergeConfig(this.defaultConfig, userConfig);
                } catch (err) {
                    console.warn(`Warning: Could not parse config file ${configFile}: ${err.message}`);
                }
            }
        }

        return this.defaultConfig;
    }

    mergeConfig(defaultConfig, userConfig) {
        const merged = JSON.parse(JSON.stringify(defaultConfig));

        if (userConfig.rules) {
            Object.assign(merged.rules, userConfig.rules);
        }

        if (userConfig.ignorePatterns) {
            merged.ignorePatterns = [...merged.ignorePatterns, ...userConfig.ignorePatterns];
        }

        if (userConfig.supportedExtensions) {
            merged.supportedExtensions = userConfig.supportedExtensions;
        }

        return merged;
    }

    generateSampleConfig() {
        const sampleConfig = {
            rules: {
                longMethodThreshold: 25,
                longParameterListThreshold: 5,
                enableLongMethodDetection: true,
                enableLongParameterDetection: true
            },
            ignorePatterns: [
                'node_modules/**',
                'dist/**',
                '*.min.js',
                '*.test.*'
            ],
            supportedExtensions: ['.js', '.ts', '.py']
        };

        fs.writeFileSync('.refactormaterc.json', JSON.stringify(sampleConfig, null, 2));
        console.log('Created .refactormaterc.json configuration file');
    }
}

module.exports = ConfigManager;