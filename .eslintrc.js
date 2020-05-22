module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": [
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "no-useless-constructor": 0,
    "no-unused-vars": 0,
    "no-prototype-builtins": 0,
    "require-atomic-updates": 0,
    "no-dupe-class-members": 0,

    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
            "delimiter": "none"
        }
      }
    ],

    // note you must disable the base rule as it can report incorrect errors
    "camelcase": "off",
    "@typescript-eslint/camelcase": ["off"],

    // disable the rule by default for all files, but override for .ts files...
    "@typescript-eslint/explicit-function-return-type": "off"
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@typescript-eslint/explicit-function-return-type": ["error"]
      }
    }
  ]
}
