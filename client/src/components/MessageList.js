import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import './css/MessageList.css'

function MessageList({data}) {

    const [state, dispatch] = useContext(UserContext)
    const [isMe, setIsMe] = useState()
    const profilePath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const [loaded, setLoaded] = useState(false)

    const date = new Date(data.createdAt)
    const dateNow = new Date().getMonth()
    
    const day = date.getDay()
    const hour = date.getHours()
    const minute = date.getMinutes()

    useEffect(() => {
        if(data.Sender.username == state.user.username){
            setIsMe(true)
        }
    }, [data])

    return (
        <div className="ml_m" style={{
            display: 'flex',
            justifyContent: `flex-${isMe ? 'end' : 'start'}`,
            background: `${isMe ? '#222' : '#eee'}`,
            borderRadius: '10px 0 10px 0',
            maxWidth: '80%',
            alignSelf: `flex-${isMe ? 'end' : 'start'}`,
            padding: '10px',
            margin: '10px 0',

        }}>
            <div className="ml_c" style={{order: `${isMe ? '1' : '0'}`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div className="ml_image ml_i" > 
                    <img src={profilePath + data.Sender.p_image} />               
                </div>
                <span style={{color: `${isMe ? '#fff' : '#000' }`, right: `${isMe ? '20px' : ''}`, left: `${isMe ? '' : '20px'}` }}>{`${days[day]}, ${hour < 10 ? `0${hour}` : hour }.${minute < 10 ? `0${minute}` : minute}`}</span>
            </div>
            <div className="ml_user ml_ub">
                <span style={{lineHeight: '1rem', color: `${isMe ? '#bbb' : '#666' }`}}>{data.message}</span>
            </div>
        </div>
    )
}

export default MessageList
