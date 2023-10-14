
import {Router} from "express"
import departamentoController from "../controllers/departamento.js"
import { checkAuth } from "../helpers/checkAuth.js"

const router = Router()

router.get("/", checkAuth,departamentoController.obtenerDepartamento)
router.post("/crear", checkAuth, departamentoController.crearDepartamento)
router.put("/editar/:id",checkAuth, departamentoController.editarDepartamento)
router.delete("/eliminar/:id",checkAuth, departamentoController.eliminarDepartamento)

export default router
