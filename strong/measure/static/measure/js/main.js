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


function show(e){
  	document.querySelector(".form-container").style.display = "block"
}
function hide(e){
  	document.querySelector(".form-container").style.display = "none"
}



//  Graph
// --------------
let labels = JSON.parse(document.querySelector("#labels").getAttribute('data-labels'))
let datas =JSON.parse(document.querySelector("#data").getAttribute('data-data'))


const data = {
	labels: labels,
	datasets: [{
	  label: document.querySelector("#heading").innerText,
	  data: datas,
	  backgroundColor: [
		'rgba(255, 26, 104, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
		'rgba(153, 102, 255, 0.2)',
		'rgba(255, 159, 64, 0.2)',
		'rgba(0, 0, 0, 0.2)'
	  ],
	  borderColor: [
		'rgba(255, 26, 104, 1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)',
		'rgba(153, 102, 255, 1)',
		'rgba(255, 159, 64, 1)',
		'rgba(0, 0, 0, 1)'
	  ],
	  borderWidth: 1
	}]
  };

  // config 
  const config = {
	type: 'line',
	data,
	options: {
	  maintainAspectRatio:false,
	  scales: {
		y: {
		  beginAtZero: true
		}
	  }
	}
  };

  // render init block
  const myChart = new Chart(
	document.getElementById('myChart'),
	config
  );

const canvas_body = document.querySelector(".canvas-body")
if(labels.length > 7){
	canvas_body.style.width = `${labels.length * 115}px`
}

  // Instantly assign Chart.js version
//   const chartVersion = document.getElementById('chartVersion');
//   chartVersion.innerText = Chart.version;

// graph Ends....
// -----------------