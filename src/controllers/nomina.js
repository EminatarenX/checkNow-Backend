import { 
    calcularCuotasObrero,
    calcularFactorIntegracion,
    calcularISR ,
    calcularSubsidio
} from "../helpers/quincenal.js"
import Nomina from "../models/Nomina.js"
import Empleado from '../models/Empleado.js'
import Check from '../models/Check.js'
import { generarNominaPdf } from "../helpers/pdfs/generarNominaPdf.cjs"
import { uploadFile, getFile } from "../helpers/clientAws.js"
import { enviarNominaTrabajador } from '../helpers/correos.js'

const generarNomina = async(req, res) => {
    const { empleado: empleado_id } = req.body

    try {
        const empleado = await Empleado.findById(empleado_id)
        .populate("usuario")
        .populate("empresa")
        .populate("plaza")
    
        if(!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' })

        const dias_vacaciones = empleado.dias_vacaciones
        const dias_aginaldo = empleado.dias_aguinaldo
        
    
        const { usuario, empresa, plaza } = empleado
    
        const quinceDiasAtras = new Date();
        quinceDiasAtras.setDate(quinceDiasAtras.getDate() - 15);
    
        const checks = await Check.find({ empleado: empleado_id, fecha_entrada: { $gte: quinceDiasAtras }})
        // verificar si aun no se ha hecho una nomina con la misma fecha de inicio y fin

        let dias_laborados = checks[checks.length - 1].fecha_entrada.getDate() - checks[0].fecha_entrada.getDate()
        if(dias_laborados === 0 && checks.length > 0) dias_laborados = 1
        else if(dias_laborados === 0 && checks.length === 0) dias_laborados = 0

        if(dias_laborados === 0) return res.status(404).json({ mensaje: 'No hay registros de dias laborados en los últimos 15 días' })
        
        let salario_diario = Number(plaza.salario)
        
       
    
        const factor_integracion = calcularFactorIntegracion(dias_vacaciones, dias_aginaldo)
        const salario_diario_integrado = salario_diario <= 207.44 ? 5255.5 / 15 : salario_diario * factor_integracion
        let cuotas_obrero = calcularCuotasObrero(salario_diario_integrado, dias_laborados)
        let ISR = calcularISR(salario_diario, dias_laborados)
      
        if(salario_diario <= 207.44) {
            ISR = 0
            cuotas_obrero = 0
        }   
       
        
        const suma_deducciones = cuotas_obrero + ISR
        const salario_bruto = salario_diario * dias_laborados
    
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
            }
        })

        const pdf = await generarNominaPdf({nomina, empleado, empresa, plaza, usuario})
        const emision = nomina.fecha_emision.toString().split('GMT')[0].trim().replace(/ /g, '-')
        const upload = await uploadFile(pdf, 
            {nomina: `${usuario.nombre}-${emision}`,
            empresa: empresa._id })
        
        nomina.aws_bucket = upload.uploadParams.Bucket
        nomina.aws_key = upload.uploadParams.Key
        nomina.save()

        const signedUrl = await getFile(upload.uploadParams.Key)

        const datosCorreo = {
            correo: usuario.correo,
            url: signedUrl,
            usuario
        }
        enviarNominaTrabajador(datosCorreo)

        return res.status(200).json({ nomina, url: signedUrl })
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'hubo un error'})
    }

    
}

export default {
    generarNomina
}