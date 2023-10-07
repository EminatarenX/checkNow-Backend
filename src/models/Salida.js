import mongoose from "mongoose";

const SalidaSchema = mongoose.Schema({
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
    fecha_salida: {
        type: Date,
        default: Date.now(),
        required: true
    },

});

const Salida = mongoose.model("Salida", SalidaSchema, "salida");

export default Salida;