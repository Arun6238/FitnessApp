let divElements = document.querySelectorAll('.exercise-container')
let exerciseWrap = document.getElementById("exercise-wrap")

function aboutExercise(){
    let url = this.getAttribute('data-url')
    console.log(url)
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
        currentPage++;
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
            console.log(currentPage)
            console.log(data.data)
            data.data.exercises.forEach(exercise => {
                const exerciseContainer = document.createElement('div')
                exerciseContainer.classList.add('exercise-container')
                exerciseContainer.setAttribute('data-url',`/exercises/about-exercise/${exercise.id}`)
                exerciseContainer.innerHTML = `<img src="${exercise.image_url}" alt="${exercise.name} logo" height="50px width="50px">
                <div class="exercise-inner-container">
                    <h4>${exercise.name}</h4>
                    <p>${exercise.body_part}</p>
                </div>`
                exerciseContainer.addEventListener('click',function(){
                    aboutExercise.bind(this)()
                })
                exerciseWrap.append(exerciseContainer)
            })
        }
        else{
            hasNext = false
            console.log('some thing went wrong...')
        }
    })
    .catch(e => console.log(e))
}