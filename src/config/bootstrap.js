/* eslint-disable @typescript-eslint/no-var-requires */
// const { resolve } = require('path')
const dotenv = require('dotenv')

const path = (process.env.NODE_ENV === 'test') ? '.env.test' : '.env'

dotenv.config({
  path: path
})
