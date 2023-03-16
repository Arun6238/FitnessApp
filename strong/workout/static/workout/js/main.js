
let selectedExercise = {}
let exerciseSelect = document.querySelector(".exercise-select")

// funtion for selecting exerccises for new template
function select(){
    let id = this.getAttribute("data-exercise")
    let img = this.firstElementChild

    if (this.getAttribute("data-selected") == "false"){
        this.setAttribute("data-selected","true") 
        img.setAttribute("data-image",this.firstElementChild.src)
        img.src = "/static/workout/img/tick.jpg"
        this.style.backgroundColor = "#7fcdfe85"
        selectedExercise[id] = this.getAttribute("data-exercise")
    }
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

const csrftoken = getCookie('csrftoken');  // get the CSRF token from a cookie
let url = document.querySelector(".select-exercise-wrap").getAttribute("data-url")
exerciseSelect.addEventListener("click",(event) =>{
    event.preventDefault();
    console.log(url)
    fetch(url,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken  // include the CSRF token in the request headers
        },
        body:JSON.stringify(selectedExercise)
    })
    .then( res => {
        console.log(res.status)
        if(res.ok){
            
            return res.json()
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        document.querySelector(".head").innerHTML = data.message
        console.log(data)
    })
    .catch( error => {
        console.log(error)
    })
})