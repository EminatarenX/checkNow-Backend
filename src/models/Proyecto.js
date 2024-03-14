import { Schema, model } from "mongoose";

const proyectoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
    },
    fechaEntrega: {
        type: Date,
    },
    cliente: {
        type: String,
        trim: true,
        required: true,
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: "Empresa",
    },
    colabolaradores: [
        {
            type: Schema.Types.ObjectId,
            ref: "Empleado",    
        },
    ],
},{
    timestamps: true,
})

const Proyecto = model("Proyecto", proyectoSchema)
export default Proyecto