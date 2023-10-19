import Empresa from "../models/Empresa.js";
import Plaza from "../models/Plaza.js";
import Categoria from "../models/Categoria.js";

const obtenerPlazas = async (req, res) => {
  const { empresa } = req;
  //todas las plazas de ese departamento
  const { id } = req.params

  try{
    if (!empresa) return res.status(404).json({ msg: "Empresa no encontrada, intente mas tarde" });
    
    const cat = await Categoria.findById(id)
      .populate({
        path: "departamento",
        select: "_id",
        populate: {
          path: "empresa",
          select: "_id",
        },
      })
    if(!cat) return res.status(404).json({ msg: "Categoria no encontrada" })      
    
    if(cat.departamento.empresa.id !== empresa.id) return res.status(401).json({ msg: "No tienes permisos para ver las plazas de esta categoria" })

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
  const { plaza_id} = req.params;
  const { usuario } = req;

  try {
    const empresa = await Empresa.findOne({ id_creador: usuario.id });
    if (!empresa) {
      return res
        .status(404)
        .json({ msg: "Empresa no encontrada, intente mas tarde" });
    }

    const plaza = await Plaza.findOne({ _id: plaza_id });
    if (!plaza) {
      return res
        .status(404)
        .json({ msg: "Plaza no encontrada, intente mas tarde" });
    }

    //si el usuario no es el creador de la empresa
    if (empresa.id !== plaza.empresa) {
      return res
        .status(401)
        .json({ msg: "No tiene permisos para modificar esta plaza" });
    }

    plaza.nombre = nombre;
    plaza.categoria = categoria;
    plaza.descripcion = descripcion;
    plaza.supervisor = supervisor;
    plaza.salario = salario;
    plaza.habilidades = habilidades;
    plaza.horario_entrada = horario_entrada;
    plaza.horario_salida = horario_salida;
    plaza.estado = estado;

    await plaza.save();

    return res.json({ msg: "Plaza modificada correctamente", plaza });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al modificar la plaza" });
  }
};

const eliminarPlaza = async (req, res) => {
    const { usuario } = req;
    const { plaza_id } = req.params; //me quedé acá

    try{
      const empresa = await Empresa.findOne({ id_creador: usuario.id });
      if (!empresa) {
        return res
          .status(404)
          .json({ msg: "Empresa no encontrada, intente mas tarde" });
      }
  
      const plaza = await Plaza.findOne({ _id: plaza_id });
      if (!plaza) {
        return res
          .status(404)
          .json({ msg: "Plaza no encontrada, intente mas tarde" });
      }
  
      await plaza.delete();
  
      return res.json({ msg: "Plaza eliminada correctamente", plaza });
    }catch(error){
      console.log(error)
      return res.status(500).json({ msg: "Error al eliminar la plaza" });
    }


}
export default {
  obtenerPlazas,
  crearPlaza,
  modificarPlaza,
  eliminarPlaza,
};
