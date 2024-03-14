import { Schema, model } from "mongoose";

const tareaSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
    },
    descripcion: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: false,
    },
    fechaEntraga: {
        type: Date,
        required: true,
    },
    prioridad: {
        type: String,
        required: true,
        enum: ["Alta", "Media", "Baja"],
    },
    proyecto: {
        type: Schema.Types.ObjectId,
        ref: "Proyecto",
    }
},{
    timestamps: true,
})

const Tarea = model("Tarea", tareaSchema)
export default Tarea