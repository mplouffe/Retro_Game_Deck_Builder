/* Nintendo Themed Magic Mechanic Based Web Card Game
 * Authored by: Matheu Plouffe
 * Version: 0.0
 * Date Started: 31/03/2016
 * Last Update: 17/10/2019
 */

// SETTING UP
var camera, scene, renderer;
var mouse, raycaster, isShiftDown = false;
var sceneObjects = [];


function init() {
	// set up camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
	camera.position.set(0, 0, 10);
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
	renderer = new THREE.WebGLRenderer( {antialias: true} );
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    addExperimentalCard();
    //addLineDrawnArrow();
    animate();
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

    scene.add(mesh);
    sceneObjects.push(mesh);
}

function addLineDrawnArrow() {
    let material = new THREE.LineBasicMaterial( { color: 0x00ccff });
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -1, 0, 0));
    geometry.vertices.push(new THREE.Vector3( 0, 1, 0));
    geometry.vertices.push(new THREE.Vector3( 1, 0, 0));
    geometry.vertices.push(new THREE.Vector3( 0.4, 0, 0));
    geometry.vertices.push(new THREE.Vector3( 0.4, -1, 0));
    geometry.vertices.push(new THREE.Vector3( -0.4, -1, 0));
    geometry.vertices.push(new THREE.Vector3( -0.4, 0, 0));
    geometry.vertices.push(new THREE.Vector3( -1, 0, 0));

    let line = new THREE.Line( geometry, material );
    scene.add( line );
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.set( (event.clientX / window.innerWidth ) * 2 - 1, - (event.clientY / window.innerHeight ) * 2 + 1);

	raycaster.setFromCamera(mouse, camera);
	let intersects = raycaster.intersectObjects(sceneObjects);

	if (intersects.length > 0) {
		for(let intersector of intersects)
		{
			intersector.object.rotation.y += 0.05;
		}
	}
}

// set up animation
function animate() {
    requestAnimationFrame( animate );
    for(let object of sceneObjects)
    {
        // object.rotation.y += 0.05;
    }
    renderer.render ( scene, camera );
}

// add document load event listener
document.addEventListener("DOMContentLoaded", init, false);