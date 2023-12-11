function updateDateTime() {
    var currentDate = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var formattedDate = currentDate.toLocaleDateString('en-US', options);
    var day = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);
    
    document.getElementById('date-container').innerHTML = `
      <div>${day}</div>
      <div>${formattedDate}</div>
      <div>Calicut</div>
    `;
  }

  // Update the date every second
  setInterval(updateDateTime, 1000);

  // Initial call to display the date immediately
  updateDateTime();