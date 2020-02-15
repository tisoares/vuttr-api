import { Sequelize, Model } from 'sequelize'

import models from '../app/models'

class Database {
  // Cria a instancia com as configurações de conexão com o banco de dados
  public connection = new Sequelize(require('../config/database.js'));

  public constructor () {
    this.init()
  }

  private init (): void {
    // Adiciona os models no sequelize
    models
      .map((model): Model => model.initialize(this.connection))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((model: any): Model => model.associate && model.associate(this.connection.models))
    // this.connection.addModels(models)
  }
}

export default new Database()
