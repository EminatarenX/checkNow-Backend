
import {Router} from "express"
import entradasController from "../controllers/entradas.js"

const router = Router()

router.get("/", entradasController.obtenerentradas)

export default router
