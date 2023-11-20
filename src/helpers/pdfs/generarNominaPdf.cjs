
const fs = require('fs')
const pdfkit = require('pdfkit')
const getStream = require('get-stream')


const generarNominaPdf = async(body) => {
  const { empleado, empresa, plaza, usuario } = body
    const nomina = {
        empleado: `${usuario.nombre} ${usuario.apellidos}`,
        empresa: empresa.nombre,
        plaza: plaza.nombre,
        percepciones: {
            fecha_inicio: body.nomina.percepciones.fecha_inicio.toLocaleDateString(),
            fecha_fin: body.nomina.percepciones.fecha_fin.toLocaleDateString(),
            neto: body.nomina.percepciones.neto.toFixed(2),
            sueldo: body.nomina.percepciones.sueldo.toFixed(2),
            salario_diario: body.nomina.percepciones.salario_diario.toFixed(2),
            salario_diario_integrado: body.nomina.percepciones.salario_diario_integrado.toFixed(2),
            subsidio: body.nomina.percepciones.subsidio.toFixed(2),
        },
        deducciones: {
            ISR: body.nomina.deducciones.ISR.toFixed(2),
            cuotas_obrero: body.nomina.deducciones.cuotas_obrero.toFixed(2),
        }
    }

    const doc = new pdfkit()

    doc.pipe(fs.createWriteStream('output.pdf'))
    
    doc
      .fontSize(25)
      .text('Recibo de nomina', 100, 100)

    doc
      .fontSize(15)
      .text(`Empleado: ${nomina.empleado}`, 100, 150)
      .text(`Empresa: ${nomina.empresa}`, 100, 170)
      .text(`Plaza: ${nomina.plaza}`, 100, 190)
      .text(`Fecha inicio: ${nomina.percepciones.fecha_inicio}`, 100, 210)
      .text(`Fecha fin: ${nomina.percepciones.fecha_fin}`, 100, 230)
      .text(`Sueldo: ${nomina.percepciones.sueldo}`, 100, 250)
      .text(`Salario diario: ${nomina.percepciones.salario_diario}`, 100, 270)
      .text(`Salario diario integrado: ${nomina.percepciones.salario_diario_integrado}`, 100, 290)
      .text(`Subsidio: ${nomina.percepciones.subsidio}`, 100, 310)
      .text(`Neto: ${nomina.percepciones.neto}`, 100, 330)
      .text(`ISR: ${nomina.deducciones.ISR}`, 100, 350)
      .text(`Cuotas obrero: ${nomina.deducciones.cuotas_obrero}`, 100, 370)
      .text(`Total deducciones: ${nomina.deducciones.ISR + nomina.deducciones.cuotas_obrero}`, 100, 390)
  
    doc.end()

    const pdfBuffer = await getStream.buffer(doc)
    
    return pdfBuffer

}


// const generarNominaPdf = async(body) => {
//     const { empleado, empresa, plaza, usuario } = body

//     const nomina = {
//         empleado: `${usuario.nombre} ${usuario.apellidos}`,
//         empresa: empresa.nombre,
//         plaza: plaza.nombre,
//         percepciones: {
//             fecha_inicio: body.nomina.percepciones.fecha_inicio.toLocaleDateString(),
//             fecha_fin: body.nomina.percepciones.fecha_fin.toLocaleDateString(),
//             neto: body.nomina.percepciones.neto.toFixed(2),
//             sueldo: body.nomina.percepciones.sueldo.toFixed(2),
//             salario_diario: body.nomina.percepciones.salario_diario.toFixed(2),
//             salario_diario_integrado: body.nomina.percepciones.salario_diario_integrado.toFixed(2),
//             subsidio: body.nomina.percepciones.subsidio.toFixed(2),
//         },
//         deducciones: {
//             ISR: body.nomina.deducciones.ISR.toFixed(2),
//             cuotas_obrero: body.nomina.deducciones.cuotas_obrero.toFixed(2),
//         }
//     }

//     try {
//       const htmlTemplate = fs.readFileSync(path.join(__dirname, './nomina.html'), 'utf8');
   
//     const htmlRenderizado = ejs.render(htmlTemplate, nomina);
//     const document = {
//       html: htmlRenderizado,
//       data: nomina,
//     };
  
//     const options = {
//       format: 'A4',
//       orientation: 'portrait',
//       border: '10mm',
//       childProcessOptions: {
//         env: {
//           OPENSSL_CONF: '/dev/null',
//         },
//       },
//     };
    
//     const pdfBuffer = await pdf.create(document, options).then((res) => {
//       console.log(res)
//     });
    
//     return pdfBuffer
//     } catch (error) {
//       console.log(error)
//     }

//   };

  module.exports = { generarNominaPdf }