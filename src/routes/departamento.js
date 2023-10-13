
import {Router} from "express"
import departamentoController from "../controllers/departamento.js"

const router = Router()

router.get("/", departamentoController.obtenerdepartamento)

export default router
