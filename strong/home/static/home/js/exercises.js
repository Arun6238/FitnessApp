let divElements = document.querySelectorAll('.exercise-container')
let exerciseWrap = document.getElementById("exercise-wrap")
let allFetchedExercise = []

// check if the browser support Intersection Observer

if(!('IntersectionObserver' in window)){
    // the browser dosent support IntersectionObserver, so we need to load the polyfill
    let polyfill = document.createElement('script')
    polyfill.src = "https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver"
    document.head.appendChild(polyfill)
}

// redirect to about exercise page
function aboutExercise(){
    let url = this.getAttribute('data-url')
    window.location.href = url;
}
divElements.forEach((div)=>{
    div.addEventListener('click',function(){
        aboutExercise.bind(this)()
    })
})

// IntersectionObserver observe changes in the intersection of an HTML element with its containing parent element or viewport.
const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const imageContainer = entry.target
            const image = imageContainer.lastElementChild
            const placeHolder = imageContainer.firstElementChild

            const src = image.getAttribute('data-src')
            // loads the image before assigning it to image tag
            let tempImage = new Image();
            tempImage.onload = function() {
                // after image is loaded assign the image to image tag
                image.src = this.src;
                //hide the place holder
                placeHolder.classList.add('lazy-loading')
                //diplay the image tag
                image.classList.remove('lazy-loading')
            };
            tempImage.src = src
            imageObserver.unobserve(image)
        }
    })
})

