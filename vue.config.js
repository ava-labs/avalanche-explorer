const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  devServer: {
    https: true
  },
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(),
    ]
  }
}
