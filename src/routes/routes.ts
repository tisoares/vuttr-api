import { Router } from 'express'

import '../config/bootstrap.js' // load .env config

import AuthenticationController from '../app/controllers/AuthenticationController'
import AuthorizationTokenRoute from '../app/middleware/AuthorizationTokenRoute'

import UserController from '../app/controllers/UserController'

const routes = Router()

// Rota de Login
routes.post('/login', AuthenticationController.login)

if (process.env.CFG_DISABLE_TOKEN === 'true' || process.env.NODE_ENV === 'test') {
  routes.post('/users', UserController.store) // Salva sem a necessidade da validação do token
} else {
  // Valida o token antes de chamar a rota
  routes.post('/users', AuthorizationTokenRoute.midTokenAuth, UserController.store)
}

// Middleare para validação do Token de acesso
routes.use(AuthorizationTokenRoute.midTokenAuth)
// Todas as rotas a partir deste ponto está validada com token

// #region Rotas de Usuer
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.destroy)
routes.get('/users/:id', UserController.indexOne)
routes.get('/users/', UserController.indexAll)
// #endregion

export default routes
