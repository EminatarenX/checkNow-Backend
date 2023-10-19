
import {Router} from "express"
import plazasController from "../controllers/plazas.js"

const router = Router()

router.get("/", checkAuth, plazasController.obtenerplazas)
router.post("/crear", checkAuth, plazasController.crearPlaza)
router.put("/editar/:id", checkAuth, plazasController.actualizarPlaza)
router.delete("/eliminar/:id", checkAuth, plazasController.eliminarPlaza)


export default router
