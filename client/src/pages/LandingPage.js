import {useState} from 'react'
import '../components/css/pages/LandingPage.css'

import Login from '../components/Login'
import Register from '../components/Register'

function LandingPage() {
    
    const [loginShow, setLoginShow] = useState(false);
    const [registerShow, setRegisterShow] = useState(false);
    
    const handleLoginShow = () => setLoginShow(true);
    const handleRegisterShow = () => setRegisterShow(true)
    
    const handleLoginClose = () => setLoginShow(false);
    const handleRegisterClose = () => setRegisterShow(false)
    return (
        <>
            <div className="lp_content">
                <div className="lp_column">
                    <img className="lp_brand" src="/assets/DumbGram.png" />
                    <div className="lp_desc">
                        <h1>Share your best photos or videos</h1>                    
                        <h4>Join now, share your creations with another people and enjoy other creations.</h4>                    
                    </div>
                    <div className="lp_btn">
                        <button onClick={handleLoginShow} className="btn_l" style={{width: '150px', padding: '10px'}}>Login</button>
                        <button onClick={handleRegisterShow} className="btn_d" style={{width: '150px',  padding: '12px', margin: '0 10px'}}>Register</button>
                        <Login registerShow={handleRegisterShow} show={loginShow} handleClose={handleLoginClose}/>
                        <Register loginShow={handleLoginShow} show={registerShow} handleClose={handleRegisterClose}/>
                    </div>
                </div>
                <div className="lp_column">  
                    <div className="lp_img">
                        <div>
                            <img src="/assets//foto4.png" />
                            <img src="/assets//foto3.png" />
                            <img src="/assets//foto7.png" />
                        </div>
                        <div>
                            <img src="/assets//foto1.png" />
                            <img src="/assets//foto6.png" />
                        </div>
                        <div>
                            <img src="/assets//foto2.png" />
                            <img src="/assets//foto5.png" />
                            <img src="/assets//foto8.png" />
                        </div>
                    </div>              
                </div>
            </div>
        </>
    )
}

export default LandingPage
