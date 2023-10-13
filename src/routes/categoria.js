
import {Router} from "express"
import categoriaController from "../controllers/categoria.js"

const router = Router()

router.get("/", categoriaController.obtenercategoria)

export default router
