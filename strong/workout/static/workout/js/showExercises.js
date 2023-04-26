
let fetchData = {} // variable to store fetched  exercise data
const selectExerciseWrap =  document.querySelector(".select-exercise-wrap")

// function to create each exercises in list 
let allExercises = document.querySelector(".all-exercises")
// add event listener to allExcercise div to select each excercise if the user click on an excercise
allExercises.addEventListener('click',function(e){
    const clickedExcercise = e.target.closest('.select-exercise-content')
    if(clickedExcercise){
        console.log("hey")
        select.bind(clickedExcercise)()
        console.log(fetchData)
    }
})

function createExerciseList(i){
    let selectExerciseContent = document.createElement("div")
    selectExerciseContent.classList.add("select-exercise-content")
    selectExerciseContent.setAttribute("data-exercise",i.id)
    selectExerciseContent.setAttribute("data-exerciseName",i.name)
    selectExerciseContent.setAttribute("data-body-part",i.body_part)
    selectExerciseContent.setAttribute("data-category",i.category)
    selectExerciseContent.setAttribute("data-selected","false")
    // selectExerciseContent.addEventListener('click',select) // select funtion is defined in main.js file
    let image = document.createElement("img")
    if(i.is_custom){
        image = document.createElement('div')
        image.classList.add('custom-excercise-logo')
        image.innerHTML =`<span>${i.name.slice(0,1)}</span>`
    }
    else{
        image.src = i.image_url;
        image.alt = "Exercise image..";
        image.height = 60;
        image.width = 60;
        image.setAttribute("data-image","/static/workout/img/tick.jpg'")  // data-image attribute is used by select function to change the image when an exercise is selected
    }



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
        filterConstraints.count = fetchData.length
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


// all filter related functions ----------------------------------------

    let exercises = allExercises.getElementsByClassName('select-exercise-content')
    let filterConstraints ={
        'name':"",
        'body_part':{},
        'category':{},
        'count':""
    }


    const appliedFilters = document.getElementById("applied-filters")
    let allAppliedFilters = {}
    // gets all the body part filtering buttons
    const filterBodyParts = document.getElementById('body-parts')
    const filterBodyPartsButtons = filterBodyParts.getElementsByTagName('button')

    // gets all the category filtering button
    const filterCategory = document.getElementById('category')
    const filterCategoryButtons = filterCategory.getElementsByTagName('button')

    // add event listener to body p
    for(let btn of filterBodyPartsButtons){
        btn.addEventListener('click',function(){
            const bodyPart = this.innerHTML
            if(this.classList.contains('selected-filter')){
                delete filterConstraints.body_part[bodyPart]
                // remove this elemtn form DOM
                allAppliedFilters[bodyPart].remove()
                delete allAppliedFilters[bodyPart]
                this.classList.remove('selected-filter')
            }
            else{
                this.classList.add('selected-filter')
                const span = document.createElement('span')
                span.innerHTML = `${bodyPart}<i class="fas fa-x"></i>`
                span.getElementsByTagName('i')[0].addEventListener('click',function(){
                    delete filterConstraints.body_part[bodyPart]
                    allAppliedFilters[bodyPart].remove()
                    delete allAppliedFilters[bodyPart]
                    this.classList.remove('selected-filter')
                    searchExercise()
                }.bind(this))
                allAppliedFilters[bodyPart] = span
                appliedFilters.append(span)
                filterConstraints.body_part[bodyPart] = bodyPart
            }
            searchExercise()
        })
    }

    // gets all the category filtering button
    for(let btn of filterCategoryButtons){
        btn.addEventListener('click',function(){
            const category = this.innerHTML
            // check if this button is already selected
            if(this.classList.contains('selected-filter')){
                delete filterConstraints.category[category]
                this.classList.remove('selected-filter')
                // remove this elemtn form DOM
                allAppliedFilters[category].remove()
                delete allAppliedFilters[category]
            }
            else{
                const span = document.createElement('span')
                span.innerHTML = `${category}<i class="fas fa-x"></i>`
                span.getElementsByTagName('i')[0].addEventListener('click',function(){
                    delete filterConstraints.category[category]
                    allAppliedFilters[category].remove()
                    delete allAppliedFilters[category]
                    this.classList.remove('selected-filter')
                    searchExercise()
                }.bind(this))
                allAppliedFilters[category] = span
                appliedFilters.append(span)

                this.classList.add('selected-filter')
                filterConstraints.category[category] = category
            }
            searchExercise()
        })
    }
    //set count to the number of objects in exercises object
    // event listener to trigger search excercise
    const searchInput = document.getElementById('search-input')
    const addExcerciseSearchButton = document.getElementById('search-button')
    addExcerciseSearchButton.addEventListener('click',function(){
        // shows search input field
        searchInput.parentElement.style.display = 'inline'
        // hides search button
        this.style.display = 'none'
        searchInput.addEventListener('input',searchExercise)
        searchInput.focus()
    })

    // search exercise 
    function searchExercise(){
        if(this.tagName === 'INPUT'){
            filterConstraints.name = this.value
        }
        filterConstraints.count = exercises.length
        for(let i of exercises){
            let exerciesname = i.getAttribute('data-exercisename').toLowerCase()
            let bodyPart = i.getAttribute('data-body-part')
            let category = i.getAttribute('data-category')
            if(exerciesname.indexOf(filterConstraints.name.toLowerCase()) !== -1 && checkBodypart(bodyPart) && checkCategory(category)){
                i.style.display ="flex"
            }
            else{
                filterConstraints.count -=1
                i.style.display ="none"
            }
        }
        filterTitle.innerHTML = `Filter(${filterConstraints.count})`
    }

    // function to check if a category is already in filter Constrains
    function checkCategory(category){
        let categoryObject = filterConstraints.category
        if(Object.keys(categoryObject).length === 0){
            return true
        }
        else{
            if(categoryObject.hasOwnProperty(category)){
                return true
            }
            else{
                return false
            }
        }
    }
    // function to check if a body part is already in filter Constrains
    function checkBodypart(bodypart){
        let bodyPartObject = filterConstraints.body_part
        if(Object.keys(bodyPartObject).length === 0){
            return true
        }
        else{
            if(bodyPartObject.hasOwnProperty(bodypart)){
                return true
            }
            else{
                return false
            }
        }
    }

    // filter exercises using bodypart  and category
    const filterControlButtons = document.getElementById('filter-control-buttons')
    // select the h2 tag that shows number of filtered exercise
    const filterTitle = document.getElementById('filter-title')
    const filterButton = document.getElementById('filter-button')
    //
    filterButton.addEventListener('click',function(){
        const closeFilter = document.getElementsByClassName('close-filter')
        selectExerciseWrap.style.display="none"
        filterControlButtons.style.display="block"
        function closethis(){
            selectExerciseWrap.style.display="block"
            filterControlButtons.style.display="none"
            this.removeEventListener('click',closethis)
        }
        closeFilter[0].addEventListener('click',closethis)
        closeFilter[1].addEventListener('click',closethis)
    })


// all filter related functions  ENDS  --------------------------------


