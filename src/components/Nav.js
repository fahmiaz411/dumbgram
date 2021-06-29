import { Link } from 'react-router-dom'
import {useState, useEffect} from 'react'
import Dropdown from './Dropdown'
import Button from './Button'
import './css/Nav.css'
import Search from './Search'

function Nav({pState}) {
    const [click, setClick] = useState(false)
    const [dropdown, setDropdown] = useState(false)

    console.log(pState)

    const [messageOpacity, setMessageOpacity] = useState()

    useEffect(() => {
        if(pState == 'message'){
            setMessageOpacity(1)
        }
    }, [])

    const handleClick = () => setClick(!click)
    return (
        <div className="content">
           <div className="left"> 
            <Search />             
           </div>
           <div className="right">
                <div className="notif">   
                    <div style={{display: 'flex'}}>                
                        <img className="notif_pic" src="/assets/feed/notif.png" />
                        <div style={{
                            background: 'red',
                            borderRadius: '50%',
                            width: '15px',
                            height: '15px',
                            position: 'absolute',
                            transform: 'translateX(13px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box',
                            paddingRight: '2px',
                            fontSize: '10px',
                            color: 'white'
                        }}>20</div>
                        <div style={{
                            display: 'none',
                            position: 'absolute',
                            marginTop: '40px',
                            width: '300px',
                            right: '100px',
                            background: 'red',
                            color: 'white'
                        }}>
                            Notif
                        </div>
                        {/* <i className="fas fa-caret-down"/> */}
                    </div>     
                </div>
                <div className="message" style={{opacity: `${messageOpacity}`}}>      
                    <Link to="/message" className="nav-links">
                        <img className="message_pic" src="/assets/feed/share.png" /> 
                    </Link>        
                </div>
                <div className="buttons">        
                    <Button />
                </div>
           </div>
        </div>
    )
}

export default Nav
