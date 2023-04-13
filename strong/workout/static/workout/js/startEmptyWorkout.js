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

// function to ensure  an inputfiled only accept positive integers
let selectExerciseInput = document.querySelectorAll(".selected-exercise-input")
selectExerciseInput.forEach((inp) => {
	inp.addEventListener('input',function(){
		validateInputField.bind(this)()
		handleInputFieldChange.bind(this)()
	
	})
})
function validateInputField(){
		let value = this.value;
		// Remove any non-digit characters from the input
		value = value.replace(/[^0-9.]/g, "");
		
		// Ensure that the input is not empty and is a positive integer
		if (value !== "" && parseInt(value) >= 0) {
		  this.value = value;
		} else {
		  this.value = "";
		}
}
// check  for updates each rows input fields
window.onload = function(){
	const trs = document.querySelectorAll('.saved-row')
	trs.forEach(tr =>{
		let tds = tr.querySelectorAll('td')
		let inp1 = tds[2].querySelector('input')
		let inp2 = tds[3].querySelector('input')
		let button = tds[4].querySelector('button')

		if(Number(inp1.value) != Number(inp1.getAttribute('data-init-value')) ||
		Number(inp2.value) != Number(inp2.getAttribute('data-init-value'))){
			tr.classList.add('update-row')// background color for this class is set as !important in css
			tr.classList.add('un-saved')// background color for this class is set as !important in css
			button.classList.add('update-btn')
		}
		else{
			tr.classList.remove('update-row')
			tr.classList.remove('un-saved')
			button.classList.remove('update-btn')
			
		}
	})
}
function handleInputFieldChange(){
	let tr = this.closest('tr')
	let td = tr.querySelectorAll('td')
	let button = td[4].querySelector('button')
	let inp2  = td[2].querySelector('input')
	// check if the input that called this funciton and inp2 are same
	if( inp2 == this){
		// if both are same assign new value to inp2
		inp2 = td[3].querySelector('input')
	}

	if(tr.classList.contains('saved-row')){
		// check if any of the input's value changed
		if(Number(this.value) != Number(this.getAttribute('data-init-value')) || Number(inp2.value) != Number(inp2.getAttribute('data-init-value'))){
			tr.classList.add('update-row')// background color for this class is set as !important in css
			tr.classList.add('un-saved')// background color for this class is set as !important in css
			button.classList.add('update-btn')
		}
		else{
			tr.classList.remove('update-row')
			tr.classList.remove('un-saved')
			button.classList.remove('update-btn')
			
		}
	}
}

