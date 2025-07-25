// invoice.js
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('invoice-date').value = today;

  // Generate random invoice number
  document.getElementById('invoice-number').value = 'INV-' + Math.floor(1000 + Math.random() * 9000);

  // Template and color selection
  const templateThumbnails = document.querySelectorAll('.template-thumbnail');
  const invoiceTemplate = document.getElementById('invoice-template');
  let selectedColor = '#4a6ee0';
  let selectedTemplate = 'simple';

  // Handle template selection
  templateThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
          templateThumbnails.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          selectedTemplate = this.getAttribute('data-template');
          updateInvoicePreview();
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
          updateInvoicePreview();
      });
  });

  // Handle custom color selection
  document.getElementById('custom-color').addEventListener('input', function() {
      selectedColor = this.value;
      updateInvoicePreview();
  });

  // Handle logo upload
  let logoPreviewUrl = '';
  document.getElementById('business-logo').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
              logoPreviewUrl = event.target.result;
              updateInvoicePreview();
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
          input.addEventListener('input', updateInvoicePreview);
      });

      // Add event listener to remove button
      itemRow.querySelector('.remove-item').addEventListener('click', function() {
          itemRow.remove();
          updateInvoicePreview();
      });

      updateInvoicePreview();
  });

  // Add event listeners to all form inputs
  document.querySelectorAll('.design-panel input, .design-panel textarea, .design-panel select').forEach(input => {
      input.addEventListener('input', updateInvoicePreview);
  });

  // Add font style selection functionality
let selectedFontFamily = 'Arial, sans-serif'; // Default font

// Handle font style selection
document.getElementById('font-style').addEventListener('change', function() {
    selectedFontFamily = this.value;
    updateInvoicePreview();
});

  // Replace the existing function with this updated version:

