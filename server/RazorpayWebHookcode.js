const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'YOUR_KEY_ID',
    key_secret: 'YOUR_KEY_SECRET'
});

// Webhook endpoint
app.post('/razorpay-webhook', (req, res) => {
    const secret = 'YOUR_WEBHOOK_SECRET'; // Set this in Razorpay Dashboard

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        // Signature verified, process the event
        const event = req.body.event;
        const payment = req.body.payload.payment.entity;

        if (event === 'payment.captured') {
            console.log(`Payment captured: ${payment.id}`);
            // Update your database: mark order as paid
        } else if (event === 'payment.failed') {
            console.log(`Payment failed: ${payment.id}`);
            // Update your database: mark order as failed
        }
    } else {
        console.log('Invalid webhook signature');
    }
    res.status(200).send('OK');
});

// Verification after frontend callback
app.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', 'YOUR_KEY_SECRET')
                                .update(body.toString())
                                .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment is successful and verified
        console.log('Payment successful and verified');
        // Update your database: mark order as paid
        res.json({ status: 'success' });
    } else {
        console.log('Payment verification failed');
        res.json({ status: 'failed' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));