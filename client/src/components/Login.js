import {Button, Modal, Form} from 'react-bootstrap'
import {useState, useContext} from 'react'
import './css/Login.css'
import { useHistory } from 'react-router-dom';
import { API } from '../config/Api';
import { UserContext } from '../context/UserContext';

function Login({show, handleClose, registerShow}) {
  
  const [state, dispatch] = useContext(UserContext)
  const [alerts, setAlerts] = useState('')
  const [data, setData] = useState({
    email: '',
    password: ''
  })


  const [message, setMessage] = useState('')
  const router = useHistory()
  const {email, password} = data
  
  const switchForm = () => {
    handleClose()
    registerShow()
  }

  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault()

      const config = {
        headers: {
          "Content-type":"application/json"
        }
      }

      const body = JSON.stringify({
        ...data
      })

      const response = await API.post('/login', body, config)
      console.log(response)
      if(response.data.status === 'failed'){
        setAlerts('alert alert-danger')
        return setMessage(response.data.message)
      }

      setAlerts('alert alert-success')
      setMessage(`Welcome ${response.data.data.user.fullname}!`)

      setTimeout(() => {

        setMessage('')
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data.user
        })
        router.push('/feed')

      }, 1000)

      

    } catch (error) {
      console.log(error)
    }
  }

    return (
      <>
      <Modal size="sm" centered show={show} onHide={handleClose}>
        <Modal.Body className="m_body">
          <div className="m_title">
            Login
          </div>
          {message &&
          <div class={alerts} role="alert">
              {message}
          </div>}
          <Form onSubmit={handleOnSubmit}>
            <Form.Group className="mb-3" controlId="Email">
              <Form.Control onChange={handleOnChange} value={email} name="email" style={{ background: '#474747', color: 'white', border: 'none' }} type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Password">
              <Form.Control onChange={handleOnChange} value={password} name="password" style={{ background: '#474747', color: 'white', border: 'none' }} type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="label">
                  <Form.Label style={{color: '#B1B1B1', fontSize: '15px'}}>Don't have an account ? Click <a onClick={switchForm} style={{color:'#B1B1B1', fontWeight: '700', textDecoration: 'none', cursor: 'pointer'}}>Here</a></Form.Label>
            </Form.Group>
            <Button className="btn_l" style={{width: '100%'}} type="submit">
              Login
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      </>
    )
}

export default Login