function updateInvoicePreview() {
    const businessName = document.getElementById('business-name').value || 'Your Business';
    const businessAddress = document.getElementById('business-address').value || '123 Business St, City, Country';
    const businessEmail = document.getElementById('business-email').value || 'business@example.com';
    const businessPhone = document.getElementById('business-phone').value || '+1234567890';
    
    const clientName = document.getElementById('client-name').value || 'Client Name';
    const clientEmail = document.getElementById('client-email').value || 'client@example.com';
    const clientAddress = document.getElementById('client-address').value || '123 Client St, City, Country';
    
    const invoiceNumber = document.getElementById('invoice-number').value || 'INV-001';
    const invoiceDate = formatDate(document.getElementById('invoice-date').value) || formatDate(today);
    const dueDate = formatDate(document.getElementById('due-date').value) || '';
    const paymentMethod = document.getElementById('payment-method').value || 'Bank Transfer';
    const paymentDetails = document.getElementById('payment-details').value || '';
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
    
    // Apply font style to the entire invoice
    const fontStyle = `font-family: ${selectedFontFamily};`;
    
    // Generate HTML based on template
let invoiceHTML = '';

if (selectedTemplate === 'simple') {
    invoiceHTML = `
        <div style="${fontStyle}">
            <div class="invoice-header" style="border-bottom: 2px solid ${selectedColor}; margin-bottom: 20px; padding-bottom: 15px;">
                ${logoPreviewUrl ? `<img src="${logoPreviewUrl}" alt="${businessName}" style="max-height: 80px; margin-bottom: 15px;">` : ''}
                <h2 style="color: ${selectedColor}; ${fontStyle}">${businessName}</h2>
                <p style="${fontStyle}">${businessAddress}</p>
                <p style="${fontStyle}">${businessEmail}<br>${businessPhone}</p>
            </div>
            
            <div class="invoice-meta" style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div style="${fontStyle}">
                    <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
                    <p><strong>Date:</strong> ${invoiceDate}</p>
                    ${dueDate ? `<p><strong>Due Date:</strong> ${dueDate}</p>` : ''}
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                </div>
                <div style="${fontStyle}">
                    <p><strong>Bill To:</strong></p>
                    <p>${clientName}</p>
                    <p>${clientAddress}</p>
                    <p>${clientEmail}</p>
                </div>
            </div>
            
            <table class="invoice-items" style="${fontStyle} width: 100%; border-collapse: collapse; margin-bottom: 20px;">
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
            
            <div class="invoice-total" style="text-align: right; margin-bottom: 20px; ${fontStyle}">
                <p>Subtotal: ${currencySymbol}${subtotal.toFixed(2)}</p>
                ${taxRate > 0 ? `<p>Tax (${taxRate}%): ${currencySymbol}${tax.toFixed(2)}</p>` : ''}
                <p style="font-size: 18px; font-weight: bold;"><strong>Total: ${currencySymbol}${total.toFixed(2)}</strong></p>
            </div>
            
            ${paymentDetails ? `
            <div class="payment-info" style="margin-bottom: 20px; ${fontStyle}">
                <h3 style="color: ${selectedColor};">Payment Information</h3>
                <p>${paymentDetails}</p>
            </div>
            ` : ''}
            
            <div class="invoice-footer" style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; ${fontStyle}">
                <p>Thank you for your business!</p>
                <p style="font-size: 14px; color: #666;">${businessName} | ${businessEmail} | ${businessPhone}</p>
            </div>
        </div>
    `;
} else if (selectedTemplate === 'modern') {
    invoiceHTML = `
        <div style="${fontStyle}; max-width: 800px; margin: 0 auto; padding: 20px; box-sizing: border-box;">
            <div class="invoice-header" style="display: flex; align-items: center; border-left: 4px solid ${selectedColor}; padding-left: 20px; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
                ${logoPreviewUrl ? `<img src="${logoPreviewUrl}" alt="${businessName}" style="max-height: 60px; flex-shrink: 0; margin-left: 0;">` : ''}
                <div style="${fontStyle}; flex: 1; min-width: 250px; margin-left: 0;">
                    <h2 style="color: ${selectedColor}; margin: 0 0 5px 0; ${fontStyle}; word-wrap: break-word;">${businessName}</h2>
                    <p style="margin: 5px 0; ${fontStyle}; word-wrap: break-word;">${businessAddress}</p>
                    <p style="margin: 5px 0; ${fontStyle}; word-wrap: break-word;">${businessEmail}<br>${businessPhone}</p>
                </div>
            </div>
            
            <div class="invoice-meta" style="margin: 0 0 30px 0; ${fontStyle};">
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; align-items: flex-start; gap: 10px; margin: 0;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; flex-shrink: 0; min-width: 100px; margin-left: 0;">INVOICE #</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; word-wrap: break-word; flex: 1; margin-right: 0;">${invoiceNumber}</span>
                </div>
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; align-items: flex-start; gap: 10px; margin: 0;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; flex-shrink: 0; min-width: 100px; margin-left: 0;">Date</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; word-wrap: break-word; flex: 1; margin-right: 0;">${invoiceDate}</span>
                </div>
                ${dueDate ? `
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; align-items: flex-start; gap: 10px; margin: 0;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; flex-shrink: 0; min-width: 100px; margin-left: 0;">Due Date</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; word-wrap: break-word; flex: 1; margin-right: 0;">${dueDate}</span>
                </div>
                ` : ''}
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; align-items: flex-start; gap: 10px; margin: 0;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; flex-shrink: 0; min-width: 100px; margin-left: 0;">Payment Method</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; word-wrap: break-word; flex: 1; margin-right: 0;">${paymentMethod}</span>
                </div>
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; align-items: flex-start; gap: 10px; margin: 0;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; flex-shrink: 0; min-width: 100px; margin-left: 0;">Bill To</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; word-wrap: break-word; flex: 1; margin-right: 0;">${clientName}</span>
                </div>
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; align-items: flex-start; gap: 10px; margin: 0;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; flex-shrink: 0; min-width: 100px; margin-left: 0;">Email</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; word-wrap: break-word; overflow-wrap: break-word; flex: 1; margin-right: 0;">${clientEmail}</span>
                </div>
                <div class="meta-row" style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 8px 0; align-items: flex-start; gap: 10px; margin: 0;">
                    <span class="meta-label" style="color: ${selectedColor}; font-weight: bold; ${fontStyle}; flex-shrink: 0; min-width: 100px; margin-left: 0;">Address</span>
                    <span class="meta-value" style="${fontStyle}; text-align: right; word-wrap: break-word; flex: 1; margin-right: 0;">${clientAddress}</span>
                </div>
            </div>
            
            <div style="overflow-x: auto; margin: 0 0 20px 0;">
                <table class="invoice-items" style="${fontStyle}; width: 100%; border-collapse: collapse; min-width: 600px; margin: 0;">
                    <thead>
                        <tr style="background-color: ${selectedColor}; color: white;">
                            <th style="padding: 12px; text-align: left; ${fontStyle}; margin: 0;">Item</th>
                            <th style="padding: 12px; text-align: center; ${fontStyle}; min-width: 60px; margin: 0;">Qty</th>
                            <th style="padding: 12px; text-align: right; ${fontStyle}; min-width: 80px; margin: 0;">Price</th>
                            <th style="padding: 12px; text-align: right; ${fontStyle}; min-width: 80px; margin: 0;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr style="border-bottom: 1px solid #eee; margin: 0;">
                                <td style="padding: 12px; ${fontStyle}; word-wrap: break-word; overflow-wrap: break-word; margin: 0;">${item.description}</td>
                                <td style="padding: 12px; text-align: center; ${fontStyle}; margin: 0;">${item.quantity}</td>
                                <td style="padding: 12px; text-align: right; ${fontStyle}; margin: 0;">${currencySymbol}${item.price.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; ${fontStyle}; margin: 0;">${currencySymbol}${item.total.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="invoice-total" style="text-align: right; margin: 0 0 20px 0; ${fontStyle};">
                <p style="margin: 5px 0;">Subtotal: ${currencySymbol}${subtotal.toFixed(2)}</p>
                ${taxRate > 0 ? `<p style="margin: 5px 0;">Tax (${taxRate}%): ${currencySymbol}${tax.toFixed(2)}</p>` : ''}
                <p style="font-size: 18px; font-weight: bold; margin: 10px 0 0 0;">Total: ${currencySymbol}${total.toFixed(2)}</p>
            </div>
            
            ${paymentDetails ? `
            <div class="payment-info" style="margin: 0 0 20px 0; ${fontStyle};">
                <h3 style="color: ${selectedColor}; margin: 0 0 10px 0;">Payment Instructions</h3>
                <p style="word-wrap: break-word; overflow-wrap: break-word; margin: 0;">${paymentDetails}</p>
            </div>
            ` : ''}
            
            <div class="invoice-footer" style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; ${fontStyle}; margin: 0;">
                <p style="margin: 0 0 5px 0;">Thank you for your business!</p>
                <p style="font-size: 14px; color: #666; word-wrap: break-word; overflow-wrap: break-word; margin: 0;">For any questions, please contact ${businessEmail} or ${businessPhone}</p>
            </div>
        </div>
    `;

    } else if (selectedTemplate === 'elegant') {
        invoiceHTML = `
            <div style="${fontStyle}">
                <div class="invoice-header" style="text-align: center; margin-bottom: 30px; ${fontStyle}">
                    ${logoPreviewUrl ? `<img src="${logoPreviewUrl}" alt="${businessName}" style="max-height: 70px; margin-bottom: 15px;">` : ''}
                    <h2 style="color: ${selectedColor}; margin: 10px 0; ${fontStyle}">${businessName}</h2>
                    <p style="margin: 5px 0; ${fontStyle}">${businessAddress}</p>
                    <p style="margin: 5px 0; ${fontStyle}">${businessEmail}<br>${businessPhone}</p>
                </div>
                
                <div class="invoice-meta" style="display: flex; justify-content: space-between; margin-bottom: 30px; ${fontStyle}">
                    <div class="meta-column">
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Invoice Number</div>
                            <div class="meta-value" style="${fontStyle}">${invoiceNumber}</div>
                        </div>
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Date</div>
                            <div class="meta-value" style="${fontStyle}">${invoiceDate}</div>
                        </div>
                        ${dueDate ? `
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Due Date</div>
                            <div class="meta-value" style="${fontStyle}">${dueDate}</div>
                        </div>
                        ` : ''}
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Payment Method</div>
                            <div class="meta-value" style="${fontStyle}">${paymentMethod}</div>
                        </div>
                    </div>
                    <div class="meta-column">
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Bill To</div>
                            <div class="meta-value" style="${fontStyle}">${clientName}</div>
                        </div>
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Email</div>
                            <div class="meta-value" style="${fontStyle}">${clientEmail}</div>
                        </div>
                        <div class="meta-row" style="margin-bottom: 10px;">
                            <div class="meta-label" style="font-weight: bold; color: #666; ${fontStyle}">Address</div>
                            <div class="meta-value" style="${fontStyle}">${clientAddress}</div>
                        </div>
                    </div>
                </div>
                
                <table class="invoice-items" style="${fontStyle} width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #ddd;">
                    <thead>
                        <tr style="background-color: #f8f9fa; border-bottom: 2px solid ${selectedColor};">
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
                
                <div class="invoice-total" style="text-align: right; margin-bottom: 20px; ${fontStyle}">
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
                    <div class="total-row" style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid ${selectedColor}; font-size: 18px; font-weight: bold;">
                        <div class="total-label" style="color: ${selectedColor}; ${fontStyle}">Total</div>
                        <div class="total-value" style="color: ${selectedColor}; ${fontStyle}">${currencySymbol}${total.toFixed(2)}</div>
                    </div>
                </div>
                
                ${paymentDetails ? `
                <div class="payment-info" style="margin-bottom: 20px; ${fontStyle}">
                    <h3 style="color: ${selectedColor};">Payment Details</h3>
                    <p>${paymentDetails}</p>
                </div>
                ` : ''}
                
                <div class="invoice-footer" style="text-align: center; border-top: 1px solid #eee; padding-top: 15px; ${fontStyle}">
                    <p>Thank you for choosing ${businessName}</p>
                    <p style="font-size: 14px; color: #666;">For any questions about this invoice, please contact us at ${businessEmail} or call ${businessPhone}</p>
                </div>
            </div>
        `;
    }
    
    invoiceTemplate.className = selectedTemplate;
    invoiceTemplate.innerHTML = invoiceHTML;
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
      const invoice = document.getElementById('invoice-template');
      
      html2canvas(invoice, {
          scale: 2,
          logging: false,
          useCORS: true
      }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 190;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`${document.getElementById('invoice-number').value || 'invoice'}.pdf`);
      });
  });

  // Print invoice
  document.getElementById('print-invoice').addEventListener('click', function() {
      const invoice = document.getElementById('invoice-template');
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>Print Invoice</title>
              <style>
                  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                  @media print {
                      @page { size: auto; margin: 0mm; }
                      body { padding: 0; }
                  }
              </style>
          </head>
          <body>
              ${invoice.innerHTML}
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

  // Improved Send via email functionality for invoice - replace the existing email function in your invoice.js

document.getElementById('send-email').addEventListener('click', function(e) {
  e.preventDefault();
  
  // 1. Validate client email
  const clientEmail = document.getElementById('client-email').value;
  if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      alert('Please enter a valid client email address');
      return;
  }

  // 2. Gather all invoice data
  const businessName = document.getElementById('business-name').value || 'Your Business';
  const businessEmail = document.getElementById('business-email').value || 'business@example.com';
  const businessPhone = document.getElementById('business-phone').value || '';
  const businessAddress = document.getElementById('business-address').value || '';
  const invoiceNumber = document.getElementById('invoice-number').value || 'INV-001';
  const invoiceDate = formatDate(document.getElementById('invoice-date').value) || formatDate(new Date().toISOString().split('T')[0]);
  const dueDate = document.getElementById('due-date').value ? formatDate(document.getElementById('due-date').value) : '';
  const paymentMethod = document.getElementById('payment-method').value || 'Bank Transfer';
  const paymentDetails = document.getElementById('payment-details').value || '';
  const clientName = document.getElementById('client-name').value || 'Valued Client';
  const clientAddress = document.getElementById('client-address').value || '';
  const currencySymbol = document.getElementById('currency').value || '$';

  // 3. Calculate totals and build items list
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
  const subject = `Invoice ${invoiceNumber} from ${businessName}`;
  
  const body = `Dear ${clientName},

I hope this email finds you well. Please find your invoice details below:

INVOICE DETAILS
===============
Invoice Number: ${invoiceNumber}
Invoice Date: ${invoiceDate}
${dueDate ? `Due Date: ${dueDate}\n` : ''}Payment Method: ${paymentMethod}

BUSINESS INFORMATION
===================
${businessName}
${businessAddress ? `${businessAddress}\n` : ''}Email: ${businessEmail}
${businessPhone ? `Phone: ${businessPhone}` : ''}

CLIENT INFORMATION
==================
${clientName}
${clientAddress ? `${clientAddress}\n` : ''}${clientEmail}

ITEMS/SERVICES
==============
${itemsText}

PAYMENT SUMMARY
===============
Subtotal: ${currencySymbol}${subtotal.toFixed(2)}
${taxRate > 0 ? `Tax (${taxRate}%): ${currencySymbol}${tax.toFixed(2)}\n` : ''}Total Amount Due: ${currencySymbol}${totalAmount.toFixed(2)}

${paymentDetails ? `PAYMENT INSTRUCTIONS
===================
${paymentDetails}

` : ''}Thank you for your business! Please remit payment by the due date specified above. 

If you have any questions about this invoice, please don't hesitate to contact us at ${businessEmail}${businessPhone ? ` or ${businessPhone}` : ''}.

Best regards,
${businessName}
${businessEmail}
${businessPhone ? businessPhone : ''}`;

  // 5. Create multiple email options for better compatibility
  const emailOptions = [
      {
          name: 'Gmail',
          url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      },
      {
          name: 'Outlook',
          url: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(clientEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      },
      {
          name: 'Default Mail Client',
          url: `mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      }
  ];

  // 6. Try opening email clients in order of preference
  function tryEmailClient(index = 0) {
      if (index >= emailOptions.length) {
          // If all email clients fail, show manual copy option
          showEmailFallback(clientEmail, subject, body);
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
              showEmailSuccess(clientEmail);
          }
      }, 1000);
  }

  // Start trying email clients
  tryEmailClient();
});

// Helper function to show success message
function showEmailSuccess(clientEmail) {
  const modal = document.createElement('div');
  modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.5); display: flex; align-items: center; 
      justify-content: center; z-index: 10000;
  `;
  
  modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; text-align: center;">
          <h3 style="color: #4a6ee0; margin-bottom: 15px;">✓ Email Opened</h3>
          <p>Your email client should now be open with the invoice ready to send to:</p>
          <p style="font-weight: bold; color: #333;">${clientEmail}</p>
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
function showEmailFallback(clientEmail, subject, body) {
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
                  <strong>To:</strong> ${clientEmail}<br>
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
                  <a href="mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}" 
                     style="background: #007bff; color: white; padding: 10px 15px; text-decoration: none; 
                            border-radius: 5px; display: inline-block;">Default Mail App</a>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}" 
                     target="_blank" style="background: #db4437; color: white; padding: 10px 15px; 
                            text-decoration: none; border-radius: 5px; display: inline-block;">Gmail</a>
                  <a href="https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(clientEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}" 
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

// Helper function to format date (make sure this exists in your invoice.js)
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

  // Save invoice
  //document.querySelector('.main-header .btn.primary').addEventListener('click', function() {
      //alert('Invoice saved! In a real application, this would save to your database.');
  //});

  // Initialize with one item row
  const initialItemRow = document.querySelector('.item-row');
  initialItemRow.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', updateInvoicePreview);
  });
  initialItemRow.querySelector('.remove-item').addEventListener('click', function() {
      initialItemRow.remove();
      updateInvoicePreview();
  });
  
  updateInvoicePreview();
});