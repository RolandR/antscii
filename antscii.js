
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

	// Generate ground level

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

	// Generate grass

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

	// Generate rocks

	var iterations = 30;
	var seedProbability = 0.001;
	var growProbability = 0.1;

	for(var i = 0; i < iterations; i++){

		for(var y = 0; y < height; y++){
			for(var x = 0; x < width; x++){

				if(Math.random() < seedProbability * Math.pow((y/height), 4) && world[y][x].type == "dirt"){
					world[y][x] = {
						 type: "rock"
						,char: "█"
					};
				}

				if(getTile(y, x).type == "dirt"){
					var prob = 0;
					if(getTile(y-1, x).type == "rock"){
						prob += growProbability;
					}
					if(getTile(y+1, x).type == "rock"){
						prob += growProbability;
					}
					if(getTile(y, x-1).type == "rock"){
						prob += growProbability;
					}
					if(getTile(y, x+1).type == "rock"){
						prob += growProbability;
					}

					if(Math.random() < prob){
						world[y][x] = {
							 type: "rock"
							,char: "█"
						};
					}
				}
			}
		}

	}

	// Generate caves

	var iterations = 30;
	var seedProbability = 0.0001;
	var growProbability = 0.05;
	var xGrowth = 0.5;
	var yGrowth = 1.5;

	for(var i = 0; i < iterations; i++){

		for(var y = 0; y < height; y++){
			for(var x = 0; x < width; x++){

				if(Math.random() < seedProbability && world[y][x].type == "dirt"){
					world[y][x] = {
						 type: "cave"
						,char: "░"
					};
				}

				if(getTile(y, x).type == "dirt"){
					var prob = 0;
					if(getTile(y-1, x).type == "cave"){
						prob += growProbability*yGrowth;
					}
					if(getTile(y+1, x).type == "cave"){
						prob += growProbability*yGrowth;
					}
					if(getTile(y, x-1).type == "cave"){
						prob += growProbability*xGrowth;
					}
					if(getTile(y, x+1).type == "cave"){
						prob += growProbability*xGrowth;
					}

					if(Math.random() < prob){
						world[y][x] = {
							 type: "cave"
							,char: "░"
						};
					}
				}
			}
		}

	}
	
}

function selectRandomly(arr){
	return(arr[~~(Math.random()*arr.length)]);
}

function getTile(y, x){
	if(world[y] && world[y][x]){
		return world[y][x];
	} else {
		return {
			 type: "void"
			,char: "?"
		};
	}
}
