import { config } from "dotenv";
config();
import Stripe from "stripe";
import Usuario from "../models/Usuario.js";
import Empresa from "../models/Empresa.js"
import Pago from "../models/Pagos.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = String(process.env.STRIPE_WEBHOOK_SECRET);

const prices = async (req, res) => {
  const prices = await stripe.prices.list();

  return res.status(200).json({ prices: prices.data })
}


const createCheckoutSession = async (req, res) => {
  const { price_id } = req.params;
  const { empresa } = req;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    line_items: [
      {
        price: price_id,
        quantity: 1,
      }
    ],
    success_url: `${process.env.FRONTEND_URL}/payment-confirmation/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/admin`,
    customer: empresa.stripeCustomerId
  })

  return res.status(200).json({ url: checkoutSession.url })

}


const webhook = async (req, res) => {

  const payload = req.body
  const signature = req.headers['stripe-signature']
  let event;

  try {
    event = await stripe.webhooks.constructEvent(payload, signature, endpointSecret)
  } catch (error) {
    console.log("Error recibido: ", error)
    return res.status(400).send(`Webhook error: ${error.message}`)
  }
  let subscription;
  let status;
  let session
  let amount
  let usuario
  let empresa

  switch (event.type) {

    case 'customer.subscription.trial_will_end':
      subscription = event.data.object;
      status = subscription.status;
      console.log('Subscription status:', status);
      break;

    case 'customer.subscription.deleted':
      subscription = event.data.object;
      status = subscription.status;
      console.log('Subscription status:', status);
      break;

    case 'customer.subscription.created':
      subscription = event.data.object;
      status = subscription.status;
      console.log('Subscription status:', status);
      break;

    case 'customer.subscription.updated':
      subscription = event.data.object;
      status = subscription.status;
      console.log('Subscription status:', status);
      break;


    case 'checkout.session.completed':
      console.log('Checkout session completed')
     session = event.data.object;

     amount = session.amount_total / 100;
     usuario = await Usuario.findOne({ correo: session.customer_details.email })
     empresa = await Empresa.findOne({ creador: usuario._id })


     await stripe.invoiceItems.create({
       customer: session.customer,
       amount: session.amount_total, // El monto en centavos
       currency: session.currency, // La moneda
       description: 'Pago de membresía'
     });

     const invoice = await stripe.invoices.create({
      customer: session.customer,
      collection_method: 'send_invoice',
      days_until_due: 30,
     })
     await stripe.invoices.sendInvoice(invoice.id)

     await Pago.create({
       id_session: session.id,
       subscription_id: session.subscription,
       customer: session.customer,
       id_user: empresa._id,
       payment_status: session.payment_status,
       amount,
     })

     // Aquí puedes agregar el código para manejar la finalización de la sesión de Checkout
     break;
    //case 'invoice.payment_succeeded':

    break;
    case 'invoice.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment);
    // Aquí puedes agregar el código para manejar un pago fallido


    default:
      break;
  }

  res.send()
}


export default { createCheckoutSession, webhook, prices }
