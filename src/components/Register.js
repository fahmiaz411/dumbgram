import { useContext, useState } from 'react'
import {Button, Modal, Form, NavLink, Row, Col} from 'react-bootstrap'
import { API } from '../config/Api'
import { UserContext } from '../context/UserContext'
import './css/Login.css'

function Register({show, handleClose, loginShow}) {

  const [state, dispatch] = useContext(UserContext)
  const [alerts, setAlerts] = useState('')
  const [message, setMessage] = useState('')
  const [data, setData] = useState({
    email: '',
    fullname: '',
    username: '',
    password: '',
    bio: 'Your bio here!',
    p_image: 'alt.jpg',
  })

  const { email, fullname, username, password } = data

  const switchForm = () => {
    handleClose()
    loginShow()
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

      const response = await API.post('/register', body, config)
      if(response.data.status === 'failed'){
        setAlerts('alert alert-danger')
        return setMessage(response.data.message)
      }

      setAlerts('alert alert-success')
      setMessage('Registered!')

      setTimeout(() => {
        setMessage('')
        handleClose()
        loginShow()
      }, 1000)

    } catch (error) {
      console.log(error)
    }
  }

    return (
      <>  
      <Modal size="sm" style={{background:''}} centered show={show} onHide={handleClose}>
        <Modal.Body className="m_body">
          <div className="m_title">
            Register
          </div>
          {message &&
          <div class={alerts} role="alert">
              {message}
          </div>}
          <Form onSubmit={handleOnSubmit}>
            <Form.Group className="mb-3" controlId="Email">
              <Form.Control onChange={handleOnChange} value={email} name="email"style={{ background: '#474747', color: 'white', border: 'none' }} type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Control onChange={handleOnChange} value={fullname} name="fullname" style={{ background: '#474747', color: 'white', border: 'none' }} type="text" placeholder="Full name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="username">
              <Form.Control onChange={handleOnChange} value={username} name="username" style={{ background: '#474747', color: 'white', border: 'none' }} type="text" placeholder="Username" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Password">
              <Form.Control onChange={handleOnChange} value={password} name="password" style={{ background: '#474747', color: 'white', border: 'none' }} type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="label">
                  <Form.Label style={{color: '#B1B1B1', fontSize: '15px'}}>Already have an account ? Click <a onClick={switchForm} style={{color:'#B1B1B1', fontWeight: '700', textDecoration: 'none', cursor: 'pointer'}}>Here</a></Form.Label>
            </Form.Group>
            <Button className="btn_l" style={{width: '100%'}} type="submit">
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      </>
    )
}

export default Register
