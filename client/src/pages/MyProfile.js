import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom' 
import '../components/css/pages/MyProfile.css'
import Profile from '../components/Profile'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { API } from '../config/Api'
import { UserContext } from '../context/UserContext'
import Nav from '../components/Nav'

function MyProfile({pState, checkUser}) {

    const [state, dispatch] = useContext(UserContext)
    const [profile, setProfile] = useState([])
    const [feeds, setFeeds] = useState([])

    const [header, setHeader] = useState(false)
    const profilePath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'

    const loadFeed = async () => {
        try {
            const response = await API.get(`/profile/${state.user.id}`)
            setFeeds(response.data.feeds)
        } catch (error) {
            console.log(error)
        }
    }

    const loadProfile = async () => {
        try {
            
            const response = await API.get(`/user/${state.user.username}`)
            setProfile(response.data.user)        
            checkUser()
            loadFeed()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])
    return (
        <>
        {profile.length != 0 &&
        <div className="containers">
        <div className="mp_detail">
            <div className="mp_r1">
                <div className="ep_image mp_image">
                    <img src={profilePath + profile.p_image} />
                </div>
                <div className="mp_edit">
                    <Link to="/edit-profile">
                        <img src="/assets/feed/edit.png"/>
                    </Link>
                </div>
                <div className="mp_head">
                    <div className="mp_item">
                        <span style={{color: '#999'}}>Posts</span>
                        <span>{profile.p_posts}</span>
                    </div>

                    <div className="f_line" />

                    <div className="mp_item">
                        <span style={{color: '#999'}}>Followers</span>
                        <span>{profile.p_followers}</span>
                    </div>

                    <div className="f_line" />

                    <div className="mp_item">
                        <span style={{color: '#999'}}>Following</span>
                        <span>{profile.p_following}</span>
                    </div>
                </div>
            </div>
            <div className="mp_username">
                @{profile.username}
            </div>
            <div className="" style={{fontSize: '15px', color: '#ddd'}}>              
                {profile.bio}                  
            </div>
        </div>
        <header>
            <Nav />
        </header>
        <aside className="active">
            <Profile pState={pState} />
        </aside>          
        <main className="mp_main">
            <div align="center" className="mp_profile">
                {profile.fullname}
            </div>
            <div className="m_c">
                {feeds.map((feed, index) => (
                <div className="" style={{padding: '0 10px', display: 'inline-block'}}>
                    <Card loadFeed={loadFeed} feed={feed} index={index} card="explore" /> 
                </div>
                ))}
            </div>
        </main>
        <footer>
          <Footer pState={pState} />
        </footer>
        </div>}
        </>
    )
}

export default MyProfile
