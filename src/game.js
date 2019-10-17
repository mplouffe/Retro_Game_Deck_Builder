/* Nintendo Themed Magic Mechanic Based Web Card Game
 * Authored by: Matheu Plouffe
 * Version: 0.0
 * Date Started: 31/03/2016
 * Last Update: 16/10/2019
 */

// SETTING UP
// requestAnimationFrame
var card01mouseOver = function() {
	document.getElementById("card01").style.backgroundColor = "#000";
}

var card01mouseOut = function(){
	document.getElementById("card01").style.backgroundColor = "#0F0";
}

var card01Click = function(){
	var card01 = document.getElementById("card01");
	while(card01.mousedown)
	{

	}

}
// add event listeners to functions
function onLoad() {
	document.getElementById("card01").addEventListener("mouseover",card01mouseOver);
	document.getElementById("card01").addEventListener("mouseout", card01mouseOut);

	interact('.draggable').draggable({
		// enable inertial throwing
		inertia: true,
		// keep he elent within the area of it's parent
		restrict: {
			restriction: "parent",
			endOnly: true,
			elementRect: { top: 0, left: 0, bottom: 1, right: 1}
		},
		// enable autoScroll
		autoScroll: true,

		// call this function on every dragmove event
		onmove: dragMoveListener,
		// call this function on every dragend event
		// onend: nothingHereYet
	});

	function dragMoveListener(event){
		var target = event.target,
			// keep the dragged position in the data-x/data-y attributes
			x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
			y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

		// translate the element
		// target.style.webkitTransform =
		target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

		// update the position attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	}

}
// add document load event listener
document.addEventListener("DOMContentLoaded", onLoad, false);