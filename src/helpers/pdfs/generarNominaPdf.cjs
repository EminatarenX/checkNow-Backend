const fs = require("fs");
const pdfkit = require("pdfkit");
const getStream = require("get-stream");

const generarNominaPdf = async (body) => {
  const { empleado, empresa, plaza, usuario, nomina: nom_body } = body;

  let percepciones = [];
  let deducciones = [];

  const nomina = {
    empleado: `${usuario.nombre} ${usuario.apellidos}`,
    empresa: empresa.nombre,
    plaza: plaza.nombre,
    neto: nom_body.percepciones.neto.toFixed(2),
    percepciones: {
      fecha_inicio: nom_body.percepciones.fecha_inicio.toLocaleDateString(),
      fecha_fin: nom_body.percepciones.fecha_fin.toLocaleDateString(),
      dias_laborados: nom_body.percepciones.dias_laborados,
      sueldo_bruto: nom_body.percepciones.sueldo.toFixed(2),
      salario_diario: nom_body.percepciones.salario_diario.toFixed(2),
      salario_diario_integrado:
      nom_body.percepciones.salario_diario_integrado.toFixed(2),
      subsidio: nom_body.percepciones.subsidio.toFixed(2),
      // neto: nom_body.percepciones.neto.toFixed(2),
    },
    deducciones: {
      ISR: nom_body.deducciones.ISR.toFixed(2),
      cuotas_obrero: nom_body.deducciones.cuotas_obrero.toFixed(2),
    },
    fecha_emision: nom_body.fecha_emision.toLocaleDateString(),
  };

  

  for (const key in nomina.percepciones) {
    if (key === "fecha_inicio" || key === "fecha_fin") {
      percepciones.push({
        name: key,
        amount: nomina.percepciones[key],
      });
      continue;
    }
    percepciones.push({
      name: key,
      amount: Number(nomina.percepciones[key]),
    });
  }

  for (const key in nomina.deducciones) {
    deducciones.push({
      name: key,
      amount: Number(nomina.deducciones[key]),
    });
  }

  let total_percepciones = nomina.neto;
  let total_deducciones = 0;
  let last_y = 0;

  const doc = new pdfkit();

  doc.pipe(fs.createWriteStream("output.pdf"));

  doc.fontSize(25).text("Recibo de nomina", 25, 75);
  doc.moveDown(0.5);
  doc.fontSize(9).text(`Empleado: ${nomina.empleado}`);

  doc.moveDown(0.5);
  doc.text(`Empresa: ${nomina.empresa}`);
  doc.moveDown(0.5);
  doc.text(`Plaza: ${nomina.plaza}`);
  doc.moveDown(0.5);
  doc.text(`Fecha: ${nomina.fecha_emision}`);
  doc.moveDown();
  doc.moveDown();

  doc
    .fontSize(13)
    .text(`Percepciones`, 25, 200)
    .underline(25, 200, 550, 15, { color: "#000000" });
  doc.moveDown();
  doc.fontSize(10);
  for (let i = 0; i < percepciones.length; i++) {
    doc.text(`${percepciones[i].name}: ${percepciones[i].amount}`);

    doc.moveDown(0.3);
    if (i === percepciones.length - 1) {
      last_y = doc.y;
    }
  }
  doc.fontSize(13).text(`Deducciones`, 300, 200).fontSize(15).fontSize(12);
  doc.moveDown();
  doc.fontSize(10);

  for (let i = 0; i < deducciones.length; i++) {
    doc.text(`${deducciones[i].name}: ${deducciones[i].amount}`);
    total_deducciones += deducciones[i].amount;
    doc.moveDown(0.3);
  }

  doc.text(`Total percepciones: ${total_percepciones}`, 25, last_y + 10);
  doc.underline(25, last_y + 10, 550, 12, { color: "#CCCCCC" });
  doc.moveDown(0.5);
  doc
    .text(`Total deducciones: ${total_deducciones}`, 300, last_y + 10)
    .text(
      `Recibi de ${empresa.nombre} la cantidad de $${nomina.percepciones.neto} por concepto de sueldo correspondiente al periodo del ${nomina.percepciones.fecha_inicio} al ${nomina.percepciones.fecha_fin}`,
      25,
      450,
      { align: "center" }
    )
    .fontSize(8)
    .text(`${nomina.empleado}`, 25, 500, { align: "center" })
    .underline(160, 500, 255, 15, { color: "#0000", align: "center" });
  doc.end();

  const pdfBuffer = await getStream.buffer(doc);

  return pdfBuffer;
};

module.exports = { generarNominaPdf };
