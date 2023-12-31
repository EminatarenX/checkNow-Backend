import { Schema, model } from "mongoose";

export const ExtraSchema = new Schema({
    empresa: {
      type: Schema.Types.ObjectId,
      ref: "Empresa"
    },
    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',   
      },
    nombre: {
        type: String,
        required: true,
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

const Extra = model("Extra", ExtraSchema, "extra");

export default Extra;