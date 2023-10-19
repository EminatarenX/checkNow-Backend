import Departamento from '../models/Departamento.js'

const obtenerDepartamentos = async (req, res) => {
    const { id } = req.empresa

    try {
        const departamentos = await Departamento.find({ empresa: id})

        if(departamentos.length === 0) {
            return res.status(404).json({ msg: "No se encontraron departamentos" })
        }

        return res.status(200).json({ departamentos})
    }catch(error){
        
        return res.status(500).json({msg: 'Hubo un error', error })
    }
}

// const obtenerDepartamento = async(req, res) => {
//     const { id } = req.empresa
//     const { nombre } = req.params

    
//     try {
//         const departamento = await Departamento.find({ empresa: id, nombre})
        
//         if(!departamento) {
//             return res.status(404).json({ msg: "No se encontró el departamento" })

//         }

//         if (departamento.categorias.length > 0) {
//             const departamentoCategorias = await Departamento.findOne({ empresa: id, nombre}).populate("categorias")
//             return res.status(200).json({ departamento: departamentoCategorias })
//         }

//         return res.status(200).json({ departamento })
        
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ error })
//     }
    
// }

const crearDepartamento = async(req, res) => {
    const { nombre: nombreDepartamento, icon } = req.body
    const { id } = req.empresa
    
    try {
        const nombre = nombreDepartamento.replace(/ /g, "-").toLowerCase()

        const existeDepartamento = await Departamento.findOne({ nombre, empresa: id})
        if(existeDepartamento) {
            return res.status(400).json({ msg: "Ya existe un departamento con ese nombre" })
        }

        const departamento = await Departamento.create({ nombre, empresa: id, icon })
        return res.status(201).json({ departamento })

    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}
const editarDepartamento = async(req, res) => {
    const { id } = req.params
    const { nombre, icon } = req.body
    const { id: idEmpresa } = req.empresa
    try {
        const departamento = await Departamento.findById(id)
            .populate({
                path: 'empresa',
                select: '_id'
            })

        if (!departamento) return res.status(404).json({ msg: "No se ha encontrado a ese departamento" });

        if(idEmpresa !== departamento.empresa.id) return res.status(401).json({ msg: "No tienes permisos para editar este departamento" })

        departamento.nombre = nombre
        departamento.icon = icon
        await departamento.save()

        return res.status(200).json({ departamento })

    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

const eliminarDepartamento = async(req, res) => {
    const { id } = req.params
    const { id: idEmpresa } = req.empresa
    try {        
        const departamento = await Departamento.findById(id)
            .populate({
                path: 'empresa',
                select: '_id'
            })

        if (!departamento) return res.status(404).json({ msg: "No se ha encontrado a ese departamento" });
        if(idEmpresa !== departamento.empresa.id) return res.status(401).json({ msg: "No tienes permisos para eliminar este departamento" })

        const eliminarDepto = await Departamento.findByIdAndDelete(id)

        return res.status(200).json({ msg: "Departamento eliminado correctamente" })
    }catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

export default { obtenerDepartamentos, crearDepartamento, editarDepartamento, eliminarDepartamento }
