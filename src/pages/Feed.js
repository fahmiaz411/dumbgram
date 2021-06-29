import Card from '../components/Card'
import Nav from '../components/Nav'
import Profile from '../components/Profile'
import { useState, useEffect, useContext } from 'react'
import { API } from '../config/Api'
import { UserContext } from '../context/UserContext'
import Footer from '../components/Footer'
import Detail from '../components/Detail'
import {useParams} from 'react-router-dom'

function Feed({pState, checkUser}) {
    const [feeds, setFeeds] = useState([])
    const [loaded, setLoaded] = useState(false)
    const { username } = useParams()
    const [feedUser, setFeedUser] = useState([])
    const [id, setId] = useState()
    const [fullname, setFullname] = useState()

    console.log(fullname)

    let data = []

    const loadFeed = async () => {
      try {
        checkUser()
        console.log(id)
        if(id || username){
          const response = await API.get(`/profile/${id}`)
          console.log(response)
          setFeedUser(response.data.feeds)
          setLoaded(true)
          return
        } else if (!id){
          const response = await API.get('/feed')
          console.log(response)
          setFeeds(response.data.data.feed)
          setLoaded(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    
    console.log(feedUser)

    feedUser?.map((f) => (
      data = [...data, f]
    ))

    feeds?.map((feed) => (
      feed.map((f) => (
        data = [...data, f]
      ))
    ))

    console.log(data)

    const findUser = async () => {
      try {
        const response = await API.get(`/user/${username}`)
        setFullname(response.data.user.fullname.split(' '))
        setId(response.data.user.id)
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      findUser()
    }, [username])

    useEffect(() => {
      loadFeed()
    }, [id])

    useEffect(() => {  
      // loadFeed()
    }, [])



    return (
      <>
      {loaded &&
        <>
        <div className="containers">          
          <header>
              <Nav />
          </header>
          <aside className="active">
              <Profile username={username} loadFeed={loadFeed} pState={pState} />
          </aside>          
          <main>
            <div className="m_title">
              <span>{fullname && `${fullname[0]}, `}Feed</span>
            </div>
            {data.length ?
            <div className="m_c">
              {data.map((feed, index) => (
                <div className="" style={{padding: '0 10px', display: 'inline-block'}}>
                  <Card loadFeed={loadFeed} feed={feed} index={index} card="feed" /> 
                </div>
              ))}
            </div> :
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '300px',
              fontSize: '20px',
            }}>
              <span style={{padding: '0 10px'}}>
                Start following peoples? 
              </span>
              <a href="/explore" style={{
                textDecoration: 'none',
                color: '#555'
              }}>Here</a>
            </div>}
          </main>
          <footer className="active">
            <Footer pState={pState} />
          </footer>
      </div>
      </> 
      }
      </>
    )
}

export default Feed
