import Empleado from '../models/Empleado.js'

const obtenerEmpleados = async(req, res) => {

    const { usuario } = req

    try {

        const empleados = await Empleado.find({ id_usuario: usuario.id})

        if (!empleados) {
            return res.status(404).json({ msg: "No se pudieron obtener los datos de los empleados, intente mas tarde" })

        }

        return res.status(200).json({ empleados })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error al obtener los empleados" })
    }
}

export default { obtenerEmpleados }