import { API } from '../config/Api'
import {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import './css/Card.css'
import { UserContext } from '../context/UserContext'
import Detail from './Detail'

function Card({card, feed, index, loadFeed}) {

    const picPath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'
    const profilePath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'

    const [state, dispatch] = useContext(UserContext)
    const [likeUser, setLikeUser] = useState([])
    const [like, setLike] = useState()
    const [loaded, setLoaded] = useState(false)

    const [detailShow, setDetailShow] = useState()


    const likeFilter = async () => {
        try {
            const find = likeUser.find((data) => data.idFeed === feed.id)
            if(find){
                setLike(true)
            } else {
                setLike(false)
            }
            console.log(find)
        } catch (error) {
            console.log(error)
        }
    } 

    const loadLike = async () => {
        try {
            const response = await API.get(`/like/${state.user.id}`)
            setLikeUser(response.data.like)            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        likeFilter()
    }, [likeUser])
    
    useEffect(() => {
        loadLike()
        setLoaded(true)
    }, [])

    const handleLike = async (e) => {
        try { 
            e.preventDefault()

            if(like == true){
                setLike(false)        
            } else {
                setLike(true)
            }

            const config = {
                headers: {
                    "Content-type":"application/json"
                }
            }

            await API.post('/like', {id: feed.id}, config)
            loadFeed()          

        } catch (error) {
            console.log(error)
        }
    }    

    const handleDetailShow = () => {
        setDetailShow(true)
      }
  
      const handleDetailClose = () => {
        setDetailShow(false)
      }

    return (
        <>
        {loaded == true &&
        <>
        {card === 'feed' ?
            <>
                <Detail loadFeed={loadFeed} like={like} handleLike={handleLike} feed={feed} show={detailShow} handleClose={handleDetailClose} />
                <div onClick={handleDetailShow} className="c_image">
                    <img src={`${picPath}${feed.image}`} />         
                </div>
                <div className="c_profile">
                    <div> 
                        <Link to={`/user/${feed.user.username}`} style={{textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center'}}>
                        <div className="p_img">
                            <img src={`${profilePath}${feed.user.p_image}`} />
                        </div>
                        <span className="text">{feed.user.username}</span>                
                        </Link>                   
                    </div>
                    <div className="c_action">
                        { like ?
                        <img onClick={handleLike} src="/assets/feed/love.png" />:
                        <img onClick={handleLike} src="/assets/feed/like.png" />}

                        <img onClick={handleDetailShow} src="/assets/feed/comment.png" />               
                        <Link to={`/message/${feed.user.username}`}>
                            <img src="/assets/feed/share.png" />               
                        </Link>
                    </div>
                </div>
                <div className="c_like">
                    <span>{feed.likes} Like</span>         
                </div>
            </> : 
            <>
                <Detail loadFeed={loadFeed} like={like} handleLike={handleLike} feed={feed} show={detailShow} handleClose={handleDetailClose} />
                <div onClick={handleDetailShow} className="c_image">
                    <img src={`${picPath}${feed.image}`} />                
                </div>
            </>}
            </>}
        </>
    )
}

export default Card
