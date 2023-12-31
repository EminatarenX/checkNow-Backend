
import {Router} from "express"
import plazasController from "../controllers/plazas.js"
import { checkAuth } from "../helpers/checkAuth.js"

const router = Router()

router.get("/:id", checkAuth, plazasController.obtenerPlazas)
router.post("/crear", checkAuth, plazasController.crearPlaza)
router.put("/editar/:id", checkAuth, plazasController.modificarPlaza)
router.delete("/eliminar/:id", checkAuth, plazasController.eliminarPlaza)
router.get("/plaza/:id", checkAuth, plazasController.getPlaza)
router.get("/buscar/:id", checkAuth, plazasController.buscarPlazaEmpleado)


export default router
