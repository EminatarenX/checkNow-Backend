import mongoose from 'mongoose';

const NominaSchema = new mongoose.Schema({
  id_empleado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true,
  },
  percepciones: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  descuentos: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  sueldo_neto: {
    type: Number,
    required: true,
  },
  extra: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  id_empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
  },
  fecha_emision : {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date, 
    default: Date.now(),
  },

});

const Nomina = mongoose.model('Nomina', NominaSchema);

export default Nomina;