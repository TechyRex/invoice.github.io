// receipt.js
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('receipt-date').value = today;

  // Generate random receipt number
  document.getElementById('receipt-number').value = 'RCPT-' + Math.floor(1000 + Math.random() * 9000);

  // Template and color selection
  const templateThumbnails = document.querySelectorAll('.template-thumbnail');
  const receiptTemplate = document.getElementById('receipt-template');
  let selectedColor = '#4a6ee0';
  let selectedTemplate = 'simple';

  // Handle template selection
  templateThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
          templateThumbnails.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          selectedTemplate = this.getAttribute('data-template');
          updateReceiptPreview();
      });
  });

  // Set first template as active by default
  if (templateThumbnails.length > 0) {
      templateThumbnails[0].classList.add('active');
      selectedTemplate = templateThumbnails[0].getAttribute('data-template');
  }

  // Handle color selection
  document.querySelectorAll('.color-option').forEach(option => {
      option.addEventListener('click', function() {
          selectedColor = this.getAttribute('data-color');
          document.getElementById('custom-color').value = selectedColor;
          updateReceiptPreview();
      });
  });

  // Handle custom color selection
  document.getElementById('custom-color').addEventListener('input', function() {
      selectedColor = this.value;
      updateReceiptPreview();
  });

  // Handle logo upload
  let logoPreviewUrl = '';
  document.getElementById('business-logo').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
              logoPreviewUrl = event.target.result;
              updateReceiptPreview();
          };
          reader.readAsDataURL(file);
      }
  });

  // Add item row functionality
  const addItemBtn = document.getElementById('add-item');
  const itemsContainer = document.getElementById('items-container');

  addItemBtn.addEventListener('click', function() {
      const itemRow = document.createElement('div');
      itemRow.className = 'item-row';
      itemRow.innerHTML = `
          <input type="text" class="item-desc" placeholder="Description">
          <input type="number" class="item-qty" placeholder="Qty" min="1" value="1">
          <input type="number" class="item-price" placeholder="Price" step="0.01">
          <button class="remove-item">×</button>
      `;
      itemsContainer.appendChild(itemRow);

      // Add event listeners to new inputs
      itemRow.querySelectorAll('input').forEach(input => {
          input.addEventListener('input', updateReceiptPreview);
      });

      // Add event listener to remove button
      itemRow.querySelector('.remove-item').addEventListener('click', function() {
          itemRow.remove();
          updateReceiptPreview();
      });

      updateReceiptPreview();
  });

  // Add event listeners to all form inputs
  document.querySelectorAll('.design-panel input, .design-panel textarea, .design-panel select').forEach(input => {
      input.addEventListener('input', updateReceiptPreview);
  });

  // Add font style selection functionality
let selectedFontFamily = 'Arial, sans-serif'; // Default font

