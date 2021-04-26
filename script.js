
let characters = [{
		category: "monsters",
		char: ["dracula", "mummy", "horseman", "witch", "it"]
	}, {
		category: "celebrities",
		char: ["jackson", "queen", "chaplin", "snoop"]
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

// Generate images

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
}

createImages();

let topImages = document.querySelectorAll(".top");
let middleImages = document.querySelectorAll(".middle");
let bottomImages = document.querySelectorAll(".bottom");



// Image Sizing

setTimeout (resizeImages, 50);
function resizeImages() {
	for (let i=0; i<middleImages.length; i++) {
		// console.log(middleImages[i].width);
		// console.log(middleImages[i].style.width);
		// console.log(window.getComputedStyle(middleImages[i]).width);
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
let images = document.querySelectorAll("main>div>img");
function makeVisible() {
	for (image of images) {
		image.style.opacity="1";
	}
}


let startButton = document.querySelector("#start");
let main = document.querySelector("main");


let position = [0,0];
let clickStatus = [false, false, false];

startButton.addEventListener("click",initialize);

// let rows = [document.querySelectorAll(".top"),document.querySelectorAll(".middle"),document.querySelectorAll(".bottom")]



function initialize() {

	if (currentRound > 0) {
		clearImages();
		currentRound++;
	}
	moveToQueueTop();
	moveToQueueMiddle();
	moveToQueueBottom();
	moveItemsTop();
	moveItemsMiddle();
	moveItemsBottom();
}

let charQueueTop = [];
let charIndexTop = 0;
let charQueueMiddle = [];
let charIndexMiddle = 0;
let charQueueBottom = [];
let charIndexBottom = 0;

let delayQueue = 1000;
let incrementMove = 5;



// let columns = [[t,m,b], [t,m,b], 3, 4, 5]

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


//more images, need larger distance to travel so they won't overlap whey return to begeinning
let trackWidth = main.offsetWidth + (howManyChar-4)*250;

function moveItemsTop() {
	let intervalTop = setInterval(function() {
			for (item of charQueueTop) {
				if (item["position"] >= trackWidth || clickStatus[0] == true) {
					// clearInterval(intervalTop);
					item["position"]=0;
					// moveItemsTop();
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
					// clearInterval(intervalMiddle);
					item["position"]=0;
					// moveItemsMiddle();
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
					// clearInterval(intervalBottom);
					item["position"]=0;
					// moveItemsBottom();
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
let selectedParts =[];

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
		console.log(selectedChars)
		if (selectedNodes.length==3) {
			endRound();
		}
	}
}

function endRound() {
	cleanUp();
	resetAll();
	updateMessage();
}


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

let message = document.querySelector("#message");
function updateMessage() {
	if (checkMatches()) {
		message.textContent = "You've won this round!";
	} else {
		message.textContent = "Sorry, not a match. Try again!";
	}
}

function clearImages() {
	for (image of images) {
		image.remove();
	}
}

