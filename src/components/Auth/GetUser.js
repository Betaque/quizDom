import React , {useEffect,useState} from "react";
import axios from "axios";

const GetUser = ({setUser}) =>{
    useEffect(()=>{
      console.log("inside get user")
        if(localStorage.getItem('_ID')){
            let id = localStorage.getItem('_ID')
            axios.get(`${process.env.REACT_APP_HOST}/API/users/${id}`,{
                headers: {
                    authorization: localStorage.getItem('JWT_PAYLOAD')
                  }
            }).then(res => {
                setUser(res.data.user.uid)
            }).catch((er) => {
              console.log(er)
            })
          }
    })
    
    return setUser

}

export default GetUser;