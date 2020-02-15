import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
// Swagger Documentação
import swaggerUi from 'swagger-ui-express'

import './config/bootstrap.js' // load .env config
import './database' // load database

import routes from './routes/routes'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require('../swagger.json')

/**
 * Classe principal que configura e inicia o servidor
 *
 * @export
 * @class Server
 */
export default class Server {
  public app: express.Application;

  /**
   * Constructor da classe para gerar a instancia do express
   * @memberof Server
   */
  public constructor () {
    this.app = express()
    this.configServer()
  }

  /**
   * Configura o server com os middlewares e rotas
   *
   * @private
   * @memberof Server
   */
  private configServer (): void {
    // Configura o servidor
    this.middlewares()
    this.routes()
  }

  /**
   * Configura as propriedades de segurança e middlewares do servidor
   *
   * @private
   * @memberof Server
   */
  private middlewares (): void {
    // Pacote de segurança para o servidor
    this.app.use(helmet())

    // Habilita o CORS com uma validade
    this.app.use(cors({
      'maxAge': 86400
    }))

    // Regras para o Cors liberar acesso de outro servidor
    this.app.use((_req, res, next): void => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })

    // Converte o corpo do http para JSON
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
  }

  /**
   * Configura as rotas no express
   *
   * @private
   * @memberof Server
   */
  private routes (): void {
    // Habilita rota para swagger
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    // define as rotas
    this.app.use(routes)
  }

  /**
   * Inicia o servidor
   *
   * @memberof Server
   */
  public startServer (): void {
    const port = Number(process.env.PORT || 3333)
    this.app.listen(port, (): void => console.log('[SERVER] Running at http://localhost:' + port + '/api-docs'))
  }
}
