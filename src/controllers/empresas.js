import Empresa from '../models/Empresa.js'

const obtenerEmpresa = async (req, res) => {

    const { usuario } = req

    try {

        const empresa = await Empresa.findOne({ id_creador: usuario.id})

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
    const { usuario } = req
    const { nombre, direccion, telefono, razonSocial, identificacionTributaria, industria } = req.body

    try {
        const empresa = await Empresa.findOne({ id_creador: usuario.id })


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

export default {
    obtenerEmpresa,
    actualizarDatosEmpresa
}