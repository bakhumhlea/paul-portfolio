'use strict';

// var THREE = require('three');

var scene, camera, renderer;
var sceneWidth, sceneHeight;

var icosa, octa, octa_wire, icosa_wire;
var geometry_radius = 80;

// var particles;
var particleField;
var particle_count = 6000;
var particles_base_radius = 330;
var particle_thickness = 5;

var starField;

var rings;
var inner_r, outer_r;
var ring_count = 50;
var ring_base_radius = 290;
var ring_thickness = 0.45;
var shrink_coef = 100;

var mat_01, mat_02, mat_03;

var controls;
var raycaster;
var mouse = new THREE.Vector2(), INTERSECTED, clickObj;

var CAMERA = {
  initZ: 230,
  minDist: 200,
  maxDist: 600,
  autoRotateSpeed: 1.0
}
var ANIMATE = {
  rotation: 0.002
}

init();
// render();
animate();

function init() {
  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;

  scene = new THREE.Scene();
  raycaster = new THREE.Raycaster();

  camera = new THREE.PerspectiveCamera(75, sceneWidth/sceneHeight, 0.1, 1000);
  camera.position.z = CAMERA.initZ;
  camera.updateMatrixWorld();
  
  // renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true
  });
  renderer.setSize( sceneWidth, sceneHeight);
  document.body.append( renderer.domElement );

  /** @Desc orbit controls */

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', onControlsChange );
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = CAMERA.autoRotateSpeed;
  controls.maxDistance = CAMERA.maxDist;
  controls.minDistance = CAMERA.minDist;
  /** @Desc Create geometries */

  var geometry_01 = new THREE.IcosahedronBufferGeometry(geometry_radius);
  mat_01 = new THREE.MeshLambertMaterial({ color: 0x110E12 });
  icosa = new THREE.Mesh( geometry_01, mat_01 );
  icosa.name = 0x92E5D0;

  var line_mat_01 = new THREE.LineBasicMaterial({ color: 0x2D77E5, transparent: true, opacity: 0.4});
  var wire_01 = new THREE.WireframeGeometry(geometry_01);
  icosa_wire = new THREE.LineSegments(wire_01, line_mat_01);

  var geometry_02 = new THREE.OctahedronBufferGeometry(geometry_radius,0);
  mat_02 = new THREE.MeshLambertMaterial({ color: 0x110E12 });
  octa = new THREE.Mesh( geometry_02, mat_02 );
  octa.name = 0xEDC97D;
  
  var line_mat_02 = new THREE.LineBasicMaterial({ color: 0xDB241E, transparent: true, opacity: 0.4 });
  var wire_02 = new THREE.WireframeGeometry(geometry_02);
  octa_wire = new THREE.LineSegments(wire_02, line_mat_02);

  // var particle_01 = new THREE.TetrahedronBufferGeometry(1);
  // mat_03 = new THREE.MeshBasicMaterial({
  //   color: 0xE08E45,
  // });

  var ring_mat = new THREE.MeshLambertMaterial({
    color: 0xDB241E,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    emissive: 0xDB241E
  });

  /** @Desc Generate rings */

  rings = [];

  for (var i = 0; i < ring_count ; i++) {
    if (i < ring_count/2) {
      inner_r = ring_base_radius - ((Math.PI / ring_count) * shrink_coef * i);
      outer_r = ring_base_radius - ((Math.PI / ring_count) * shrink_coef * i) + ring_thickness;
    } else {
      inner_r = ring_base_radius - ((Math.PI / ring_count) * shrink_coef * (ring_count - i));
      outer_r = ring_base_radius - ((Math.PI / ring_count) * shrink_coef * (ring_count - i)) + ring_thickness;
    }
    var ring_geo = new THREE.RingBufferGeometry(inner_r, outer_r, 150);
    
    rings[i] = new THREE.Mesh(ring_geo,ring_mat);
    rings[i].rotation.x = (Math.PI/(ring_count * 2) * i);
    rings[i].rotation.y = Math.PI/3 + (Math.PI/ring_count * i);

    var decre_value_r = (rings[i].material.color.r - 0.1) / ring_count;
    var incre_value_b = (1 - rings[i].material.color.b + 0.1) / ring_count;
    
    rings[i].material.color.r = rings[i].material.color.r - (decre_value_r);
    rings[i].material.color.b = rings[i].material.color.b + (incre_value_b);

    scene.add(rings[i]);
  }

  /** @Desc Generate particles */
  
  var particle_geo = new THREE.Geometry();

  for ( var i = 0; i < particle_count; i ++ ) {
    var azi = Math.random() * 180;
    var pol = Math.random() * 360;
    var r = (Math.random() * particle_thickness) + particles_base_radius;

    var particle = new THREE.Vector3(0,1,0);
    particle.x = r * Math.cos(azi) * Math.sin(pol);
    particle.y = r * Math.sin(azi) * Math.sin(pol);
    particle.z = r * Math.cos(pol);
    particle_geo.vertices.push( particle );
  }

  var particle_mat = new THREE.PointsMaterial( { color: 0xE08E45 } );
  particleField = new THREE.Points( particle_geo, particle_mat );
  scene.add(particleField);

  var star_geo = new THREE.Geometry();

  for ( var j = 0; j < 5000; j ++ ) {
    var azi = Math.random() * 180;
    var pol = Math.random() * 360;
    var r = (Math.random() * 50) + particles_base_radius + 300;

    var star = new THREE.Vector3(0,1,0);
    star.x = r * Math.cos(azi) * Math.sin(pol);
    star.y = r * Math.sin(azi) * Math.sin(pol);
    star.z = r * Math.cos(pol);
    star_geo.vertices.push(star);
  }

  var star_mat = new THREE.PointsMaterial( { color: 0xffffff } );
  starField = new THREE.Points( star_geo, star_mat );
  scene.add(starField);

  var geometries_offset = {
    x: 100,
    y: 40,
    z: 40,
  }
  icosa.position.x = geometries_offset.x;
  icosa.position.y = geometries_offset.y;
  icosa.position.z = - geometries_offset.z;

  icosa.rotation.z = 0.5;

  icosa.scale.x = 0.7;
  icosa.scale.y = 0.7;
  icosa.scale.z = 0.7;

  icosa_wire.position.x = geometries_offset.x;
  icosa_wire.position.y = geometries_offset.y;
  icosa_wire.position.z = - geometries_offset.z;

  icosa_wire.rotation.z = 0.5;

  icosa_wire.scale.x = 0.8;
  icosa_wire.scale.y = 0.8;
  icosa_wire.scale.z = 0.8;

  octa.position.x = - geometries_offset.x;
  octa.position.y = - geometries_offset.y;
  octa.position.z = geometries_offset.z;

  octa.rotation.z = 0.5;
  
  octa.scale.x = 0.7;
  octa.scale.y = 0.7;
  octa.scale.z = 0.7;

  octa_wire.position.x = - geometries_offset.x;
  octa_wire.position.y = - geometries_offset.y;
  octa_wire.position.z = geometries_offset.z;

  octa_wire.rotation.z = 0.5;
  
  octa_wire.scale.x = 0.8;
  octa_wire.scale.y = 0.8;
  octa_wire.scale.z = 0.8;

  scene.add(icosa);
  scene.add(icosa_wire);
  scene.add(octa);
  scene.add(octa_wire);

  /** @Desc Lighting */ 

  var light_01 = new THREE.DirectionalLight( 0xffffff, 1.5);
  light_01.position.x = 5;
  light_01.position.y = 5;
  light_01.position.z = 4;

  var light_02 = new THREE.SpotLight( 0x3F88C5, 1);
  light_02.position.x = -4;
  light_02.position.y = -4;
  light_02.position.z = 3;

  scene.add( light_01 );
  scene.add( light_02 );

  var ambiant = new THREE.AmbientLight( 0xFFC6F1, 0.4 );
  scene.add(ambiant);

  var blue_black = 0x060316;
  var smoky_black = 0x110E12;
  scene.fog = new THREE.Fog(smoky_black, 0, 20000);
  renderer.setClearColor(scene.fog.color,1);

  document.addEventListener('mousemove', onDocMouseMove, false);
  document.addEventListener('mousedown', onDragScroll, false);
  document.addEventListener('mouseup', onDragScroll, false);

  window.onresize = resizeScene;
}
var incre = true;

