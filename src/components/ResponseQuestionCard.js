import React, {useState,useEffect} from "react";
import firebase from '../firebase/firebase'

const ResponseQuestionCard = (props)=>{

    const {question,index,quizCode,selectedOptions,userCode} = props
    const [message,setMessage] = useState()
    // const [selectedOptions, setSelectedOptions] = useState([])
    console.log("questions got the component",question)
    console.log("selectedOptions got the component",selectedOptions)

    useEffect(()=>{
        selectedOptions.map((data) =>{
            if(data.id  === question.id){
                setMessage(data.textAns)
            }
        })
    },[selectedOptions])


    const getClass = (val,qindex) => {
        let checking = val.isCorrect
        for(let i = 0; i<selectedOptions.length ; i++){

            if(qindex === selectedOptions[i].id){
                if(val.id === selectedOptions[i].optionId){
                    return (checking === "true" ? 'label green bold' : 'label red bold')
                }
                else{
                    return (checking === "true" ? 'label green': 'label red')
                }

            }
        }
    }

    // const getText = () =>{
    //     console.log("heyaa")
    // }

    return(
        
        <div className='attempQuestionCard' key={index}>
			<div id='title'>{question.title}</div>
            <div className='option-div'>

            {
                question.optionType === 'text' ? 
                <div className='textOption'>
                    <textarea type="text"
                        value={message}
                        disabled
                    ></textarea>
                </div>
                :
                question.options.map((option, ind) => (
                    <div className='option' key={ind}>
                        {question.optionType === 'radio' ? (
                            <input
                                type='radio'
                                name={`option${index}`}
                                disabled
                            />
                        ) : (
                            <input
                                type='checkbox'
                                name='option'
                                disabled
                            />
                        )}
                        <label className={getClass(option,question.id)} style={{ padding: '0px 5px' }}>
                            {option.text}
                        </label>
                    </div>
                ))}
            

            </div>
        </div>
    )
}


export default ResponseQuestionCard;
