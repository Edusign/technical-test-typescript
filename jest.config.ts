import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  silent: false,
  testEnvironment: 'node',
  rootDir: './',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testMatch: ['**/?(*.)+(spec|test)?(s).+(ts|js)'],
  moduleDirectories: ["node_modules"],
};

export default config;