function animate() {
  icosa.rotation.x += (ANIMATE.rotation);
  icosa.rotation.y += (ANIMATE.rotation);
  icosa_wire.rotation.x += (ANIMATE.rotation);
  icosa_wire.rotation.y += (ANIMATE.rotation);

  octa.rotation.x += - (ANIMATE.rotation);
  octa.rotation.y += - (ANIMATE.rotation);
  octa_wire.rotation.x += - (ANIMATE.rotation);
  octa_wire.rotation.y += - (ANIMATE.rotation);

  if (incre) {
    if (particleField.material.color.b < 0.98) {
      particleField.material.color.b += 0.005
    } else {
      particleField.material.color.b -= 0.005
      incre = !incre;
    }
  } else {
    if (particleField.material.color.b > 0.02) {
      particleField.material.color.b -= 0.005
    } else {
      particleField.material.color.b += 0.005
      incre = !incre;
    }
  }
  controls.update();
  render();
  requestAnimationFrame( animate );
}

function onControlsChange() {
  dist_x = Math.abs(controls.object.position.x)
  dist_y = Math.abs(controls.object.position.y)
  dist_z = Math.abs(controls.object.position.z)
  if ( dist_x > 350 || dist_y > 350 || dist_z > 350) {
    menuBtn.style.opacity = 1;
    tlEl.style.opacity = 1;
    trEl.style.opacity = 1;
    icons.style.display = 'block';
    devlink.style.opacity = 0;
    archlink.style.opacity = 0;
  } else {
    menuBtn.style.opacity = 0;
    tlEl.style.opacity = 0;
    trEl.style.opacity = 0;
    icons.style.display = 'none';
  }
  render();
}

