import React, {useState,useEffect} from "react";
import firebase from '../firebase/firebase'

const QuestionCard = (props) =>{
    const {question,index,quizCode,attemptedQuestions} = props
    // const [attemptedQuestions, setAttemptedQuestions] = useState([])
    const [qResps , setqResps] = useState([])
	const [isVal,setisVal] = useState();
    const uid = firebase.auth().currentUser.uid

    useEffect(() =>{
		try{
			const fetchResponses = async () =>{
				const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/fetchResponse`, {
					method: 'POST',
					body: JSON.stringify({ quizId: quizCode, uid }),
					headers: {
						'Content-Type': 'application/json',
					},
				})
				const data = await res.json()
				let arr = []
				if(!data.error){
					data.forEach((element) => {
						arr.push(element)
					});
		
					setqResps(arr)
				}
				
			}
			fetchResponses()
		}
        catch{
			console.log("Quiz Not attempted Yet")
		}
		

    })


    const handleOptionChecked = (option, index,id) =>{
		// console.log("ocheck",option,id)
		// console.log("ops",ops)
		let selected = false
		// console.log("qresps",qResps)
		qResps.forEach((op) =>{
			// console.log("Optsss",op)
			if(op.id === id){
				// console.log(op.id,id)
				op.selectedOp.forEach((ops) =>{
					if(ops === option){
						// console.log("Selected Options Match", ops,option)
						selected = true
					}
				})
			}
		})
		return selected
	}

    const handleOptionSelect = async (e, option,index,ops) => {
		const temp = [...attemptedQuestions]
        console.log("temp",temp)
		console.log("sss",e.target)
		const options = temp[index].selectedOptions
		const opId = ops.id
		// console.log("ops",ops)
		if (!options.includes(option) && e.target.checked) {
			if (attemptedQuestions[index].optionType === 'radio') options[0] = option
			else options.push(option)
		}
		if (options.includes(option) && !e.target.checked) {	
			const i = options.indexOf(option)
			options.splice(i, 1)
		}
		console.log("options",options)
		setisVal(options[0])
		temp[index].selectedOptions = options
		const value = temp[index]
		// console.log("t2",temp[index])
		try {
			const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/update`, {
				method: 'POST',
				body: JSON.stringify({
					uid,
					quizId: quizCode,
					questions: value,
					optionId: opId
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const body = await res.json()
			// setResult(body)
			// setShowModal(true)
			console.log('res body : ', body)
		} catch (e) {
			console.log('Error Submitting quiz', e)
		}

	}



    return (
        <div className='attempQuestionCard' key={index}>
							<div id='title'>{question.title}</div>
							<div className='option-div'>
								{question.options.map((option, ind) => (
									<div className='option' key={ind}>
										{question.optionType === 'radio' ? (
												<input
												type='radio'
												name={`option${index}`}
												id={question.title+option.text}
												// ref={checkRefs}
												onChange={(e) =>{
													// setOp(e)
													handleOptionSelect(e, option.text, index,option)
													}		
												}
												// ref={check}
												checked={
													isVal === option.text || handleOptionChecked(option.text, index,question.id) ? true: false
													// handleOptionChecked(option.text, index,question.id)
												}
												// onClick={(e)=>setOp(e)}
												// onClick={check}
												
											/>
											
										) : (
											<input
												type='checkbox'
												name='option'
												onChange={(e) =>
													handleOptionSelect(e, option.text, index)
												}
											/>
										)}
										<label className='label' style={{ padding: '0px 5px' }}>
											{option.text}
										</label>
									</div>
								))}
							</div>
							{/* <button onClick={() => resetVal(question)}>reset</button> */}
						</div>
    )
}

export default QuestionCard;