module.exports = {
  apps: [
    {
      name: "socket-server",
      script: "dist/index.js",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4200
      }
    },
    {
      name: "socket-worker",
      script: "dist/queues/index.js",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
