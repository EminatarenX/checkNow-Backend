import Categoria from '../models/Categoria.js'
import Departamento from '../models/Departamento.js'


const crearCategoria = async(req, res) => {
    const { nombre, departamento } = req.body
    const { empresa } = req
    try {
        const existeDepartamento = await Departamento.findById(departamento)
            .populate({
                path: 'empresa',
                select: '_id'
            })
        if(existeDepartamento.empresa.id !== empresa.id) return res.status(401).json({ msg: "No tienes permisos para crear una categoria en este departamento" })
        //buscar si existe una categoria con el mismo nombre en el mismo departamento
        const existeCategoria = await Categoria.findOne({ nombre, departamento })
        if(existeCategoria) return res.status(400).json({ msg: "Ya existe una categoria con ese nombre en este departamento" })
        const categoria = await Categoria.create({ nombre, departamento })
        return res.status(201).json({ categoria })
    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

const obtenerCategoria = async(req, res) => {
    const { id } = req.params
    const { empresa } = req
    try {
        const departamento = await Departamento.findById(id)
            .populate({
                path: 'empresa',
                select: '_id'
            })

        if(!departamento) return res.status(404).json({ msg: "No se ha encontrado el departamento" })
        if(departamento.empresa.id  !== empresa.id) return res.status(401).json({ msg: "No tienes permisos para ver esta categoria" })

        const categorias = await Categoria.find({ departamento: id })

        if(categorias.length === 0) return res.status(404).json({ msg: "No se han encontrado categorias" })
        return res.status(200).json({ categorias })
    }catch(error){
        console.log(error)
        return res.status(500).json({ error })
    }
}

// const editarCategoria = async(req, res) => {
//     const { id } = req.params
//     const { nombre, departamento } = req.body
//     const { empresa } = req

//     try {
//         const categoria = await Categoria.findById(id)
//             .populate({
//                 path: 'departamento',
//                 select: '_id',
//                 populate: {
//                     path: 'empresa',
//                     select: '_id'
//                 }
//             })

//         if (!categoria) return res.status(404).json({ msg: "No se ha encontrado a esa categoria" });
        
       
//         if(empresa.id !== categoria.departamento.empresa.id) return res.status(401).json({ msg: "No tienes permisos para editar esta categoria" })

//         categoria.nombre = nombre
//         categoria.departamento = departamento
//         await categoria.save()

//         return res.status(200).json({ categoria })

//     }catch(error) {
//         console.log(error)
//         return res.status(500).json({ error })
//     }
// }

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
        if(empresa.id !== categoria.departamento.empresa.id) return res.status(401).json({ msg: "No tienes permisos para eliminar esta categoria" })
        await Categoria.findByIdAndDelete(id)

        return res.status(200).json({msg: 'Eliminado exitosamente', id })
    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

export default { crearCategoria, obtenerCategoria, /*editarCategoria,*/ eliminarCategoria }
