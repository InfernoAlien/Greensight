let path = require('path');
let webpack = require('webpack');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
 
let conf = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'main.js',
		publicPath: 'dist/'
	},
	devServer: {
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader', 
				//exclude: '/node_modules/'
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader'
				})
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: ['css-loader', 'sass-loader']
				})
			},
			{
				test: /\.(jpg|jpeg|png|svg|gif)$/,
				use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: './images/',
								useRelativePath: true
							}
						}
				]
			},	
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'fonts/'
							}
						}
				]
			}		
		]
	},
	plugins: [
		new ExtractTextPlugin("style.css"),
	]	
};
 
module.exports = (env, options) => {
	let production = options.mode === 'production';
	
	conf.devtool = production
					? false
					: 'eval-sourcemap';
	return conf;
	plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
	]	
}