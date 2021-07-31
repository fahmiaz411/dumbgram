import Card from '../components/Card'
import Nav from '../components/Nav'
import Profile from '../components/Profile'
import { useState, useEffect } from 'react'
import { API } from '../config/Api'
import Footer from '../components/Footer'

function Explore({pState, checkUser}) {

    const [feeds, setFeeds] = useState([])
    const [loaded, setLoaded] = useState(false)

    const loadFeed = async () => {
      try {
        checkUser()
        const response = await API.get('/feeds')
        setFeeds(response.data.data.feed)
        setLoaded(true)
      } catch (error) {
        console.log(error)
      }
    }

    console.log(feeds)

    useEffect(() => {
      loadFeed()
    }, [])
    return (
      <>
      {loaded &&
        <div className="containers">
          <header>
              <Nav />
          </header>
          <aside className="active">
              <Profile pState={pState} />
          </aside>          
          <main>
            <div className="m_title">
              <span>Explore</span>
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
      </div>
      }
      </>
    )
}

export default Explore
