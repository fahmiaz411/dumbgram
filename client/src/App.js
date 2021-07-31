import './components/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import {BrowserRouter as Router, Switch, Route, useHistory} from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextProvider } from './context/UserContext';

import Feed from './pages/Feed';
import Explore from './pages/Explore';
import LandingPage from './pages/LandingPage';
import EditProfile from './pages/EditProfile';
import MyProfile from './pages/MyProfile';
import CreatePost from './pages/CreatePost';

import { API, setAuthToken } from './config/Api'
import Message from './pages/Message';

if(localStorage.token){
  setAuthToken(localStorage.token)
}

function App() {
  const router = useHistory()
  const [state, dispatch] = useContext(UserContext)
  const [aside, setAside] = useState()
  
  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth')
      console.log(response)
      if(response.data.status === 'failed'){
        return dispatch({
          type: "LOGOUT"
        })
      }

      let payload = response.data.data.user
      payload.token = localStorage.token

      dispatch({
        type: "LOGIN_SUCCESS",
        payload
      })

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if(window.innerWidth <= 960){

    }
  }, [window.innerWidth])
  return (
    <>
    <Router>
      <Switch>
      {state.isLogin ?
      <>

      {/* <Route exact path="/feed/zayn" component={Zayn} /> */}

      
      <Route exact path="/">
        <Feed checkUser={checkUser} pState='feed' />
      </Route>

      <Route exact path="/profile">
        <MyProfile checkUser={checkUser} pState='profile' />
      </Route>

      <Route exact path="/feed">
        <Feed checkUser={checkUser} pState='feed' />
      </Route>

      <Route exact path="/user/:username">
        <Feed checkUser={checkUser} pState='feed' />
      </Route>

      <Route exact path="/explore">
        <Explore checkUser={checkUser} pState='explore' />
      </Route>

      <Route exact path="/edit-profile">
        <EditProfile checkUser={checkUser} pState='edit' />
      </Route>

      <Route exact path="/create-post">
        <CreatePost checkUser={checkUser} pState='' />
      </Route>

      <Route exact path="/message">
        <Message checkUser={checkUser} pState='message' />
      </Route>

      <Route exact path="/message/:username">
        <Message checkUser={checkUser} pState='message' />
      </Route>
      {/* <Route path="/message/zayn" component={ZaynMsg} /> */}

      {/* <Route path="/create-post" component={CreatePost} /> */}


      </> 
      : 
      <>
      <Route path="/*" component={LandingPage} />
      </>
      }
      </Switch>
    </Router>
    </>
  );
}

export default App;
