
import {Router} from "express"
import empresasController from "../controllers/empresas.js"
import { checkAuth } from "../helpers/checkAuth.js"

const router = Router()

router.route("/")
    .post(checkAuth, empresasController.actualizarDatosEmpresa)
    .get(checkAuth, empresasController.obtenerEmpresa)
    .delete(checkAuth, empresasController.eliminarEmpresa)

export default router
