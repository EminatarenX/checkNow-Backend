import mongoose from "mongoose";

const CategoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    plazas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plaza"
    }],
    departamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Departamento"
    }
})

const Categoria = mongoose.model("Categoria", CategoriaSchema, "categoria")

export default Categoria