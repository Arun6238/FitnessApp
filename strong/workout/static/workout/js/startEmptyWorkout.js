const stopwatch = {
    startTime: null,
    running: false,
    display: document.querySelector("#time"),
    data: "",
    
    start: function() {
      let time = document.querySelector("#time").getAttribute("data-time");
      const unixTime = new Date(time).getTime();
      let today = new Date();
      this.startTime = today.getTime() - unixTime;
      
      window.addEventListener("load", () => {
        this.running = true;
        this.run()
        // requestAnimationFrame(this.run.bind(this));
      });
    },
    
    run: function(timestamp) {
      if (!this.startTime) {
        this.startTime = timestamp;
      }
      var elapsed = timestamp + this.startTime;
      var hours = Math.floor(elapsed / 3600000);
      var minutes = Math.floor((elapsed % 3600000) / 60000);
      var seconds = Math.floor((elapsed % 60000) / 1000);
      this.display.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
      if (this.running) {
          requestAnimationFrame(this.run.bind(this));
      }
    },
    
    stop: function() {
      this.running = false;
    }
  };
//   starts the  timer when the page is loaded
  stopwatch.start();
let container = document.querySelector(".container")
// object to handle all addExercises related things
const showExercise = {
	fetchData:{},
	url :"/workout/show-all-exercises", //view function url for getExercise 
	allExercises: document.querySelector(".all-exercises"),
	closeButton: document.querySelector("#close-button"),
	addExercise: document.querySelector("#addExercise"),
	selectedExercise : {},
	exerciseSelect :document.querySelector(".exercise-select"),
	//function check if fetchData is empty or not
	checkFetchData:function(){
		for(let i of this.fetchData){
			return true
		}
		return false
	},
	createExerciseList:function(i){
			let selectExerciseContent = document.createElement("div")
			selectExerciseContent.classList.add("select-exercise-content")
			selectExerciseContent.setAttribute("data-exercise",i.id)
			selectExerciseContent.setAttribute("data-exerciseName",i.name)
			selectExerciseContent.setAttribute("data-selected","false")
			selectExerciseContent.addEventListener('click',this.select) // select funtion is defined in main.js file
		
			let image = document.createElement("img")
			image.src = i.image_url;
			image.alt = "Exercise image..";
			image.height = 60;
			image.width = 60;
			image.setAttribute("data-image","/static/workout/img/tick.jpg'")  // data-image attribute is used by select function to change the image when an exercise is selected
		
		
			let div = document.createElement("div")
			let h4 = document.createElement("h4")
			h4.innerText = i.name
			let h5 = document.createElement("h5")
			h5.innerText = i.body_part
		
			div.appendChild(h4)
			div.appendChild(h5)
		
			selectExerciseContent.appendChild(image)
			selectExerciseContent.appendChild(div)
		
			this.allExercises.appendChild(selectExerciseContent)		
	},

	// funciton for displaying and hiding addExercise page-block
	showExerciseHandler:function(){
		this.addExercise.addEventListener("click",function(){
			if(this.checkFetchData){
				this.getExercise()
			}
			container.style.display = "none"
			this.allExercises.style.display = "block"
		}.bind(this))

		this.closeButton.addEventListener("click",function(){
			container.style.display = "block"
			this.allExercises.style.display = "none"
		}.bind(this))
	},
	
	//function to get all the exercise and diplay the list in 
	getExercise:function(){
		fetch(this.url)
		.then(response => response.json())
		.then(data =>{
			this.fetchData = data.exercises
			for(let i of this.fetchData){
				this.createExerciseList(i)
			}
		})
		.catch(error => {
			console.log(error)
		})
	},
	// funtion for selecting exerccises for new workout
	select:function(){
		let id = this.getAttribute("data-exercise")
		let img = this.firstElementChild

		// select the exercise and add it to selected exercise object
		if (this.getAttribute("data-selected") == "false"){
			this.setAttribute("data-selected","true") 
			img.setAttribute("data-image",this.firstElementChild.src)
			// link of tick image
			img.src = "/static/workout/img/tick.jpg"
			this.style.backgroundColor = "#7fcdfe85"
			showExercise.selectedExercise[id] = id
				
		}
		// unselect an exercise and remove it from selected exercise
		else{
			this.setAttribute("data-selected","false")
			img.src = this.firstElementChild.getAttribute("data-image")    
			this.style.backgroundColor = "inherit" 
			delete showExercise.selectedExercise[id]   
		}

		// check if selectedExercise dictionary have any value
		if(Object.keys(showExercise.selectedExercise).length){
			showExercise.exerciseSelect.style.display = "inline" //display the exercise select button
		}
		else{
			showExercise.exerciseSelect.style.display = "none"
		}
		console.log(showExercise.selectedExercise)
	}
}

showExercise.showExerciseHandler()

// function to ensure  and inputfiled only accept positive integers
let selectExerciseInput = document.querySelectorAll(".selected-exercise-input")
selectExerciseInput.forEach((inp) => {
	inp.addEventListener('input',validateInputField)
})
function validateInputField(){
		let value = this.value;
		// Remove any non-digit characters from the input
		value = value.replace(/\D/g, "");
		
		// Ensure that the input is not empty and is a positive integer
		if (value !== "" && parseInt(value) >= 0) {
		  this.value = value;
		} else {
		  this.value = "";
		}
}

function getCookie(name) {
    // function to retrieve a cookie by name
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

const csrftoken = getCookie('csrftoken');

let selectExerciseButton = document.querySelector(".exercise-select")
let redirectUrl = selectExerciseButton.getAttribute("data-redirecturl") // url to redirect after saving selected exercise
selectExerciseButton.addEventListener("click",function(){
	let url = this.getAttribute("data-url")
	let data = {
		exercises:showExercise.selectedExercise,
		workoutSessionId:1
	}
	let options = {
		method:'POST',
		headers:{
			'Content-Type':'application/json',
			'x-CSRFToken':csrftoken
		},
		body:JSON.stringify(data)
	}

	fetch(url,options)
	.then(res =>{
		if(res.ok)
			window.location.href = redirectUrl
	})
	.catch(error => console.error(error))
})