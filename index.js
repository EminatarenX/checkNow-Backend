import { config } from 'dotenv'
import express from 'express'
import usuariosRouter from './src/routes/usuarios.js'
import empresasRouter from './src/routes/empresas.js'
import departamentosRouter from './src/routes/departamento.js'
import empleadosRouter from './src/routes/empleados.js'
import categoriasRouter from './src/routes/categoria.js'
import plazasRouter from './src/routes/plazas.js'
import checksRouter from './src/routes/check.js'
import nominasRouter from './src/routes/nomina.js'
import pagosRouter from './src/routes/webhook.js'
import { revisarPagos } from './src/tareas/payments.js'

import { ConectarDB } from './src/db/connection.js'
import cors from 'cors'
config()
ConectarDB()
revisarPagos()


const app = express()
const puerto = process.env.PORT || 4000

const origin = process.env.FRONTEND_URL
app.use(cors({
    origin: [origin, 'http://localhost:5173', "https://develop--checknowdev.netlify.app"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.use('/api/usuarios',express.json(), usuariosRouter);
app.use('/api/empresas',express.json(), empresasRouter);
app.use('/api/departamentos',express.json(), departamentosRouter);
app.use('/api/empleados',express.json(), empleadosRouter);
app.use('/api/categorias',express.json(), categoriasRouter);
app.use('/api/plazas',express.json(), plazasRouter);
app.use('/api/checks',express.json(), checksRouter);
app.use('/api/nominas',express.json(), nominasRouter);
app.use('/api/pagos', pagosRouter);

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

    socket.on('solicitud', (data) => {
        const empresa = data.empresa
        socket.to(empresa).emit('solicitud recibida', data)
    })

    socket.on('checks admin', (empresa) => {
        socket.join(empresa)
    })
    

    socket.on('nueva entrada', (check) => {
        const empresa = check.empresa
        io.to(empresa).emit('entrada recibida', check)
    })

})