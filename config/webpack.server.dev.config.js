const webpackConfig = require('miox-vue2x-webpack-config');
const nodeExternals = require('webpack-node-externals');
const isProd = process.env.NODE_ENV === 'production';

module.exports = webpackConfig(config => {
    config.set({
        env: 'server',
        'source-compile': {
            dirs: [/^src/i]
        }
    });

    const options = {
        target: 'node',
        entry: config.resolve('src', 'index.js'),
        output: {
            path: config.resolve('build'),
            publicPath: undefined,
            filename: 'server-bundle.js',
            libraryTarget: 'commonjs2'
        },

        // https://webpack.js.org/configuration/externals/#function
        // https://github.com/liady/webpack-node-externals
        // Externalize app dependencies. This makes the server build much faster
        // and generates a smaller bundle file.
        externals: nodeExternals({
            // do not externalize dependencies that need to be processed by webpack.
            // you can add more file types here e.g. raw *.vue files
            // you should also whitelist deps that modifies `global` (e.g. polyfills)
            whitelist: [/miox\-?/]
        }),

        performance: {
            maxEntrypointSize: 300000,
            hints: isProd ? 'warning' : false
        },

        plugins: [
            config.vueServer()
        ]
    };

    if (!isProd) {
        options.devtool = 'source-map';
    }

    config.merge(options);
});