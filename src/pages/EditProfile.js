import { useContext, useState, useEffect } from 'react'
import '../components/css/pages/EditProfile.css'
import Nav from '../components/Nav'
import Profile from '../components/Profile'
import Footer from '../components/Footer'
import { API } from '../config/Api'
import { UserContext } from '../context/UserContext'
import { useHistory } from 'react-router-dom'

function EditProfile({pState, checkUser}) {

    const router = useHistory()

    const [state, dispatch] = useContext(UserContext)
    const [profile, setProfile] = useState([])

    const [preview, setPreview] = useState()
    const profilePath = 'http://localhost:5001/uploads/'

    const [data, setData] = useState({
        fullname : '',
        username: '',
        bio: '',
        p_image: ''
    })

    const loadProfile = async () => {
        try {            
            const response = await API.get(`/user/${state.user.username}`)
            setProfile(response.data.user)
            setPreview(profilePath + response.data.user.p_image)
            checkUser()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // let url = URL.createObjectURL(profilePath + profile.p_image)
        // console.log(url)
        setData({
            fullname: profile.fullname,
            username: profile.username,
            bio: profile.bio,
        })
    }, [profile])

    useEffect(() => {
        loadProfile()
    }, [])


    const { fullname, username, bio, p_image } = data

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value
        })

        if(e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }

    }
    console.log(data)
    
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type":`${p_image ? 'multipart/form-data' : 'application/json'}`
                }
            }

            console.log(config)

            let formData
            if(p_image == ''){
                formData = JSON.stringify({...data})
            } else {
                formData = new FormData()
                formData.set('fullname', fullname)
                formData.set('username', username)
                formData.set('bio', bio)
                formData.set('imageFile', p_image[0], p_image[0].name)
            }

            console.log(formData)

            await API.patch('/user', formData, config)

            router.push('/feed')

        } catch (error) {
            console.log(error)
        }
    }

    console.log(profile)

    return (
        <>
        {profile.length != 0 &&
        <div className="containers">
        <header>
            <Nav />
        </header>
        <aside className="active">
            <Profile pState={pState} />
        </aside>          
        <main>
            <div className="m_title">
              <span>Edit Profile</span>
            </div>
            <div className="ep_content">
                <div className="ep_image">
                    <img src={preview} />
                </div>
                <label className="inp inp_e">
                        <input
                            type="file" 
                            onChange={handleChange} 
                            name="p_image" 
                            />
                        <span style={{
                            fontSize: '20px'
                        }}>Upload Photos</span>
                    </label>
                <form onSubmit={handleSubmit} className="ep_form">
                    <input onChange={handleChange} className="ep_input" type="text" value={fullname} name="fullname" placeholder="Full Name" required />
                    <input onChange={handleChange} className="ep_input" type="text" value={username} name="username" placeholder="Username" required />
                    <textarea onChange={handleChange} className="in_bio" rows="3" value={bio} name="bio" placeholder="Bio" required />
                    <button type="submit" className="btn_l btn_upl" style={{alignSelf: 'flex-end', height: '50px'}}>Save</button>
                </form>
            </div>
        </main>
        <footer>
          <Footer pState={pState} />
        </footer>
        </div>}
        </>
    )
}

export default EditProfile
