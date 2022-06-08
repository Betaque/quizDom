


const AnswerQuiz = (quizQuestions, attemptedQuestions) => {
    // vals.forEach((val)=>{
    //     console.log("val",val.selectedOptions)
    // })
    // let score = 0
    let answers = []
    attemptedQuestions.forEach((question) => {
		const realQues = quizQuestions.find((x) => x.id === question.id)
		const correctOptions = realQues.options.filter((op) => op.isCorrect)
		// Error for Quiz with no correct answers
		if (correctOptions.length < 1) return 0
		if (realQues.optionType === 'check') {
			// if (correctOptions.length < question.selectedOptions.length) {
				question.selectedOptions.forEach((selectedOp) => {  
                    let id = realQues.id
                    answers.push({id,selectedOp})
                })
			// }
		} else if (realQues.optionType === 'radio') {
			question.selectedOptions.forEach((selectedOp) => {
                console.log("selectedOp",selectedOp)   
                let id = realQues.id
                answers.push({id,selectedOp})
            })
		}
	})
    return answers
}

module.exports = AnswerQuiz
