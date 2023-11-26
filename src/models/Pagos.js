import { Schema, model } from "mongoose";

const pagoSchema = new Schema({
    id_session: {
        type: String,
        required: true
    },
    subscription_id: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    id_user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    invoice: {
        type: String,
    },
    payment_status: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
});

const Pago = model("Pago",pagoSchema, "pagos" )

export default Pago;