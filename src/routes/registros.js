
import {Router} from "express"
import registrosController from "../controllers/registros.js"

const router = Router()

router.get("/", registrosController.obtenerregistros)

export default router
