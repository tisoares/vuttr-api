// Carrega as configs do arquivo .env
require('./bootstrap')

// Objeto com os dados de conexao com o banco
module.exports = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  storage: '__tests__/database.sqlite',
  logging: false,
  define: {
    timestamp: true
  }
}
