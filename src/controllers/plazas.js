import Empresa from "../models/Empresa.js";
import Plaza from "../models/Plaza.js";
import Categoria from "../models/Categoria.js";

const obtenerPlazas = async (req, res) => {
  const { empresa } = req;
  //todas las plazas de ese departamento
  const { id } = req.params

  try{
    if (!empresa) return res.status(404).json({ msg: "Empresa no encontrada, intente mas tarde" });
    
    const categoria = await Categoria.findById(id)
      .populate({
        path: "departamento",
        select: "_id",
        populate: {
          path: "empresa",
          select: "_id",
        },
      })
    if(!categoria) return res.status(404).json({ msg: "Categoria no encontrada" })      
    
    if(categoria.departamento.empresa.id !== empresa.id) return res.status(401).json({ msg: "No tienes permisos para ver las plazas de esta categoria" })

    const plazas = await Plaza.find({ categoria: id })
    return res.json({ msg: "Plazas obtenidas correctamente", plazas });
    
  }catch(error){
    console.log(error);
    return res.status(500).json({ msg: "ErrorS al obtener las plazas" });

  }
};

const crearPlaza = async (req, res) => {
  const {
    nombre,
    categoria,
    descripcion,
    supervisor,
    salario,
    habilidades,
    horario_entrada,
    horario_salida
  } = req.body;
  const { empresa } = req;
  
  try {
    if(!empresa) return res.json({msg: "Empresa no encontrada"})

    const cat = await Categoria.findOne({ _id: categoria })
      .populate({
        path: "departamento",
        select: "_id",
        populate: {
          path: "empresa",
          select: "_id",
        },
      })
    if(cat.departamento.empresa.id !== empresa.id) return res.status(401).json({ msg: "No tienes permisos para crear en esta categoria" })

    const existePlaza = await Plaza.findOne({ nombre, categoria })
    if(existePlaza) return res.status(400).json({ msg: "Ya existe una plaza con ese nombre" })
    const plaza = new Plaza({
      nombre: nombre,
      categoria: categoria,
      descripcion: descripcion,
      supervisor: supervisor,
      salario: salario,
      habilidades: habilidades,
      horario_entrada: horario_entrada,
      horario_salida: horario_salida,
      empresa: empresa.id,
    });

    await plaza.save();

    return res.json({ msg: "Plaza creada correctamente", plaza });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al crear la plaza" });
  }
};

const modificarPlaza = async (req, res) => {
  const {
    nombre,
    categoria,
    descripcion,
    supervisor,
    salario,
    habilidades,
    horario_entrada,
    horario_salida
  } = req.body;
  const { id } = req.params;
  const { empresa } = req;

  try {
    if (!empresa) return res.status(404).json({ msg: "Empresa no encontrada, intente mas tarde" });
    const plaza = await Plaza.findById(id)
      .populate({
        path: "empresa",
        select: "_id",
      })
    if(!plaza) return res.status(404).json({ msg: "Plaza no encontrada" })
    if(plaza.empresa.id !== empresa.id) return res.status(401).json({ msg: "No tienes permisos para modificar esta plaza" })

    const existePlaza = await Plaza.findOne({ nombre, categoria })
    if(existePlaza) return res.status(400).json({ msg: "Ya existe una plaza con ese nombre" })

    const plazaModificada = await Plaza.findByIdAndUpdate(id, {
      nombre: nombre,
      categoria: categoria,
      descripcion: descripcion,
      supervisor: supervisor,
      salario: salario,
      habilidades: habilidades,
      horario_entrada: horario_entrada,
      horario_salida: horario_salida,
    });
    return res.json({ msg: "Plaza modificada correctamente", plazaModificada });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al modificar la plaza" });
  }
};

const eliminarPlaza = async (req, res) => {
    const { empresa } = req;
    const { id } = req.params;

    try{
      if(!empresa) return res.status(404).json({ msg: "Empresa no encontrada, intente mas tarde" });
      const plaza = await Plaza.findById(id)
        .populate({
          path: "empresa",
          select: "_id",
        })
      if(!plaza) return res.status(404).json({ msg: "Plaza no encontrada" })
      if(plaza.empresa.id !== empresa.id) return res.status(401).json({ msg: "No tienes permisos para eliminar esta plaza" })

      await plaza.deleteOne()
      return res.json({ msg: "Plaza eliminada correctamente" });

    }catch(error){
      console.log(error)
      return res.status(500).json({ msg: "Error al eliminar la plaza" });
    }


}

const getPlaza = async(req,res) => {
  const { id } = req.params;

  try {
    const existePlaza = await Plaza.findById(id)
    
    if(!existePlaza) return res.status(404).json({ msg: "Plaza no encontrada" })

    if(!existePlaza.empleado) {
      const plaza = await Plaza.findById(id)
        .populate({
          path: "categoria",
          select: "_id nombre",
          populate: {
            path: "departamento",
            select: "_id nombre",
            populate: {
              path: "empresa",
              select: "_id nombre",
            }
          }
        })

      if(plaza.categoria.departamento.empresa.id !== req.empresa.id) 
      return res.status(401).json({ msg: "No tienes permisos para ver esta plaza" })

      return res.json({ plaza });
    }else{
      const plaza = await Plaza.findById(id)
        .populate({
          path: "categoria",
          select: "_id nombre",
          populate: {
            path: "departamento",
            select: "_id nombre",
            populate: {
              path: "empresa",
              select: "_id nombre",
            }
          }
        })
        .populate({
          path: "empleado",
        })
      return res.json({ plaza });
    }

  } catch (error) {
    console.log(error)
  }
}

export default {
  obtenerPlazas,
  crearPlaza,
  modificarPlaza,
  eliminarPlaza,
  getPlaza
};
