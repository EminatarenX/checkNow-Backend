import mongoose from "mongoose";

const CheckSchema = mongoose.Schema({
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
        required: true
    },
    empleado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        required: true
    },
    fecha_entrada: {
        type: Date,
        default: Date.now(),
        required: true
    },
    fecha_salida: {
        type: Date
    },
    comentarios: {
        type: String,
        enum: ["puntual, no asistió, tarde, permiso"],
    }
})

const Check = mongoose.model("Check", CheckSchema, 'check')

export default Check