
let characters = [{
		category: "monsters",
		char: ["dracula", "mummy", "horseman", "witch", "it"]
	}, {
		category: "celebrities",
		char: ["jackson", "queen", "chaplin", "snoop", "elvis"]
	}, {
		category: "superheroes",
		char: ["superman", "spiderman", "hulk", "thor", "captain"]
	}, {
		category: "animals",
		char: ["kangaroo", "ostrich", "cat", "meerkat", "dog"]
	}
]

let currentRound = 0;
let currentCategory=characters[currentRound];

let sections = ["top", "middle", "bottom"];
let rows = document.querySelectorAll("main>div");

// Generate random order for current characters
let howManyChar = currentCategory["char"].length;
let randomSeq;
function generateRandomSeq() {
	howManyChar = currentCategory["char"].length;
	randomSeq = [];
	for (let i = 0; i<howManyChar; i++) {
		let randomNum;
		do {
			randomNum = Math.floor(Math.random()*(howManyChar))
		} while (randomSeq.indexOf(randomNum) > -1)
		randomSeq.push(randomNum);
	}
	return(randomSeq);
}


// generate images

let topImages;
let middleImages;
let bottomImages;
let images;

function createImages() {
	for (let i=0; i<sections.length; i++) {
		let order = generateRandomSeq()
		for (num of order) {
			let name = currentCategory["char"][num];
			let img = document.createElement("img");
			img.setAttribute('src', `images/${name}${i+1}.png`)
			img.classList.add(name, currentCategory["category"], sections[i]);
			rows[i].append(img);
		}
	}
	topImages = document.querySelectorAll(".top");
	middleImages = document.querySelectorAll(".middle");
	bottomImages = document.querySelectorAll(".bottom");
	images = document.querySelectorAll("main>div>img");
	callTimeout();
}



// Image Sizing

function callTimeout() {
	setTimeout (resizeImages, 50);
}

function resizeImages() {
	for (let i=0; i<middleImages.length; i++) {
		let width = middleImages[i].width;
		let charClass = middleImages[i].classList[0]
		let sameCharImages = document.querySelectorAll("." + charClass);
		for (image of sameCharImages) {
			image.width = width;
		}
	}
	makeVisible();
}


// to avoid possible img flashing before resizing, visibility set only afterward
function makeVisible() {
	for (image of images) {
		image.style.opacity="1";
	}
	startMove();
}


function startMove() {
	moveToQueueTop();
	moveToQueueMiddle();
	moveToQueueBottom();
	moveItemsTop();
	moveItemsMiddle();
	moveItemsBottom();
}

let startButton = document.querySelector("#start");
let main = document.querySelector("main");


let clickStatus = [false, false, false];

startButton.addEventListener("click",initialize);


function initialize() {
	if (currentRound > 0) {
		clearImages();
		currentCategory=characters[currentRound];
	}
		createImages()
	startButton.disabled = true;
}

let charQueueTop = [];
let charIndexTop = 0;
let charQueueMiddle = [];
let charIndexMiddle = 0;
let charQueueBottom = [];
let charIndexBottom = 0;

let delayQueue = 1000;
let incrementMove = 5;


function moveToQueueTop() {
	let id = setInterval(function() {
	    if (charQueueTop.length == topImages.length) {
	    	charIndexTop = 0 
	        clearInterval(id);
	    }  else {
	    	let obj = {
	    		char: topImages[charIndexTop],
	    		position: 0
	    	};
			charQueueTop.push(obj);
		    charIndexTop++;
		}
	}, delayQueue);
}

function moveToQueueMiddle() {
	let id = setInterval(function() {
	    if (charQueueMiddle.length == middleImages.length) {
	    	charIndexMiddle = 0 
	        clearInterval(id);
	    }  else {
	    	let obj = {
	    		char: middleImages[charIndexMiddle],
	    		position: 0
	    	};
			charQueueMiddle.push(obj);
		    charIndexMiddle++;
		}
	}, delayQueue);
}

