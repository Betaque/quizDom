const express = require('express')
var sendTimeLeft

const evaluate = (time) =>{
    const {minute} = time
    console.log("time",time)
    secondsLeft = minute*60
    var sleft = setInterval(function(){
        secondsLeft--
        let seconds = secondsLeft % 60;
        const minutes = Math.floor(secondsLeft / 60);  
        console.log(`${minutes}:${seconds}`,minutes,seconds)
        console.log('')
        console.log(secondsLeft)
        sendTimeLeft = secondsLeft
        if(secondsLeft == 0) {
            clearInterval(sleft)
            console.log("done")
        }
    },1000)
    console.log(sleft)
}

const sendTime = () =>{
    let seconds = sendTimeLeft % 60;
    const minutes = Math.floor(sendTimeLeft / 60); 
    return({minutes,seconds,sendTimeLeft})
}

module.exports.evaluate = evaluate
module.exports.sendTime = sendTime