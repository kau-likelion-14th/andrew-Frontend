const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://lte-dev-env.eba-uhe4na6c.ap-northeast-2.elasticbeanstalk.com",
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
    })
  );
};
