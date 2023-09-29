
import { Router } from 'express'
import usuariosController from '../controllers/usuarios.js'
import { checkAuth } from '../helpers/checkAuth.js'

const router = Router()

router.get('/', usuariosController.obtenerUsuarios)
router.post("/", usuariosController.crearUsuario)
router.post("/insertar", checkAuth ,usuariosController.completarPerfil)
router.post("/login", usuariosController.iniciarSesion)
router.get("/confirmar/:id", usuariosController.confirmarUsuario)
export default router
