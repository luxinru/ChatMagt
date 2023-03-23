module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'http://103.233.8.101:3001', // 代理接口的地址
        changeOrigin: true,
        pathRewrite: {
        //   '^/api': '' // 重写路径，将/api替换为空字符串
        }
      }
    }
  }
}
