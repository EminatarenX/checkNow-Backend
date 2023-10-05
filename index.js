import { config } from 'dotenv'
import express from 'express'
import usuariosRouter from './src/routes/usuarios.js'
import { ConectarDB } from './src/db/connection.js'
import cors from 'cors'
config()

ConectarDB()

const app = express()
const puerto = process.env.PORT || 4000

app.use(express.json())

const origin = process.env.FRONTEND_URL
app.use(cors({
    origin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.use('/api/usuarios', usuariosRouter)

app.listen(puerto, () => {
    console.log('Servidor corriendo en puerto', puerto)
})

