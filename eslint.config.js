import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    {        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["eslint.config.js"]
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            }],
            "@typescript-eslint/no-empty-function": "off",
        },
    },

    {
        ignores: ["**/node_modules/", "**/dist/", "**/out/"],
    }
)