function render() {
  devlink = document.getElementById('dev-link');
  archlink = document.getElementById('arch-link');
  devtitle = document.getElementById('dev-title');
  archtitle = document.getElementById('arch-title');
  objlinkto = document.getElementById('obj-linkto');
  raycaster.setFromCamera( mouse, camera );
  var objects = [icosa, octa];
  var intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) {
        INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        devlink.style.transition =`0.7s 0s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
        0.1s 0.7s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
        archlink.style.transition =`0.7s 0s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
        0.1s 0.7s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
        objlinkto.style.transition =`0.7s 0s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
        0.1s 0.7s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
        devlink.style.opacity = 0;
        archlink.style.opacity = 0;
        devlink.style.height = '0px';
        archlink.style.height = '0px';
        devtitle.style.color = '#FFFFFF';
        // devtitle.style.textDecoration = 'none';
        archtitle.style.color = '#FFFFFF';
      }
      if (!!!sceneHidden) {
        document.body.style.cursor = 'pointer';
      }
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( INTERSECTED.name );
      if (INTERSECTED.name === 0xEDC97D) {
        devlink.style.transition =`0.7s 0.1s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
        0.1s 0s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
        devlink.style.height = '20px';
        devlink.style.opacity = 1;
        if ( dist_x > 350 || dist_y > 350 || dist_z > 350) {
          // devtitle.style.color = '#d65d59';
          objlinkto.style.transition =`0.7s 0s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
        0.1s 0.7s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
          objlinkto.style.opacity = 1;
          objlinkto.style.color = '#d65d59';
          objlinkto.innerText = 'WORKS';
        }
      } else {
        archlink.style.transition =`0.7s 0.1s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
        0.1s 0s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
        archlink.style.height = '20px';
        archlink.style.opacity = 1;
        if ( dist_x > 350 || dist_y > 350 || dist_z > 350) {
          // devtitle.style.textDecoration = 'line-through';
          // archtitle.style.color = '#5180be';
          objlinkto.style.transition =`0.7s 0s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
        0.1s 0.7s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
          objlinkto.style.opacity = 1;
          objlinkto.style.color = '#5180be';
          objlinkto.innerText = 'ABOUT';
        }
      }
    }
  } else {
    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    document.body.style.cursor = null;
    INTERSECTED = null;
    devlink.style.transition =`0.7s 0s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
    0.1s 0.7s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
    archlink.style.transition =`0.7s 0s opacity cubic-bezier(0.075, 0.82, 0.165, 1),
    0.1s 0.7s height cubic-bezier(0.075, 0.82, 0.165, 1)`;
    devlink.style.opacity = 0;
    archlink.style.opacity = 0;
    devlink.style.height = '0px';
    archlink.style.height = '0px';
    objlinkto.style.opacity = 0;
  }
  renderer.render(scene,camera);
}

function onDocMouseMove(event) {
  event.preventDefault();
  currentX = event.clientX;
  currentY = event.clientY;
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
}
function onOpenPage(url) {
  var el = document.getElementsByClassName('circle-trnst-el');
  if (el.length === 0) {
    // expandTransition();
    var transitionObj = document.createElement('div');
    transitionObj.setAttribute('class', 'circle-trnst-el');
    transitionObj.style.top = event.clientY;
    transitionObj.style.left = event.clientX;
    document.body.append(transitionObj);
    setTimeout(()=>{
      transitionObj.style.height = (window.innerWidth * 2)+'px';
      // transitionObj.style.backgroundColor = `rgb(17, 14, 18)`;
      transitionObj.style.width = (window.innerWidth * 3)+'px';
    },100);
  }
  setTimeout(()=>{
    open(url,'_self');
  }, 2000);
}
function expandTransition() {
  var transitionObj = document.createElement('div');
  transitionObj.setAttribute('class', 'circle-trnst-el');
  transitionObj.style.top = event.clientY;
  transitionObj.style.left = event.clientX;
  document.body.append(transitionObj);
  setTimeout(()=>{
    transitionObj.style.width = window.innerWidth * 2;
    transitionObj.style.height = window.innerWidth * 3;
  },200);
}
function onDragScroll(event) {
  event.preventDefault();
  if (INTERSECTED && !!!sceneHidden) {
    console.log(INTERSECTED.name === 0x92E5D0)
    if (INTERSECTED.name === 0x92E5D0) {
      onOpenPage('about.html');
    } else {
      onOpenPage('content.html');
    }
  }
  var dragScroll = document.getElementById('drag-scroll');
  dragScroll.style.opacity = event.type === 'mousedown' ? 0.2 : 1;
}

function resizeScene() {
  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
  camera.aspect = sceneWidth/sceneHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( sceneWidth, sceneHeight);
  renderer.render(scene, camera);
}
