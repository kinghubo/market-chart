var path = require("path");
var webpack = require('webpack');

module.exports = {
    entry: {
        main: ['./app/main.js']
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.(js)$/,
                loaders: ['babel?presets[]=es2015&presets[]=react'],
                include: path.join(__dirname, 'app')
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'autoprefixer?{browsers:["> 1%", "last 3 version", "Firefox ESR"]}', 'less']
            },
            {
                test:/\.(png|jpg|bmp)$/,
                loader: 'url?limit=8192'
            },
            {
                test: /\.(otf|woff|woff2)(\?.+)$/,
                loader: 'url?limit=8192'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};

