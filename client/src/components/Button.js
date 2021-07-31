import { Link } from 'react-router-dom'
import './css/Button.css'

function Button() {
    return (
        <>
            <Link className="btn_link" to="/create-post">
                <button className="btn_l">
                    <i className="plus">+</i>
                    Create Post
                </button>
            </Link>
        </>
    )
}

export default Button
