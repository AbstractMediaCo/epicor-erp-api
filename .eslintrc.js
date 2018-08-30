module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": ["eslint:recommended"],
  "env": {
    "es6": true,
    "node": true
  },
  parserOptions: {
    "ecmaFeatures": {
      "arrowFunctions": true,
      "blockBindings": true,
      "classes": true,
      "defaultParams": true,
      "destructuring": true,
      "forOf": true,
      "generators": false,
      "modules": true,
      "objectLiteralComputedProperties": true,
      "objectLiteralDuplicateProperties": false,
      "objectLiteralShorthandMethods": true,
      "objectLiteralShorthandProperties": true,
      "spread": true,
      "superInFunctions": true,
      "templateStrings": true,
    }
  },
  "rules": {
    "strict": [2, "never"],
    "no-var": 2,
    "prefer-const": 2,
    "no-shadow": 2,
    "no-shadow-restricted-names": 2,
    "no-unused-vars": [1, {
      "vars": "local",
      "args": "after-used"
    }],
    "no-use-before-define": 0,
    "comma-dangle": [0, "always-multiline"],
    "no-cond-assign": [2, "always"],
    "no-console": 0,
    "no-debugger": 1,
    "no-alert": 1,
    "no-constant-condition": 1,
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-empty": 2,
    "no-ex-assign": 2,
    "no-extra-boolean-cast": 0,
    "no-extra-semi": 2,
    "no-func-assign": 2,
    "no-inner-declarations": 2,
    "no-invalid-regexp": 2,
    "no-irregular-whitespace": 2,
    "no-obj-calls": 2,
    "no-sparse-arrays": 2,
    "no-unreachable": 2,
    "use-isnan": 2,
    "block-scoped-var": 0,
    "consistent-return": 0,
    "curly": [2, "multi-line"],
    "default-case": 1,
    "dot-notation": [1, {
      "allowKeywords": true
    }],
    "eqeqeq": 2,
    "guard-for-in": 0,
    "no-caller": 2,
    "no-else-return": 2,
    "no-eq-null": 2,
    "no-eval": 2,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-fallthrough": 2,
    "no-floating-decimal": 2,
    "no-implied-eval": 2,
    "no-lone-blocks": 2,
    "no-loop-func": 2,
    "no-multi-str": 0,
    "no-native-reassign": 2,
    "no-new": 0,
    "no-new-func": 2,
    "no-new-wrappers": 2,
    "no-octal": 2,
    "no-octal-escape": 2,
    "no-param-reassign": 2,
    "no-proto": 2,
    "no-redeclare": 2,
    "no-return-assign": 2,
    "no-script-url": 2,
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-throw-literal": 2,
    "no-with": 2,
    "radix": 2,
    "vars-on-top": 2,
    "wrap-iife": [2, "any"],
    "yoda": 2,
    'indent': [1,  2, {
      'ArrayExpression': 1,
      'MemberExpression': 0,
      'ObjectExpression': 1,
      'SwitchCase': 1,
      'FunctionDeclaration': {
        'body': 1,
        'parameters': 0
        },
    }],
    'brace-style': [1, '1tbs', {
      'allowSingleLine': true
    }],
    'quotes': [1, 'single', 'avoid-escape'],
    'camelcase': [2, {
      'properties': 'never'
    }],
    'comma-spacing': [2, {
      'before': false,
      'after': true
    }],
    'comma-style': [2, 'last'],
    'eol-last': 2,
    'func-names': 1,
    'key-spacing': [2, {
      'beforeColon': false,
      'afterColon': true
    }],
    'new-cap': [2, {
      'newIsCap': true,
      'capIsNew': false
    }],
    'no-multiple-empty-lines': [2, {
      'max': 4
    }],
    'no-nested-ternary': 0,
    'no-new-object': 2,
    'no-spaced-func': 2,
    'no-trailing-spaces': 2,
    'no-extra-parens': [2, 'functions'],
    'no-underscore-dangle': 0,
    'object-curly-spacing': ['error', 'always', {
      'objectsInObjects': false,
      'arraysInObjects': false
    }],
    'one-var': [2, 'never'],
    'padded-blocks': [1, 'never'],
    'quote-props': ['error', 'consistent-as-needed', {
      'keywords': true,
      'unnecessary': true
    }],
    'semi': [2, 'always'],
    'semi-spacing': [2, {
      'before': false,
      'after': true
    }],
    'keyword-spacing': 0,
    'space-before-blocks': 2,
    'space-before-function-paren': [2, 'never'],
    'space-infix-ops': 1
  }
}
