var windowHeight = window.innerHeight;

window.addEventListener('scroll', onScroll, false);
window.addEventListener('resize',function(event){
  event.preventDefault();
  windowHeight = window.innerHeight;
},false);

var video = document.getElementById('video-el');
var video2 = document.getElementById('video-el-2');

function onScroll(event) {
  event.preventDefault();
  var scrollY = window.scrollY;
  if (video) {
    if (scrollY > 1600 ) {
      video.play();
    } else if (scrollY > 2200) {
      video2.play()
    }
  }
}


var imgContainer = document.getElementById('img-con');
var links = document.getElementsByClassName('proj-link');
if (links.length !== 0) {
  for (var i = 0; i<links.length; i++) {
    links[i].onmouseover = onHoverLink;
    links[i].onmouseleave = onLeaveLink;
  }
}
function onHoverLink(event) {
  console.log(event.target.name);
  if (event.target.name !== undefined) {
    imgContainer.style.backgroundImage = `url('assets/images/sample/${event.target.name}')`
    // imgContainer.style.transform = `translateY(-50%)`;
    imgContainer.style.opacity  = 1;
  }
}
function onLeaveLink(event) {
  // imgContainer.style.transform = `translateY(-45%)`;
  imgContainer.style.opacity  = 0;
}