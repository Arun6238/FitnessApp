
let preloader = document.querySelector('.preloader')
window.addEventListener('load',function(){
    setTimeout(function(){
        preloader.style.display="none"
    })
})

const workoutInProgress = document.getElementById('workout-in-progress')
const timerDisplay =document.getElementById('timer-2')
const workoutInProgressHeading = document.getElementById('workout-in-progress-heading')

var stopwatch2 = {
    startTime: null,
    running: false,
    display: document.getElementById('timer-2'),
    
    start: function(t) {

      const unixTime = new Date(t).getTime();
      let today = new Date();
      this.startTime = today.getTime() - unixTime;
      this.running = true;
      this.run()


    },
    
    run: function(timestamp) {
      if (!this.startTime) {
        this.startTime = timestamp;
      }
      var elapsed = timestamp + this.startTime;
      var hours = Math.floor(elapsed / 3600000);
      var minutes = Math.floor((elapsed % 3600000) / 60000);
      var seconds = Math.floor((elapsed % 60000) / 1000);
      this.display.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
      if (this.running) {
          requestAnimationFrame(this.run.bind(this));
      }
    },
    
    stop: function() {
      this.running = false;
    }
  };

  // if timerDiplay is null dont check for live wrokout session
  if(timerDisplay != null){
    fetch('/workout/check-for-live-workout-session')
    .then(res =>{
        if(res.ok){
            return res.json()
        }
        else{
            console.log('some error occured')
        }
    })
    .then(data => {
        if(data.status == 'success'){
            workoutInProgressHeading.textContent = data.data.workout_session_name
            stopwatch2.start(data.data.time)
            workoutInProgress.style.display= 'block'
            document.body.style.paddingBottom = "4em"
            workoutInProgress.addEventListener('click',redirectToStartEmptyWorkout)
        }
        else{
            console.log(data.status)
        }

    })
    .catch(error =>{
        console.log(error)
    })
  }

function redirectToStartEmptyWorkout(){
    window.location.href = '/workout/start-empty-workout'
}
