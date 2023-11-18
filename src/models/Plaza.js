import { Schema, model } from "mongoose";

const PlazaSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: true
    },
    descripcion: {
        type: String,
        required: true,
    },
    supervisor: {
        type: String,
    },
    salario: {
        type: Number,
        required: true
    },
    habilidades: {
        type: Schema.Types.Mixed,
        default: {}
    },
    horario_entrada: {
        type: String,
        required: true
    },
    horario_salida: {
        type: String,
        required: true
    },
    empleado: {
        type: Schema.Types.ObjectId,
        ref: "Empleado"
    },
    
    empresa:{
        type: Schema.Types.ObjectId,
        ref: "Empresa"
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    }
})

const Plaza = model("Plaza", PlazaSchema, 'plaza')

export default Plaza