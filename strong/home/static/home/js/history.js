var datepicker = document.getElementById('datepicker');

let currentDate = new Date();
let d = currentDate.getDate();
if (d<10){
	d = 0 + String(d)
}
let m = currentDate.getMonth() + 1;
if(m<10){
  	m = 0+String(m)
}
let y = currentDate.getFullYear();
date =`${y}-${m}-${d}`
datepicker.defaultValue = date; 


const exerciseHistoryDiv = document.getElementById('exercise-history')
function fetchHistory(date){
    const url = `/workout-history?date_time=${date}`
    fetch(url)
    .then(res => res.json())
    .then(data => {
        if(data.status == 'success'){
            for(let i of data.data){

                // create the div for holding each workout sesson
                const historyCard = document.createElement('div')
                historyCard.classList.add('history-card')

                // wrokout session title
                const cardTitle = document.createElement('h3')
                cardTitle.classList.add('card-title')
                cardTitle.innerText = i.name

                // wrokout session started date time
                const h5 = document.createElement('h5')
                const dateTime = new Date(i.started_at)
                h5.innerText = dateTime.toLocaleString()

                // table showing all the exercise performed in a session
                const table = document.createElement('table')
                const firstRow = document.createElement("tr")

                firstRow.innerHTML = '<th>Exercise</th><th>Best Set</th>'
                // append the first row containing table heading
                table.append(firstRow)

                //div contains all the exercise and each sets performed
                const exerciseDetailsDiv = document.createElement('div')
                exerciseDetailsDiv.classList.add('exercise-details-div')
                exerciseDetailsDiv.style.display = 'none'

                historyCard.addEventListener('click',function(){
                    if(table.style.display != 'none'){
                        table.style.display = 'none'
                        exerciseDetailsDiv.style.display = 'block'
                    }
                    else{
                        table.style.display = 'table'
                        exerciseDetailsDiv.style.display = 'none'
                    }
                })


                // loop over i.exercises to get all the exercise in a session and each sets details
                for(let j of i.exercises){
                    
                    const nextRow = document.createElement('tr')

                    // variable to store best set 
                    let best_set = ""
                    let  intesity = 0
                    // loop over all the sets performed of an exercise and finds best set
                    const div = document.createElement('div')
                    div.innerHTML = `<h4>${j.exercise}</h4>`
                    for(let k of j.sets){
                        div.innerHTML +=`<p><span>${k.set_no}</span> ${k.weight}kg  x ${k.reps}</p>`
                        if(Number(k.weight) * Number(k.reps) > intesity){
                            intesity = Number(k.weight) * Number(k.reps)
                            best_set = `${k.weight} kg x ${k.reps}`
                        }
                    }
                    exerciseDetailsDiv.append(div)
                    nextRow.innerHTML =`
                    <td>${j.sets.length} x ${j.exercise}</td>
                    <td>${best_set}</td>`

                    table.append(nextRow)
                }

                historyCard.append(cardTitle)
                historyCard.append(h5)
                historyCard.append(table)
                historyCard.append(exerciseDetailsDiv)
                exerciseHistoryDiv.append(historyCard)
            }
        }
        else if(data.status == 'warning'){
            exerciseHistoryDiv.innerHTML = "<div id='zero-workout-history'><h4>Not performed yet</h4><p>Come back after you've finished any workout! </p></div>"
        }
        else if(data.status == 'no-data'){
            exerciseHistoryDiv.innerHTML = "<div id='zero-workout-history'><h4>No Workout History Found!</h4><p>No workout sessions performed before the selected date.</p></div>"
        }

    })
}

fetchHistory(date)



let previousFilterDate = date
const filterButton = document.getElementById('filter')

filterButton.addEventListener('click',function(){
    let newDate = datepicker.value
    if(newDate == previousFilterDate){
        alert('no change')
    }
    else{
        previousFilterDate = newDate
        exerciseHistoryDiv.innerHTML = ""
        fetchHistory(newDate)

    }
})


