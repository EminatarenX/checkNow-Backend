
import {Router} from "express"
import departamentoController from "../controllers/departamento.js"

const router = Router()

router.get("/", departamentoController.obtenerdepartamento)
router.post("/crear", departamentoController.creardepartamento)
router.put("/editar/:id", departamentoController.editardepartamento)
router.delete("/eliminar/:id", departamentoController.eliminardepartamento)

export default router
