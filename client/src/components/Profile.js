import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {useState, useEffect, useContext} from 'react'
import { UserContext } from '../context/UserContext'
import './css/Profile.css'
import { API } from '../config/Api'

function Profile({pState, loadFeed, username}) {
    
    const picPath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'

    const [state, dispatch] = useContext(UserContext)
    const [states, setStates] = useState(pState)
    const [profileOp, setProfileOp] = useState(0.5)
    const [feedOp, setFeedOp] = useState(0.5)
    const [exploreOp, setExploreOp] = useState(0.5)
    const [edit, setEdit] = useState(true)
    const [isMe, setIsMe] = useState(true)
    const [isFollow, setIsFollow] = useState(false)

    const [profile, setProfile] = useState([])
    const [follow, setFollow] = useState([])


    useEffect(() => {
        if(states === 'feed') {
            setFeedOp(1)
        } else if (states === 'explore') {
            setExploreOp(1)
        } else if (states === 'profile') {
            setProfileOp(1)
        }
    },[states])

    const followFilter = () => {
        console.log(follow)
        const find = follow.find((data) => data.following.id == profile.id)
        if(find){
            setIsFollow(true)
        } else {
            setIsFollow(false)
        }
    }

    useEffect(() => {
        followFilter()
    }, [follow])

    const loadFollow = async () => {
        try {
            const response = await API.get(`/following/${state.user.id}`)
            console.log(response.data.data.following)
            setFollow(response.data.data.following)
        } catch (error) {
            console.log(error)
        }
    }

    const loadProfile = async () => {
        try {
            if(username) {
                const response = await API.get(`user/${username}`)
                setProfile(response.data.user)
                loadFollow()
                return
            }
            const response = await API.get(`/user/${state.user.username}`)
            setProfile(response.data.user)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(username == state.user.username){
            setEdit(true)
            setIsMe(true)
            loadProfile()
            return 
        }
        if(username){
            setEdit(false)
            setIsMe(false)
        }
        if(states == 'edit'){
            setEdit(false)
            setIsMe(true)
        }
        loadProfile()
    }, [username])

    useEffect(() => {
        console.log('hallo')
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

    const handleFollow = async () => {
        try {

            if(isFollow == true){
                setIsFollow(false)
            } else {
                setIsFollow(true)
            }

            const config = {
                headers: {
                    "Content-type":"application/json"
                }
            }

            const response = await API.post('/follow', {id: profile.id}, config)
            console.log(response)
            loadProfile()
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <>
        {profile.length != 0 &&
            <>
            <div className="brand">
                <Link to="/feed">
                    <img className="b_img" src="/assets/DumbGram.png" />
                </Link>
            </div>
            {edit &&
            <div className="p_edit">
                <Link to="/edit-profile">
                    <img className="e_img" src="/assets/feed/edit.png" />
                </Link>                
            </div>}
            <div className="image">
                <img src={`${picPath}${profile.p_image}`} />
            </div>
            <div className="p_name">
                {profile.fullname}
            </div>
            <div className="p_uname">
                @{profile.username}
            </div>

            {!isMe &&
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Link to={`/message/${profile.username}`}>
                    <button className="btn_l" style={{height:'40px', margin: '5px', padding: '0px 22px'}}>Message</button>
                </Link>
                <button onClick={handleFollow} className="btn_d" style={{height: '40px', margin: '5px', padding: '0px 22px'}}>{isFollow ? 'Unfollow' : 'Follow'}</button>
            </div>}

            <div className="p_feed">
                <div className="f_item">
                    <span className="f_title">Posts</span>
                    <span>{profile.p_posts}</span>
                </div>                
                <div className="f_line" />
                <div className="f_item">
                    <span className="f_title">Followers</span>
                    <span>{profile.p_followers}</span>
                </div>
                <div className="f_line" />
                <div className="f_item">
                    <span className="f_title">Following</span>
                    <span>{profile.p_following}</span>
                </div>
            </div>

            <div className="bio">
                {profile.bio}
            </div>

            <div className="h_line" />

            <div className="p_content">
            <div className="p_link_h">
                <Link onMouseEnter={() => handleProfileOp(1)} onMouseLeave={() => handleProfileOp(0)} className="l_link" style={{opacity: `${profileOp}`}} to="/profile">
                    <img className="l_img" src="/assets/feed/profile.png"/>
                    <span>Profile</span>
                </Link>
            </div>
            <div className="p_link_h">
                <Link onMouseEnter={() => handleFeedOp(1)} onMouseLeave={() => handleFeedOp(0)} className="l_link" style={{opacity: `${feedOp}`}} to="/feed">
                    <img className="l_img" src="/assets/feed/home.png"/>
                    <span>Feed</span>
                </Link>
            </div>
            <div className="p_link_e">
                <Link className="l_link" onMouseEnter={() => handleExploreOp(1)} onMouseLeave={() => handleExploreOp(0)} style={{opacity: `${exploreOp}`}} to="/explore">
                    <img className="l_img" src="/assets/feed/explore.png"/>
                    <span>Explore</span>
                </Link>
            </div>

            <div className="h_line" />

            <div className="p_link_l">
                <Link onClick={handleLogout} className="l_link" to="/">
                    <img className="l_img" src="/assets/feed/logout.png"/>
                    <span>Logout</span>
                </Link>
            </div>

            </div>
            </>}
        </>
    )
}

export default Profile
