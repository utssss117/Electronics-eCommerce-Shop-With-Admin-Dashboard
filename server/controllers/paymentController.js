// @desc    Create payment intent (Stripe)
// @route   POST /api/payment/create-payment-intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // If Stripe key is not configured, simulate payment
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      return res.json({
        clientSecret: 'demo_payment_' + Date.now(),
        demo: true,
        message: 'Demo payment mode - Stripe not configured'
      });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      demo: false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentIntent };
