module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    indentation: 2,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'custom-property-pattern': null,
    'at-rule-no-unknown': null,
    'no-empty-source': null,
    'scss/at-rule-no-unknown': true,
    'scss/at-extend-no-missing-placeholder': null,
    'color-function-notation': null,
  },
};
