const tarifas = [
    {
      limite_inferior: 0.01,
      limite_superior: 368.1,
      cuota_fija: 0,
      porcentaje: 0.0192,
    },
    {
      limite_inferior: 368.11,
      limite_superior: 3124.35,
      cuota_fija: 7.05,
      porcentaje: 0.064,
    },
    {
      limite_inferior: 3124.36,
      limite_superior: 5490.75,
      cuota_fija: 183.45,
      porcentaje: 0.1088,
    },
    {
      limite_inferior: 5490.76,
      limite_superior: 6382.80,
      cuota_fija: 441,
      porcentaje: 0.16,
    },
    {
      limite_inferior: 6382.81,
      limite_superior: 7641.90,
      cuota_fija: 583.65,
      porcentaje: 0.1792,
    },
    {
      limite_inferior: 7641.91,
      limite_superior: 15412.80,
      cuota_fija: 809.25,
      porcentaje: 0.2136,
    },
    {
      limite_inferior: 15412.81,
      limite_superior: 24292.65,
      cuota_fija: 2469.15,
      porcentaje: 0.2352,
    },
    {
      limite_inferior: 24292.66,
      limite_superior: 46378.50,
      cuota_fija: 4557.75,
      porcentaje: 0.30,
    },
    {
      limite_inferior: 46378.51,
      limite_superior: 61838.10,
      cuota_fija: 11183.40,
      porcentaje: 0.032,
    },
    {
      limite_inferior: 61838.11,
      limite_superior: 185514.30,
      cuota_fija: 16130.55,
      porcentaje: 0.34,
    },
    {
      limite_inferior: 185514.31,
      limite_superior: Infinity,
      cuota_fija: 58180.35,
      porcentaje: 0.35,
    },
  ];
  

  const subsidio = [
    {
      desde_ingresos: 0.01,
      hasta_ingresos: 872.85,
      cantidad_subsidio: 200.85,
    },
    {
      desde_ingresos: 872.86,
      hasta_ingresos: 1309.20,
      cantidad_subsidio: 200.7,
    },
    {
      desde_ingresos: 1309.21,
      hasta_ingresos: 1713.60,
      cantidad_subsidio: 200.7,
    },
    {
      desde_ingresos: 1713.61,
      hasta_ingresos: 1745.70,
      cantidad_subsidio: 193.8,
    },
    {
      desde_ingresos: 1745.71,
      hasta_ingresos: 2193.75,
      cantidad_subsidio: 188.7,
    },
    {
      desde_ingresos: 2193.76,
      hasta_ingresos: 2327.55,
      cantidad_subsidio: 174.75,
    },
    {
      desde_ingresos: 2327.56,
      hasta_ingresos: 2632.65,
      cantidad_subsidio: 160.35,
    },
    {
      desde_ingresos: 2632.66,
      hasta_ingresos: 3071.40,
      cantidad_subsidio: 145.35,
    },
    {
      desde_ingresos: 3071.41,
      hasta_ingresos: 3510.15,
      cantidad_subsidio: 125.1,
    },
    {
      desde_ingresos: 3510.16,
      hasta_ingresos: 3642.60,
      cantidad_subsidio: 107.4,
    },
    {
      desde_ingresos: 3642.61,
      hasta_ingresos: Infinity,
      cantidad_subsidio: 0,
    },
  ];
  
  
const calcularFactorIntegracion = (dias_vacaciones,dias_aginaldo ) => {
    const prima_vacacional = 0.25;
    const diasXprima_vacacional = dias_vacaciones * prima_vacacional;
    const dias_anio = 365;
    const suma = diasXprima_vacacional + dias_aginaldo + dias_anio;
    const factor_integracion = suma / dias_anio;

    return factor_integracion;
}   

const calcularISR = (sueldo, dias_laborados) => {
    const base_isr = sueldo * dias_laborados;

   
    const limite_inferior = tarifas.find( tarifa => {
        return tarifa.limite_inferior  < base_isr && tarifa.limite_superior > base_isr;
    })

    const exedente_de_porcentaje = base_isr - limite_inferior.limite_inferior;
   
    const tasa_de_isr = limite_inferior.porcentaje;
    
  
    const exedente_irs = exedente_de_porcentaje * tasa_de_isr;
    
    const cuota_fija = limite_inferior.cuota_fija;

    const isr_cargo = exedente_irs + cuota_fija;
 

    const sub = subsidio.find ( sub => {
        return sub.desde_ingresos < base_isr && sub.hasta_ingresos > base_isr;
    })
    


    const ISR_A_RETENER = isr_cargo - sub.cantidad_subsidio;
    if(ISR_A_RETENER < 0) return 0;
    else return ISR_A_RETENER;
    
}

const calcularSubsidio = (sueldo, dias_laborados) => {
    const base_isr = sueldo * dias_laborados;

    const sub = subsidio.find ( sub => {
        return sub.desde_ingresos < base_isr && sub.hasta_ingresos > base_isr;
    })

    return sub.cantidad_subsidio;

}

const calcularCuotasObrero = (salario_diario_integrado, dias_trabajados) => {
    const UMA_POR_TRES = 103.74 * 3;

    let importe_exedente_patronal = salario_diario_integrado - UMA_POR_TRES;

    if(importe_exedente_patronal < 0) {
      importe_exedente_patronal = 207.44;
    }

    
    let cuotas_obrero= {
        exedente_patronal: {
            porcentaje: 0.004,
            importe: importe_exedente_patronal * dias_trabajados,
            
        },
        prestaciones_en_dinero: {
            porcentaje: 0.0025,
            importe: salario_diario_integrado * dias_trabajados,
        },
        prestaciones_en_especie: {
            porcentaje: 0.00375,
            importe: salario_diario_integrado * dias_trabajados,
        },
        invalidez_y_vida: {
            porcentaje: 0.00625,
            importe: salario_diario_integrado * dias_trabajados,
        },
        cesantia_y_vejez: {
            porcentaje: 0.01125,
            importe: salario_diario_integrado * dias_trabajados,
        },
    }
    

    const cuotas_correspondiente = {
        exedente_patronal: Number(cuotas_obrero.exedente_patronal.importe * cuotas_obrero.exedente_patronal.porcentaje),
        prestaciones_en_dinero: Number(cuotas_obrero.prestaciones_en_dinero.importe * cuotas_obrero.prestaciones_en_dinero.porcentaje),
        prestaciones_en_especie: Number(cuotas_obrero.prestaciones_en_especie.importe * cuotas_obrero.prestaciones_en_especie.porcentaje),
        invalidez_y_vida: Number(cuotas_obrero.invalidez_y_vida.importe * cuotas_obrero.invalidez_y_vida.porcentaje),
        cesantia_y_vejez: Number(cuotas_obrero.cesantia_y_vejez.importe * cuotas_obrero.cesantia_y_vejez.porcentaje),
    }

    const suma_de_importes_seguro = 
        cuotas_correspondiente.exedente_patronal + 
        cuotas_correspondiente.prestaciones_en_dinero + 
        cuotas_correspondiente.prestaciones_en_especie + 
        cuotas_correspondiente.invalidez_y_vida + 
        cuotas_correspondiente.cesantia_y_vejez;
    
    return suma_de_importes_seguro;


}

export {
    calcularFactorIntegracion,
    calcularISR,
    calcularCuotasObrero,
    calcularSubsidio
}