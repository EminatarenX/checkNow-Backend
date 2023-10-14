
import {Router} from "express"
import empleadosController from "../controllers/empleados.js"

const router = Router()

router.get("/", empleadosController.obtenerempleados)
router.post("/crear", empleadosController.crearempleados)
router.put("/editar/:id", empleadosController.editarempleados)
router.delete("/eliminar/:id", empleadosController.eliminarempleado)

export default router
