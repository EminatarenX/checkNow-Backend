import Empresa from '../models/Empresa.js'

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

export default {
    obtenerEmpresa,
    actualizarDatosEmpresa,
    eliminarEmpresa
}