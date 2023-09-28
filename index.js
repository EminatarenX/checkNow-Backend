import { config } from 'dotenv'
import express from 'express'
import usuariosRouter from './src/routes/usuarios.js'
import { ConectarDB } from './src/db/connection.js'
config()

ConectarDB()

const app = express()
const puerto = process.env.PORT || 4000

app.use(express.json())

app.use('/api/usuarios', usuariosRouter)

app.listen(puerto, () => {
    console.log('Servidor corriendo en puerto', puerto)
})

