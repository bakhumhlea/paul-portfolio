var menuBtn, menu, tlEl, trEl;
var devlink, archlink;
var devtitle, archtitle, objlinkto;
var sceneHidden;
var menuOn;
var menuSvg, menuSvgPaths;
var backBtn, backBtnSvgPaths;

var windowHeight;
var scrollY;
var minHeight;
var currentX, currentY;
var dist_x, dist_y, dist_z;

minHeight = windowHeight > 760 ? windowHeight : 760;

menuOn = false;
sceneHidden = false;

menuBtn = document.getElementById('menu-btn');
menu = document.getElementById('menu-bar');
menuSvg = document.getElementById('menu-svg');
menuSvgPaths = document.getElementsByClassName('path-svg');
backBtn = document.getElementById('bk-btn');
backBtnSvgPaths = document.getElementById('svg-arrow');

tlEl = document.getElementById('tl-el');
trEl = document.getElementById('tr-el');

var timePaths = ['M0 15 L20 35','M0 15 L20 35','M0 35 L20 15'];
var menuPaths = ['M0 17 L20 17','M0 25 L20 25','M0 33 L20 33'];

window.onload = function(event) {
  var container = document.getElementById('page-obj');
  container.style.opacity = 1;
}
function toggleMenu(currentpath) {
  if (menuOn) {
    menuOn = !menuOn;
    sceneHidden = false;
    menu.style.height = `0vh`;
    if (!!!currentpath) {
      menuSvg.setAttribute('stroke',`black`);
    }
    if (backBtnSvgPaths) backBtnSvgPaths.setAttribute('stroke',`black`);
    morphPathTime(menuPaths);
    setTimeout(() => {
      menu.style.display = 'none';
    },500);
  } else {
    menuOn = !menuOn;
    sceneHidden = true;
    menu.style.display = 'block';
    menuSvg.setAttribute('stroke',`white`);
    if (backBtnSvgPaths) backBtnSvgPaths.setAttribute('stroke',`white`);
    morphPathTime(timePaths);
    setTimeout(() => {
      menu.style.height = `100vh`;
    },100);
  }
}

function morphPathTime(paths) {
  for (var p = 0; p < menuSvgPaths.length; p++) {
    menuSvgPaths[p].setAttribute('d',paths[p]);
  }
}