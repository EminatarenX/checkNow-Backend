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
    },
    fecha_salida: {
        type: Date
    },
    comentarios: {
        type: String,
        enum: ["Puntual", "No asistio", "Tarde", "Permiso"],
    }
})

const Check = mongoose.model("Check", CheckSchema, 'check')

export default Check