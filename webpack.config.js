const path = require('path')

const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
  }
}

const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = [
  {
    target: 'electron-main',
    entry: { main: './src/main/index.ts' },
    node: {
      __dirname: false
    },
    ...commonConfig
  },
  {
    target: 'electron-preload',
    entry: { preload: './src/main/preload.ts' },
    node: {
      __dirname: false
    },
    ...commonConfig
  },
  {
    target: 'electron-renderer',
    entry: { gui: './src/gui/index.tsx' },
    plugins: [new HtmlWebpackPlugin({
      template: 'src/gui/index.html'
    })],
    ...commonConfig
  }
]