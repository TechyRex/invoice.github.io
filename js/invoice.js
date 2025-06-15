document.addEventListener('DOMContentLoaded', function() {
  // Add item row functionality
  document.getElementById('add-item').addEventListener('click', function() {
    const itemsContainer = document.getElementById('items-container');
    const newItemRow = document.createElement('div');
    newItemRow.className = 'item-row';
    newItemRow.innerHTML = `
      <input type="text" class="item-desc" placeholder="Description">
      <input type="number" class="item-qty" placeholder="Qty" min="1">
      <input type="number" class="item-price" placeholder="Price" step="0.01">
      <button class="remove-item">×</button>
    `;
    itemsContainer.appendChild(newItemRow);
    
    // Add event to remove button
    newItemRow.querySelector('.remove-item').addEventListener('click', function() {
      itemsContainer.removeChild(newItemRow);
      updateInvoicePreview();
    });
    
    // Add input events to new fields
    const inputs = newItemRow.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', updateInvoicePreview);
    });
  });

  // Remove initial item row's remove button
  const initialRemoveBtn = document.querySelector('.item-row .remove-item');
  if (initialRemoveBtn) {
    initialRemoveBtn.addEventListener('click', function() {
      const itemsContainer = document.getElementById('items-container');
      if (itemsContainer.children.length > 1) {
        itemsContainer.removeChild(this.parentNode);
        updateInvoicePreview();
      }
    });
  }

  // Setup event listeners for all inputs
  const allInputs = document.querySelectorAll('.design-panel input, .design-panel textarea, .design-panel select');
  allInputs.forEach(input => {
    input.addEventListener('input', updateInvoicePreview);
    input.addEventListener('change', updateInvoicePreview);
  });

  // Setup reminder button
  document.getElementById('setup-reminder').addEventListener('click', function() {
    const dueDate = document.getElementById('due-date').value;
    const clientName = document.getElementById('client-name').value;
    
    if (!dueDate) {
      alert('Please set a due date for the invoice first.');
      return;
    }
    
    // Store invoice data
    const invoiceData = {
      clientName: clientName,
      dueDate: dueDate,
      invoiceNumber: document.getElementById('invoice-number').value
    };
    localStorage.setItem('currentInvoice', JSON.stringify(invoiceData));
    window.location.href = 'whatsapp-scheduler.html';
  });

  // PDF download functionality
  document.getElementById('download-pdf').addEventListener('click', function() {
    const invoiceElement = document.getElementById('invoice-template');
    const buttons = invoiceElement.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');
    
    html2canvas(invoiceElement, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      buttons.forEach(btn => btn.style.display = '');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const invoiceNumber = document.getElementById('invoice-number').value || 'invoice';
      pdf.save(`${invoiceNumber}.pdf`);
    }).catch(err => {
      console.error('Error generating PDF:', err);
      alert('Error generating PDF. Please try again.');
      buttons.forEach(btn => btn.style.display = '');
    });
  });

  // Email sending functionality
  document.getElementById('send-email').addEventListener('click', function() {
    const businessName = document.getElementById('business-name').value || 'Your Business';
    const invoiceNumber = document.getElementById('invoice-number').value || 'INV-001';
    const dueDate = document.getElementById('due-date').value || '';
    
    const subject = `Invoice ${invoiceNumber} from ${businessName}`;
    let body = `Invoice Details\n===============\n\n`;
    body += `Invoice #: ${invoiceNumber}\n`;
    body += `Date: ${new Date().toLocaleDateString()}\n`;
    if (dueDate) body += `Due Date: ${new Date(dueDate).toLocaleDateString()}\n\n`;
    
    body += `From:\n${businessName}\n`;
    if (document.getElementById('business-address').value) {
      body += `${document.getElementById('business-address').value}\n`;
    }
    if (document.getElementById('business-contact').value) {
      body += `${document.getElementById('business-contact').value}\n\n`;
    }
    
    body += `To:\n${document.getElementById('client-name').value || 'Client Name'}\n`;
    if (document.getElementById('client-address').value) {
      body += `${document.getElementById('client-address').value}\n\n`;
    }
    
    body += `Items:\n`;
    document.querySelectorAll('.item-row').forEach(row => {
      const desc = row.querySelector('.item-desc').value || 'Item';
      const qty = row.querySelector('.item-qty').value || 0;
      const price = row.querySelector('.item-price').value || 0;
      body += `- ${desc}: ${qty} × $${price}\n`;
    });
    
    const subtotal = [...document.querySelectorAll('.item-row')].reduce((sum, row) => {
      const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
      const price = parseFloat(row.querySelector('.item-price').value) || 0;
      return sum + (qty * price);
    }, 0);
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    body += `\nSubtotal: $${subtotal.toFixed(2)}\n`;
    body += `Tax: $${tax.toFixed(2)}\n`;
    body += `Total: $${total.toFixed(2)}\n\n`;
    body += `Payment Instructions:\n`;
    body += `${document.getElementById('payment-details').value || 'Please contact us for payment details'}\n\n`;
    body += `Thank you for your business!`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      window.location.href = mailtoLink;
      setTimeout(() => {
        if (!document.hidden) {
          showEmailFallback(subject, body);
        }
      }, 500);
    } catch (e) {
      showEmailFallback(subject, body);
    }
  });

  // Initial update
  updateInvoicePreview();
});

