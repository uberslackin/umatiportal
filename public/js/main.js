/* eslint-env jquery, browser */
$(document).ready(() => {
	
$('#depth').append( "h2 boot" );
//	$( "div.fc-slats:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(15) > td:nth-child(2)" ).append( "<p>Test</p>" );

/* $('#calendar').fullCalendar({
  events: [
    {
      title  : 'event1',
      start  : '2020-06-02'
    },
    {
      title  : 'event2',
      start  : '2020-06-02',
      end    : '2020-06-02'
    },
    {
      title  : 'event3',
      start  : '2020-06-02T12:30:00',
      allDay : false // will make the time show
    }
  ]
});
*/

    $('#invite').on('click', function () {
        var Status = $(this).val();
        $.ajax({
            url: '/account/door1',
            data: {
                text: $("input[name=invite]").val(),
                Status: Status
            },
            dataType : 'json'
        });
    });



$('#invite').change(function(){
        container = document.getElementById(this);
        container.innerHTML=page_request.responseText;
        container.innerHTML=page_request.responseText;
      if (container.value == 'good vibes') {
          container.style.visibility = 'visible';
      }
});


$('.carousel .vertical .item').each(function(){
  var next = $(this).next();
  if (!next.length) {
    next = $(this).siblings(':first');
  }
  next.children(':first-child').clone().appendTo($(this));
  
  for (var i=1;i<2;i++) {
    next=next.next();
    if (!next.length) {
    	next = $(this).siblings(':first');
  	}
    
    next.children(':first-child').clone().appendTo($(this));
  }
});


    $('.movetrash').click(function(e) {
	(this).parent.remove();
        e.preventDefault();
    });

    $(".toggle-trigger").click(function() {
    $(this).parent().nextAll('.toggle-wrap').first().toggle('slow');

    });

   $("umatidb").hover(function() {
     $(this).addClass("blue");
     }, function() {
       $(this).removeClass("blue");
   });

   $( ".umatidb" ).on( "click", function() {
        $(this).parent().remove();
        $(".email-head-sender").next().eq(0).remove();
     //   $(this).nextAll('.email-head-sender').first().remove();
        $(this).load("/account/messagestrashmoveajax/" + $(this).attr('href') + "/" + $(this).attr('newstatus') );
         return false;
      });

   $( ".umatidbr" ).on( "click", function() {
        $(this).parent().remove();
        $(".email-head-sender").next().eq(0).remove();
     //   $(this).nextAll('.email-head-sender').first().remove();
        $(this).load("/account/messagestrashremove/" + $(this).attr('href') + "/" + $(this).attr('newstatus') );
         return false;
      });

  var JSON = [
    {
        "id": "1", // Optional
        "title": "Demo event", // Required
        "start": "2020-06-02 10:20:00", // Required
        "end": "2020-06-02 11:00:00", // Optional
        "allDay": false, // Optional
        "url": "http://google.com", // Optional, will not open because of browser-iframe security issues
        "className": "test-class", // Optional
        "editable": true, // Optional
        "color": "yellow", // Optional
        "borderColor": "red", // Optional
        "backgroundColor": "yellow", // Optional
        "textColor": "green" // Optional
    },
    {
        "id": "2", // Optional
        "title": "Demo event 2", // Required
        "start": "2020-06-02 10:20:00", // Required
        "end": "2013-08-27 11:00:00", // Optional
        "allDay": false, // Optional
        "url": "http://google.com", // Optional, will not open because of browser-iframe security issues
        "className": "test-class", // Optional
        "editable": true, // Optional
        "color": "yellow", // Optional
        "borderColor": "red", // Optional
        "backgroundColor": "yellow", // Optional
        "textColor": "green" // Optional
    }
];

 /*   $("#demo-calendar").fullCalendar({
        header: {
            left: "prev,next today",
            center: "title",
            right: "month,agendaWeek,agendaDay"
        },
        events: JSON
    });
*/

    // Place JavaScript code here...
    // new WOW().init();
    $('body').ihavecookies(options);

        if ($.fn.ihavecookies.preference('marketing') === true) {
            console.log('Cookie policy has been accepted.');
        }

        $('#ihavecookiesBtn').on('click', function(){
            $('body').ihavecookies(options, 'reinit');
        });

    /*$('#duration').slider({
    formatter: function(value) {
        return 'Current value: ' + value;
        }
    });

    var slider = new Slider('#duration', {
        formatter: function(value) {
        return 'Current value: ' + value;
        }
    });
*/

    $("form#changeQuote").on('submit', function(e){
        e.preventDefault();
        var data = $('input[name=quote]').val();
        $.ajax({
            type: 'post',
            url: '/accoun/ajax',
            data: data,
            dataType: 'text'
        })
        .done(function(data){
            $('h1').html(data.quote);
        });
    });

    $('#upload').on('click', function () {
        var file_data = $('#file').prop('files')[0];
        var form_data = new FormData();
        form_data.append('file', file_data);
        $.ajax({
            url: '//localhost:8080/account/upload', // point to server-side controller method
            dataType: 'text', // what to expect back from the server
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (response) {
                $('#msg').html(response); // display success response from the server
            },
            error: function (response) {
                $('#msg').html(response); // display error response from the server
            }
        });
    });
});
