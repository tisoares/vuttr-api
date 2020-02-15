import database from '../../src/database'

export default function truncate (): Promise<number[]> {
  return Promise.all(
    Object.keys(database.connection.models).map((key): Promise<number> => {
      // Apaga todos os registros de todas as tabelas
      return database.connection.models[key].destroy({
        truncate: true,
        force: true
      })
    })
  )
}
