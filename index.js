import { config } from 'dotenv'
import express from 'express'
import usuariosRouter from './src/routes/usuarios.js'
import empresasRouter from './src/routes/empresas.js'
import departamentosRouter from './src/routes/departamento.js'
import empleadosRouter from './src/routes/empleados.js'
import categoriasRouter from './src/routes/categoria.js'
import plazasRouter from './src/routes/plazas.js'
import { ConectarDB } from './src/db/connection.js'
import cors from 'cors'
config()

ConectarDB()


const app = express()
const puerto = process.env.PORT || 4000

app.use(express.json())

const origin = process.env.FRONTEND_URL
app.use(cors({
    origin: [origin, 'http://localhost:5173'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.use('/api/usuarios', usuariosRouter)
app.use('/api/empresas', empresasRouter)
app.use('/api/departamentos', departamentosRouter)
app.use('/api/empleados', empleadosRouter)
app.use('/api/categorias', categoriasRouter)
app.use('/api/plazas', plazasRouter)

app.listen(puerto, () => {
    console.log('Servidor corriendo en puerto', puerto)
})

export default app
