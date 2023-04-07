module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'http://47.243.18.112:3001', // 代理接口的地址
        changeOrigin: true,
        pathRewrite: {
        //   '^/api': '' // 重写路径，将/api替换为空字符串
        }
      }
    }
  }
}
