import React , {useEffect,useState} from "react";
import axios from "axios";

const GetUser = ({setUser}) =>{
    useEffect(()=>{
      console.log("inside get user")
        if(localStorage.getItem('_ID')){
            console.log("found the id")
            let id = localStorage.getItem('_ID')
            console.log("ID",id)
            axios.get(`${process.env.REACT_APP_HOST}/API/users/${id}`,{
                headers: {
                    authorization: localStorage.getItem('JWT_PAYLOAD')
                  }
            }).then(res => {
                console.log("res from localstorage",res)
                setUser(res.data.user.uid)
            }).catch((er) => {
              console.log(er)
            })
          }
    })
    
    return setUser

}

export default GetUser;