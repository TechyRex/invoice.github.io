document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Initialize calendar
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: []
  });
  calendar.render();

  // Handle reminder type change
  const reminderType = document.getElementById('reminder-type');
  const beforeOptions = document.getElementById('before-reminder-options');
  const afterOptions = document.getElementById('after-reminder-options');

  reminderType.addEventListener('change', function() {
      if (this.value === 'before') {
          beforeOptions.style.display = 'block';
          afterOptions.style.display = 'none';
      } else if (this.value === 'after') {
          beforeOptions.style.display = 'none';
          afterOptions.style.display = 'block';
      } else if (this.value === 'both') {
          beforeOptions.style.display = 'block';
          afterOptions.style.display = 'block';
      }
  });

  // Schedule reminders
  const scheduleBtn = document.getElementById('schedule-reminders');
  const remindersList = document.getElementById('reminders-list');

  scheduleBtn.addEventListener('click', function() {
      // Get form values
      const clientName = document.getElementById('client-name').value;
      const invoiceNumber = document.getElementById('invoice-number').value;
      const dueDate = document.getElementById('due-date').value;
      const dueTime = document.getElementById('due-time').value;
      const reminderTypeValue = reminderType.value;
      
      if (!clientName || !invoiceNumber || !dueDate || !dueTime) {
          alert('Please fill in all required fields');
          return;
      }

      // Process reminders based on type
      const reminders = [];
      const dueDateTime = new Date(`${dueDate}T${dueTime}`);

      if (reminderTypeValue === 'before' || reminderTypeValue === 'both') {
          const daysBefore = parseInt(document.getElementById('days-before').value);
          const beforeMessage = document.getElementById('before-message').value;
          
          const reminderDate = new Date(dueDateTime);
          reminderDate.setDate(reminderDate.getDate() - daysBefore);
          
          reminders.push({
              type: 'before',
              date: reminderDate,
              message: beforeMessage
                  .replace('[Client Name]', clientName)
                  .replace('[Invoice Number]', invoiceNumber)
                  .replace('[Due Date]', formatDate(dueDateTime))
          });
      }

      if (reminderTypeValue === 'after' || reminderTypeValue === 'both') {
          const daysAfter = parseInt(document.getElementById('days-after').value);
          const afterMessage = document.getElementById('after-message').value;
          
          const reminderDate = new Date(dueDateTime);
          reminderDate.setDate(reminderDate.getDate() + daysAfter);
          
          reminders.push({
              type: 'after',
              date: reminderDate,
              message: afterMessage
                  .replace('[Client Name]', clientName)
                  .replace('[Invoice Number]', invoiceNumber)
                  .replace('[Due Date]', formatDate(dueDateTime))
          });
      }

      // Add events to calendar
      reminders.forEach(reminder => {
          calendar.addEvent({
              title: `Reminder: ${reminder.type === 'before' ? 'Before' : 'After'} Due Date`,
              start: reminder.date,
              extendedProps: {
                  message: reminder.message
              }
          });

          // Add to reminders list
          const li = document.createElement('li');
          li.innerHTML = `
              <span>${formatDate(reminder.date)} - ${reminder.type === 'before' ? 'Before' : 'After'} Due Date</span>
              <button class="delete-reminder">×</button>
          `;
          remindersList.appendChild(li);

          // Add delete functionality
          li.querySelector('.delete-reminder').addEventListener('click', function() {
              li.remove();
              // In a real app, you would also remove the event from the calendar
          });
      });

      alert('Reminders scheduled successfully!');
  });

  // Helper function to format dates
  function formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  }
});