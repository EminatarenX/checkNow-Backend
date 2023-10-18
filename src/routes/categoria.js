
import {Router} from "express"
import categoriaController from "../controllers/categoria.js"
import { checkAuth } from "../helpers/checkAuth.js"

const router = Router()

router.post("/crear", checkAuth, categoriaController.crearCategoria)
router.get("/:id", checkAuth, categoriaController.obtenerCategorias)
router.put("/editar/:id", checkAuth,categoriaController.editarCategoria)
router.delete("/eliminar/:id",checkAuth, categoriaController.eliminarCategoria)

export default router
