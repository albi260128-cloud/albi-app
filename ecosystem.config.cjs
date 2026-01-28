module.exports = {
  apps: [
    {
      name: 'albi-app',
      script: 'npx',
      args: 'wrangler pages dev public --compatibility-date=2024-01-01 --d1=albi-production --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
