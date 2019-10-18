/* Nintendo Themed Magic Mechanic Based Web Card Game
 * Authored by: Matheu Plouffe
 * Version: 0.0
 * Date Started: 31/03/2016
 * Last Update: 17/10/2019
 */

// SETTING UP
// requestAnimationFrame
// create scene
var scene = new THREE.Scene();
var sceneObjects = [];
// create renderer instance
let renderer = new THREE.WebGLRenderer();
    // set up PerspectiveCamera
    // Args: (FOV(in degrees), Aspect Ratio, near clipping plane, far clipping plane)
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

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
            gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);        
        }
    `
}

function addExperimentalCube() {
    let uniforms = {
        colorA: {type: 'vec3', value: new THREE.Color(0x00ccff)},
        colorB: {type: 'vec3', value: new THREE.Color(0xcc00ff)}
    }

    let geometry = new THREE.BoxGeometry(1,1,1);
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

// set up animation
function animate() {
    requestAnimationFrame( animate );
    for(let object of sceneObjects)
    {
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
    }
    renderer.render ( scene, camera );
}

// add event listeners to functions
function onLoad() {
    // size to render the app
    renderer.setSize( window.innerWidth, window.innerHeight );
    // add renderer element to the HTML document
    document.body.appendChild( renderer.domElement );

    camera.position.set( 0, 0, 10 );
    camera.lookAt( 0, 0, 0 );

    addExperimentalCube();
    addLineDrawnArrow();
    animate();
}
// add document load event listener
document.addEventListener("DOMContentLoaded", onLoad, false);