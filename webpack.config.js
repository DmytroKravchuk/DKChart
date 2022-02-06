const path = require( "path" );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const OptimizeCssAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const TerserPlugin = require( "terser-webpack-plugin" );
const ESLintPlugin = require( 'eslint-webpack-plugin' );

const isDev = process.env.NODE_ENV === 'development';

const filename = ext => isDev ? `[name].${ ext }` : `[name].[hash].${ ext }`;

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: path.resolve( __dirname, 'dist' )
            }
        },
        'css-loader',
    ];
    if (extra) {
        loaders.push( extra );
    }
    return loaders;
};

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env',
        ],
        plugins: []
    }
    if (preset) {
        opts.presets.push( preset );
    }
    return opts;
}

const jsLoaders = () => {
    return [ {
        loader: 'babel-loader',
        options: babelOptions()
    } ]
}

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }
    if (!isDev) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin()
        ]
    }
    return config;
};

module.exports = {
    context: path.resolve( __dirname, "src" ),
    mode: "development",
    entry: [ "@babel/polyfill", "./index.js" ],
    output: {
        path: path.resolve( __dirname, "dist" ),
        filename: "[name].[contenthash].js",
        clean: true
    },
    devServer: {
        hot: isDev,
        port: 8080,
    },
    devtool: isDev ? 'source-map' : false,
    resolve: {
        alias: {
            "@styles": path.resolve( __dirname, "src/styles" ),
            "@": "src"
        }
    },
    optimization: optimization(),
    plugins: [ new HtmlWebpackPlugin( {
        template: "./index.html",
        minify: {
            collapseWhitespace: !isDev
        }
    } ), new MiniCssExtractPlugin( {
        filename: filename( 'css' )
    } ),
        /*new ESLintPlugin()*/ ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders(),
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders( 'sass-loader' ),
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
        ]
    }
}