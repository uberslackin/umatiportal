jQuery(function($) {

  checkCookie();

function checkCookie()
{
var consent = getCookie("cookies_consent");

if (consent == null || consent == "" || consent == undefined)
  {
    // show notification bar
     $('#cookie_directive_container').show();
  }
}

function setCookie(c_name,value,exdays)
{

var exdate = new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie = c_name + "=" + c_value+"; path=/";

$('#cookie_directive_container').slideUp('slow');
}


function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

$("#cookie_accept a").click(function(){
  setCookie("cookies_consent", 1, 30);
});

});