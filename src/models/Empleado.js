import mongoose from "mongoose";

const EmpleadoSchema = mongoose.Schema({
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    id_empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
    },
    id_plaza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plaza",
        required: true
    },
    entradas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Entrada"
        }
    ],
    salidas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Salida"
    }],
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date, 
        default: Date.now()
    }

})

const Empleado = mongoose.model("Empleado", EmpleadoSchema, 'empleado')
export default Empleado