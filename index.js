var postcss = require('postcss')
var _ = require('lodash')

module.exports = postcss.plugin('postcss-beard-responsive', function(opts) {
  opts = opts || {}

  var breakpoints = opts.breakpoints

  return function(root, result) {
    let rules = []

    root.walkAtRules('responsive', atRule => {
      rules = rules.concat(cloneRules(atRule))

      let responsiveRules = _.flatMap(breakpoints, function(
        breakpointValue,
        breakpointKey
      ) {
        return postcss
          .atRule({
            name: 'media',
            params: breakpointValue,
          })
          .append(
            _.map(rules, function(rule) {
              return rule.clone({
                selector: `.${breakpointKey}-${rule.selector.slice(1)}`,
              })
            })
          )
      })

      atRule.remove()

      root.append(rules.concat(responsiveRules))
    })
  }
})

function cloneRules(atRule) {
  return _.map(atRule.nodes, node => {
    return postcss
      .rule({
        selector: node.selector,
      })
      .append(
        _.map(node.nodes, decl => {
          return postcss.decl({
            prop: decl.prop,
            value: decl.value,
          })
        })
      )
  })
}
