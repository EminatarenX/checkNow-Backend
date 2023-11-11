import { Schema, model } from 'mongoose'

const solicitudSchema = new Schema({

    empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    plaza: {
        type: Schema.Types.ObjectId,
        ref: 'Plaza',
        required: true
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },

})

const Solicitud = model('Solicitud', solicitudSchema, 'solicitud')

export default Solicitud