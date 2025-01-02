import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
    rules: {
      // Convert specific errors to warnings
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",

      // Or disable specific rules entirely if needed
      // "@typescript-eslint/no-unused-vars": "off",
      // "@typescript-eslint/no-explicit-any": "off",
      // "react-hooks/exhaustive-deps": "off",
      // "@next/next/no-img-element": "off"
    },
  },
];


export default eslintConfig;
