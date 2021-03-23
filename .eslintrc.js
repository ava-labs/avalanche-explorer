module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/recommended',
        'prettier/vue',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier',
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser',
    },
    rules: {
        'no-console': 'off',
        'vue/no-unused-components': 'off',
        'no-unreachable': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/class-name-casing': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
}
