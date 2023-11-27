import { Schema, model } from "mongoose";

const ExtraSchema = new Schema({
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