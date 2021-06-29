import {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { API } from '../config/Api'
import { UserContext } from '../context/UserContext'

import './css/MessageUserList.css'

function MessageUserList({data}) {

    const [state, dispatch] = useContext(UserContext)
    const profilePath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'
    const [message, setMessage] = useState([])
    const [msg, setMsg] = useState([])
    const [date, setDate] = useState()

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
     
    console.log(state.user.id)
    console.log(msg)
    const dateSet = () => {
        const date = new Date(msg?.createdAt)
        console.log(date)
        
        let day = date.getDay()
        let hour = date.getHours()
        let minute = date.getMinutes()
        if(minute < 10){
            minute = `0${minute}`
        }
        if(hour < 10){
            hour = `0${hour}`
        }
        day = days[day]
        setDate(`${day}, ${hour}.${minute}`)
    }

    console.log(date)

    const lastMessage = async () => {
        try {
            const response = await API.get(`/message/${data.Recipient.username}`)
            console.log(response.data.data.Message)
            setMessage(response.data.data.Message)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        dateSet()
    }, [msg])

    useEffect(() => {
        setMsg(message[message.length - 1])
    }, [message])

    useEffect(() => {
        lastMessage()
    }, [])

    return (
        <>
        {msg &&
        <div className="ml_container" style={{
            display: 'flex',
            width: '100%',
            padding: '5px',
            margin: '10px 0'
        }}>
            <Link to={`/message/${data.Recipient.username}`} style={{
                display: 'flex',
                textDecoration: 'none',
                width: '100%',
                color: 'white'
            }}>
            <div className="ml_image"> 
                <img src={profilePath + data.Recipient.p_image}/>               
            </div>
            <div className="ml_user">
                <span>{data.Recipient.username}</span>
                <span style={{lineHeight: '1rem', color: '#777'}}>{msg.message}</span>
            </div>
            <div style={{
                position: 'absolute',
                right: '0',
                marginRight: '15px',
                marginTop: '25px',
                fontSize: '10px'
            }}>
                <span>{date}</span>
                {msg.Sender?.id == state.user.id ?
                <span style={{fontSize: '20px', padding: '0 10px', color: 'blue'}}>»</span>:
                <span style={{fontSize: '20px', padding: '0 10px', opacity: '0'}}>»</span>
            }
            </div>
            </Link>
        </div>}
        </>
    )
}

export default MessageUserList
