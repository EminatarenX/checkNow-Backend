import mongoose from "mongoose";

const PlazaSchema = mongoose.Schema({
    nombre: {
        type: String, 
        required: true,

    },
    departamento: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    supervisor: {
        type: String,
        required: true,
    },
    salario: {
        type: Number,
        required: true
    },
    habilidades: {
        type: Array,
        required: true
    },
    horario_entrada: {
        type: Date,
        required: true
    },
    horario_salida: {
        type: Date,
        required: true
    },
    estado : {
        type: String,
        required: true,
        default: "disponible",
        enum: ["disponible", "ocupado"]
    },
    empleado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado"
    },
    idEmpresa:{
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