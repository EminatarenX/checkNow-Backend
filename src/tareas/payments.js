
import cron from 'node-cron';
import Pago from '../models/Pagos.js';
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export function revisarPagos () {
    console.log('Corriendo tarea')
    cron.schedule('* * * * *', async () => {
        try {
            const pagos = await Pago.find()

        if(pagos.length === 0) return

        for await (const pago of pagos) {
            const suscription = await stripe.subscriptions.retrieve(pago.subscription_id)
            if(suscription.status === 'canceled'){
                pago.payment_status = 'canceled'
                await pago.save()
            }else if(suscription.status === 'active'){
                pago.payment_status = 'active'
                await pago.save()
            }
            

        }
        } catch (error) {
            console.log(error)
        }
    })
}