var perfData = window.performance.timing;
var loadingTime = - (perfData.loadEventEnd - perfData.navigationStart);
var time = parseInt((loadingTime/1000)%60)/100 < 0.5? 0.5 : parseInt((loadingTime/1000)%60)/100;
var fadeTime = 1;
var loadingPage = document.getElementsByClassName('loading-bar');
var trackBar = document.getElementById('track-bar');

trackBar.style.transition = `${time}s 0.2s all cubic-bezier(0.075, 0.82, 0.165, 1)`;
trackBar.style.width = `150px`;

setTimeout(function() {
  trackBar.style.background = `#110E12`;
  loadingPage[0].style.transition = `${fadeTime}s 0.2s all linear`;
  loadingPage[0].style.opacity = `0`;
}, (time+0.2)*1000);

setTimeout(function() {
  loadingPage[0].remove();
}, (time+0.2+fadeTime)*1000);