
import {Router} from "express"
import salidasController from "../controllers/salidas.js"

const router = Router()

router.get("/", salidasController.obtenersalidas)

export default router
