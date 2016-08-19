var mouseDragging = false;

/*Dispositivo:
Base para todos los demas dispositivos
@draw: ejecuta todos los demas comandos del objeto
@gridded: alinea el objeto con la grilla
@dragging: permite arrastrar el objeto
@drawing: dibuja el objeto.
*/

var Device = function (nx, ny, nname) {
	this.x = nx;
	this.y = ny;
	this.name = nname;
	this.drag = false;
	this.imageURL = "hola";
	//Dibujo mi equipo.
	Device.prototype.draw = function () {
			this.drawing();
			this.dragging();
			this.gridded();
		}
		//alinea el objeto con la grilla
	Device.prototype.gridded = function () {
			var gridX = this.x / 64;
			var gridY = this.y / 64;
			gridY = Math.floor(gridY);
			gridX = Math.floor(gridX);
			this.x = gridX * 64 + 32;
			this.y = gridY * 64 + 32;
		}
		//permite ser arrastrado el objeto por el mouse
	Device.prototype.dragging = function () {
			if (mouseIsPressed == true && mouseX > this.x - 16 && mouseX < this.x + 16 && mouseY > this.y - 16 && mouseY < this.y + 16 && mouseDragging == false) {
				this.drag = true;
				mouseDragging = true;
			}
			if (mouseIsPressed == false) {
				this.drag = false;
				mouseDragging = false;
			}
			if (this.drag) {
				this.x = mouseX;
				this.y = mouseY;
			}
		}
		//dibuja el objeto
	Device.prototype.drawing = function () {
		stroke(30, 30, 200);
		rect(this.x - 16, this.y - 16, 32, 32);
		text(this.name, this.x, this.y)
	}
};
var AguaInicial= function (){
	this.x=10;
	this.y=20;
	this.dbo=100;
	this.SST=20; //solidos solutos totales
	AguaInicial.prototype.drawing = function () {
		stroke(30, 30, 200);
		rect(this.x - 16, this.y - 16, 32, 32);
		text(this.name, this.x, this.y)
	}
}
var tuberia = function (){
	
}


//creo los objetos
var test = new Device(32, 32, "1");
var test2 = new Device(32, 32, "2");

//funcion que se ejecuta al cargar las imagenes del javaScript
function preload() {

}

function setup() {
	var myCanvas = createCanvas(960, 384);
	myCanvas.parent('main-board');

}

function draw() {
	background(255);
	grid();
	mouseSeeker();
	test.draw();
	test2.draw();
}
//Funcion para saber la posicion del raton, solo para fines de testeo
function mouseSeeker() {
	stroke(230);
	line(mouseX, 0, mouseX, height);
	line(0, mouseY, width, mouseY);
	//color(0,0);
	//rect(0,0,959,383);
}
//crea una grilla para ubicar los objetos
function grid() {
	var spaceX = 64;
	var spaceY = spaceX;

	stroke(200);
	for (var i = 64; i < width; i += 64) {
		line(i, 0, i, height);
	}
	for (var i = 64; i < height; i += 64) {
		line(0, i, width, i);
	}
}
/*var water {
	dbo:100,
	solidos:20
};*/