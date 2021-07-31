import {useContext, useState, useEffect} from 'react'
import { API } from '../config/Api'
import { UserContext } from '../context/UserContext'
import {Link} from 'react-router-dom'
import './css/Comment.css'

function Comment({data, loadComment}) {

    const [state, dispatch] = useContext(UserContext)

    const peoplePath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'
    const [edit, setEdit] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const commentFilter = () => {
        if(data.user.id == state.user.id){
            setEdit(true)
        } else {
            setEdit(false)
        }
    }

    useEffect(() => {
        commentFilter()
        setLoaded(true)
    }, [])

    const handleDelete = async () => {
        try {
            const response = await API.delete(`/comments/${data.id}`)
            console.log(response)
            loadComment()
        } catch (error) {
            console.log(error)
        }
    }

    return (
    <>
    {loaded &&
     <>
        <div className="md_user" style={{ borderBottom: '0px', paddingBottom: '0px'}}>
            <Link to={`/user/${data.user.username}`} style={{display: 'flex', textDecoration: 'none'}}>
            <div className="md_u_image" style={{justifySelf: 'flex-start'}}>
                <img src={peoplePath + data.user.p_image} />
            </div>
            <div className="md_u_text">                      
                <span style={{color: 'white'}}>{data.user.username}</span>
                <span style={{lineHeight: '1.2rem'}}>{data.comment}</span>
            </div>
            </Link>
            {edit &&
                <div className="c_action cm_action" style={{
                    position: 'absolute',
                    right: '0',
                    paddingRight: '10px'
                }}>        
                    <img onClick={handleDelete} src="/assets/feed/trash.png" />          
                </div>}
        </div>
     </>}
     </>
    )
}

export default Comment
