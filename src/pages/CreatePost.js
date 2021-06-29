import { useContext, useState, useEffect } from 'react'
import '../components/css/pages/EditProfile.css'
import Nav from '../components/Nav'
import Profile from '../components/Profile'
import Footer from '../components/Footer'
import { API } from '../config/Api'
import { UserContext } from '../context/UserContext'
import { useHistory } from 'react-router-dom'

function CreatePost({pState, checkUser}) {

    const router = useHistory()

    const [state, dispatch] = useContext(UserContext)
    const [profile, setProfile] = useState([])
    const [preview, setPreview] = useState()
    const profilePath = '/assets/people/'

    const [data, setData] = useState({
        caption: '',
        image: ''
    })

    const loadProfile = async () => {
        try {            
            const response = await API.get(`/user/${state.user.username}`)
            setProfile(response.data.user)     
            checkUser()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfile()
    }, [])


    const { caption } = data

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value
        })

        if(e.target.type === 'file'){
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    "Content-type":"multipart/form-data"
                }
            }

            const formData = new FormData()
            formData.set('caption', data.caption)
            formData.set('imageFile', data.image[0], data.image[0].name)

            await API.post('/feed', formData, config)

            router.push('/profile')

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
              <span>Create Post</span>
            </div>
            <div className="ep_content">
                <div className="ep_image cp_image">
                    {preview && <img src={preview} />}
                </div>
                <form 
                    onSubmit={
                        handleSubmit}
                    className="ep_form"
                    >
                    <label className="inp">
                        <input
                            type="file" 
                            onChange={handleChange} 
                            name="image" 
                            className="btn_l btn_upl"
                            required />
                        <span style={{
                            fontSize: '20px'
                        }}>Upload Photos or Videos</span>
                    </label>
                    <textarea onChange={handleChange} className="in_bio" rows="3" value={caption} name="caption" placeholder="Caption" required />
                    <button type="submit" className="btn_l btn_upl" style={{alignSelf: 'flex-end', height: '50px'}}>Upload</button>
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

export default CreatePost
