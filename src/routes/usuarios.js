
import { Router } from 'express'
import usuariosController from '../controllers/usuarios.js'
import { checkAuth } from '../helpers/checkAuth.js'

const router = Router()


router.post("/", usuariosController.crearUsuario)
router.get("/", usuariosController.obtenerUsuarios)
router.post("/registrar-datos", checkAuth ,usuariosController.completarPerfil)
router.post("/login", usuariosController.iniciarSesion)
router.get("/confirmar/:token", usuariosController.confirmarUsuario)
router.post("/recovery", usuariosController.solicitarCambioPassword)
router.put("/recovery/:token", usuariosController.cambiarPassword)
router.get("/perfil", checkAuth, usuariosController.obtenerPerfil)

export default router
