/* Nintendo Themed Magic Mechanic Based Web Card Game
 * Authored by: Matheu Plouffe
 * Version: 0.0
 * Date Started: 31/03/2016
 * Last Update: 24/04/2022
 */

import * as THREE from './three.module.js';
import Stats from './stats.js';
import { DragControls } from './DragControls.js';
import { Card } from './card.js';

// SETTING UP
var camera, scene, renderer;

var stats;
var mouse, raycaster;
var intersected = null;

var sceneObjects = [];

const MAX_CARD_SCALE = 1.5;
const CARD_SCALE_FACTOR = 0.05;

function init() {
	// set up camera
	camera = new THREE.PerspectiveCamera(45, 2, 1, 500);
	camera.position.set(0, 0, 30);
	camera.lookAt(0, 0, 0);

	// create the scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);

	// set up mouse
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	// add lights
	let ambientLight = new THREE.AmbientLight(0x606060);
	scene.add(ambientLight);

	let directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 0.75, 0.5).normalize();
	scene.add(directionalLight);

	// size to render the app
	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector("canvas"),
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false);


	var controls = new DragControls( sceneObjects, camera, renderer.domElement );
	controls.addEventListener( 'dragstart', function ( event ) {

	} );
	controls.addEventListener( 'dragend', function ( event ) {

    } );
    
	stats = new Stats();
	document.body.appendChild( stats.dom );

    addExperimentalCard();
    addLineDrawnSquare();
    animate();
}

function logVariable(objToLog) {
    let name = Object.keys(objToLog)[0];
    let value = objToLog[name];
    console.log(name + ": " + value);
}

function vertexShader() {
    return `
        varying vec3 vUv;
        
        void main() {
            vUv = position;
            
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }
    `
}

function fragmentShader() {
    return `
        uniform vec3 colorA;
        uniform vec3 colorB;
        varying vec3 vUv;
        
        void main() {
            gl_FragColor = vec4(mix(colorA, colorB, vUv.z * 10.0), 1.0);        
        }
    `
}

function addExperimentalCard() {
	console.log("Adding experimental cube");
    let uniforms = {
        colorA: {type: 'vec3', value: new THREE.Color(0x00ccff)},
        colorB: {type: 'vec3', value: new THREE.Color(0xffffff)}
    }

    let geometry = new THREE.BoxGeometry(2,3.5,0.1);
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader(),
    });

    let mesh = new THREE.Mesh(geometry, material);
	mesh.position.y = 2;
	
	let cardInfo = new Card("demoCard");
	mesh.userData.cardInfo = cardInfo;

    scene.add(mesh);
    sceneObjects.push(mesh);
}

function addLineDrawnSquare() {
    let material = new THREE.LineBasicMaterial( { color: 0x00ccff });
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -17, 10, 0));
    geometry.vertices.push(new THREE.Vector3( 17, 10, 0));
    geometry.vertices.push(new THREE.Vector3( 17, -10, 0));
	geometry.vertices.push(new THREE.Vector3( -17, -10, 0));
	geometry.vertices.push(new THREE.Vector3( -17, 10, 0));

    let line = new THREE.Line( geometry, material );
    scene.add( line );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.set( (event.clientX / window.innerWidth ) * 2 - 1, - (event.clientY / window.innerHeight ) * 2 + 1 );
}

function onWindowResize() {	
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// set up animation
function animate() {	

	raycaster.setFromCamera(mouse, camera);
	let intersects = raycaster.intersectObjects(sceneObjects);

	if (intersects.length > 0) {
		if ( intersected !== intersects[ 0 ] ) {
			intersected = intersects[ 0 ];
		}
	} else {
		if ( intersected !== null ) {
			intersected.object.scale.x = 1;
			intersected.object.scale.y = 1;
		}
		intersected = null;
	}

	if (intersected !== null) {
		if( intersected.object.scale.x < MAX_CARD_SCALE ) {
			intersected.object.scale.x += CARD_SCALE_FACTOR;
			intersected.object.scale.y += CARD_SCALE_FACTOR;
		}
	}

    renderer.render ( scene, camera );
    
    stats.update()
	
	requestAnimationFrame( animate );
}

// add document load event listener
document.addEventListener("DOMContentLoaded", init, false);