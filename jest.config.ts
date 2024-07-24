import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";

const projects = [
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

const config: Config = {
  projects,
};

export default config;
