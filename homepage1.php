<?php
session_start();
include("connect.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InvoiceGen | Invoice, Receipt & Reminder Solutions</title>
    <link rel="stylesheet" href="css/landing.css">
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="main-header">
        <div class="container">
            <div class="logo">InvoiceGen</div>
            <nav>
                <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                    <li><a href="#benefits">Benefits</a></li>
                    <li><a href="logout.php">Logout</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Professional Invoices, Receipts & Automated Reminders</h1>
                <p>Create beautiful financial documents and schedule payment reminders to streamline your business operations.</p>
                <div class="cta-buttons">
                    <a href="invoice-generator.html" class="btn primary receipt-btn">
                        <span class="receipt-top"></span>
                        Design Invoice
                        <span class="receipt-bottom"></span>
                    </a>
                    <a href="receipt.html" class="btn secondary receipt-btn">
                        <span class="receipt-top"></span>
                        Create Receipt
                        <span class="receipt-bottom"></span>
                    </a>
                    <a href="your-scheduler.html" class="btn tertiary receipt-btn">
                        <span class="receipt-top"></span>
                        Schedule Reminders
                        <span class="receipt-bottom"></span>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <section id="features" class="features">
        <div class="container">
            <h2>Complete Financial Documentation Solution</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">📄</div>
                    <h3>Custom Invoices</h3>
                    <p>Professional invoice templates with your branding that make you look established and trustworthy.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🧾</div>
                    <h3>Instant Receipts</h3>
                    <p>Generate polished receipts immediately after transactions to provide excellent customer service.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⏰</div>
                    <h3>Automated Reminders</h3>
                    <p>Schedule payment reminders to reduce late payments by up to 70%.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Record Keeping</h3>
                    <p>Digital archive of all your financial documents for easy tracking and tax preparation.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="benefits" class="benefits">
        <div class="container">
            <h2>Who Benefits From Our Solution?</h2>
            <div class="benefits-grid">
                <div class="benefit-card">
                    <h3>Small Business Owners</h3>
                    <ul>
                        <li>Appear more professional to clients</li>
                        <li>Reduce time spent on paperwork by 80%</li>
                        <li>Automate payment follow-ups</li>
                        <li>Keep perfect financial records</li>
                    </ul>
                </div>
                <div class="benefit-card">
                    <h3>Online Vendors</h3>
                    <ul>
                        <li>Generate receipts instantly for customers</li>
                        <li>Send automatic payment reminders</li>
                        <li>Mobile-friendly for market transactions</li>
                        <li>Professional look without the overhead</li>
                    </ul>
                </div>
                <div class="benefit-card">
                    <h3>Organizations</h3>
                    <ul>
                        <li>Standardize financial documentation</li>
                        <li>Reduce accounting errors</li>
                        <li>Automate member payment reminders</li>
                        <li>Centralized record keeping</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section id="how-it-works" class="how-it-works">
        <div class="container">
            <h2>How It Works</h2>
            <div class="steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <p>Design your invoice or receipt with our easy editor</p>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <p>Set up automatic payment reminders for your customers</p>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <p>Send documents and let our system handle the rest</p>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <p>Access all records in your secure dashboard</p>
                </div>
            </div>
        </div>
    </section>

    <section class="testimonials">
        <div class="container">
            <h2>What Our Users Say</h2>
            <div class="testimonial-grid">
                <div class="testimonial-card">
                    <p>"InvoiceGen has cut my admin time in half. The automatic reminders mean I get paid faster without awkward conversations."</p>
                    <div class="testimonial-author">- Sarah K., Freelance Designer</div>
                </div>
                <div class="testimonial-card">
                    <p>"My customers love the professional receipts. The reminders have reduced my late payments dramatically."</p>
                    <div class="testimonial-author">- Michael T., Online Retailer</div>
                </div>
                <div class="testimonial-card">
                    <p>"As a small NGO, this system helps us maintain professional standards with minimal staff time."</p>
                    <div class="testimonial-author">- Amina B., Nonprofit Director</div>
                </div>
            </div>
        </div>
    </section>

    <section class="final-cta">
        <div class="container">
            <h2>Ready to Streamline Your Financial Documents?</h2>
            <div class="cta-buttons">
                <a href="invoice-generator.html" class="btn primary">Create Invoice</a>
                <a href="receipt.html" class="btn secondary">Generate Receipt</a>
                <a href="your-scheduler.html" class="btn tertiary">Set Up Reminders</a>
            </div>
        </div>
    </section>

    <footer class="main-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">InvoiceGen</div>
                <div class="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Contact Us</a>
                    <a href="#">Help Center</a>
                </div>
            </div>
            <div class="copyright">
                &copy; 2023 InvoiceGen. All rights reserved.
            </div>
        </div>
    </footer>

    <script src="js/main.js"></script>
    <script type="module" src="js/dashboard.js"></script>
</body>
</html>