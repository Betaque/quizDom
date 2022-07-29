import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useContext, useState, useEffect, useRef} from "react";
import SettingsContext from "./SettingsContext";
import axios from 'axios';
// import axios from "axios";

function Timer(props) {
  let workMinutes = 1
  const remainingTime = "http://localhost:8000/API/quizzes/remaining_time"
  const currentTime = "http://localhost:8000/API/quizzes/gettime"
  const settingsInfo = useContext(SettingsContext);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submission, setSubmission] = useState(false)
  const [uid , setUid] = useState()
  // const quizCode = props.data[0]
  // const uid = props.data[1]

  const secondsLeftRef = useRef(secondsLeft);

  function tick() {
    if (secondsLeftRef.current === 0) {
          localStorage.removeItem("count_timer")
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

  
  useEffect(() => {
    try{
      if(localStorage.getItem('_ID')){
        let id = localStorage.getItem('_ID')
        axios.get(`${process.env.REACT_APP_HOST}/API/users/find/${id}`,{
          headers: {
            authorization: localStorage.getItem('JWT_PAYLOAD')
            }
        }).then(res => {
          setUid(res.data.user.uid)
        }).catch((er) => {
          console.log(er)
        })
        }
    }catch{
      return null
    }
    const run = async () =>{
      if(localStorage.getItem("count_timer")){
        let cval = await current_time()
        localStorage.setItem("count_timer",cval);
        secondsLeftRef.current = localStorage.getItem("count_timer");
  
      } else {
        let rval = await remaining_time()
        secondsLeftRef.current = rval * 60;
      }
    }
      run()
      setSecondsLeft(secondsLeftRef.current);
    
    const interval = setInterval(() => {
      if (secondsLeftRef.current <= 0) {
        localStorage.removeItem("count_timer")
        setSubmission(true)
        return clearInterval(interval)
      }

      tick();

    },1000);
  
    
    
  }, [workMinutes]);


  const totalSeconds = settingsInfo.workMinutes * 60;
  const percentage = Math.round(secondsLeft / totalSeconds * 100);
  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if(seconds < 10) seconds = '0'+seconds;

  if(!submission){
    return (
      <div className='timer'>
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
  else{
    props.handleChild(true)
    return null
  }
}

export default Timer;
