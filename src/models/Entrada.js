import mongoose from "mongoose";

const EntradaSchema = mongoose.Schema({
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
    comentarios: {
        type: String,
        enum: ["puntual, no asistió, tarde, permiso"],
        required: true
    }
})

const Entrada = mongoose.model("Entrada", EntradaSchema, 'entrada')

export default Entrada