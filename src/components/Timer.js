// import { useEffect, useContext } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useContext, useState, useEffect, useRef} from "react";
import SettingsContext from "./SettingsContext";
import axios from 'axios';
// import axios from "axios";

function Timer() {
  let workMinutes = 1
  const remainingTime = "http://localhost:8000/API/quizzes/remaining_time"
  const currentTime = "http://localhost:8000/API/quizzes/gettime"
  
  const settingsInfo = useContext(SettingsContext);
  const [secondsLeft, setSecondsLeft] = useState(0);


  const secondsLeftRef = useRef(secondsLeft);

  function tick() {
    if (secondsLeftRef.current === 0) {
          console.log("Completed")
          localStorage.clear("count_timer");
        }
    secondsLeftRef.current--;
    localStorage.setItem("count_timer",secondsLeftRef.current);
    setSecondsLeft(secondsLeftRef.current);
  }

  const remaining_time = async () =>{
    let val = await axios.get(remainingTime)
    .then((res) =>{
      console.log("rem",res.data.time.minute)
      return res.data.time.minute
    })
    return val
  }

  const current_time = async () =>{
    let val = await axios.get(currentTime)
    .then((res)=>{
      console.log("current",res.data.time.sendTimeLeft)
      return res.data.time.sendTimeLeft
    })
    return val
  }

  
  useEffect(async() => {
    if(localStorage.getItem("count_timer")){
      let cval = await current_time()
      console.log("current",cval)
      localStorage.setItem("count_timer",cval);
      secondsLeftRef.current = localStorage.getItem("count_timer");

    } else {
      let rval = await remaining_time()
      console.log("rval",rval)
      secondsLeftRef.current = rval * 60;
      console.log("secondsLeft",secondsLeftRef.current)
    }

    setSecondsLeft(secondsLeftRef.current);
    
    const interval = setInterval(() => {
      if (secondsLeftRef.current === 0) {
        console.log("Completed")
        localStorage.clear("count_timer");
        return clearInterval(interval)
      }

      tick();

    },1000);
    
  }, [workMinutes]);

  // useEffect(() => {
  //   // if(localStorage.getItem("count_timer")){
  //   //   console.log("clearing")
  //   //   secondsLeftRef.current = localStorage.getItem("count_timer");
  //   // } else {
  //   //   secondsLeftRef.current = settingsInfo.workMinutes * 60;
  //   //   console.log("updating",secondsLeftRef.current)
  //   // }
  //         secondsLeftRef.current = settingsInfo.workMinutes * 60;

  //   setSecondsLeft(secondsLeftRef.current);
    
  //   const interval = setInterval(() => {
  //     if (secondsLeftRef.current === 0) {
  //       console.log("Completed")
  //       localStorage.clear();
  //       clearInterval(interval)
  //     }
  //     tick();
  //   },1000);
  // }, [settingsInfo]);

  // console.log(secondsLeft)
  
  // const setTime = () =>{
  //   setMode(true)
  // }
  // const getTime = () =>{
  //   axios.get("http://localhost:8000/API/quizzes/remaining_time")
  //   .then((res) =>{
  //     // setTime
  //     console.log("resss",res)
  //   })
  // }

  const totalSeconds = settingsInfo.workMinutes * 60;
  const percentage = Math.round(secondsLeft / totalSeconds * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if(seconds < 10) seconds = '0'+seconds;

  return (
    <div>
      <CircularProgressbar
        value={percentage}
        text={minutes + ':' + seconds}
        styles={buildStyles({
        textColor:'#000',
        tailColor:'rgba(255,255,255,.2)',
      })} />
    </div>
  );
}

export default Timer;





// // import { useEffect, useContext } from 'react';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import {useState, useEffect, useRef} from "react";
// // import SettingsContext from "./SettingsContext";
// // import axios from "axios";

// function Timer() {
//   // const settingsInfo = useContext(SettingsContext);
//   const [secondsLeft, setSecondsLeft] = useState(0);
//   let workMinutes = 1

//   const secondsLeftRef = useRef(secondsLeft);

//   // function tick() {
//   //   console.log("tick")
//   //   secondsLeftRef.current--;
//   //   localStorage.setItem("count_timer",secondsLeftRef.current);
//   //   setSecondsLeft(secondsLeftRef.current);
//   // }


//   // if(localStorage.getItem("count_timer")){
//   //   // console.log("hello2")
//   //   var count_timer = localStorage.getItem("count_timer");
//   // } else {
//   //   // console.log("helloo")
//   //   count_timer = 60*1;
//   // }

//   // let mins = parseInt(count_timer/60);
//   // let secs = parseInt(count_timer%60);

//   // function countDownTimer(){
//   //         if(secs < 10){
//   //          secs= "0"+ secs ;
//   //         }if(mins < 10){
//   //            mins= "0"+ mins ;
//   //         }
          
//   //         // document.getElementById("total-time-left").innerHTML = "Time Left : "+minutes+" Minutes "+seconds+" Seconds";
//   //         if(count_timer <= 0){
//   //             localStorage.clear("count_timer");
//   //         } else {
//   //             count_timer = count_timer -1 ;
//   //             mins = parseInt(count_timer/60);
//   //             secs = parseInt(count_timer%60);
//   //             localStorage.setItem("count_timer",count_timer);
//   //             setTimeout(countDownTimer(),1000);
//   //         }
//   //       }
//   //       setTimeout(countDownTimer(),1000);

//       const countDownTimer = () =>{
//         if(secondsLeftRef.current <= 0){
//             localStorage.clear("count_timer");
//         } else {
//           secondsLeftRef.current--
//           // mins = parseInt(count_timer/60);
//           // secs = parseInt(count_timer%60);
//           localStorage.setItem("count_timer",secondsLeftRef.current);
//           setTimeout(countDownTimer(),1000);
//         }
//       }  

//   useEffect(() => {
//     if(localStorage.getItem("count_timer")){
//       console.log("value",localStorage.getItem("count_timer"))
//       secondsLeftRef.current = localStorage.getItem("count_timer");
//     } else {
//       secondsLeftRef.current = workMinutes * 60;
//     }

//   //   secondsLeftRef.current = workMinutes * 60;

//     setSecondsLeft(secondsLeftRef.current);
    
//   //   const interval = setInterval(() => {
//   //     if (secondsLeftRef.current === 0) {
//   //       console.log("Completed")
//   //       localStorage.clear("count_timer");
//   //       return clearInterval(interval)
//   //     }
//   //     tick();
//   //   },1000);
//   }, [workMinutes]);


//     setInterval(countDownTimer(), 1000)
  

//   const totalSeconds = workMinutes * 60;
//   const percentage = Math.round(secondsLeft / totalSeconds * 100);
//   const minutes = Math.floor(secondsLeft / 60);
//   let seconds = secondsLeft % 60;
//   if(seconds < 10) seconds = '0'+seconds;

//   return (
//     <div>
//       <CircularProgressbar
//         value={percentage}
//         text={minutes + ':' + seconds}
//         styles={buildStyles({
//         textColor:'#000',
//         tailColor:'rgba(255,255,255,.2)',
//       })} />
      
//     </div>
//   );
// }

// export default Timer;

