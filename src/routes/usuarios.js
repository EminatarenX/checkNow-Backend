
import { Router } from 'express'
import usuariosController from '../controllers/usuarios.js'

const router = Router()

router.get('/', usuariosController.obtenerUsuarios)
router.post("/", usuariosController.crearUsuario)

export default router
