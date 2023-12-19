
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

setInterval(updateDateTime, 1000);

updateDateTime();