function loadPage(pageNumber){
    // featch all the exercises form server
    fetch("/exercises/",{
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data =>{
        //check if all the exercises are succesfully retrived
        if(data.status == 'success'){
            // assign all the exercise to this variable
            // retrive each  exercise data from allFetchedExerise
            data.data.exercises.forEach(exercise => {
                // check if exercise is a custom exercise
                const exerciseContainer = document.createElement('div')
                exerciseContainer.classList.add('exercise-container')
                exerciseContainer.setAttribute('data-url',`/exercises/about-exercise/${exercise.id}`)
                // check if the exercise is a custome exercise
                if(exercise.is_custom){
                    // if exercise is a custom exercise a custom logo is added
                    exerciseContainer.innerHTML =
                    `<div class="custom-excercise-logo">
                        <span>${exercise.name.slice(0,1)}</span>
                    </div>
                    <div class="exercise-inner-container">
                        <h4>${exercise.name}</h4>
                        <p>${exercise.body_part}</p>
                    </div>`
                }
                else{
                    exerciseContainer.innerHTML = 
                        `<div class="lazy">
                            <div class="custom-excercise-logo">
                                <span>${exercise.name.slice(0,1)}</span>
                            </div>
                            <img data-src="${exercise.image_url}" class="lazy-loading" alt="${exercise.name} logo" height="50px width="50px">
                        </div>
                        <div class="exercise-inner-container">
                            <h4>${exercise.name}</h4>
                            <p>${exercise.body_part}</p>
                        </div>`
                }
                exerciseContainer.addEventListener('click',function(){
                    aboutExercise.bind(this)()
                })
                allFetchedExercise.push({
                    'name':exercise.name,
                    'body_part':exercise.body_part,
                    'category':exercise.category,
                    'element':exerciseContainer
                })
                exerciseWrap.append(exerciseContainer)
            })
            //set total number of available exercise
            filterConstrains.count = allFetchedExercise.length
            document.querySelectorAll(".lazy").forEach(img => {
                imageObserver.observe(img);
            })
        }
    })
    .catch(e => console.log(e))
}
loadPage()


// code for filtering exercise

let filterConstrains = {
    'name':"",
    'category':{},
    'body_part':{},
    'count':0
}

const searchInput = document.getElementById("search-input")
const filterButton = document.getElementById("filter-button")
const createExerciseButton = document.getElementById('create-custom-exercise')

const filterControlButtons = document.getElementById("filter-control-buttons")
const filterTitle = document.getElementById('filter-title')
// buttons for hiding filter control buttons
const closeFilter = document.getElementsByClassName('close-filter')

// get all the button for filtering with body part
const bodyParts = document.getElementById('body-parts')
const bodyPartButtons = bodyParts.getElementsByTagName('button')
// get all the button for filtering with category
const category = document.getElementById('category')
const categoryButtons = category.getElementsByTagName('button')

// create exercise form
const createExerciseForm = document.getElementById('custom-exercise-form')
const customExerciseFormClose = document.getElementById('custom-exercise-form-close')

// object to store all the applied filters
let allAppliedFilters = {}
// applied filter container
const appliedFilters = document.getElementById('applied-filters') 

searchInput.addEventListener('input',function(){
    filterConstrains.name = this.value
    filterExercise()
})

// add event to all body patrs buttons
for(let i of bodyPartButtons){
    i.addEventListener('click',()=>{
        const body_part = i.innerText
        // check if the button is already selected
        if(i.classList.contains('selected-filter')){
            i.classList.remove('selected-filter')
            allAppliedFilters[body_part].remove()
            delete allAppliedFilters[body_part]
            delete filterConstrains.body_part[body_part]
        }
        else{
            const span = document.createElement('span')
            span.innerHTML = `${body_part}<i class="fas fa-x"></i>`
            span.getElementsByTagName('i')[0].addEventListener('click',function(){
                delete filterConstrains.body_part[body_part]
                allAppliedFilters[body_part].remove()
                delete allAppliedFilters[body_part]
                this.classList.remove('selected-filter')
                filterExercise()
            }.bind(i))
            i.classList.add('selected-filter')
            allAppliedFilters[body_part] = span
            filterConstrains.body_part[body_part] = body_part
            appliedFilters.append(span)
        }
        filterExercise()
    })
}
// add event to all category
for(let i of categoryButtons){
    i.addEventListener('click',()=>{
        const category = i.innerText
        // check if the button is already selected
        if(i.classList.contains('selected-filter')){
            i.classList.remove('selected-filter')
            allAppliedFilters[category].remove()
            delete allAppliedFilters[category]
            delete filterConstrains.category[category]
        }
        else{
            const span = document.createElement('span')
            span.innerHTML = `${category}<i class="fas fa-x"></i>`
            span.getElementsByTagName('i')[0].addEventListener('click' ,function(){
                delete filterConstrains.category[category]
                allAppliedFilters[category].remove()
                delete allAppliedFilters[category]
                this.classList.remove('selected-filter')
                filterExercise()
            }.bind(i))
            i.classList.add('selected-filter')
            filterConstrains.category[category] = category
            appliedFilters.append(span)
            allAppliedFilters[category] = span
        }
        filterExercise()
    })
}

// shows all the filter buttons
filterButton.addEventListener('click',function(){
    filterTitle.innerHTML = `Filter(${filterConstrains.count})`
    filterControlButtons.style.display = "block"
    exerciseWrap.style.display = "none"
    // function to hide  filterControll buttons
    function closeFilterControl(){
        filterControlButtons.style.display = "none"
        exerciseWrap.style.display = "block"

        closeFilter[0].removeEventListener('click',closeFilterControl)
        closeFilter[1].removeEventListener('click',closeFilterControl)
    }
    closeFilter[0].addEventListener('click',closeFilterControl)
    closeFilter[1].addEventListener('click',closeFilterControl)

})



// function to create new exercise
createExerciseButton.addEventListener('click',function(){
    createExerciseForm.style.display = "block"
    exerciseWrap.style.display = "none"
    customExerciseFormClose.addEventListener('click',function closeThis(){
        createExerciseForm.style.display = "none"
        exerciseWrap.style.display = "block"
        this.removeEventListener('click',closeThis)
    })
})

createExerciseForm.addEventListener('submit',function(e){
    e.preventDefault()
    fetch('create-custome-exercise',{
        method:'POST',
        body:new FormData(this)
    })
    .then(res => res.json())
    .then(data => {
        if(data.status == 'success'){
            location.reload()
        }
        else{
            alert(data.message)
        }
    })
    .catch(e => console.log(e))
    this.reset()
})
// filters out all the exercise satisfieng all the constrains
function filterExercise(){
    // set length of allFetchedExercise as count
    filterConstrains.count =  allFetchedExercise.length
    allFetchedExercise.forEach(exercise => {
        const exerciseName = exercise.name.toLowerCase()
        const bodyPart = exercise.body_part
        const category = exercise.category
        
        // check if filter constrain name is a substring of exercise name 
        const condition1 = exerciseName.indexOf(filterConstrains.name.toLowerCase()) !== -1
        if(condition1 && checkBodyPart(bodyPart) && checkCategory(category)){
            exercise.element.style.display = "flex"
        }
        else{
            exercise.element.style.display = "none"
            filterConstrains.count--;
        }
    })
    filterTitle.innerHTML = `Filter(${filterConstrains.count})`
}

function checkBodyPart(bodypart){
    let bodyPartObject = filterConstrains.body_part
    if(Object.keys(bodyPartObject).length === 0){
        return true
    }
    if(bodyPartObject[bodypart])
        return true
        
    return false
        
}
function checkCategory(category){
    let categoryObject = filterConstrains.category
    if(Object.keys(categoryObject).length === 0){
        return true
    }
    if(categoryObject[category])
        return true
        
    return false
        
}
