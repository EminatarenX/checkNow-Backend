
import {Router} from "express"
import tareasController from "../controllers/tareas.js"

const router = Router()

router.get("/", tareasController.obtenertareas)

export default router
