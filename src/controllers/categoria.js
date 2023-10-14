import Categoria from '../models/Categoria.js'

const obtenerCategoria = async(req, res) => {
    
    try {
        const categorias = await Categoria.find() //aquí no sé qué poner xd 
        return res.status(200).json({ categorias })

    }catch(error) {
        return res.status(500).json({ error })
    }


}
const crearCategoria = async(req, res) => {
    const { nombre, departamento } = req.body
    try {
        const categoria = new Categoria({ nombre, departamento })
        await categoria.save()
        return res.status(201).json({ categoria })
    }catch(error) {
        return res.status(500).json({ error })
    }
}
const editarCategoria = async(req, res) => {
    const { id } = req.params
    const { nombre, departamento } = req.body
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, { nombre, departamento })
        return res.status(200).json({ categoria })
    }catch(error) {
        return res.status(500).json({ error })
    }
}

const eliminarCategoria = async(req, res) => {
    const { id } = req.params
    try {
        const categoria = await Categoria.findByIdAndDelete(id)
        return res.status(200).json({ categoria })
    }catch(error) {
        return res.status(500).json({ error })
    }
}

export  { obtenerCategoria, crearCategoria, editarCategoria, eliminarCategoria }
