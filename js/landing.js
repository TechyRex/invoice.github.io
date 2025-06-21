// Initialize Supabase
const supabaseUrl = 'https://ibchilighnbwqcirujsl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY2hpbGlnaG5id3FjaXJ1anNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzg5MzMsImV4cCI6MjA2NTY1NDkzM30.01Zd2xmWF3f3QJcOZjI9vBaXtm3NZBxJ2WQbz4PM17A';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    window.location.href = '../auth/login.html';
    return;
  }
  
  // Store email in localStorage if not already there
  if (!localStorage.getItem('userEmail')) {
    localStorage.setItem('userEmail', user.email);
  }
  
  document.getElementById('pay-button').addEventListener('click', () => {
    initiatePayment(user.email);
  });
});

async function initiatePayment(email) {
  const errorElement = document.getElementById('error-message');
  
  try {
    // First, verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated. Please log in.');
    }
    
    // Initialize Paystack payment
    const handler = PaystackPop.setup({
      key: 'YOUR_PAYSTACK_PUBLIC_KEY',
      email: email,
      amount: 1000 * 100, // 1000 Naira (in kobo) - adjust as needed
      currency: 'NGN', // Change as needed
      ref: 'INV-' + Math.floor(Math.random() * 1000000000 + 1),
      callback: async function(response) {
        // Payment successful - update user record in Supabase
        const { error } = await supabase
          .from('users')
          .upsert({
            email: email,
            has_paid: true,
            payment_reference: response.reference,
            payment_date: new Date().toISOString()
          });
        
        if (error) throw error;
        
        // Redirect to main app
        window.location.href = '../../index.html';
      },
      onClose: function() {
        // User closed payment modal
        console.log('Payment window closed');
      }
    });
    
    handler.openIframe();
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('hidden');
    console.error('Payment error:', error);
  }
}