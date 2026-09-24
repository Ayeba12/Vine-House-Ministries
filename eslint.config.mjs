import { defineConfig } from "eslint/config";
import next from "eslint-config-next";

// eslint-config-next registers @typescript-eslint in its own config object, and
// that registration does not carry through `extends` into a sibling object, so
// borrow the plugin map rather than adding a redundant direct dependency.
const nextTypescript = next.find((config) => config.name === "next/typescript");

export default defineConfig([
  {
    ignores: [".next/**", "dist/**", "out/**", "node_modules/**"]
  },
  {
    extends: [...next]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: nextTypescript.plugins,
    rules: {
      // Dead code accumulates fast during the WordPress migration: imports and
      // handlers get orphaned as content moves out of lib/data.ts. Underscore
      // prefixes are the escape hatch for deliberately unused bindings.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  }
]);
