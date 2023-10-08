
import {Router} from "express"
import empleadosController from "../controllers/empleados.js"

const router = Router()

router.get("/", empleadosController.obtenerempleados)

export default router
