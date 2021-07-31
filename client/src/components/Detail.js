import './css/Detail.css'
import { Modal } from 'react-bootstrap'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

import Comment from './Comment'
import { API } from '../config/Api'

function Detail({show, handleClose, feed, handleLike, like, loadFeed}) {
  const picPath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'
  const profilePath = 'http://192.168.43.199:5001/uploads/' || 'http://localhost:5001/uploads/'

  const [form, setForm] = useState({
    comment: '',
    id_feed: feed.id
  })

  const { comment } = form
  const [feedComments, setFeedComments] = useState([])

  const loadComment = async () => {
    const response = await API.get(`/comments/${feed.id}`)
    setFeedComments(response.data.data.Comments)
  }
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
    
      const config = {
        headers: {
          "Content-type":"application/json"
        }
      }
    
      const body = JSON.stringify({
        ...form
      })
    
      const response = await API.post('/comments', body, config)
      console.log(response)
      setForm({
        comment: '',
        id_feed: feed.id
      })
      loadComment()
      
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

  console.log(form)
  
  useEffect(() => {
    loadComment()
  }, [])

    return (
       <>
        <Modal
          centered
          size="lg"
          show={show}
          onHide={handleClose}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Body className="m_detail">
              <div className="md_image">
                  <img className="md_img" src={picPath + feed.image} />
              </div>
              <div className="md_text">
                <div onClick={handleClose} style={{alignSelf: 'flex-end', cursor: 'pointer'}}>
                  X
                </div>
                <div className="md_t_content">
                  <div className="md_user" style={{paddingTop: '0'}}>
                    <Link to={`/user/${feed.user.username}`} style={{display: 'flex', textDecoration: 'none'}}>
                    <div className="md_u_image" >
                      <img src={profilePath + feed.user.p_image} />
                    </div>
                    <div className="md_u_text">                      
                      <span style={{color: 'white'}}>{feed.user.username}</span>
                      <span style={{lineHeight: '1.2rem'}}>{feed.caption}</span>
                    </div>
                    </Link>
                  </div>

                  <div className="md_comment">
                    <div className="md_c">
                      {feedComments.map((data, index) => (
                        <Comment loadComment={loadComment} data={data} />
                        ))}      
                    </div>
                  </div>
                  <div className="c_action md_action">
                        { like ?
                        <img onClick={handleLike} src="/assets/feed/love.png" />:
                        <img onClick={handleLike} src="/assets/feed/like.png" />}

                        <img src="/assets/feed/share.png" />               
                  </div>
                  <div style={{ margin: '5px 0', alignSelf: 'flex-end', color: '#bbb'}}>
                    <span>{feed.likes} Like</span>         
                  </div>
                  <form onSubmit={handleSubmit} className="md_add" style={{width: '100%'}}>
                    <input onChange={handleChange} style={{
                      height: '40px',
                      borderRadius: '5px',
                      width: '100%',
                      border: 'none',
                      padding: '10px',
                      background: '#555',
                      color: 'white'     
                    }} placeholder="Comment ..." name="comment" value={comment} />
                  </form>
                </div>
              </div>
          </Modal.Body>
        </Modal>
       </>
    )
}

export default Detail
