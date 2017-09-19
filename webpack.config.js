var path = require('path');

module.exports = {
	entry: './js/app.js',
	output: {
    filename: 'app.js',
    path: __dirname + '/public',
    publicPath: './public/'
	},
	module: {
		rules: [
			{
			  test: /\.js$/,
			  exclude: /(node_modules|bower_components)/,
			  use: {
			    loader: 'babel-loader',
			    options: {
			      presets: ['es2015','stage-2'],
						plugins: ['syntax-dynamic-import']
			    }
			  }
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.s[a|c]ss$/,
				loader: 'style-loader!css-loader!sass-loader'
			}
    ]
	},
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
}
