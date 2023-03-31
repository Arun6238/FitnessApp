
let selectedExercise = {}
let exerciseSelect = document.querySelector(".exercise-select")

// funtion for selecting exerccises for new template
function select(){
    let id = this.getAttribute("data-exercise")
    let img = this.firstElementChild

    // select the exercise and add it to selected exercise object
    if (this.getAttribute("data-selected") == "false"){
        this.setAttribute("data-selected","true") 
        img.setAttribute("data-image",this.firstElementChild.src)
        // link of tick image
        img.src = "/static/workout/img/tick.jpg"
        this.style.backgroundColor = "#7fcdfe85"
        selectedExercise[id] = [this.getAttribute("data-exercise"),this.getAttribute("data-exerciseName")]
		selectedExercise[id] = {
			"id":id,
			"name":this.getAttribute("data-exerciseName"),
			"set" :1
		}
			
    }
    // unselect an exercise and remove it from selected exercise
    else{
        this.setAttribute("data-selected","false")
        img.src = this.firstElementChild.getAttribute("data-image")    
        this.style.backgroundColor = "inherit" 
        delete selectedExercise[id]   
    }

    // check if selectedExercise dictionary have any value
    if(Object.keys(selectedExercise).length){
        exerciseSelect.style.display = "inline" //display the exercise select button
    }
    else{
        exerciseSelect.style.display = "none"
    }
}

let selectedExerciseDiv = document.querySelector(".selected-exercise")
exerciseSelect.addEventListener("click",addSelectedExercise)

function addSet(table,i){
	selectedExercise[i]["set"] += 1
	tr = createTableRow(selectedExercise[i]["set"])
	table.append(tr)
}


function addSelectedExercise(){
    {
        // removes all the children before adding selected exercise to selectedExerciseDiv
        selectedExerciseDiv.innerHTML = ""
    
        for(let i in selectedExercise){
              let heading = document.createElement("h3")
              heading.innerText=selectedExercise[i]["name"] //"selectedExercise[i]["name"]" is exercise name
    
              let table = document.createElement("table")
              table.classList.add("selected-exercise-table")
    
            //   creates first row of table
              let fisrtRow = (function(){
                let tr = document.createElement('tr')
                tr.append(createTh("SET"))
                tr.append(createTh("PREVIOUS"))
                tr.append(createTh("KG"))
                tr.append(createTh("REPS"))
            
                return tr
            })()
            
                
              // button to add set
              let button  = document.createElement("button")
              button.addEventListener('click',function(){
                addSet(table,i)
              })
              button.innerHTML ="ADD SET"
              button.classList.add('add-set')
    
    
              table.append(fisrtRow)
              let set = selectedExercise[i]["set"]
              for(let i=1; i<=set;i++){
                table.append(createTableRow(i))
              }
    
              selectedExerciseDiv.append(heading)
              selectedExerciseDiv.append(table)
              selectedExerciseDiv.append(button)
    
            
        }
        toggleAddExercise()
    }
}
// This function creates and returns a new table header element with the specified text content
function createTh(txt){
  let th = document.createElement('th')
  th.innerText = txt
  return th
}

// This function creates and returns a new Table Data Cell element with the specified text content
function createTd(txt){
  let td = document.createElement('td')
  td.append(txt)
  return td
}

// this function create the first row for each selected exerxise
function createTableRow(set){
    let tr = document.createElement('tr')
	let td = createTd(set) //this column display the number of set
	td.style.color= "#0092cb"
    tr.append(td)
    tr.append(createTd("-"))

	let inp = document.createElement("input")
  inp.classList.add("selected-exercise-input")
	inp.readOnly = true
    tr.append(createTd(inp))

	let inp2 = document.createElement("input")
	inp2.readOnly = true
  inp2.classList.add("selected-exercise-input")
    tr.append(createTd(inp2))
	return tr
}

