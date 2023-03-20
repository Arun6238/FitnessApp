
let fetchData = {} // variable to store fetched  exercise data

// function to create each exercises in list 
let allExercises = document.querySelector(".all-exercises")
function createExerciseList(i){
    let selectExerciseContent = document.createElement("div")
    selectExerciseContent.classList.add("select-exercise-content")
    selectExerciseContent.setAttribute("data-exercise",i.id)
    selectExerciseContent.setAttribute("data-exerciseName",i.name)
    selectExerciseContent.setAttribute("data-selected","false")
    selectExerciseContent.addEventListener('click',select) // select funtion is defined in main.js file

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

    allExercises.appendChild(selectExerciseContent)
    
}

// funtion to hide AND display select-exercise block and container 
function toggleAddExercise(){
    let selectExerciseWrap =  document.querySelector(".select-exercise-wrap")
    let container = document.querySelector(".container")
    if(selectExerciseWrap.style.display == "block" && container.style.display == "none"){
        // hides  seletct exercise 
        selectExerciseWrap.style.display = "none"
        container.style.display = "block"
    }
    else{
        // hides new workout termplate
        selectExerciseWrap.style.display = "block"
        container.style.display = "none"

    }
    
}

document.querySelector("#addExercise").addEventListener('click',function(){
    // use to display add-exercies
    toggleAddExercise()
    // check if data already feched
    for(i in fetchData){
        // shows fetched data 
        for(let i of fetchData){
            createExerciseList(i)
        }
        return
    }

    let url = "/workout/show-all-exercises" //view function url for 
    fetch(url)
    .then(response => response.json())
    .then(data =>{
        fetchData = data.exercises
        for(let i of fetchData){
            createExerciseList(i)
        }
    })
    .catch(error => {
        console.log(error)
    })

})

// funciton to close the add exercise page-block
document.querySelector(".close-add-exercises").addEventListener("click",addSelectedExercise
)




