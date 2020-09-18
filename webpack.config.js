var webpack = require('webpack');
module.exports = {
	entry: __dirname + '/client/app.js',
	output: {
		path: __dirname + '/client/bin',
		filename: "bundle.js",
		publicPath: '/bin/'
	},
	externals: {
		"react": 'react',
		"react-dom": 'ReactDOM'
	},
	devtool: 'cheap-module-eval-source-map',  //生成source file cheap-module-source-map,cheap-module-eval-source-map
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react','stage-0']
				},
				
			}
		]
	}
	,
	plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};