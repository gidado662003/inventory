module.exports = {
  apps: [
    // ===========================
    // BACKEND (Express Server)
    // ===========================
    {
      name: "lanab-server",
      cwd: "./backend",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },

    // ===========================
    // FRONTEND (Next.js App)
    // ===========================
    {
      name: "lanab-client",
      cwd: "./frontend",
      script: "cmd.exe",
      args: "/c npm run start",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOST: "0.0.0.0",
      },
    },
  ],
};
