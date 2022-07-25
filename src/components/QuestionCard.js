import React, {useState,useEffect} from "react";
import axios from "axios"

const QuestionCard = (props) =>{
    const {question,index,quizCode,attemptedQuestions} = props
    // const [attemptedQuestions, setAttemptedQuestions] = useState([])
    const [qResps , setqResps] = useState([])
	const [isVal,setisVal] = useState();
	const [uid,setUser] = useState()
	const [message, setMessage] = useState('');
    // const uid = user
	

    useEffect(() =>{
		try{
			const fetchResponses = async () =>{

				if(localStorage.getItem('_ID')){
					let id = localStorage.getItem('_ID')
					axios.get(`${process.env.REACT_APP_HOST}/API/users/find/${id}`,{
						headers: {
							authorization: localStorage.getItem('JWT_PAYLOAD')
						  }
					}).then(res => {
						setUser(res.data.user.uid)
					}).catch((er) => {
					  console.log(er)
					})
				  }


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
				// console.log("qresps",qResps)
				
			}
			fetchResponses()
		}
        catch{
			console.log("Quiz Not attempted Yet")
		}
		

    })

    const handleOptionChecked = (option, index,id) =>{
		let selected = false
		qResps.forEach((op) =>{
			if(op.id === id){
				op.selectedOp.forEach((ops) =>{
					if(ops === option){
						selected = true
					}
				})
			}
		})
		return selected
	}

	const handleChange = event => {
		setMessage(event.target.value);
	};

	const submitText = async(e) =>{
		console.log("message is", message)
		const temp = [...attemptedQuestions]
		console.log("tem", temp[e])
		const value = temp[e]
		const opType = value.optionType
		if(message.length < 1){
			alert("Please Write something before clicking it!!")
			return null
		}
		try {
			const res = await fetch(`${process.env.REACT_APP_HOST}/API/quizzes/update`, {
				method: 'POST',
				body: JSON.stringify({
					uid,
					quizId: quizCode,
					questions: value,
					opType: opType,
					message: message
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
		console.log("t2",temp[index])
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

	// const clear = (e,option) =>{
	// 	console.log("e",e)
	// 	console.log("option",option)
	// 	setisVal('')
	// }



    return (
        <div className='attempQuestionCard' key={index}>
			<div id='title'>{question.title}</div>
			<div className='option-div'>
				{
					question.optionType === 'text' ? 
					<div className='textOption'>
						<textarea type="text"
							onChange={handleChange}
							value={message}
						></textarea>
						<button className="textBtn" onClick={(e) => submitText(index)}>Done</button>
					</div>
					:
				question.options.map((option, ind) => (
					<div className='option' key={ind}>
						{question.optionType === 'radio' ? (
							<input
								type='radio'
								name={`option${index}`}
								id={question.title+option.text}
								onChange={(e) =>{
									handleOptionSelect(e, option.text, index,option)
									}		
								}
								checked={
									isVal === option.text || handleOptionChecked(option.text, index,question.id) ? true: false
								}	
								// onClick={clear()}				
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
					</div>
    )
}

export default QuestionCard;