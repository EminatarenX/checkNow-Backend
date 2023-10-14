import Departamento from '../models/Departamento.js'

const obtenerDepartamento = async(req, res) => {

    return res.json({msg: "Obteniendo departamento"})
}

const crearDepartamento = async(req, res) => {
    const { nombre, icon } = req.body
    const { id } = req.empresa
    
    try {
        const departamento = await Departamento.create({ nombre, empresa: id, icon })
        return res.status(201).json({ departamento })

    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}
const editarDepartamento = async(req, res) => {
    const { id } = req.params
    const { nombre } = req.body
    try {
        const departamento = await Departamento.findByIdAndUpdate(id, { nombre })
        return res.status(200).json({ departamento })
    }catch(error) {
        return res.status(500).json({ error })
    }
}

const eliminarDepartamento = async(req, res) => {
    const { id } = req.params
    try {
        const departamento = await Departamento.findByIdAndDelete(id)
        return res.status(200).json({ departamento })
    }catch(error) {
        return res.status(500).json({ error })
    }
}

export default { obtenerDepartamento, crearDepartamento, editarDepartamento, eliminarDepartamento }
