const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;

const stripe = require('stripe')(STRIPE_SECRET_KEY)

const createCustomer = async(req,res)=>{

    try {

        const customer = await stripe.customers.create({
            name:req.body.name,
            email:req.body.email,
        });

        res.status(200).send(customer);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

const addNewCard = async(req,res)=>{

    try {

        const {
            customer_id,
            card_Name,
            card_ExpYear,
            card_ExpMonth,
            card_Number,
            card_CVC,
        } = req.body;

        const card_token = await stripe.tokens.create({
            card:{
                name: card_Name,
                number: card_Number,
                exp_year: card_ExpYear,
                exp_month: card_ExpMonth,
                cvc: card_CVC
            }
        });

        const card = await stripe.customers.createSource(customer_id, {
            source: `${card_token.id}`
        });

        res.status(200).send({ card: card.id });

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

const createCharges = async(req,res)=>{

    try {

        const createCharge = await stripe.charges.create({
            receipt_email: 'tester@gmail.com',
            amount: parseInt(req.body.amount)*100, //amount*100
            currency:'usd',
            card: req.body.card_id,
            customer: req.body.customer_id,
            capture: false
        });

        res.status(200).send(createCharge);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}


const createCaptureCharges = async(req,res)=>{

    try {

        // const createCharge = await stripe.charges.create({
        //     receipt_email: 'tester@gmail.com',
        //     amount: parseInt(req.body.amount)*100, //amount*100
        //     currency:'usd',
        //     card: req.body.card_id,
        //     customer: req.body.customer_id,
        //     capture: true,
        // });


        // ==>> PaymentIntents
        // https://stripe.com/docs/api?lang=node
        // https://stripe.com/docs/payments/payment-intents
        // https://stripe.com/docs/api/payment_intents
        // https://stripe.com/docs/api/charges/capture
        // https://stripe.com/docs/api/payment_intents/capture

        // ## Note: 
        // Uncaptured PaymentIntents will be canceled a set number of days after they are created (7 by default).


        // ## Create a PaymentIntent
        // https://stripe.com/docs/api/payment_intents/create
        // confirm: false ( optional => Set to true to attempt to confirm this PaymentIntent immediately. )
        // customer: 'adsfsadf' [optional => ID of the Customer this PaymentIntent belongs to, if one exists. ]
        // payment_method: 'asdfb' [ optional => ID of the payment method ],

        // const paymentIntent = await stripe.paymentIntents.create({
        //     customer: req.body.customer_id,
        //     amount: 200,
        //     currency: "usd",
        //     payment_method_types: ["card"],
        //     receipt_email: "masud@gmail.com",
        // });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1200,
            currency: 'usd',
            payment_method_types: ['card'],
            capture_method: 'manual',
          });
            

        
        // ## Retrieve a PaymentIntent
        // https://stripe.com/docs/api/payment_intents/retrieve

        // const paymentIntent = await stripe.paymentIntents.retrieve(
        //     'pi_3NW2BwIIQpgUe9ST0N1nGsqU'
        // );



            
        // ## update a PaymentIntent
        // https://stripe.com/docs/api/payment_intents/update

        // const paymentIntent = await stripe.paymentIntents.update(
        //     'pi_3NW2BwIIQpgUe9ST0N1nGsqU',
        //     {
        //         amount: 120,
        //     }
        // );
            

        // ## Confirm a PaymentIntent
        // https://stripe.com/docs/api/payment_intents/confirm

        // const paymentIntent = await stripe.paymentIntents.confirm(
        // 'pi_3NW2IGIIQpgUe9ST0amu34YD',{
        //     payment_method: "card_1NW2KvIIQpgUe9ST3rltKepB"
        // });


        // ## Cancel a PaymentIntent
        // https://stripe.com/docs/api/payment_intents/cancel
        // Only a PaymentIntent with one of the following statuses may be canceled: requires_payment_method, requires_capture, requires_confirmation, requires_action, processing."
        // const paymentIntent = await stripe.paymentIntents.cancel(
        // 'pi_3NW2BwIIQpgUe9ST0N1nGsqU');


        // ## List all PaymentIntents
        // https://stripe.com/docs/api/payment_intents/list
        // const paymentIntent = await stripe.paymentIntents.list({
        //     limit: 3,
        //   }); 


        // ## Place a hold on a payment method
        // https://stripe.com/docs/payments/place-a-hold-on-a-payment-method
        // Separate payment authorization and capture to create a charge now, but capture funds later.


        res.status(200).send(paymentIntent);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}



module.exports = {
    createCustomer,
    addNewCard,
    createCharges,
    createCaptureCharges
}