
import {Router} from "express"
import plazasController from "../controllers/plazas.js"

const router = Router()

router.get("/", plazasController.obtenerplazas)

export default router
