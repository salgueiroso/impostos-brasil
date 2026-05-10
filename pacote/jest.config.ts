import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    reporters: [
        "default",
        "github-actions",
        ["jest-junit", { outputDirectory: "./reports", outputName: "junit.xml" }]
    ],
    collectCoverage: true,
    coverageDirectory: "./coverage",
    coverageReporters: ["clover", "json", "lcov", "text"],

    // define explicitamente quais arquivos entram na cobertura
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/utils/extensoes.ts", // ignora o arquivo
        "!src/**/*.d.ts",     // ignora declarações
        "!src/**/index.ts"       // ignora barrel exports
    ],

    // limites de cobertura — falha o build se não atingir
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
        }
    },

    maxConcurrency: 5,
    setupFiles: [
        "./src/utils/extensoes.ts"
    ]
};

export default config;