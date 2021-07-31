import { useState, useEffect, useContext} from 'react'

import './css/Footer.css'

import { Link } from 'react-router-dom'
import { API } from '../config/Api'
import { UserContext } from '../context/UserContext'

function Footer({pState}) {

    const picPath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'

    const [state, dispatch] = useContext(UserContext)
    const [states, setStates] = useState(pState)
    const [profileOp, setProfileOp] = useState(0.5)
    const [feedOp, setFeedOp] = useState(0.5)
    const [exploreOp, setExploreOp] = useState(0.5)

    const [profile, setProfile] = useState([])

    useEffect(() => {
        if(states === 'feed'){
            setFeedOp(1)
        } else if (states === 'explore') {
            setExploreOp(1)
        } else if (states === 'profile') {
            setProfileOp(1)
        }
    },[states])

    const loadProfile = async () => {
        try {
            
            const response = await API.get(`/user/${state.user.username}`)
            setProfile(response.data.user.p_image)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])
    
    const handleProfileOp = (op) => {
        if(states !== 'profile'){
            if(op === 0){
                setProfileOp(0.5)
            } else {
                setProfileOp(1)
            }
        }
    }

    const handleFeedOp = (op) => {
        if(states !== 'feed'){
            if(op === 0){
                setFeedOp(0.5)
            } else {
                setFeedOp(1)
            }
        }
    }

    const handleExploreOp = (op) => {
        if(states !== 'explore'){
            if(op === 0){
                setExploreOp(0.5)
            } else {
                setExploreOp(1)
            }
        }
    }

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT"
        })
    }

    return (
    <>
    { profile.length !== 0 &&
        <>
        <div className="p_link_p">
            <Link onMouseEnter={() => handleProfileOp(1)} onMouseLeave={() => handleProfileOp(0)} className="l_link" style={{opacity: `${profileOp}`}} className="l_link" to="/profile">
                <img className="pl_img" src={picPath + profile} />
            </Link>
        </div>
        <div className="p_link_h">
            <Link onMouseEnter={() => handleFeedOp(1)} onMouseLeave={() => handleFeedOp(0)} className="l_link" style={{opacity: `${feedOp}`}} to="/feed">
                <img className="l_img" src="/assets/feed/home.png"/>
            </Link>
        </div>
        <div className="p_link_e">
            <Link className="l_link" onMouseEnter={() => handleExploreOp(1)} onMouseLeave={() => handleExploreOp(0)} style={{opacity: `${exploreOp}`}} to="/explore">
                <img className="l_img" src="/assets/feed/explore.png"/>
            </Link>
        </div>

        <div className="p_link_l">
            <Link onClick={handleLogout} className="l_link" to="/">
                <img className="l_img" src="/assets/feed/logout.png"/>
            </Link>
        </div>
        </>}
    </>
    )
}

export default Footer
