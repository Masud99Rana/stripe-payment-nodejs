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
        //     capture: false,
        // });


        // ==>> PaymentIntents
        // https://stripe.com/docs/api?lang=node
        // https://stripe.com/docs/payments/payment-intents
        // https://stripe.com/docs/api/payment_intents
        // https://stripe.com/docs/api/charges/capture
        // https://stripe.com/docs/api/payment_intents/capture

        // ## Note: 
        // Uncaptured PaymentIntents will be canceled a set number of days after they are created (7 by default).



        // ***********************
        // ***********************
        // Place a hold on a payment method
        // https://stripe.com/docs/payments/place-a-hold-on-a-payment-method

        // Placing a hold on a card -> Charges API
        // https://stripe.com/docs/charges/placing-a-hold

        // Accept a payment
        // https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements

        // Save payment details during payment
        // https://stripe.com/docs/payments/save-during-payment?platform=web&client=react#charge-saved-payment-method

        // https://stackoverflow.com/questions/58407657/stripe-intent-api-hold-card-and-then-charge-not-working


        // https://stripe.com/docs/stripe-js/react
        // https://stripe.com/docs/stripe-js/react#useelements-hook
        // https://stripe.com/docs/js
        // https://stripe.com/docs/js/setup_intents/confirm_setup

        // Set up future payments
        // https://stripe.com/docs/payments/save-and-reuse?platform=react-native&ui=payment-sheet


        
        // https://saasbase.dev/blog/subscription-payments-1-adding-basic-and-pro-subscription-plans-using-stripe



        // ***********************


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


        // =>>  create intent 
        const paymentIntent = await stripe.paymentIntents.create({
            customer: req.body.customer_id,
            amount: 1500,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: false,
                allow_redirects: 'never'
            },
            // capture_method: 'manual',
            // confirm: true,
            payment_method: req.body.card_id
        });

            

        // => capture the amount
        // const intent = await stripe.paymentIntents.capture(
        //     "pi_3NWdmYIIQpgUe9ST1MR3SjAh",{
        //         amount_to_capture: 3000
        //     }
        // );

        // const intent = await stripe.paymentIntents.capture("pi_3NWdmYIIQpgUe9ST1MR3SjAh");
        // const intent = await stripe.paymentIntents.confirm("pi_3NWdmYIIQpgUe9ST1MR3SjAh");


        
        // ## Retrieve a PaymentIntent
        // https://stripe.com/docs/api/payment_intents/retrieve

        // const paymentIntent = await stripe.paymentIntents.retrieve(
        //     'pi_3NWdN2IIQpgUe9ST1lcX8vpl'
        // );



            
        // => update a PaymentIntent
        // https://stripe.com/docs/api/payment_intents/update

        // const paymentIntentUpdate = await stripe.paymentIntents.update(
        //     "pi_3NWdy5IIQpgUe9ST01IYj2ol",
        //     {
        //         amount: 35000,
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

        


        //////////////////////////
        // change the saved customer
        //////////////////////////
        // const paymentMethods = await stripe.paymentMethods.list({
        //     customer: 'cus_OJGJwXUapPq7UB',
        //     type: 'card',
        // });

        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: 5000,
        //     currency: 'gbp',
        //     automatic_payment_methods: {enabled: true},
        //     customer: 'cus_OJGJwXUapPq7UB',
        //     payment_method: paymentMethods.data[0].id,
        //     off_session: true,
        //     confirm: true,
        //   });


        res.status(200).send(paymentIntent);
        // res.status(200).send(paymentIntent);
        // res.status(200).send(intent);

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