import mongoose from "mongoose";

const CategoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    departamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Departamento",
        required: true
    },
    plazas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plaza"
    }]
})

const Categoria = mongoose.model("Categoria", CategoriaSchema, "categoria")

export default Categoria