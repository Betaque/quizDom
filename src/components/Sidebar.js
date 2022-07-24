import React, { useState} from 'react'
import { Link, Navigate } from 'react-router-dom'
import './Sidebar.css'
import firebase from '../firebase/firebase'
import Home from '../screens/Home'
import { Icon } from '@material-ui/core'
import axios from "axios"

import {
	CreateNewFolder,
	Dashboard,
	ExitToApp,
	MeetingRoom,
	MenuOpenRounded,
	MenuRounded,
} from '@material-ui/icons'
import { useEffect } from 'react'

require('dotenv').config()

function Sidebar() {
	const [signOut, setSignOut] = useState(false)
	const SidedbarData = [
		{
			title: 'Dashboard',
			path: '/dashboard',
			icon: <Dashboard />,
			CName: 'nav-text',
		},
		{
			title: 'Join Quiz',
			path: '/join-quiz',
			icon: <MeetingRoom />,
			CName: 'nav-text',
		},
		{
			title: 'Create Quiz',
			path: '/create-quiz',
			icon: <CreateNewFolder />,
			CName: 'nav-text',
		},
	]
	const [sidebar, setSidebar] = useState(false)
	const [user, setUser] = useState({})
	const showSidebar = () => setSidebar(!sidebar)
	useEffect(()=>{
		if(!user.name && localStorage.getItem('_ID')){
				let id = localStorage.getItem('_ID')
				axios.get(`${process.env.REACT_APP_HOST}/API/users/find/${id}`,{
					headers: {
						authorization: localStorage.getItem('JWT_PAYLOAD')
					  }
				}).then(res => {
					setUser(res.data.user)
				}).catch((er) => {
				  console.log(er)
				})
			  
		}
		
	})

	if (signOut) return <Navigate to='/' />


	return (
		<div className='App'>
			{user.name ? (
			<Home setUser={setUser} />
				) : (
		<>
			<div>
			<Icon className='menu-bars' onClick={showSidebar}>
				<MenuRounded />
			</Icon>
			{/* <FaIcons.FaBars  onClick={} /> */}
			<nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
				<ul className='nav-menu-items' onClick={showSidebar}>
					<li className='navbar-toggle'>
						<Icon>
							<MenuOpenRounded fontSize='large' />
						</Icon>
					</li>
					{SidedbarData.map((item, index) => {
						return (
							<li key={index} className='nav-text'>
								{
									user.email==="tushar.verma@betaque.com" && item.title==='Join Quiz' ? 
									<Link to={item.path}>
										<Icon>{item.icon}</Icon>
									 	<span className='nav-item-title'>{item.title}</span>
									</Link>
									:''
								}
							</li>
						)
					})}
					{/* Sign Out Button */}
					<li className='nav-text sign-out'>
						<button
							onClick={() => {
								console.log('clicked')
								// setUser({})
								firebase.auth().signOut()
								setSignOut(true)
							}}
						>
							<Icon>
								<ExitToApp />
							</Icon>
							<span className='nav-item-title'>{'SignOut'}</span>
						</button>
					</li>
				</ul>
			</nav>
		</div>
			</>
		)}
		</div>
			
		
	)
}

export default Sidebar
