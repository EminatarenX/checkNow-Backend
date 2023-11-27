import {Schema, model} from 'mongoose';

const NominaSchema = new Schema({
  empleado: {
    type: Schema.Types.ObjectId,
    ref: 'Empleado',
    required: true,
  },
  plaza: {
    type: Schema.Types.ObjectId,
    ref: 'Plaza',
  },
  percepciones: {
    type: Schema.Types.Mixed,
    default: {},
  },
  deducciones: {
    type: Schema.Types.Mixed,
    default: {},
  },
  aws_bucket: {
    type: String,
    default: '',
  },
  aws_key: {
    type: String,
    default: '',
  },
    extra: {
    ref: 'Extra',
    default: {}
  },
  empresa: {
    type: Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true,
  },
  fecha_emision : {
    type: Date,
    default: Date.now,
  },
  quincena: {
    type: Number,
    default: 1,
  },
  updated_at: {
    type: Date, 
    default: Date.now,
  },

});

const Nomina = model('Nomina', NominaSchema);

export default Nomina;