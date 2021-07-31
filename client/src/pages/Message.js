import {useState, useEffect, useRef} from 'react'
import { Link, useParams } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import MessageUserList from '../components/MessageUserList'
import MessageList from '../components/MessageList'
import MessageDate from '../components/MessageDate'

import { API } from '../config/Api'

function Message({pState}) {
    const [loaded, setLoaded] = useState(true)
    const [profile, setProfile] = useState([])
    const [user, setUser] = useState([])
    const [messages, setMessages] = useState([])
    const [showDate, setShowDate] = useState(false)
    const [dateIndex, setDateIndex] = useState(100)
    
    const messagesEnd = useRef(null)
    const [reversedMessages, setReversedMessage] = useState([])

    const [form, setForm] = useState({
        message: ''
    })

    const { username } = useParams()

    const loadUsers = async () => {
        try {
            const response = await API.get(`/messages`)
            setProfile(response.data.data.chat)
        } catch (error) {
            console.log(error)
        }
    }


    console.log(profile)
    const loadMessages = async () => {
        try {
            const response = await API.get(`/message/${username}`)
            setMessages(response.data.data.Message)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const loadUser = async () => {
        try {
           const response = await API.get(`/user/${username}`)
           setUser(response.data.user)
        } catch (error) {
            console.log(error)
        }
    }

    console.log(profile)
    useEffect(() => {
        loadUser()
        setReversedMessage(messages.reverse())
    }, [messages])

    useEffect(() => {
        loadMessages()
    }, [username])

    useEffect(() => {
        loadUsers()
    }, [])

    const { message } = form
    const handleSubmit = async () => {
        try {
            const config = {
                headers : {
                    "Content-type":"application/json"
                }
            }

            const body = JSON.stringify({
                ...form
            })
            const response = await API.post(`/message/${user.id}`, body, config)
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleDateIndex = (e) => {
        setDateIndex(e)
    }

    const handleShowDate = (e) => {
        console.log(e)
        setShowDate(e)
    }

    const scrollToBottom = () => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [reversedMessages])

    useEffect(() => {
        scrollToBottom()
    }, [])

    return (
        <>
        {loaded &&
          <div className="containers">
            <header>
                <Nav pState={pState} />
            </header>
            <aside className="active">
                <div className="brand" style={{}}>
                    <Link to="/feed">
                        <img className="b_img" src="/assets/DumbGram.png" />
                    </Link>
                </div>
                {profile?.map((data, index) => (
                    <MessageUserList data={data} />
                ))}
            </aside>          
            <main className="ml_main" style={{
                justifyContent: `${messages.length != 0 ? '' : 'center' }`,
                paddingBottom: `${messages.length != 0 ? '110px' : ''}`,
                alignItems: 'center'
            }}>
                {messages.length != 0 ?
                <>
                <div ref={messagesEnd} />
                {reversedMessages.map((data) => (
                    <>  
                        {/* <MessageDate showDate={showDate} data={data} handleShowDate={handleShowDate} dateIndex={dateIndex} handleDateIndex={handleDateIndex} /> */}
                        <MessageList data={data} />         
                    </>
                ))}  
                </>
                :
                <div className="ml_nomsg">
                    <span>No Message</span>
                </div>}
                <div className="ml_form">
                    <form onSubmit={handleSubmit} className="md_add" style={{width: '100%'}}>
                        <input onChange={handleChange} name="message" value={message} style={{
                            height: '40px',
                            width: '100%',
                            borderRadius: '0px',
                            border: 'none',
                            padding: '10px',
                            background: '#555',
                            color: 'white'     
                        }} placeholder="Send Message" name="message" value={message} />
                    </form>
                </div>
            </main>
            <footer className="active">
              <Footer />
            </footer>
        </div>
        }
        </>
    )
}

export default Message
