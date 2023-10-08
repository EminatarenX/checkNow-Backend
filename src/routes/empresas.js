
import {Router} from "express"
import empresasController from "../controllers/empresas.js"

const router = Router()

router.get("/", empresasController.obtenerempresas)

export default router
