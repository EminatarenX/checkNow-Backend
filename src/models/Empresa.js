import mongoose from "mongoose";

const EmpresaSchema = mongoose.Schema({
  nombre: {
    type: String,
  },
  direccion: {
    type: String,
  },
  telefono: {
    type: String,
  },
  correo: {
    type: String,
  }
});

const Empresa = mongoose.model("Empresa", EmpresaSchema, "empresa");
export default Empresa;