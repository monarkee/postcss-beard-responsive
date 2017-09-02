var postcss = require('postcss')
var fs = require('fs')

var plugin = require('./')

function run(input, fixture, opts) {
    var expected = fs.readFileSync(fixture, 'utf-8')

    return postcss([plugin(opts)]).process(input).then(result => {
        expect(result.css).toEqual(expected.trim())
        expect(result.warnings().length).toBe(0)
    })
}

it('generates responsive versions of utility classes', () => {
    return run(
        '@responsive { .red { color: red; } .blue { color: blue; } }',
        'fixture.css',
        {
            breakpoints: {
                sm: '(min-width: 300px)',
                md: '(min-width: 600px)',
            },
        }
    )
})