// Functions defined outside DOMContentLoaded
function updateInvoicePreview() {
  const invoiceTemplate = document.getElementById('invoice-template');
  
  // Get all form values
  const businessName = document.getElementById('business-name').value || 'Your Business Name';
  const businessAddress = document.getElementById('business-address').value || '123 Business St\nCity, State ZIP';
  const businessContact = document.getElementById('business-contact').value || 'Phone: (123) 456-7890\nEmail: contact@business.com';
  const businessLogo = document.getElementById('business-logo').value;
  
  const clientName = document.getElementById('client-name').value || 'Client Name';
  const clientAddress = document.getElementById('client-address').value || '123 Client St\nCity, State ZIP';
  
  const invoiceNumber = document.getElementById('invoice-number').value || 'INV-001';
  const invoiceDate = document.getElementById('invoice-date').value || new Date().toISOString().split('T')[0];
  const dueDate = document.getElementById('due-date').value || '';
  
  const paymentMethod = document.getElementById('payment-method').value;
  const paymentDetails = document.getElementById('payment-details').value || 'Please make payment to:\nBank Name: Your Bank\nAccount Number: 123456789\nRouting Number: 987654321';
  
  const colorTheme = document.getElementById('color-theme').value;
  const fontStyle = document.getElementById('font-style').value;
  
  // Get items
  const items = [];
  const itemRows = document.querySelectorAll('.item-row');
  itemRows.forEach(row => {
    const desc = row.querySelector('.item-desc').value || 'Item Description';
    const qty = parseFloat(row.querySelector('.item-qty').value) || 1;
    const price = parseFloat(row.querySelector('.item-price').value) || 0.00;
    const total = qty * price;
    items.push({ desc, qty, price, total });
  });
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  // Format dates
  const formattedInvoiceDate = formatDate(invoiceDate);
  const formattedDueDate = dueDate ? formatDate(dueDate) : '';
  
  // Generate HTML for the invoice
  invoiceTemplate.innerHTML = `
    <div class="invoice" style="font-family: ${fontStyle}; color: #333;">
      <div class="invoice-header">
        <div>
          ${businessLogo ? `<img src="${businessLogo}" class="invoice-logo" alt="${businessName}">` : ''}
          <h1 class="invoice-title" style="color: ${colorTheme};">INVOICE</h1>
        </div>
        <div class="invoice-details">
          <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
          <p><strong>Date:</strong> ${formattedInvoiceDate}</p>
          ${formattedDueDate ? `<p><strong>Due Date:</strong> ${formattedDueDate}</p>` : ''}
        </div>
      </div>
      
      <div class="invoice-info">
        <div class="invoice-from">
          <h3 style="color: ${colorTheme};">From:</h3>
          <p><strong>${businessName}</strong></p>
          <p>${businessAddress.replace(/\n/g, '<br>')}</p>
          <p>${businessContact.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div class="invoice-to">
          <h3 style="color: ${colorTheme};">To:</h3>
          <p><strong>${clientName}</strong></p>
          <p>${clientAddress.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      
      <table class="invoice-items">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.desc}</td>
              <td>${item.qty}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${item.total.toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Subtotal:</td>
            <td>$${subtotal.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Tax (10%):</td>
            <td>$${tax.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
      
      <div class="invoice-summary">
        <div class="invoice-totals">
          <h3 style="color: ${colorTheme};">Payment Information</h3>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p>${paymentDetails.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      
      <div class="invoice-footer">
        <p>Thank you for your business!</p>
        <p>Please make payment by the due date to avoid late fees.</p>
      </div>
    </div>
  `;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showEmailFallback(subject, body) {
  const fallbackDiv = document.createElement('div');
  fallbackDiv.style.position = 'fixed';
  fallbackDiv.style.top = '0';
  fallbackDiv.style.left = '0';
  fallbackDiv.style.right = '0';
  fallbackDiv.style.bottom = '0';
  fallbackDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
  fallbackDiv.style.zIndex = '1000';
  fallbackDiv.style.display = 'flex';
  fallbackDiv.style.justifyContent = 'center';
  fallbackDiv.style.alignItems = 'center';
  
  const contentDiv = document.createElement('div');
  contentDiv.style.backgroundColor = 'white';
  contentDiv.style.padding = '20px';
  contentDiv.style.borderRadius = '8px';
  contentDiv.style.maxWidth = '600px';
  contentDiv.style.maxHeight = '80vh';
  contentDiv.style.overflow = 'auto';
  
  contentDiv.innerHTML = `
    <h2>Email Client Not Found</h2>
    <p>We couldn't open your email client automatically. Here's your invoice information:</p>
    <h3>Subject: ${subject}</h3>
    <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-radius: 4px;">${body}</pre>
    <p>You can copy this information and paste it into your email client.</p>
    <button id="copy-email" style="padding: 8px 16px; background: #4a6ee0; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy to Clipboard</button>
    <button id="close-fallback" style="padding: 8px 16px; margin-left: 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
  `;
  
  fallbackDiv.appendChild(contentDiv);
  document.body.appendChild(fallbackDiv);
  
  document.getElementById('copy-email').addEventListener('click', function() {
    navigator.clipboard.writeText(`${subject}\n\n${body}`)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy to clipboard'));
  });
  
  document.getElementById('close-fallback').addEventListener('click', function() {
    document.body.removeChild(fallbackDiv);
  });
}