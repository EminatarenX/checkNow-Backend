
import {Router} from "express"
import entradasController from "../controllers/check.js"

const router = Router()

router.get("/", entradasController.obtenerChecks)

export default router
