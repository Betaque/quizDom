import React, { useState, useEffect } from "react"
import { Modal } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Link , useParams} from "react-router-dom"
import axios from "axios"

const useStyles = makeStyles((theme) => ({
	root: {
		// margin: "10px",
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(10, 10),
		borderRadius: "20px",
		// display:"flex",
		// alignItems:"center",
	},
	buttons: {
		display: "flex",
		justifyContent: "flex-end",
	},
}))
// { result, totalScore, showModal }
const AttemptedModal = (user) => {
	const classes = useStyles()
	const params = useParams()
	const {qid} = params
	const [text,setText] = useState('')
	// const [open, setOpen] = useState(showModal)

	useEffect(() => {
		const getInfo = async () =>{
			try{
				const modal = await axios.post(`${process.env.REACT_APP_HOST}/API/quizzes/modals`,{user,qid})
				let checking = modal.data.val
				if(checking){
					setText("Your quiz have been submitted Successfully !!!")
				}
				else{
					setText("Some error occurred!!!")
				}
			}
			catch{
				console.log("errorr")
			}
			
		}
		getInfo()
		// setOpen(showModal)
	}, [qid,user])

	return (
		<div className={classes.root}>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				// open={open}
				open={true}
				disableEnforceFocus={true}
			>
				<div className={classes.paper}>
					<h2>Quiz Attempted Successfully.</h2>
					<h1 className="score_h2">
						{/* {"Almost there"} */}
						{text}
						{/* {result.error
							? "Not Submitted ! "
							: ''} */}
					</h1>
					<Link to={"/dashboard"}>
						<button className="button wd-200">Dashboard</button>
					</Link>
				</div>
			</Modal>
		</div>
	)
}

export default AttemptedModal
