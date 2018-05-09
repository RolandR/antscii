
var width = 100;
var height = 60;

var worldContainer = document.getElementById("renderContainer");

var world = [];

generateWorld();
render();

function render(){
	var renderString = "";

	for(var y = 0; y < height; y++){
		for(var x = 0; x < width; x++){
			renderString += world[y][x].char;
		}
		renderString += "<br>";
	}

	worldContainer.innerHTML = renderString;
}

function generateWorld(){

	var groundLevel = 1/4;
	var groundVariance = 0.02;

	var groundLevels = [];

	for(var i = 0; i < width; i++){
		groundLevels[i] = groundLevel*height;
		groundLevel += (Math.random()-0.5)*groundVariance;
	}

	for(var i = 1; i < width-1; i++){
		groundLevels[i] = (groundLevels[i-1] + groundLevels[i] + groundLevels[i+1])/3;
	}

	for(var i = 0; i < width; i++){
		groundLevels[i] = Math.round(groundLevels[i]);
	}

	for(var y = 0; y < height; y++){
		world[y] = [];
		for(var x = 0; x < width; x++){

			if(y < groundLevels[x]){
				world[y][x] = {
					 type: "air"
					,char: " "
				};
			} else {
				world[y][x] = {
					 type: "dirt"
					,char: "▓"
				};
			}
		}
	}

	var grassChars = ["/", "\\", "V", "v", "|", ","];
	var grassProbability = 0.8;
	
	for(var x = 0; x < width; x++){
		if(Math.random() < grassProbability){
			var grassChar = selectRandomly(grassChars);
			if(world[groundLevels[x]-1]){
				world[groundLevels[x]-1][x] = {
					 type: "grass"
					,char: grassChar
				};
			}
		}
	}
	
}

function selectRandomly(arr){
	return(arr[~~(Math.random()*arr.length)]);
}
