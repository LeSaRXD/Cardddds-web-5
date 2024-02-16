const MAX_DISTANCE = 200;


let canv, ctx, cW, cH;
let dots;
let cursor_div;

let cursor = {x: 0, y: 0};
let pointer = {x: 0, y: 0};

document.body.addEventListener("mousemove", (e) => {
	cursor.x = e.clientX;
	cursor.y = e.clientY;
});
window.addEventListener("resize", () => {
	
	let newCW = window.innerWidth;
	let newCH = window.innerHeight;
	for (let dot of dots) {
		dot.x *= newCW / cW;
		dot.y *= newCH / cH;
		dot.start.x *= newCW / cW;
		dot.start.y *= newCH / cH;
	}
	cW = newCW;
	cH = newCH;
	canv.width = cW;
	canv.height = cH;

});

window.addEventListener("load", () => {

	canv = document.querySelector("canvas");
	ctx = canv.getContext("2d");
	cursor_div = document.querySelector("#cursor");

	cW = window.innerWidth;
	canv.width = cW;
	cH = window.innerHeight;
	canv.height = cH;

	dots = [];
	let step = 0.12;
	for(let x = 0.05; x < 1 - step; x += step) {
		for(let y = 0.05; y < 1 - step; y += step) {
			let sx = cW * step, sy = cH * step;
			dots.push(new Dot(
				x * cW + map(Math.random(), 0, sx),
				y * cH + map(Math.random(), 0, sy),
				0.03,
				50,
			));
		}
	}

	u();
	r();

});
let x = 0;

let u = () => {
	for (let dot of dots) dot.move();

	pointer.x = lerp(pointer.x, cursor.x, 0.1);
	pointer.y = lerp(pointer.y, cursor.y, 0.1);
	if(cursor_div) cursor_div.style.transform = `translate(calc(${pointer.x}px - var(--radius)), calc(${pointer.y}px - var(--radius)))`;
	
	setTimeout(u, 10);
}
let r = () => {
	ctx.clearRect(0, 0, cW, cH);
	for (let dot of dots) dot.draw();
	
	let blocks = Array.from(document.querySelectorAll(".block"));
	for (let i = 0; i < blocks.length; i++) {
		for (let j = i + 1; j < blocks.length; j++) {
			draw_line(blocks[i], blocks[j], 1, 2);
		}
	};

	requestAnimationFrame(r);
}

let map = (v, mi, ma) => v * (ma - mi) + mi;
let lerp = (x, y, a) => x + (y - x) * a;
let dist_sqr = (a, b) => (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);

let draw_line = (one, other, a = 1, w = 1, dist = MAX_DISTANCE) => {
	if (dist_sqr(one, other) >= dist * dist) return;
	ctx.beginPath();
	ctx.moveTo(one.x, one.y);
	ctx.lineTo(other.x, other.y);
	ctx.strokeStyle = `rgb(255, 255, 255, ${a})`;
	ctx.lineWidth = w;
	ctx.stroke();
}

class Dot {
	constructor(x = 0, y = 0, vel = 0.05, range = 100) {
		this.x = x;
		this.y = y;
		this.start = {x, y};
		this.alpha = map(Math.random(), 0.3, 1);
		this.k = map(Math.random(), -5, 5);
		this.l = map(Math.random(), -5, 5);
		this.r = Math.sqrt(this.alpha) * 3;
		this.vel = vel;
		this.range = range;
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fillStyle = `rgb(255, 255, 255, ${this.alpha})`;
		ctx.fill();

		for (let block of document.querySelectorAll(".block")) {
			draw_line(this, block, 0.6 * this.alpha);
		}
		draw_line(this, pointer, this.alpha, 1, 100);
	}
	dist_sqr(x, y) {
		return dist_sqr(this, {x, y});
	}
	move() {
		let t = Date.now() / 1000 * this.vel;
		this.x = this.start.x + this.range * Math.sin(this.k * t);
		this.y = this.start.y + this.range * Math.sin(this.l * t);
	}
}
