import { Schema, model } from "mongoose";

const ExtraSchema = new Schema({
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true,
    },
    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',   
    },
    percepciones: [
        {
          name: String,
          value: String,
          default: {},
        },
      ],
      deducciones: [
        {
          name: String,
          value: String,
          default: {},
        },
      ],
})

const Extra = model("Extra", ExtraSchema, Extra);

export default Extra;