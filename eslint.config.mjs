import pluginVue from 'eslint-plugin-vue'

export default [
    ...pluginVue.configs['flat/vue2-recommended'],
    {
        ignores: [
            '**/searchAndTable.vue',
            'src/utils/citySource/citySource.d.ts',
            'src/utils/watermark.js',
            'src/carrier-web/',
            'src/trade-web/',
            'src/driver-web/'
        ],
        rules: {
            'no-console': 'off',
            'vue/multi-word-component-names': 'warn',
            'no-prototype-builtins': 'off',
            'vue/valid-v-slot': 'warn',
            'vue/no-mutating-props':'warn',
            'vue/require-default-prop':'off',
            'vue/attribute-hyphenation':'off',
            'vue/max-attributes-per-line': ['error', {
                'singleline': {
                    'max': 3,
                },
                'multiline': {
                    'max': 1,
                },
            }],
            'eqeqeq': ['error', 'always'],
            'comma-dangle': ['error', {
                'arrays': 'never',
                'objects': 'always-multiline',
                'imports': 'never',
                'exports': 'never',
                'functions': 'never',
            }],
            'quotes':['error','single'],
            'semi':['error','never'],
            'max-len': ['error', { 'code': 120, 'tabWidth': 2 }],
            'vue/component-tags-order': ['warn', {
                'order': [ 'style','template','script' ],
            }],
        },

        languageOptions: {
            globals: {
                AMap: 'writable',
            },
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions:{},
        },
    }
]