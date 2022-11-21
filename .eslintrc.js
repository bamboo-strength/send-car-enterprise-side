module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
    page: true,
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/no-unused-state': 'off',
    'react/jsx-one-expression-per-line': 0,
    'react/no-unknown-property': 'off',
    'react/jsx-closing-tag-location': 0,
    'react/no-array-index-key': 0,
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'import/order': 'off',
    'import/extensions': 'off',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: ['**/tests/**.js', '/mock/**/**.js', '**/**.test.js'],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/alt-text': 0,
    'no-nested-ternary': 0,
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'no-useless-escape': 'off',
    'no-plusplus': 'off',
    'no-undef': 'off',
    'no-unused-vars': 0,
    'no-restricted-globals': 'off',
    'no-underscore-dangle': 'off',
    'no-extra-boolean-cast': 'off',
    'dot-notation': 'off',
    'linebreak-style': 0,
    'func-names': 'off',
    camelcase: 'off',
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url', 'object-assign'],
  },
};
