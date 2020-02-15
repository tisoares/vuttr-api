// import dotenv from 'dotenv'
import './bootstrap.js' // load .env config

/**
 * Classe estática com os dados de seguarnça do jwt token
 *
 * @class AuthConfig
 */
class AuthConfig {
  /**
   * Retorna o objeto as configurações de segurança
   *
   * @static
   * @returns {{secret: string}}
   * @memberof AuthConfig
   */
  public static config (): {secret: string} {
    return {
      secret: process.env.APP_SECRET ? process.env.APP_SECRET : ''
    }
  }
}
// Esporta somente as configurações
export default AuthConfig.config()
