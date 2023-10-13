import mongoose from "mongoose";

const DepartamentoSchema = mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        required: true
    },
    categorias: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categoria"
        }
    ],
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empresa"
    }
})

const Departamento = mongoose.model("Departamento", DepartamentoSchema, "departamento")

export default Departamento