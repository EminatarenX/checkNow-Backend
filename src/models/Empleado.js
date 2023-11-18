import mongoose from "mongoose";

const EmpleadoSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    informacion_personal: { 
        type: mongoose.Schema.Types.Mixed,
        default: {
            fecha_nacimiento: "", //pasar estos datos en el req.bodylololó´ljose 
            genero: "",
            estado_civil: "",
            numero_seguro_social: "",
            curp: "",
            rfc: "",
            foto: "",            
        },
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa",
    },
    plaza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plaza"
    },
    checks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Check"
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date, 
        default: Date.now
    }

})

const Empleado = mongoose.model("Empleado", EmpleadoSchema, 'empleado')
export default Empleado