// function to return csrf token
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
// function to save selected exercise
selectExerciseButton.addEventListener("click",function(){
	let url = this.getAttribute("data-url")
	let data = {
		exercises:showExercise.selectedExercise,
		workoutSessionId:this.getAttribute('data-workout-session-id')
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
	.then(res =>res.json())
	.then(data =>{
		if(data.status == "error"){
			alert(data.message)
		}
		else if(data.status == "success"){
			window.location.href = redirectUrl
		}
	})
	.catch(error => console.error(error))
})

// funciton to save each sets to database
let saveRowButton = document.querySelectorAll(".save-row-button")
saveRowButton.forEach(btn =>{
	btn.addEventListener("click",clickFuncion)
})
function clickFuncion(){
	const tr = this.closest('tr');
	const tds = tr.querySelectorAll('td')
	const weightInput = tds[2].querySelector('input')
	const repsInput = tds[3].querySelector('input')
	const btn = tds[4].querySelector('button')
	if(weightInput.value !=="" && repsInput.value !== ""){
		if(Number(weightInput.getAttribute("data-init-value")) == Number(weightInput.value) && Number(repsInput.getAttribute("data-init-value")) == Number(repsInput.value)){
			console.log("no change detected")
		}
		else{
			const set = {
				exercise_session:tr.closest('table').getAttribute("data-exercise-session"),
				set_number:tds[0].textContent,
				weight:weightInput.value,
				reps: repsInput.value
			}	
			const url = tr.closest('table').getAttribute("data-url")
			const options = {
				method:'POST',
				headers:{
					'Content-Type':'Application/json',
					'x-CSRFToken':csrftoken
				},
				body:JSON.stringify(set)
			}
			fetch(url,options)
			.then(res => res.json())
			.then (data => {
				if(data.status == 'success'){
					console.log("working fine")
					weightInput.setAttribute("data-init-value",set.weight)
					repsInput.setAttribute("data-init-value",set.reps)
					tr.classList.add('saved-row')
					if(tr.classList.contains('update-row')){
						tr.classList.remove('update-row')
					}
					if(btn.classList.contains('update-btn')){
						btn.classList.remove('update-btn')
					}
					btn.classList.add('saved-btn')
				}
				else if(data.status == 'warning'){
					alert(data.message)
				}
				else{
					console.log(`${data.status} : ${data.message}`)
				}
			})
			.catch(error => console.log(error))
		}
	}
	else{
		alert("Enter weight and Reps")
	}

}
// selected-exercise-input

// function to add set to each exercises
const addSetButton  = document.querySelectorAll('.add-set')
addSetButton.forEach(btn => {
	btn.addEventListener("click",function(){
		let table = null;
		let prevSibling = this.previousSibling;
		while(prevSibling){
			if(prevSibling.nodeName === "TABLE"){
				table = prevSibling
				break
			}
			prevSibling = prevSibling.previousSibling
		}
		const lastRow = table.rows[table.rows.length - 1]
		if(lastRow.classList.contains('saved-row')){

			let setNo = Number(lastRow.querySelector('td').textContent) //content of first column as a number
			let data = {
				exercise_session:table.getAttribute("data-exercise-session"),
				set: setNo+1,
			}

			const newRow = document.createElement('tr');

			let button = document.createElement("button")
			button.innerHTML = "<i class='fa fa-check' aria-hidden='true'></i>"
			button.classList.add('save-row-button')

			// adding click funtion to this button
			button.addEventListener("click",clickFuncion)
			// first td of each row
			let td = createTd(setNo+1)
			td.style.color="#0092cb"
			// class un-saved is used to identify the unsaved row
			newRow.classList.add('un-saved')
			newRow.append(td)
			newRow.append(createTd("-"))
			newRow.append(createTd(createInput("weight")))
			newRow.append(createTd(createInput("reps")))
			newRow.append(createTd(button))
			table.append(newRow)

		}
		else{
			alert("please complete or save the previous set before adding new one")
		}
	})
})
// only used by funtion to add set
function createTd(txt){
	let td = document.createElement('td')
	td.append(txt)
	return td
  }

// only used by funtion to add set
function createInput(name){
	let inp = document.createElement("input")
	inp.classList.add("selected-exercise-input")
	inp.setAttribute("data-init-value","")
	inp.setAttribute("name",name)
	inp.addEventListener('input',function(){
		validateInputField.bind(this)()
		handleInputFieldChange.bind(this)()
	
	})
	return inp
}
// restric input field to have empty spaces as first charecter
function restrictLeadingSpace(event) {
	const inputValue = event.target.value;
	if (inputValue.charAt(0) === " ") {
	  event.target.value = inputValue.trimStart();
	}
  }
// function to rename an empty workout sesson
let workoutSessionNameElement = document.getElementById('workout-name')
workoutSessionNameElement.addEventListener('click',function(){
	const inp = document.createElement('input')
	inp.value = this.innerText
	inp.id = this.id

	// replace heading element with input element to edit the workout session name
	this.replaceWith(inp)
	inp.focus()
	inp.addEventListener('input',restrictLeadingSpace)

	inp.addEventListener('blur',function replace(){
		//save input field value as new name 
		let newName = this.value
		if(newName != workoutSessionNameElement.innerText){
			if(newName.length != 0){
				workoutSessionNameElement.innerText = newName
				sessionID = workoutSessionNameElement.getAttribute('data-workout-session-id')
				fetch(`/workout/rename-empty-workout?id=${sessionID}&name=${newName}`)
				.then(res => {
					if(res.ok){
						return res.json()
					}
					else{
						console.log('something went wrong')
					}
				})
				.then(data => {
					if(data.status == 'success'){
						console.log(data.message)
					}
					else	
						console.log(data.messsage)
				})
				.catch(error =>{
					console.log(error)
				})
			}
		}
		this.replaceWith(workoutSessionNameElement)
		this.removeEventListener('blur',replace)
	})
})
// function to finish workout
const finishButton = document.querySelector("#finish")
const conformation = document.querySelector('.confirmation')
finishButton.addEventListener('click',function(){
	conformation.style.display= "block"
})

function finishWorkoutSession(){
		const data = {
			workout_session_id:this.getAttribute('data-workout-session-id')
		}
		console.log(data)
		const url = '/workout/finish-workout-session' // finish workout view function url 
		console.log(url)
		const options = {
			method:'POST',
			headers:{
				'Content-Type':'Application/json',
				'x-CSRFToken':csrftoken
			},
			body:JSON.stringify(data)
		}
		fetch(url,options)
		.then(res => res.json())
		.then(data => {
			if(data.status == 'success'){
				alert(data.message)
				window.location.href= "/workouts"
			}
			else if(data.status == 'alert'){
				alert(data.message)
			}
			else if(data.status == 'warning'){
				alert(data.message)
			}
			else{
				console.log(`${data.error}: ${data.message}`)
			}
		})
}
// hide conformation block
document.querySelector("#cancel-confirmation-button").addEventListener('click',function(){
	conformation.style.display= "none"
})

document.querySelector("#confirm-button").addEventListener('click',finishWorkoutSession)
// // function to retrive each rows data as a object eg: { exercise_session: "1", set_number: "4", weight: "10", reps: "11" }
// function getSetData(obj){
// 	const tds = obj.querySelectorAll('td')
// 	let setData = {
// 		exercise_session:obj.closest('table').getAttribute("data-exercise-session"),
// 		set_number:tds[0].textContent,
// 		weight:tds[2].querySelector('input').value,
// 		reps:tds[3].querySelector('input').value
// 	}
// 	return setData
	
// }

// function to cancel workout

cancelWorkoutButton = document.getElementById("cancelWorkout")
cancelWorkoutButton.addEventListener('click',function(){
	const workout_session_id = this.getAttribute('data-id')
	url = `/workout/cancel-workout/${workout_session_id}`
	fetch(url)
	.then(res => {
		if (res.ok){
			return res.json()
		}
		else{
			alert('some thing went wrong')
		}
	})
	.then(data =>{
		if(data.status == 'success'){
			alert('workout session removed successfully..')
			const buttons = document.getElementsByClassName('btn-to-disabled')
			for(let i of buttons){
				i.disabled = true
			}
			window.location.href = '/workouts'
		}
		else if(data.status == 'alert'){
			alert(data.message)
		}
	})
})