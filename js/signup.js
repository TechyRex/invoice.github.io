// Initialize Supabase
const supabaseUrl = 'https://ibchilighnbwqcirujsl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY2hpbGlnaG5id3FjaXJ1anNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzg5MzMsImV4cCI6MjA2NTY1NDkzM30.01Zd2xmWF3f3QJcOZjI9vBaXtm3NZBxJ2WQbz4PM17A';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('error-message');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    
    // Remove the localStorage set for email
    // Instead of redirecting to payment, go to login
    window.location.href = 'login.html';
    
  } catch (error) {
    errorElement.textContent = error.message;
    errorElement.classList.remove('hidden');
    console.error('Signup error:', error);
  }
});