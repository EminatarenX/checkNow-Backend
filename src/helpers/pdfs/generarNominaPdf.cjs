
const fs = require('fs')
const pdfkit = require('pdfkit')
const getStream = require('get-stream')


const generarNominaPdf = async(body) => {
  const { empleado, empresa, plaza, usuario, nomina: nom_body } = body
    const nomina = {
        empleado: `${usuario.nombre} ${usuario.apellidos}`,
        empresa: empresa.nombre,
        plaza: plaza.nombre,
        percepciones: {
            dias_laborados: nom_body.percepciones.dias_laborados,
            fecha_inicio: nom_body.percepciones.fecha_inicio.toLocaleDateString(),
            fecha_fin: nom_body.percepciones.fecha_fin.toLocaleDateString(),
            neto: nom_body.percepciones.neto.toFixed(2),
            sueldo: nom_body.percepciones.sueldo.toFixed(2),
            salario_diario: nom_body.percepciones.salario_diario.toFixed(2),
            salario_diario_integrado: nom_body.percepciones.salario_diario_integrado.toFixed(2),
            subsidio: nom_body.percepciones.subsidio.toFixed(2),
            neto: nom_body.percepciones.neto.toFixed(2),
        },
        deducciones: {
            ISR: nom_body.deducciones.ISR.toFixed(2),
            cuotas_obrero: nom_body.deducciones.cuotas_obrero.toFixed(2),
        },
        fecha_emision: nom_body.fecha_emision.toLocaleDateString()
    }

    const doc = new pdfkit()

    doc.pipe(fs.createWriteStream('output.pdf'))
    
    doc
      .fontSize(25)
      .text('Recibo de nomina', 50, 75)
      

    doc
      .fontSize(10)
      .text(`Empleado: ${nomina.empleado}`, 50, 120)
      .text(`Empresa: ${nomina.empresa}`, 50, 135)
      .text(`Plaza: ${nomina.plaza}`, 50, 150)
      .text(`Fecha: ${nomina.fecha_emision}`, 50, 165)
      
      .fontSize(15)
      .text(`Percepciones`, 50, 250)
      .underline(50, 250, 200, 15,{color: '#0000FF'})
      .fontSize(12)
      .text(`Sueldo: $${nomina.percepciones.sueldo}`, 50, 290)
      .text(`Salario diario: $${nomina.percepciones.salario_diario}`, 50, 310)
      .text(`Salario diario integrado: ${nomina.percepciones.salario_diario_integrado}`, 50, 330)
      .text(`Subsidio: $${nomina.percepciones.subsidio}`, 50, 350)
      .text(`Neto a recibir: $${nomina.percepciones.neto}`, 50, 370)
      .fontSize(15)
      .text(`Deducciones`, 350, 250).fontSize(15)
      .underline(350, 250, 200, 15,{color: '#0000FF'})
      .fontSize(12)
      .text(`ISR: $${nomina.deducciones.ISR}`, 350, 290)
      .text(`Cuotas obrero: $${nomina.deducciones.cuotas_obrero}`, 350, 310)
      .text(`Total deducciones: $${Number(nomina.deducciones.ISR) + Number(nomina.deducciones.cuotas_obrero)}`, 350, 330)

      .text(`Recibi de ${empresa.nombre} la cantidad de $${nomina.percepciones.neto} por concepto de sueldo correspondiente al periodo del ${nomina.percepciones.fecha_inicio} al ${nomina.percepciones.fecha_fin}`, 50, 450, {align: 'center'})
      .fontSize(8)
      .text(`${nomina.empleado}`, 50, 500, {align: 'center'})
      .underline(160, 500, 255, 15,{color: '#0000', align: 'center'})
    doc.end()

    const pdfBuffer = await getStream.buffer(doc)
    
    return pdfBuffer

}


  module.exports = { generarNominaPdf }