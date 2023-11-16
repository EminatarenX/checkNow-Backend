import { config } from 'dotenv'
import express from 'express'
import usuariosRouter from './src/routes/usuarios.js'
import empresasRouter from './src/routes/empresas.js'
import departamentosRouter from './src/routes/departamento.js'
import empleadosRouter from './src/routes/empleados.js'
import categoriasRouter from './src/routes/categoria.js'
import plazasRouter from './src/routes/plazas.js'
import checksRouter from './src/routes/check.js'

import { ConectarDB } from './src/db/connection.js'
import cors from 'cors'
config()

ConectarDB()


const app = express()
const puerto = process.env.PORT || 4000

app.use(express.json())

const origin = process.env.FRONTEND_URL
app.use(cors({
    origin: [origin, 'http://localhost:5173', "https://develop--checknowdev.netlify.app"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.use('/api/usuarios', usuariosRouter);
app.use('/api/empresas', empresasRouter);
app.use('/api/departamentos', departamentosRouter);
app.use('/api/empleados', empleadosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/plazas', plazasRouter);
app.use('/api/checks', checksRouter);

const servidor = app.listen(puerto, () => {
    console.log('Servidor corriendo en puerto', puerto)
})

// socket.io
import { Server as SocketServer } from 'socket.io'

const io = new SocketServer(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: [origin, 'http://localhost:5173', "https://develop--checknowdev.netlify.app"]
    }
})

io.on('connection', socket => {

    socket.on('solicitudes', (empresa) => {
        socket.join(empresa)
    })
    
    socket.on('enviar solicitud', (data) => {
        const empresa = data.empresa
        io.to(empresa).emit('solicitud recibida', data)
    })

    socket.on('nueva entrada', (check) => {
        const empresa = check.empresa
        socket.to(empresa).emit('entrada recibida', check)
    })

})