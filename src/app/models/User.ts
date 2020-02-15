import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'

const PROTECTED_ATTRIBUTES = ['password', 'passwordHash']

export default class User extends Model {
  public toJSON (): {} & object {
    // hide protected fields
    let attributes = Object.assign({}, this.get())
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a as keyof object] // remove attributes
    }
    return attributes
  }

  public static initialize (sequelize: Sequelize.Sequelize): User {
    User.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      passwordHash: Sequelize.STRING
    }, {
      tableName: 'users',
      sequelize: sequelize
    })
    // Criptografa a senha antes de salvar
    this.addHook('beforeSave', async (user: User): Promise<void> => {
      if (user.password) {
        user.passwordHash = await bcrypt.hash(user.password, 8)
      }
    })

    return new User()
  }

  public id!: number;
  public name!: string;
  public email!: string
  public passwordHash!: string
  public password!: string
}
