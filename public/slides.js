const SLIDE_DURATION = 15000;
const BUFFERED_FADE_TIME = 500; // set in pong.css, this is a padded variant

function rotateSlides(){
  // Fade the top slide
  document.querySelector('.slide:last-child').classList.add('faded');
  // Give it time to finish fading, then remove it from the top and insert it at the bottom of the deck
  setTimeout(()=>{
    const topSlide = document.querySelector('.slide:last-child');
    topSlide.remove();
    topSlide.classList.remove('faded');
    document.querySelector('#slides').prepend(topSlide);
  }, BUFFERED_FADE_TIME);
}

setInterval(rotateSlides, SLIDE_DURATION);
