import { supabase } from './supabase-config.js'

// Configuration
const PAYMENT_AMOUNT = 500000; // ₦5,000 in kobo
const PAYMENT_CURRENCY = 'NGN';

// Format currency display
document.getElementById('priceDisplay').textContent = 
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(PAYMENT_AMOUNT / 100);

// Handle payment
document.getElementById('payButton').addEventListener('click', async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
        alert('Please login first');
        return window.location.href = '../auth/login.html';
    }

    const handler = PaystackPop.setup({
        key: 'pk_test_your_paystack_key', // Replace with your key
        email: user.email,
        amount: PAYMENT_AMOUNT,
        currency: PAYMENT_CURRENCY,
        ref: 'INV-' + user.id.slice(0, 8) + '-' + Date.now(),
        callback: async (response) => {
            // Verify and record payment
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    payment_status: true,
                    payment_amount: PAYMENT_AMOUNT / 100,
                    payment_currency: PAYMENT_CURRENCY,
                    last_payment_date: new Date().toISOString()
                })
                .eq('id', user.id);
            
            if (!error) {
                window.location.href = '../index.html';
            } else {
                alert('Payment verification failed. Please contact support.');
            }
        },
        onClose: () => {
            console.log('Payment window closed');
        }
    });
    
    handler.openIframe();
});


// Add this to your existing auth.js
async function checkPaymentStatus(user) {
  const { data, error } = await supabase
      .from('profiles')
      .select('payment_status, payment_currency, payment_amount')
      .eq('id', user.id)
      .single();

  if (!data?.payment_status) {
      window.location.href = '../payment/checkout.html';
  } else {
      console.log(`User paid ${data.payment_amount} ${data.payment_currency}`);
      window.location.href = '../index.html';
  }
}