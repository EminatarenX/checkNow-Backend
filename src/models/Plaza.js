import mongoose from "mongoose";

const PlazaSchema = mongoose.Schema({
    nombre: {
        type: String, 
        unique: true,
        required: true,

    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.Mixed,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado"
    },
    
    empresa:{
        type: mongoose.Schema.Types.ObjectId,
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

const Plaza = mongoose.model("Plaza", PlazaSchema, 'plaza')

export default Plaza