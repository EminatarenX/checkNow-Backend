import Categoria from '../models/Categoria.js'
import Departamento from '../models/Departamento.js'


const crearCategoria = async(req, res) => {
    const { nombre, departamento } = req.body
    try {

        const existeCategoria = await Categoria.findOne({ nombre, departamento })
        if(existeCategoria) return res.status(400).json({ msg: "Ya existe una categoria con ese nombre" })

        const categoria = await Categoria.create({ nombre, departamento, plazas: [] })
        const departamentoCategoria = await Departamento.findById(departamento)
        departamentoCategoria.categorias.push(categoria.id)
        await departamentoCategoria.save()
        return res.status(201).json({ categoria })

    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

// const obtenerCategorias = async(req, res) => {
//     const { id } = req.params
//     const { empresa } = req
//     try {
//         const categoria = await Categoria.findById(id)
//         if (!categoria) return res.status(404).json({ msg: "No se ha encontrado a esa categoria" });
//         if(empresa.id !== categoria.departamento.empresa) return res.status(401).json({ msg: "No tienes permisos para editar esta categoria" })
//         return res.status(200).json({ categoria })
//     }
//     catch(error) {
//         return res.status(500).json({ error })
//     }
// }

const obtenerCategoria = async(req, res) => {
    const { id } = req.params
    try {
        const categorias = await Categoria.find({ departamento: id })

        if(categorias.length === 0) return res.status(404).json({ msg: "No se han encontrado categorias" })
        return res.status(200).json({ categorias })
    }catch(error){
        console.log(error)
        return res.status(500).json({ error })
    }
}

const editarCategoria = async(req, res) => {
    const { id } = req.params
    const { nombre, departamento } = req.body
    const { empresa } = req

    try {
        const categoria = await Categoria.findById(id)
            .populate({
                path: 'departamento',
                select: '_id',
                populate: {
                    path: 'empresa',
                    select: '_id'
                }
            })

        if (!categoria) return res.status(404).json({ msg: "No se ha encontrado a esa categoria" });
        
       
        if(empresa.id !== categoria.departamento.empresa.id) return res.status(401).json({ msg: "No tienes permisos para editar esta categoria" })

        categoria.nombre = nombre
        categoria.departamento = departamento
        await categoria.save()

        return res.status(200).json({ categoria })

    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

const eliminarCategoria = async(req, res) => {
    const { id } = req.params
    const { empresa } = req
    try {
        const categoria = await Categoria.findById(id)
            .populate({
                path: 'departamento',
                select: "_id",
                populate: {
                    path: 'empresa',
                    select: '_id'
                }
            })
        if (!categoria) return res.status(404).json({ msg: "No se ha encontrado a esa categoria" });
        if(empresa.id !== categoria.departamento.empresa.id) return res.status(401).json({ msg: "No tienes permisos para editar esta categoria" })
        await Categoria.findByIdAndDelete(id)

        return res.status(200).json({msg: 'eliminado exitosamente', id })
    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

export default { crearCategoria, obtenerCategoria, editarCategoria, eliminarCategoria }
