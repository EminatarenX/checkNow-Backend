// const stripe = new Stripe('sk_test_51NOtkQJRIprVyB9KFM0LOWd3hO3xocFp5xYeqGRLluV25UqaQPkBDlse65F7Alo4SnXGzXMt4DfM3I3teAxZl2ve005WzooTLI');
// const endpointSecret = 'whsec_cd04392924531b37234e3e45b32d47072386ae046905a5c1f85d5413b5b80bdb';
import express from 'express';
import {checkAuth} from '../helpers/checkAuth.js';
import pagosController from '../controllers/pagos.js'
import bodyParser from 'body-parser'
const router = express.Router();


router.get('/',express.json(), pagosController.prices)
router.get('/session/:price_id',[express.json(),checkAuth ],pagosController.createCheckoutSession)
router.post('/webhook',bodyParser.raw({type: 'application/json'}), pagosController.webhook)

export default router