module.exports = {
  module: {
    loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }
    ],
  },
  entry: './app',
  devtool: 'source-map',
  output: {
    path: 'dist',
    filename: 'bundle.js'
  }
}
