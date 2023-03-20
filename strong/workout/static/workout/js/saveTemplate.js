let saveButton = document.querySelector("#save")
let url = saveButton.getAttribute("data-url")
let input = document.querySelector("#template-name")

function redirectUrl(a){
    console.log(a)
}

input.addEventListener('input', () => {
    const value = input.value;
    const pattern = /^[^\s]+(\s+[^\s]+)*$/; // regex pattern to allow only non-empty spaces

    if (!pattern.test(value)) {
      input.value = value.trim(); // remove empty spaces at the beginning of the input
    }
  });


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
saveButton.addEventListener("click",function(){
    let templateName = input.value
    if(Object.keys(selectedExercise).length !== 0 && templateName.length !== 0 ){
        let data = {
            "template-name":templateName,
            "selected-exercise":selectedExercise
        }
        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'x-CSRFToken':csrftoken
            },
            body:JSON.stringify(data)
            })
            .then( res => {
                console.log(res.status)
                if(res.ok){
                    window.location.href = "/workouts"
                }
                else{
                    throw new Error('Network response was not ok.')
                }
            })

            .catch( error => {
                console.log(error)
            })
    }
    else{
        if(templateName.length == 0)
            alert("Enter a Template name")
    }
})

