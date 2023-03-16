module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:vitest/recommended",
    "plugin:testing-library/react",
    "airbnb",
    "airbnb-typescript",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
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
    "prettier",
    "vitest",
  ],
  ignorePatterns: [".eslintrc.js", "setupProxy.js", "setupTests.ts"],
  rules: {
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
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        trailingComma: "all",
      },
    ],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    // "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".ts", ".tsx"] }],
  },
  settings: {
    "import/resolver": {
      node: {
        moduleDirectory: ["src", "node_modules"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
