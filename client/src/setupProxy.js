// eslint-disable-next-line import/no-extraneous-dependencies
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8001",
      changeOrigin: true,
    }),
  );
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:8001",
      changeOrigin: true,
    }),
  );
};
