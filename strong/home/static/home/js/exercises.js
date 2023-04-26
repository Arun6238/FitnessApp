let divElements = document.querySelectorAll('.exercise-container')
let exerciseWrap = document.getElementById("exercise-wrap")

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
let currentPage = 2
let hasNext = true
window.addEventListener('scroll', () => {
    // Check if the user has scrolled to the bottom of the page
    if (hasNext && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        // Load the next page of data
        loadPage(currentPage);
    }
});

function loadPage(pageNumber){
    if(!hasNext){
        return
    }
    fetch(`/exercises/?page=${pageNumber}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data =>{
        if(data.status == 'success'){
            hasNext = data.has_next
            data.data.exercises.forEach(exercise => {
                // check if exercise is a custom exercise
                const exerciseContainer = document.createElement('div')
                if(exercise.is_custom){
                    exerciseContainer.classList.add('exercise-container')
                    exerciseContainer.setAttribute('data-url',`/exercises/about-exercise/${exercise.id}`)
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
                    exerciseContainer.classList.add('exercise-container')
                    exerciseContainer.setAttribute('data-url',`/exercises/about-exercise/${exercise.id}`)
                    exerciseContainer.innerHTML = `<img src="${exercise.image_url}" alt="${exercise.name} logo" height="50px width="50px">
                    <div class="exercise-inner-container">
                        <h4>${exercise.name}</h4>
                        <p>${exercise.body_part}</p>
                    </div>`
                }
                exerciseContainer.addEventListener('click',function(){
                    aboutExercise.bind(this)()
                })
                exerciseWrap.append(exerciseContainer)
            })
        }
    })
    .catch(e => console.log(e))
}
