let dragging = null;
let start = {x: 0, y: 0};

window.addEventListener("load", () => {
	for (let block of document.querySelectorAll(".block")) {
		block.x = Math.random() * window.innerWidth;
		block.y = Math.random() * window.innerHeight;
		set_transform(block);
		block.addEventListener("mousedown", (e) => {
			dragging = block;
			start.x = e.clientX - dragging.x;
			start.y = e.clientY - dragging.y;
		});
	}
});

window.addEventListener("mousemove", (e) => {

	if (!dragging) return;

	dragging.x = e.clientX - start.x;
	dragging.y = e.clientY - start.y;

	set_transform(dragging);

});

let set_transform = (block) => {
	block.style.transform = `translate(calc(${block.x}px - 50%), calc(${block.y}px - 50%))`;
}

let undrag = (e) => {
	dragging = null;
};

window.addEventListener("mouseup", undrag);
window.addEventListener("mouseleave", undrag);