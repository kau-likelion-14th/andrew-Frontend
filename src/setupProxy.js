const { createProxyMiddleware } = require("http-proxy-middleware");

// 백엔드는 각자 로컬(기본 http://localhost:8080)에서 실행합니다.
// 포트나 주소가 다르면 .env.local 에 API_PROXY_TARGET=http://localhost:xxxx 로 덮어쓰세요.
const target = process.env.API_PROXY_TARGET || "http://localhost:8080";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
    })
  );
};
