
import {Router} from "express"
import categoriaController from "../controllers/categoria.js"
import { checkAuth } from "../helpers/checkAuth.js"

const router = Router()

router.post("/crear", categoriaController.crearCategoria)
router.get("/", checkAuth, categoriaController.obtenerCategoria)
router.put("/editar/:id", categoriaController.editarCategoria)
router.delete("/eliminar/:id", categoriaController.eliminarCategoria)

export default router