// Handle font style selection
document.getElementById('font-style').addEventListener('change', function() {
    selectedFontFamily = this.value;
    updateReceiptPreview();
});

  function updateReceiptPreview() {
    const businessName = document.getElementById('business-name').value || 'Your Business';
    const businessAddress = document.getElementById('business-address').value || '123 Business St, City, Country';
    const businessEmail = document.getElementById('business-email').value || 'business@example.com';
    const businessPhone = document.getElementById('business-phone').value || '+1234567890';
    
    const customerName = document.getElementById('customer-name').value || 'Customer Name';
    const customerEmail = document.getElementById('customer-email').value || 'customer@example.com';
    
    const receiptNumber = document.getElementById('receipt-number').value || 'RCPT-001';
    const receiptDate = formatDate(document.getElementById('receipt-date').value) || formatDate(today);
    const paymentMethod = document.getElementById('payment-method').value || 'Cash';
    const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
    const currencySymbol = document.getElementById('currency').value || '$';
    
    // Get all items
    const items = [];
    let subtotal = 0;
    
    document.querySelectorAll('.item-row').forEach(row => {
        const description = row.querySelector('.item-desc').value || 'Item';
        const quantity = parseFloat(row.querySelector('.item-qty').value) || 1;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = quantity * price;
        
        items.push({ description, quantity, price, total });
        subtotal += total;
    });
    
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    
    // Apply font style to the entire receipt
    const fontStyle = `font-family: ${selectedFontFamily};`;
    
    // Generate HTML based on template
    let receiptHTML = '';
    
    if (selectedTemplate === 'simple') {
        receiptHTML = `
            <div style="${fontStyle}">
                <div class="receipt-header" style="border-bottom: 2px solid ${selectedColor}; margin-bottom: 20px; padding-bottom: 15px;">
                    ${logoPreviewUrl ? `<img src="${logoPreviewUrl}" alt="${businessName}" style="max-height: 80px; margin-bottom: 15px;">` : ''}
                    <h2 style="color: ${selectedColor}; ${fontStyle}">${businessName}</h2>
                    <p style="${fontStyle}">${businessAddress}</p>
                    <p style="${fontStyle}">${businessEmail}<br>${businessPhone}</p>
                </div>
                
                <div class="receipt-meta" style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div style="${fontStyle}">
                        <p><strong>Receipt #:</strong> ${receiptNumber}</p>
                        <p><strong>Date:</strong> ${receiptDate}</p>
                        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    </div>
                    <div style="${fontStyle}">
                        <p><strong>Customer:</strong> ${customerName}</p>
                        <p><strong>Email:</strong> ${customerEmail}</p>
                    </div>
                </div>
                
                <table class="receipt-items" style="${fontStyle} width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: ${selectedColor}; color: #34495e;">
                            <th style="padding: 12px; text-align: left; ${fontStyle}">Description</th>
                            <th style="padding: 12px; text-align: center; ${fontStyle}">Qty</th>
                            <th style="padding: 12px; text-align: right; ${fontStyle}">Price</th>
                            <th style="padding: 12px; text-align: right; ${fontStyle}">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 12px; ${fontStyle}">${item.description}</td>
                                <td style="padding: 12px; text-align: center; ${fontStyle}">${item.quantity}</td>
                                <td style="padding: 12px; text-align: right; ${fontStyle}">${currencySymbol}${item.price.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; ${fontStyle}">${currencySymbol}${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="receipt-total" style="text-align: right; margin-bottom: 20px; ${fontStyle}">
                    <p>Subtotal: ${currencySymbol}${subtotal.toFixed(2)}</p>
                    ${taxRate > 0 ? `<p>Tax (${taxRate}%): ${currencySymbol}${tax.toFixed(2)}</p>` : ''}
                    <p style="font-size: 18px; font-weight: bold;"><strong>Total: ${currencySymbol}${total.toFixed(2)}</strong></p>
                </div>
                
                <div class="receipt-footer" style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; ${fontStyle}">
                    <p>Thank you for your business!</p>
                    <p style="font-size: 14px; color: #666;">${businessName} | ${businessEmail} | ${businessPhone}</p>
                </div>
            </div>
        `;
    } else if (selectedTemplate === 'modern') {
    receiptHTML = `
        <div style="${fontStyle}">
            <div class="receipt-header" style="display: flex; align-items: center; border-left: 4px solid ${selectedColor}; padding-left: 20px; margin-bottom: 30px; flex-wrap: wrap;">
                ${logoPreviewUrl ? `<img src="${logoPreviewUrl}" alt="${businessName}" style="max-height: 60px; margin-right: 20px; margin-bottom: 10px;">` : ''}
                <div style="${fontStyle}">
                    <h2 style="color: ${selectedColor}; margin: 0; ${fontStyle}">${businessName}</h2>
                    <p style="margin: 5px 0; ${fontStyle}">${businessAddress}</p>
                    <p style="margin: 5px 0; ${fontStyle}">${businessEmail}<br>${businessPhone}</p>
                </div>
            </div>
            
            <div class="receipt-meta" style="margin-bottom: 30px; ${fontStyle}">
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; flex-wrap: wrap;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; min-width: 120px;">Receipt #</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; flex: 1;">${receiptNumber}</span>
                </div>
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; flex-wrap: wrap;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; min-width: 120px;">Date</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; flex: 1;">${receiptDate}</span>
                </div>
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; flex-wrap: wrap;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; min-width: 120px;">Payment Method</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; flex: 1;">${paymentMethod}</span>
                </div>
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; flex-wrap: wrap;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; min-width: 120px;">Customer</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; flex: 1;">${customerName}</span>
                </div>
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; flex-wrap: wrap;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; min-width: 120px;">Email</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; flex: 1; word-break: break-all;">${customerEmail}</span>
                </div>
            </div>
            
            <div style="overflow-x: auto; margin-bottom: 20px;">
                <table class="receipt-items" style="${fontStyle} width: 100%; min-width: 500px; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: ${selectedColor}; color: white;">
                            <th style="padding: 12px; text-align: left; ${fontStyle}">Item</th>
                            <th style="padding: 12px; text-align: center; ${fontStyle}">Qty</th>
                            <th style="padding: 12px; text-align: right; ${fontStyle}">Price</th>
                            <th style="padding: 12px; text-align: right; ${fontStyle}">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 12px; ${fontStyle}">${item.description}</td>
                                <td style="padding: 12px; text-align: center; ${fontStyle}">${item.quantity}</td>
                                <td style="padding: 12px; text-align: right; ${fontStyle}">${currencySymbol}${item.price.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; ${fontStyle}">${currencySymbol}${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="receipt-total" style="text-align: right; margin-bottom: 20px; ${fontStyle}">
                <p>Subtotal: ${currencySymbol}${subtotal.toFixed(2)}</p>
                ${taxRate > 0 ? `<p>Tax (${taxRate}%): ${currencySymbol}${tax.toFixed(2)}</p>` : ''}
                <p style="font-size: 18px; font-weight: bold;">Total: ${currencySymbol}${total.toFixed(2)}</p>
            </div>
            
            <div class="receipt-footer" style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; ${fontStyle}">
                <p>Thank you for your purchase!</p>
                <p style="font-size: 14px; color: #666; word-wrap: break-word;">For any questions, please contact ${businessEmail} or ${businessPhone}</p>
            </div>
        </div>
    `;
    } else if (selectedTemplate === 'elegant') {
        receiptHTML = `
            <div style="${fontStyle}">
                <div class="receipt-header" style="text-align: center; margin-bottom: 30px; ${fontStyle}">
                    ${logoPreviewUrl ? `<img src="${logoPreviewUrl}" alt="${businessName}" style="max-height: 70px; margin-bottom: 15px;">` : ''}
                    <h2 style="color: ${selectedColor}; margin: 10px 0; ${fontStyle}">${businessName}</h2>
                    <p style="margin: 5px 0; ${fontStyle}">${businessAddress}</p>
                    <p style="margin: 5px 0; ${fontStyle}">${businessEmail}<br>${businessPhone}</p>
                </div>
                
                <div class="receipt-meta" style="display: flex; justify-content: space-between; margin-bottom: 30px; ${fontStyle}">
                    <div class="meta-column">
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Receipt Number</div>
                            <div class="meta-value" style="${fontStyle}">${receiptNumber}</div>
                        </div>
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Date</div>
                            <div class="meta-value" style="${fontStyle}">${receiptDate}</div>
                        </div>
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Payment Method</div>
                            <div class="meta-value" style="${fontStyle}">${paymentMethod}</div>
                        </div>
                    </div>
                    <div class="meta-column">
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Customer</div>
                            <div class="meta-value" style="${fontStyle}">${customerName}</div>
                        </div>
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Email</div>
                            <div class="meta-value" style="${fontStyle}">${customerEmail}</div>
                        </div>
                    </div>
                </div>
                
                <table class="receipt-items" style="${fontStyle} width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ddd;">
                    <thead>
                        <tr style="background-color: #f8f9fa;  border-bottom: 2px solid ${selectedColor};">
                            <th style="padding: 12px; text-align: left; ${fontStyle}">Description</th>
                            <th style="padding: 12px; text-align: center; ${fontStyle}">Qty</th>
                            <th style="padding: 12px; text-align: right; ${fontStyle}">Unit Price</th>
                            <th style="padding: 12px; text-align: right; ${fontStyle}">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr style="border-bottom: 1px solid #eee;">
                                <td style="padding: 12px; ${fontStyle}">${item.description}</td>
                                <td style="padding: 12px; text-align: center; ${fontStyle}">${item.quantity}</td>
                                <td style="padding: 12px; text-align: right; ${fontStyle}">${currencySymbol}${item.price.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; ${fontStyle}">${currencySymbol}${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="receipt-total" style="text-align: right; margin-bottom: 20px; ${fontStyle}">
                    <div class="total-row" style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <div class="total-label" style="font-weight: bold; ${fontStyle}">Subtotal</div>
                        <div class="total-value" style="${fontStyle}">${currencySymbol}${subtotal.toFixed(2)}</div>
                    </div>
                    ${taxRate > 0 ? `
                    <div class="total-row" style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <div class="total-label" style="font-weight: bold; ${fontStyle}">Tax (${taxRate}%)</div>
                        <div class="total-value" style="${fontStyle}">${currencySymbol}${tax.toFixed(2)}</div>
                    </div>
                    ` : ''}
                    <div class="total-row" style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px 0; border-bottom: 2px solid ${selectedColor};">
                        <div class="total-label" style="font-weight: bold; font-size: 18px; ${fontStyle}">Total</div>
                        <div class="total-value" style="font-weight: bold; font-size: 18px; ${fontStyle}">${currencySymbol}${total.toFixed(2)}</div>
                    </div>
                </div>
                
                <div class="receipt-footer" style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; ${fontStyle}">
                    <p>Thank you for choosing ${businessName}</p>
                    <p style="font-size: 14px; color: #666;">For any questions about this receipt, please contact us at ${businessEmail} or call ${businessPhone}</p>
                </div>
            </div>
        `;
    }
    
    receiptTemplate.className = selectedTemplate;
    receiptTemplate.innerHTML = receiptHTML;
}
  // Format date
  function formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  }

  // Download PDF
  document.getElementById('download-pdf').addEventListener('click', function() {
      const { jsPDF } = window.jspdf;
      const receipt = document.getElementById('receipt-template');
      
      html2canvas(receipt, {
          scale: 2,
          logging: false,
          useCORS: true
      }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 190;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`${document.getElementById('receipt-number').value || 'receipt'}.pdf`);
      });
  });

  // Print receipt
  document.getElementById('print-receipt').addEventListener('click', function() {
      const receipt = document.getElementById('receipt-template');
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>Print Receipt</title>
              <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                  @media print {
                      @page { size: auto; margin: 0mm; }
                      body { padding: 0; }
                  }
              </style>
          </head>
          <body>
              ${receipt.innerHTML}
              <script>
                  window.onload = function() {
                      window.print();
                      window.close();
                  };
              </script>
          </body>
          </html>
      `);
      printWindow.document.close();
  });

  // Improved Send via email functionality - replace the existing email function in your receipt.js

document.getElementById('send-email').addEventListener('click', function(e) {
  e.preventDefault();
  
  // 1. Validate customer email
  const customerEmail = document.getElementById('customer-email').value;
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      alert('Please enter a valid customer email address');
      return;
  }

  // 2. Gather all receipt data
  const businessName = document.getElementById('business-name').value || 'Your Business';
  const businessEmail = document.getElementById('business-email').value || 'business@example.com';
  const businessPhone = document.getElementById('business-phone').value || '';
  const receiptNumber = document.getElementById('receipt-number').value || 'RCPT-001';
  const receiptDate = formatDate(document.getElementById('receipt-date').value) || formatDate(new Date().toISOString().split('T')[0]);
  const paymentMethod = document.getElementById('payment-method').value || 'Cash';
  const customerName = document.getElementById('customer-name').value || 'Valued Customer';
  const currencySymbol = document.getElementById('currency').value || '$';

  // 3. Calculate totals
  let subtotal = 0;
  let itemsText = '';
  
  document.querySelectorAll('.item-row').forEach((row, index) => {
      const description = row.querySelector('.item-desc').value || 'Item';
      const quantity = parseFloat(row.querySelector('.item-qty').value) || 1;
      const price = parseFloat(row.querySelector('.item-price').value) || 0;
      const total = quantity * price;
      
      itemsText += `${index + 1}. ${description} - Qty: ${quantity} x ${currencySymbol}${price.toFixed(2)} = ${currencySymbol}${total.toFixed(2)}\n`;
      subtotal += total;
  });
  
  const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
  const tax = subtotal * (taxRate / 100);
  const totalAmount = subtotal + tax;

  // 4. Create comprehensive email content
  const subject = `Receipt ${receiptNumber} from ${businessName}`;
  
  const body = `Dear ${customerName},

Thank you for your business! Please find the details of your purchase below:

RECEIPT DETAILS
===============
Receipt Number: ${receiptNumber}
Date: ${receiptDate}
Payment Method: ${paymentMethod}

BUSINESS INFORMATION
===================
${businessName}
Email: ${businessEmail}
${businessPhone ? `Phone: ${businessPhone}` : ''}

ITEMS PURCHASED
===============
${itemsText}

PAYMENT SUMMARY
===============
Subtotal: ${currencySymbol}${subtotal.toFixed(2)}
${taxRate > 0 ? `Tax (${taxRate}%): ${currencySymbol}${tax.toFixed(2)}\n` : ''}Total: ${currencySymbol}${totalAmount.toFixed(2)}

Thank you for choosing ${businessName}! If you have any questions about this receipt, please don't hesitate to contact us.

Best regards,
${businessName}
${businessEmail}
${businessPhone ? businessPhone : ''}`;

  // 5. Create multiple email options for better compatibility
  const emailOptions = [
      {
          name: 'Gmail',
          url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(customerEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      },
      {
          name: 'Outlook',
          url: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(customerEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      },
      {
          name: 'Default Mail Client',
          url: `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      }
  ];

  // 6. Try opening email clients in order of preference
  function tryEmailClient(index = 0) {
      if (index >= emailOptions.length) {
          // If all email clients fail, show manual copy option
          showEmailFallback(customerEmail, subject, body);
          return;
      }

      const option = emailOptions[index];
      const emailWindow = window.open(option.url, '_blank');

      // Check if popup was blocked or failed
      setTimeout(() => {
          if (!emailWindow || emailWindow.closed || typeof emailWindow.closed === 'undefined') {
              // Try next option
              tryEmailClient(index + 1);
          } else {
              // Success! Show confirmation
              showEmailSuccess(customerEmail);
          }
      }, 1000);
  }

  // Start trying email clients
  tryEmailClient();
});

