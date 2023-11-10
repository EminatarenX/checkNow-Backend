
import {Router} from "express"
import empresasController from "../controllers/empresas.js"
import { checkAuth } from "../helpers/checkAuth.js"

const router = Router()

router.get("/", checkAuth, empresasController.obtenerEmpresa);
router.post("/editar/", checkAuth, empresasController.actualizarDatosEmpresa);
router.delete("/:id", checkAuth, empresasController.eliminarEmpresa);

export default router
