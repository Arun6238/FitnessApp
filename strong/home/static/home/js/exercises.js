let divElements = document.querySelectorAll('.exercise-container')

divElements.forEach((div)=>{
    div.addEventListener('click',function(){
        let url = this.getAttribute('data-url')
        console.log(url)
        window.location.href = url;
    })
})