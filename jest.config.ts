import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";

const projects: Config["projects"] = [
  {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: pathsToModuleNameMapper(
      {
        "@compositor/*": ["packages/*/src"],
      },
      {
        prefix: "./",
      },
    ),
    testMatch: ["./**/spec/**/*.spec.ts"],
  },
];

const globals: Config["globals"] = {
  "ts-jest": {
    tsconfig: "./tsconfig.json",
  },
};

const config: Config = {
  projects,
  globals,
};

export default config;
