import React, {useState,useEffect} from "react";

const ResponseQuestionCard = (props)=>{

    const {question,index,selectedOptions} = props
    const [message,setMessage] = useState()
    // const [selectedOptions, setSelectedOptions] = useState([])

    useEffect(()=>{
        selectedOptions.map((data) =>{
            if(data.id  === question.id){
                return setMessage(data.textAns)
            }
        })
    },[selectedOptions, question])

    const getChecked = (val,qindex) =>{
        let v = false
        for(let i = 0; i<selectedOptions.length ; i++){
            selectedOptions[i].selectedOp.forEach(op => {
                 if(op === val.text){
                        v = true
                    }
            });
        }
        return v
    }

    const getClass = (val) => {
        let checking = val.isCorrect
        if(checking){
            return 'label green bold'
        }else{
            return 'label'
        }
    }

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
                                checked={getChecked(option,question.id)}
                                // disabled
                            />
                        ) : (
                            <input
                                type='checkbox'
                                name='option'
                                defaultChecked={getChecked(option,question.id)}
                                
                                // disabled
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
