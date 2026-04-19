import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    reporters: [
        "default",
        "github-actions",
        ["jest-junit", { outputDirectory: "./reports", outputName: "junit.xml" }]
        // "jest-junit"
    ],
    collectCoverage: true,
    coverageDirectory: "./coverage",

    coverageReporters: ["clover", "json", "lcov", "text"],
    maxConcurrency: 5

}

export default config;