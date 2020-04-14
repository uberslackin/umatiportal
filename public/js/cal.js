document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [ 'bootstrap', 'interaction', 'dayGrid', 'timeGrid' ],
    header    : {
        left  : 'prev,next today',
        center: 'title',
        right : 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    timeZone: 'UTC',
    defaultView: 'timeGridDay',
    events: function(info, successCallback, failureCallback) {
        var arrevents = [];
        jQuery.get( "https://api.myjson.com/bins/16ubhe", function( data ) {
          
          // var response = JSON.parse(data);
          // $.each(response, function(k, v) {
          //     arrevents.push(v);
          // });
          arrevents = data;
          successCallback(arrevents);
        });
    },
    editable  : true,
    droppable : true, // this allows things to be dropped onto the calendar !!!
    drop      : function(info) {
        // is the "remove after drop" checkbox checked?
        if (checkbox.checked) {
            // if so, remove the element from the "Draggable Events" list
            info.draggedEl.parentNode.removeChild(info.draggedEl);
        }
    } 
  });

  calendar.render();
});