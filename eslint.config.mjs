import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // ✅ Global rules for all .ts/.tsx
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "import/extensions": "off"
    },
  },

  // ✅ Override for scripts: allow require()
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "import/no-commonjs": "off", // if you're using this rule too
    },
  },
];

export default eslintConfig;


