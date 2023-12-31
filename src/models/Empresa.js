import mongoose from "mongoose";

// Define el esquema de la empresa
const empresaSchema = new mongoose.Schema({
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  nombre: {
    type: String,
    //required: true
  },
  razonSocial: {
    type: String,
  },
  identificacionTributaria: {
    type: String,
    unique: true,
    sparse: true
  },
  direccion: {
    type: String,
    //required: true
  },
  telefono: {
    type: String,
    unique: true,
    sparse: true
  },
  // Industria: Sector en el que laboran
  //  puede ser:
  // - Servicios
  // - Manufactura
  // - Comercio
  // - Construcción
  // - Tecnología etc
  industria: {
    type: String
  },

  departamentos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departamento'
    }
  ],
  stripeCustomerId: {
    type: String,
    default: null
  }

}, {
  timestamps: true,
  versionKey: false
});


const Empresa = mongoose.model('Empresa', empresaSchema);

export default Empresa;