// Helper function to show success message
function showEmailSuccess(customerEmail) {
  const modal = document.createElement('div');
  modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.5); display: flex; align-items: center; 
      justify-content: center; z-index: 10000;
  `;
  
  modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; text-align: center;">
          <h3 style="color: #4a6ee0; margin-bottom: 15px;">✓ Email Opened</h3>
          <p>Your email client should now be open with the receipt ready to send to:</p>
          <p style="font-weight: bold; color: #333;">${customerEmail}</p>
          <p style="font-size: 14px; color: #666; margin-top: 15px;">
              Please review the email content and click send in your email client.
          </p>
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="background: #4a6ee0; color: white; border: none; padding: 10px 20px; 
                         border-radius: 5px; cursor: pointer; margin-top: 15px;">
              Got it!
          </button>
      </div>
  `;
  
  document.body.appendChild(modal);
}

// Helper function to show fallback options when email clients fail
function showEmailFallback(customerEmail, subject, body) {
  const modal = document.createElement('div');
  modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.5); display: flex; align-items: center; 
      justify-content: center; z-index: 10000; overflow-y: auto;
  `;
  
  modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 20px;">
          <h3 style="color: #e74c3c; margin-bottom: 15px;">Email Client Not Available</h3>
          <p>We couldn't open your email client automatically. Here are your options:</p>
          
          <div style="margin: 20px 0;">
              <h4>Option 1: Copy Email Content</h4>
              <p>Copy the content below and paste it into your preferred email client:</p>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                  <strong>To:</strong> ${customerEmail}<br>
                  <strong>Subject:</strong> ${subject}
              </div>
              <textarea readonly style="width: 100%; height: 200px; border: 1px solid #ddd; 
                         border-radius: 5px; padding: 10px; font-family: monospace; font-size: 12px;">${body}</textarea>
              <button onclick="copyToClipboard(this.previousElementSibling.value)" 
                      style="background: #28a745; color: white; border: none; padding: 8px 15px; 
                             border-radius: 5px; cursor: pointer; margin-top: 10px;">
                  Copy Content
              </button>
          </div>
          
          <div style="margin: 20px 0;">
              <h4>Option 2: Try Email Links</h4>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <a href="mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}" 
                     style="background: #007bff; color: white; padding: 10px 15px; text-decoration: none; 
                            border-radius: 5px; display: inline-block;">Default Mail App</a>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(customerEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}" 
                     target="_blank" style="background: #db4437; color: white; padding: 10px 15px; 
                            text-decoration: none; border-radius: 5px; display: inline-block;">Gmail</a>
                  <a href="https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(customerEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}" 
                     target="_blank" style="background: #0078d4; color: white; padding: 10px 15px; 
                            text-decoration: none; border-radius: 5px; display: inline-block;">Outlook</a>
              </div>
          </div>
          
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="background: #6c757d; color: white; border: none; padding: 10px 20px; 
                         border-radius: 5px; cursor: pointer; float: right; margin-top: 15px;">
              Close
          </button>
      </div>
  `;
  
  document.body.appendChild(modal);
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
      // Show temporary success message
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.background = '#28a745';
      setTimeout(() => {
          button.textContent = originalText;
          button.style.background = '#28a745';
      }, 2000);
  }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Email content copied to clipboard!');
  });
}
  // Save receipt
  //document.getElementById('save-receipt').addEventListener('click', function() {
      //alert('Receipt saved! In a real application, this would save to your database.');
  //});

  // Initialize with one item row
  const initialItemRow = document.querySelector('.item-row');
  initialItemRow.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', updateReceiptPreview);
  });
  initialItemRow.querySelector('.remove-item').addEventListener('click', function() {
      initialItemRow.remove();
      updateReceiptPreview();
  });
  
  updateReceiptPreview();
});