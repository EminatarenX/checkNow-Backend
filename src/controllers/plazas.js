import Empresa from "../models/Empresa.js";
import Plaza from "../models/Plaza.js";

const obtenerplazas = async (req, res) => {
  const { usuario } = req;

  try {
    const empresa = await Empresa.findOne({ id_creador: usuario.id });

    if (!empresa) {
      return res
        .status(404)
        .json({ msg: "Empresa no encontrada, intente mas tarde" });
    }

    const plazas = await Plaza.find({ idEmpresa: empresa.id });

    return res.json({ plazas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al obtener las plazas" });
  }
};

const crearPlaza = async (req, res) => {
  const {
    nombre,
    departamento,
    descripcion,
    supervisor,
    salario,
    habilidades,
    horario_entrada,
    horario_salida,
    estado,
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
      nombre,
      departamento,
      descripcion,
      supervisor,
      salario,
      habilidades,
      horario_entrada,
      horario_salida,
      estado,
      idEmpresa: empresa.id,
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
    departamento,
    descripcion,
    supervisor,
    salario,
    habilidades,
    horario_entrada,
    horario_salida,
    estado,
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


    plaza.nombre = nombre;
    plaza.departamento = departamento;
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
    const { plaza_id } = req.params;

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