function moveToQueueBottom() {
	let id = setInterval(function() {
	    if (charQueueBottom.length == bottomImages.length) {
	    	charIndexBottom = 0 
	        clearInterval(id);
	    }  else {
	    	let obj = {
	    		char: bottomImages[charIndexBottom],
	    		position: 0
	    	};
			charQueueBottom.push(obj);
		    charIndexBottom++;
		}
	}, delayQueue);
}


//if more images, need larger distance to travel so they won't overlap whey return to beginning
let trackWidth = main.offsetWidth + (howManyChar-4)*250;

function moveItemsTop() {
	let intervalTop = setInterval(function() {
			for (item of charQueueTop) {
				if (item["position"] >= trackWidth || clickStatus[0] == true) {
					item["position"]=0;
				} else {
					item["position"]+=1;
					item["char"].style.left = item["position"] + "px";
				}
			}
	}, incrementMove);
}

function moveItemsMiddle() {
	let intervalMiddle = setInterval(function() {
			for (item of charQueueMiddle) {
				if (item["position"] >= trackWidth || clickStatus[1] == true) {
					item["position"]=0;
				} else {
					item["position"]+=1;
					item["char"].style.left = item["position"] + "px";
				}
			}
	}, incrementMove);
}

function moveItemsBottom() {
	let intervalBottom = setInterval(function() {
			for (item of charQueueBottom) {
				if (item["position"] >= trackWidth || clickStatus[2] == true) {
					item["position"]=0;
				} else {
					item["position"]+=1;
					item["char"].style.left = item["position"] + "px";
				}
			}
	}, incrementMove);
}


main.addEventListener("click",getImgId);

let selectedNodes = [];
let selectedChars = [];
let selectedParts = [];

// check if click was on appropriate image, if 3 goes to endRound()
function getImgId(event) {
	let hoverItems = document.querySelectorAll( ":hover" );
	let clickedItem = hoverItems[hoverItems.length-1];
	let bodyPart = clickedItem.classList[2];
	if (clickedItem.nodeName == "IMG" && selectedParts.indexOf(bodyPart) < 0) {
		selectedNodes.push(clickedItem);
		selectedChars.push(clickedItem.classList[0]);
		selectedParts.push(clickedItem.classList[2]);
		switch (bodyPart) {
			case "top":
				clickStatus[0] = true;
			break;
			case "middle":
				clickStatus[1] = true;
			break;
			case "bottom":
				clickStatus[2] = true;
		}
		if (selectedNodes.length==3) {
			endRound();
		}
	}
}


function endRound() {
	resetAll();
	cleanUp();
	updateMessage();
	currentRound++;
	startButton.disabled = false;
}

// bring 3 selected images together and hide other ones
function cleanUp() {
	for (img of images) {
		if (selectedNodes.indexOf(img) <0) {
			img.style.opacity = "0";
		}
	}
	for (img of images) {
	img.style.transition = "all .8s ease-in";
	}
	for (img of selectedNodes) {
		img.style.left = "50%";
		img.classList.add("centered");
		switch (img.classList[2]) {
			case "top":
				img.style.bottom = "0";
				break;
			case "bottom":
				img.style.top = "0";
				break;
		}
	}
}

// check if the three selected images match
function checkMatches() {
	if (selectedChars[0]==selectedChars[1] && selectedChars[0] ==selectedChars[2]) {
		return true;
	} else {
		return false;
	}
}

function resetAll() {
	charQueueTop = [];
	charIndexTop = 0;
	charQueueMiddle = [];
	charIndexMiddle = 0;
	charQueueBottom = [];
	charIndexBottom = 0;
}

let winCount = 0;
let lossCount = 0;
let message = document.querySelector("#message");
let wins = document.querySelector("#wins span");
let losses = document.querySelector("#losses span");
let round = document.querySelector("#round span")


function updateMessage() {
	if (checkMatches()) {
		message.textContent = "You've won this round!";
		winCount++;
		wins.textContent = winCount;
	} else {
		message.textContent = "Sorry, not a match. Try again!";
		lossCount++
		losses.textContent = lossCount;
	}
		round.textContent = currentRound+2;
}

function clearImages() {
	for (image of images) {
		image.remove();
	}
}

