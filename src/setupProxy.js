const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://ec2-13-124-72-219.ap-northeast-2.compute.amazonaws.com",
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
    })
  );
};
