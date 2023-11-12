import Empresa from '../models/Empresa.js'
import Empleado from '../models/Empleado.js'
import Solicitud from '../models/Solicitud.js'


const obtenerEmpresa = async (req, res) => {

    const { id } = req.empresa

    try {

        const empresa = await Empresa.findById(id)
        

        if (!empresa) {
            return res.status(404).json({ msg: "No se pudieron obtener los datos de la empresa, intente mas tarde" })

        }

        return res.status(200).json({ empresa })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error al obtener la empresa" })
    }
}

const actualizarDatosEmpresa = async (req, res) => {
    const { id } = req.empresa

    const { nombre, direccion, telefono, razonSocial, identificacionTributaria, industria } = req.body

    try {
        const empresa = await Empresa.findById(id)


        if (!empresa) {
            return res.status(404).json({ msg: "Empresa no encontrada, intente mas tarde" })
        }

        empresa.nombre = nombre
        empresa.direccion = direccion
        empresa.telefono = telefono
        empresa.razonSocial = razonSocial
        empresa.identificacionTributaria = identificacionTributaria
        empresa.industria = industria
        await empresa.save()

        return res.json({ msg: "Empresa actualizada correctamente", empresa })



    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error al actualizar la empresa" })
    }

}

const eliminarEmpresa = async (req, res) => {

    const { id } = req.empresa

    try {
        const empresa = await Empresa.findById( id )

        if (!empresa) {
            return res.status(404).json({ msg: "Empresa no encontrada, intente mas tarde" })
        }
        await empresa.remove()
        return res.json({ msg: "Empresa eliminada correctamente" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error al eliminar la empresa" })
    }
}

const obtenerSolicitudes = async (req, res) => {
    const { empresa } = req

    try {
        const solicitudes = await Solicitud.find({empresa: empresa.id})
            .populate({
                path: "empleado",
                populate: {
                    path: "usuario",
                }
            })
            .populate("plaza")
        if(!solicitudes){
            return res.status(404).json({msg: "No se encontraron solicitudes"})
        }

        return res.status(200).json({solicitudes})

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "Error al obtener las solicitudes"})
    }
}


const aceptarSolicitud = async (req, res) => {
    const { empresa } = req
    const { empleado, plaza, solicitud } = req.body

    try {
        await Solicitud.findByIdAndDelete(solicitud)
        
        const existeEmpleado = await Empleado.findById(empleado)

        existeEmpleado.empresa = empresa.id
        existeEmpleado.plaza = plaza
        await existeEmpleado.save()

        
    
    return res.status(200).json({empleado: existeEmpleado})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "No se pudo unir a la empresa"})
    }
}

const rechazarSolicitud = async(req, res) => {
    const { id } = req.params

    try {
        const existeSolicitud = await Solicitud.findById(id)

        if(!existeSolicitud){
            return res.status(404).json({msg: "No se encontro la solicitud"})
        }

        if(existeSolicitud.empresa != req.empresa.id){
            return res.status(400).json({msg: "No tienes permiso para rechazar esta solicitud"})
        }
        
        await Solicitud.findByIdAndDelete(id)

        return res.status(200).json({msg: "Solicitud rechazada correctamente"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "Error al rechazar la solicitud"})
    }
}

const obtenerEmpleadoEnPlaza = async( req, res) => {
    const { empresa } = req
    const { id } = req.params

    try {
        const empleado = await Empleado.findOne({empresa: empresa.id, plaza: id})
            .populate("usuario")
            .populate("plaza")

        if(!empleado){
            return res.status(404).json({msg: "No se encontro el empleado"})
        }

        return res.status(200).json({empleado})

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: "Error al obtener el empleado"})
    }

}

export default {
    obtenerEmpresa,
    actualizarDatosEmpresa,
    eliminarEmpresa,
    obtenerSolicitudes,
    aceptarSolicitud,
    rechazarSolicitud,
    obtenerEmpleadoEnPlaza
}