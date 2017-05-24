var path = require('path');

var webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
            {
              test: /\.(png|jpg)$/,
              loader: 'url-loader'
            }
        ]
    }
}