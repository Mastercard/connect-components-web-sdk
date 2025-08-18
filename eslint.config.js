import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        project: "./tsconfig.json"
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
    // Add the plugins section here
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      "keyword-spacing": "warn",
      "no-param-reassign": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off"
    },
    ignores: [
      "dist/",
      "tests/",
      "**/*.spec.js",
      "**/*.e2e.js"
    ]
  }
];
