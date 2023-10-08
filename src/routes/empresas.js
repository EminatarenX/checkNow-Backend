
import {Router} from "express"
import empresasController from "../controllers/empresas.js"
import { checkAuth } from "../helpers/checkAuth.js"

const router = Router()

router.route("/")
    .put(checkAuth, empresasController.actualizarDatosEmpresa)
    .get(checkAuth, empresasController.obtenerEmpresa)
    .post(checkAuth, empresasController.crearEmpresa)
    .delete(checkAuth, empresasController.eliminarEmpresa)

export default router
