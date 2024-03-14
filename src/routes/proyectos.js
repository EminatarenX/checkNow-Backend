
import {Router} from "express"
import proyectosController from "../controllers/proyectos.js"

const router = Router()

router.get("/", proyectosController.obtenerproyectos)

export default router
