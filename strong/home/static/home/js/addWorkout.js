// funciton to start an empty workout
let button = document.querySelector("#start-empty-workout")
button.addEventListener('click',function(){
    window.location.href = this.getAttribute('data-url')
})






// function to cancle confirmation 
const cancelConfirmation = document.querySelector('#cancel-confirmation-button')
cancelConfirmation.addEventListener('click',function(){
    document.querySelector('.confirmation').style.display = "none"
})







// edit a template 
function editTemplate(){
    alert('this option is not avaliable')
}





const renameTemplateTab = document.getElementById('rename-template')
// button to rename a template
const renameTemplateButton  = document.getElementById("confirm-rename-template")
const renameTemplateInput = document.getElementById("rename-template-input")
// functiopn to hide renam tab
function hideRenameTab(){
    renameTemplateTab.style.display = 'none'
    cover_all.style.display = 'none'
}
// rename a template
function renameTemplate(){
    renameTemplateTab.style.display = 'block'
    const id = this.parentElement.getAttribute('data-template-id')
    function preventLeadingSpace(event) {

        let inputField = event.target; // Get the input field element
        // Check if the first character is a space
        if (inputField.value[0] === ' ') {
          inputField.value = inputField.value.trimStart(); // Remove the leading space
        }
      }
    // add a function to prevent user form inputting space as first charecter
    renameTemplateInput.addEventListener("input", preventLeadingSpace);
    renameTemplateButton.addEventListener('click',function rename(){
        let newName = renameTemplateInput.value;
        if(newName.trim() == ""){
            renameTemplateInput.ariaPlaceholder = "Enter a valid name";
            renameTemplateInput.style.border = "2px red solid"
        }
        else{
            url = `workout/rename-template/${id}/${newName}`
            fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data.status == 'success'){

                    // select the corresponding heading and change it to new one
                    const headingId = `i${id}`
                    document.getElementById(headingId).innerText = newName

                    renameTemplateInput.removeEventListener("input", preventLeadingSpace)
                    this.removeEventListener('click',rename)
                    // if the name is changed hide the tab
                    hideRenameTab()
                }
                else{
                    alert(data.message)
                }
            })
        }
    })

}






// delete a template
function deleteTemplate(){
    // collect the id of temmplate from parent ul element
    const id = this.parentElement.getAttribute('data-template-id')
    // url of view function to delete a template
    url = `/workout/delete-template/${id}`
    fetch(url)
    .then(res => res.json())
    .then(data => {
        if(data.status == 'success'){
            this.closest(".my-template-content").remove()
            cover_all.style.display = 'none'
        }
        else if(data.status == 'warning'){
            alert(data.message)
            cover_all.style.display = 'none'
        }
        else{
            alert('Could not remove template..')
            cover_all.style.display = 'none'
        }
    })
    .catch(e => console.log(e))

}






// div to cover the whole screen
const cover_all = document.getElementById('cover-all')
// function to manage drop down of all templates
const drop = document.getElementsByClassName('drop')
for (let i = 0; i < drop.length; i++) {
    drop[i].addEventListener('click',function(){
        const option = this.nextElementSibling;
        cover_all.style.display = 'block'
        option.style.display = "block"

        // function to hide option when the whole page is scrolled
        function myScrollHandler(){
            cover_all.style.display = 'none'
            option.style.display = "none"
            window.removeEventListener('scroll',myScrollHandler)
        }

        window.addEventListener('scroll',myScrollHandler)
        const listElements = option.getElementsByTagName('li')

        listElements[0].addEventListener('click',editTemplate)
        listElements[1].addEventListener('click',function(){
            // remove the scroll event listener so that covel-all dive wont disappear on scrolling
            window.removeEventListener('scroll',myScrollHandler)
            // hides the options
            option.style.display = "none"
            renameTemplate.bind(this)()
        })
        listElements[2].addEventListener('click',deleteTemplate)

        cover_all.addEventListener('click',function(){
            cover_all.style.display = 'none'
            option.style.display = "none"
        })  
    })
}








// function to start workout by selecting a template...
const templates = document.querySelectorAll(".card")
templates.forEach(template =>{
    template.addEventListener('click',function(){
        const id = this.getAttribute('data-template-id')
        url=`workout/select-template-as-workout/${id}`
        fetch(url)
        .then(res => res.json())
        .then(data =>{
            if(data.status == 'success'){
                alert(data.message)
                window.location.href = "workout/start-empty-workout"
            }
            if(data.status == 'warning'){
                document.querySelector('.confirmation').style.display = "block"

                const title = document.querySelector('#confirmation-heading')
                const para = document.querySelector('#confirmation-para')
                const confirmButton = document.querySelector('#confirm-button')

                title.innerText = "Workout in progress"
                para.innerText = 'You are currently performing a workout.Would you like to discard it?'
                confirmButton.innerText="Yes, DISCARD"
                confirmButton.addEventListener('click',function(){
                    const url = `workout/cancel-workout/${data.data.id}`
                    fetch(url)
                    .then(res => {
                        if(res.ok){
                            window.location.href = "workouts"
                        }
                    })
                    .catch(e => console.log(e))
                })
            }
            else{
                alert(data.message)
            }
        })
    })
})

