import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    parser: tsParser,
    parserOptions: {
      project: "./tsconfig.json", // Certifique-se de que o caminho para o seu tsconfig.json está correto
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-type-checked", // Opcional, mas mais estrito
    ],
    rules: {
      "no-unused-vars": "off", // Desativa a regra base do JavaScript
      "@typescript-eslint/no-unused-vars": "warn", // Ou "error" se preferir
      // Adicione outras regras personalizadas aqui, se necessário
    },
  },
  // Você pode adicionar outras configurações para arquivos JavaScript, se tiver
  {
    files: ["**/*.js", "**/*.jsx"],
    ...compat.extends("eslint:recommended"),
  },
];

export default eslintConfig;