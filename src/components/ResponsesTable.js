import React , {useEffect,useState} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { Link, useParams } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import axios from "axios"
const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: '#d81e5b',
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow)

function createData({ name, email, score }) {
	return { name, email, score }
}

const useStyles = makeStyles({
	table: {
		minWidth: 500,
	},
	paper: {
		borderRadius: 15,
	},
})


export default function ResponsesTable({ responses }) {
	const [uid,setUid] = useState()
	useEffect(()=>{
		try{
			if(localStorage.getItem('_ID')){
				console.log("found the id")
				let id = localStorage.getItem('_ID')
				console.log("ID",id)
				axios.get(`${process.env.REACT_APP_HOST}/API/users/find/${id}`,{
					headers: {
						authorization: localStorage.getItem('JWT_PAYLOAD')
					  }
				}).then(res => {
					console.log("res from localstorage",res)
					setUid(res.data.user.uid)
				}).catch((er) => {
				  console.log(er)
				})
			  }
		}
		catch{
			console.log("Some Error occured while finding the user")
		}
	})
	console.log("responses from the response table",responses[0][0])
	const params = useParams()
	const classes = useStyles()
	// const uid = firebase.auth().currentUser.uid
	const val = responses[0]
	const quizId = params.quizCode
	const rows = val.map((resp) => createData(resp))
	console.log("responses",responses)
	return (
		<TableContainer className={classes.paper} component={Paper}>
			<Table className={classes.table} aria-label='customized table'>
				<TableHead>
					<TableRow>
						<StyledTableCell>Name</StyledTableCell>
						<StyledTableCell align='center'>Email Address</StyledTableCell>
						<StyledTableCell align='right'>Score</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
				<Link to={`/res/${quizId}/${uid}`}>
					{rows.map((row,index) => (
						<StyledTableRow key={index}>
						<StyledTableCell component='th' scope='row'>
							{row.name}
						</StyledTableCell>
						<StyledTableCell align='center'>{row.email}</StyledTableCell>
						<StyledTableCell align='right'>{row.score}</StyledTableCell>
						</StyledTableRow>	
					))}
				</Link>
				</TableBody>
			</Table>
		</TableContainer>
	)
}
