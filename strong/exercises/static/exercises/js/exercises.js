const navLinks = document.getElementById('exercise-nav').querySelectorAll('li');
const tabs = [];

// iterate over each list item in the nav bar
navLinks.forEach((li, i) => {
    // get the ID of the corresponding tab
    let id = li.getAttribute('data-link');
    // add the tab element to the tabs array
    tabs.push(document.getElementById(id));

    // add a click event listener to the list item
    li.addEventListener('click', function() {
        // iterate over each tab element in the tabs array
        tabs.forEach((tab, j) => {
            const tabId = tab.getAttribute('id');
            // if the current tab is the same as the clicked list item and it's already selected, do nothing
            if (tabId == id && tab.classList.contains('selected-tab')) {
                return;
            }
            // if the current tab is the same as the clicked list item and it's not already selected, select it
            if (tabId == id && !tab.classList.contains('selected-tab')) {
                // set the border color of the corresponding list item
                navLinks[j].style.borderBottomColor = "#5e5e5e";
                tab.classList.add('selected-tab');
            }
            // if the current tab is not the same as the clicked list item and it's currently selected, deselect it
            else if (tab.classList.contains('selected-tab')) {
                // set the border color of the corresponding list item
                navLinks[j].style.borderBottomColor = "transparent";
                tab.classList.remove('selected-tab');
            }
        });
    });
});


// funtion to retrive exercise histroy
const historyTab = document.getElementById('history')
const postListContainer = document.querySelector('#exercise-list-container');
const exerciseId = historyTab.getAttribute('data-exercise-id')
const url = `/exercises/exercise-history/${exerciseId}`
fetch(url)
    .then(res =>{
        if (res.ok)
            return res.json()
        return TypeError
    })
    .then(data => {

        if(data.status == 'warning'){
            historyTab.innerHTML = `<p class="not-performed">
            Not performed yet <br>
            <span>Come back after you've performed this exercise!</span>
        </p>`
            return
        }

        const history = data.data

        for(let i in history){
            let div = document.createElement('div')
            div.classList.add('exercise-card')

            const dateTimeString = history[i].started_at;
            const dateTime = new Date(dateTimeString);
            const formattedDateTime = dateTime.toLocaleString();

            const w =  `<h3 class="exercise-card-title">${history[i].name}</h3>
            <p class="exercise-card-date">${formattedDateTime}</p>`
            div.innerHTML = w

            const exerciseCardTable = document.createElement('table')
            exerciseCardTable.classList.add("exercise-card-table")

            const firstRow = document.createElement('tr')
            firstRow.append(createTrChild('th','Sets performed'))
            firstRow.append(createTrChild('th','1rm'))

            exerciseCardTable.append(firstRow)

            for(let j of history[i].sets){
                const tr = document.createElement('tr')
                tr.append(createTrChild('td',`<span>${j.set_number}</span>${j.weight} kg x ${j.reps}`))
                exerciseCardTable.append(tr) 
            }
            div.append(exerciseCardTable)
            historyTab.append(div)
            console.log(history[i])
        }
    })
    .catch(error => console.error(error));

    function createTrChild(element,innerTxt){
        const el = document.createElement(element)
        el.innerHTML = innerTxt
        console.log(el)
        return el
    }

// -----------------------------------------------------------------------------




