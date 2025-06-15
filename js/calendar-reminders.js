// js/calendar-reminders.js
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // Initialize variables
  const STORAGE_KEY = 'invoiceReminders';
  let reminders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // Initialize calendar
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [],
      eventClick: function(info) {
          showReminderDetails(info.event);
      }
  });
  calendar.render();

  // Load saved reminders
  function loadReminders() {
      reminders.forEach(reminder => {
          addEventToCalendar(reminder);
          addReminderToList(reminder);
      });
  }

  // Add event to FullCalendar
  function addEventToCalendar(reminder) {
      calendar.addEvent({
          id: reminder.id,
          title: reminder.title,
          start: reminder.date,
          allDay: false,
          extendedProps: {
              description: reminder.description,
              type: reminder.type,
              clientName: reminder.clientName,
              invoiceNumber: reminder.invoiceNumber,
              dueDate: reminder.dueDate
          }
      });
  }

  // Add reminder to the list
  function addReminderToList(reminder) {
      const li = document.createElement('li');
      li.dataset.id = reminder.id;
      li.innerHTML = `
          <strong>${formatDate(reminder.date)}</strong>
          <div>${reminder.title}</div>
          <small>${reminder.type === 'before' ? 'Before due date' : 'After due date'}</small>
          <div class="reminder-actions">
              <button class="export-btn" title="Export to Calendar">📅</button>
              <button class="delete-reminder">×</button>
          </div>
      `;
      
      li.querySelector('.delete-reminder').addEventListener('click', function() {
          deleteReminder(reminder.id);
      });

      li.querySelector('.export-btn').addEventListener('click', function() {
          exportToICalendar(reminder);
      });

      document.getElementById('reminders-list').appendChild(li);
  }

  // Delete a reminder
  function deleteReminder(id) {
      if (confirm('Delete this reminder?')) {
          reminders = reminders.filter(r => r.id !== id);
          saveReminders();
          updateCalendarAndList();
      }
  }

  // Save reminders to localStorage
  function saveReminders() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }

  // Update calendar and list
  function updateCalendarAndList() {
      calendar.getEvents().forEach(event => event.remove());
      document.getElementById('reminders-list').innerHTML = '';
      loadReminders();
  }

  // Show reminder details
  function showReminderDetails(event) {
      const extendedProps = event.extendedProps;
      alert(
          `${event.title}\n\n` +
          `Client: ${extendedProps.clientName}\n` +
          `Invoice #: ${extendedProps.invoiceNumber}\n` +
          `Due Date: ${formatDate(new Date(extendedProps.dueDate))}\n\n` +
          `${extendedProps.description}`
      );
  }

  // Format dates
  function formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });
  }

  // Generate iCalendar file
  function exportToICalendar(reminder) {
      const startDate = new Date(reminder.date);
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // +30 minutes
      
      const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//InvoiceGen//Invoice Reminder//EN',
          'BEGIN:VEVENT',
          `UID:${reminder.id}@invoicegen`,
          `DTSTAMP:${formatDateForICS(new Date())}`,
          `DTSTART:${formatDateForICS(startDate)}`,
          `DTEND:${formatDateForICS(endDate)}`,
          `SUMMARY:${reminder.title}`,
          `DESCRIPTION:${reminder.description}\\n\\nClient: ${reminder.clientName}\\nInvoice #: ${reminder.invoiceNumber}`,
          'BEGIN:VALARM',
          'TRIGGER:-PT15M', // 15 minutes before
          'ACTION:DISPLAY',
          `DESCRIPTION:${reminder.title}`,
          'END:VALARM',
          'END:VEVENT',
          'END:VCALENDAR'
      ].join('\n');

      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reminder-${reminder.invoiceNumber}.ics`;
      link.click();
  }

  // Format date for iCalendar
  function formatDateForICS(date) {
      return date.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  }

  // Initialize Web Notifications
  function initNotifications() {
      if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return;
      }

      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
          Notification.requestPermission();
      }
  }

  // Check for due reminders
  function checkForDueReminders() {
      const now = new Date();
      reminders.forEach(reminder => {
          const reminderDate = new Date(reminder.date);
          if (reminderDate <= now && !reminder.notified) {
              showNotification(reminder.title, reminder.description);
              reminder.notified = true;
              saveReminders();
          }
      });
  }

  // Show browser notification
  function showNotification(title, body) {
      if (Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/icon.png' });
      }
  }

  // Handle reminder type change
  const reminderType = document.getElementById('reminder-type');
  const beforeOptions = document.getElementById('before-reminder-options');
  const afterOptions = document.getElementById('after-reminder-options');

  reminderType.addEventListener('change', function() {
      beforeOptions.style.display = this.value === 'after' ? 'none' : 'block';
      afterOptions.style.display = this.value === 'before' ? 'none' : 'block';
  });

  // Schedule reminders
  document.getElementById('schedule-reminders').addEventListener('click', function() {
      const clientName = document.getElementById('client-name').value;
      const invoiceNumber = document.getElementById('invoice-number').value;
      const dueDate = document.getElementById('due-date').value;
      const dueTime = document.getElementById('due-time').value;
      const reminderTypeValue = reminderType.value;
      
      if (!clientName || !invoiceNumber || !dueDate || !dueTime) {
          alert('Please fill in all required fields');
          return;
      }

      const dueDateTime = new Date(`${dueDate}T${dueTime}`);

      if (reminderTypeValue === 'before' || reminderTypeValue === 'both') {
          const daysBefore = parseInt(document.getElementById('days-before').value);
          const beforeMessage = document.getElementById('before-message').value
              .replace('[Invoice Number]', invoiceNumber)
              .replace('[Client Name]', clientName);
          
          const reminderDate = new Date(dueDateTime);
          reminderDate.setDate(reminderDate.getDate() - daysBefore);
          
          reminders.push(createReminder(
              'before',
              reminderDate,
              beforeMessage,
              `Invoice #${invoiceNumber} for ${clientName} is due on ${formatDate(dueDateTime)}`,
              clientName,
              invoiceNumber,
              dueDateTime
          ));
      }

      if (reminderTypeValue === 'after' || reminderTypeValue === 'both') {
          const daysAfter = parseInt(document.getElementById('days-after').value);
          const afterMessage = document.getElementById('after-message').value
              .replace('[Invoice Number]', invoiceNumber)
              .replace('[Client Name]', clientName);
          
          const reminderDate = new Date(dueDateTime);
          reminderDate.setDate(reminderDate.getDate() + daysAfter);
          
          reminders.push(createReminder(
              'after',
              reminderDate,
              afterMessage,
              `Invoice #${invoiceNumber} for ${clientName} was due on ${formatDate(dueDateTime)}`,
              clientName,
              invoiceNumber,
              dueDateTime
          ));
      }

      saveReminders();
      updateCalendarAndList();
      alert('Reminders scheduled successfully!');
  });

  // Create reminder object
  function createReminder(type, date, title, description, clientName, invoiceNumber, dueDate) {
      return {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          type,
          date: date.toISOString(),
          title,
          description,
          clientName,
          invoiceNumber,
          dueDate: dueDate.toISOString(),
          notified: false
      };
  }

  // Initialize
  initNotifications();
  loadReminders();
  
  // Check for due reminders every minute
  setInterval(checkForDueReminders, 60000);
  checkForDueReminders();
});