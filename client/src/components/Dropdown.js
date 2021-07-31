import {Notif} from './Notif'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import './css/Dropdown.css'

function Dropdown() {
    const [click, setClick] = useState(false)

    const handleClick = () => setClick(!click)

    return (
        <> 
            <ul onClick={handleClick} className={click ? "dropdown-menu clicked" : "dropdown-menu"}>
                {Notif.map((item, index) => {     
                    return (
                        <li key={index} className="li">
                            <Link to={item.url} className="link" onClick={() => setClick(false)}>
                                <div className="dropdown-link">                                    
                                    <img className="pic" src={item.pic}/>
                                    {item.name}
                                </div>
                                <div className="comment_head">
                                    Komentar: <a className="comment">{item.comment}</a>
                                </div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default Dropdown
