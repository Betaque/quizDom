import React from "react"
import { Modal } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
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
	},
}))
const AttemptedModal = (props) => {
	const classes = useStyles()

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
						Click the button to submit Your Quiz
					</h1>
                    <button className="button wd-200" onClick={props.submitQuiz}>SubmitQuiz</button>
				</div>
			</Modal>
		</div>
	)
}

export default AttemptedModal
