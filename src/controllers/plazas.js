import Empresa from "../models/Empresa.js";
import Plaza from "../models/Plaza.js";

const obtenerPlazas = async (req, res) => {
  const { empresa } = req;
  try{
    if (!empresa) {
      return res
        .status(404)
        .json({ msg: "Empresa no encontrada, intente mas tarde" });
    }
    const plazas = await Plaza.find({ categoria: { departamento: { empresa: empresa.id } } });
    if(plazas.length === 0) return res.status(404).json({ msg: "No se han encontrado plazas" })
    return res.status(200).json({ plazas })
  }catch(error){
    return res.status(500).json({ msg: "Error al obtener las plazas" });
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
  const { usuario } = req;

  try {
    const empresa = await Empresa.findOne({ id_creador: usuario.id });
    if (!empresa) {
      return res
        .status(404)
        .json({ msg: "Empresa no encontrada, intente mas tarde" });
    }

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
  obtenerplazas,
  crearPlaza,
  modificarPlaza,
  eliminarPlaza,
};
