
import {Router} from "express"
import categoriaController from "../controllers/categoria.js"

const router = Router()

router.get("/", categoriaController.obtenercategoria)
router.post("/crear", categoriaController.crearcategoria)
router.put("/editar/:id", categoriaController.editarcategoria)
router.delete("/eliminar/:id", categoriaController.eliminarcategoria)

export default router
