import Empleado from '../models/Empleado.js'

const crearEmpleados = async(req, res) => {
    const { usuario } = req
    const { empresa } = req
    const { fecha_nacimiento, genero, estado_civil, numero_seguro_social, curp, rfc, nss/*, foto*/,  } = req.body
    try {

        const empleado = new Empleado({ usuario: usuario.id, empresa: empresa.id, informacion_personal: { fecha_nacimiento, genero, estado_civil, numero_seguro_social, curp, rfc, nss/*, foto*/ } })
        await empleado.save()
        return res.status(201).json({ empleado })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error al crear el empleado" })
    }

}

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

const eliminarEmpleado = async(req, res) => {
    const { id } = req.params
    try {
        const empleado = await Empleado.findByIdAndDelete(id)
        return res.status(200).json({ empleado })
    }catch(error) {
        return res.status(500).json({ error })
    }
}

const editarEmpleado = async(req, res) => { // esta es una funcion prototipo que se plantea solo pueda ejecutar por el administrador
    const { id } = req.params
    const { nombre, departamento } = req.body
    try {
        const empleado = await Empleado.findByIdAndUpdate(id, { nombre, departamento }) //faltaría definir departamento en el modelo
        return res.status(200).json({ empleado })
    }catch(error) {
        return res.status(500).json({ error })
    }
}

export { crearEmpleados, obtenerEmpleados, editarEmpleado, eliminarEmpleado }