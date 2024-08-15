module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended", // Must be first
    "plugin:import/recommended", // After eslint:recommended
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:vitest/recommended",
    "plugin:testing-library/react",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier", // Must be last
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "react",
    "import",
    "jsx-a11y",
    "react-hooks",
    "@typescript-eslint",
    "vitest",
  ],
  ignorePatterns: [
    ".eslintrc.js",
    "setupProxy.js",
    "setupTests.ts",
    "vite.config.ts",
    "vitest.setup.mjs",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unsafe-function-type": "warn",
    "comma-dangle": "off",
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: "react*",
            group: "external",
            position: "before",
          },
          {
            pattern: "{.,..}/**/*.+(css|scss)", // eslint-plugin-import#1239
            group: "sibling",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        "newlines-between": "never",
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "no-console": "off",
    // 'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
    // disallow use of variables before they are defined
    "no-use-before-define": [
      "error",
      { functions: true, classes: true, variables: true },
    ],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    // "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".ts", ".tsx"] }],
    "react/no-unstable-nested-components": ["error", { allowAsProps: true }],
    "react/require-default-props": [
      "error",
      {
        classes: "defaultProps",
        functions: "defaultArguments",
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        moduleDirectory: ["src", "test-utils", "node_modules"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
