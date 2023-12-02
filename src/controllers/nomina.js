import {
  calcularCuotasObrero,
  calcularFactorIntegracion,
  calcularISR,
  calcularSubsidio,
} from "../helpers/quincenal.js";
import Nomina from "../models/Nomina.js";
import Empleado from "../models/Empleado.js";
import Check from "../models/Check.js";
import { generarNominaPdf } from "../helpers/pdfs/generarNominaPdf.cjs";
import {
  uploadFile,
  getFile,
  getAllNominas,
  deleteDocument,
} from "../helpers/clientAws.js";
import { enviarNominaTrabajador } from "../helpers/correos.js";

const generarNomina = async (req, res) => {
  const { empleado: empleado_id } = req.body;

  try {
    const empleado = await Empleado.findById(empleado_id)
      .populate("usuario")
      .populate("empresa")
      .populate("plaza");

    if (!empleado)
      return res.status(404).json({ mensaje: "Empleado no encontrado" });

    const dias_vacaciones = empleado.dias_vacaciones;
    const dias_aginaldo = empleado.dias_aguinaldo;

    const { usuario, empresa, plaza } = empleado;

    const quinceDiasAtras = new Date();
    quinceDiasAtras.setDate(quinceDiasAtras.getDate() - 15);

    const checks = await Check.find({
      empleado: empleado_id,
      fecha_entrada: { $gte: quinceDiasAtras },
    });

    // verificar si aun no se ha hecho una nomina con la misma fecha de inicio y fin

    let dias_laborados = checks.length;

    if (dias_laborados === 0)
      return res
        .status(404)
        .json({
          mensaje: "No hay registros de dias laborados en los últimos 15 días",
        });

    let salario_diario = Number(plaza.salario);

    const factor_integracion = calcularFactorIntegracion(
      dias_vacaciones,
      dias_aginaldo
    );
    const salario_diario_integrado =
      salario_diario <= 207.44
        ? 5255.5 / 15
        : salario_diario * factor_integracion;
    let cuotas_obrero = calcularCuotasObrero(
      salario_diario_integrado,
      dias_laborados
    );
    let ISR = calcularISR(salario_diario, dias_laborados);

    if (salario_diario <= 207.44) {
      ISR = 0;
      cuotas_obrero = 0;
    }

    const suma_deducciones = cuotas_obrero + ISR;
    const salario_bruto = salario_diario * dias_laborados;

    const nomina = await Nomina.create({
      empleado: empleado_id,
      empresa: empresa._id,
      plaza: plaza._id,
      percepciones: {
        dias_laborados,
        fecha_inicio: checks[0].fecha_entrada,
        fecha_fin: checks[checks.length - 1].fecha_entrada,
        sueldo: salario_bruto,
        salario_diario,
        salario_diario_integrado,
        subsidio: calcularSubsidio(salario_diario, dias_laborados),
        neto: salario_bruto - suma_deducciones,
      },
      deducciones: {
        ISR,
        cuotas_obrero,
      },
    });

    const pdf = await generarNominaPdf({
      nomina,
      empresa,
      plaza,
      usuario,
    });
    const emision = nomina.fecha_emision
      .toString()
      .split("GMT")[0]
      .trim()
      .replace(/ /g, "-");
    const upload = await uploadFile(pdf, {
      nomina: `${usuario.nombre}-${emision}`,
      empresa: empresa._id,
    });

    nomina.aws_bucket = upload.uploadParams.Bucket;
    nomina.aws_key = upload.uploadParams.Key;
    nomina.save();

    const signedUrl = await getFile(upload.uploadParams.Key);

    const datosCorreo = {
      correo: usuario.correo,
      url: signedUrl,
      usuario,
    };
    enviarNominaTrabajador(datosCorreo);

    const nominaPopulate = await Nomina.findById(nomina._id)
      .populate({
        path: "empleado",
        populate: {
          path: "usuario",
        },
      })
      .populate("plaza");

    return res.status(200).json({ nomina: nominaPopulate, url: signedUrl });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "hubo un error" });
  }
};

const getNominasEmpresa = async (req, res) => {
  const { empresa } = req;

  try {
    const nominas = await Nomina.find({ empresa: empresa.id })
      .populate({
        path: "empleado",
        populate: {
          path: "usuario",
        },
      })
      .populate("plaza");

    if (nominas.length === 0)
      return res.status(404).json({ msg: "No se encontraron nominas" });

    const urls = await getAllNominas(empresa.id);

    const nominasConUrl = nominas.map((nomina, index) => {
      return {
        ...nomina._doc,
        url: urls[index],
      };
    });

    nominasConUrl.sort((a, b) => {
      return new Date(b.fecha_emision) - new Date(a.fecha_emision);
    });

    return res.status(200).json({ nominas: nominasConUrl });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "hubo un error" });
  }
};

const eliminarDocumento = async (req, res) => {
  const { id } = req.params;

  try {
    const nomina = await Nomina.findById(id);
    if (!nomina)
      return res.status(404).json({ msg: "No se encontró la nomina" });
    const result = await deleteDocument(nomina.aws_key);
    if (result.code === "AccessDenied")
      return res
        .status(400)
        .json({ msg: "No tienes permiso para eliminar este documento" });
    await Nomina.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Nomina eliminada" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "hubo un error" });
  }
};

export default {
  generarNomina,
  getNominasEmpresa,
  eliminarDocumento,
};
