const webpackConfig = require('miox-vue2x-webpack-config');

module.exports = webpackConfig(config => {
    config.set({
        env: 'client',
        'source-compile': {
            dirs: [/^src/i],
            modules: [/miox-?/]
        }
    });

    config.merge({
        entry: {
            app: config.resolve('src', 'index.js')
        },
        output: {
            path: config.resolve('build'),
            publicPath: undefined,
            filename: '[name].js'
        },
        plugins: [
            config.chunk({
                name: 'vendor',
                minChunks(module) {
                    // a module is extracted into the vendor chunk if...
                    return (
                        // it's inside node_modules
                        /node_modules/.test(module.context) &&
                        // and not a CSS file (due to extract-text-webpack-plugin limitation)
                        !/\.css$/.test(module.request)
                    )
                }
            }),
            config.chunk({
                name: 'manifest',
                minChunks: Infinity
            }),
            config.vueClient()
        ]
    });
});