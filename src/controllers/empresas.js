import Empresa from '../models/Empresa.js'

const crearEmpresa = async (req, res) => {
    const { nombre, razonSocial, identificacionTributaria, direccion, telefono, industria } = req.body
    const { usuario } = req;

    try {
        const empresaExiste = await Empresa.findOne({ id_creador: usuario.id })

        if (empresaExiste) {
            return res.status(400).json({ msg: "La empresa ya esta registrada" })
        }

        const empresa = new Empresa({
            id_creador: usuario.id,
            nombre,
            direccion,
            telefono,
            razonSocial,
            identificacionTributaria,
            industria
        })

        await empresa.save()

        return res.json({ msg: "Empresa creada correctamente", empresa })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Error al crear la empresa" })
    }
}
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

const eliminarEmpresa = async (req, res) => {

    const { usuario } = req

    try {
        const empresa = await Empresa.findOne({ id_creador: usuario.id })

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
    crearEmpresa,
    obtenerEmpresa,
    actualizarDatosEmpresa,
    eliminarEmpresa
}