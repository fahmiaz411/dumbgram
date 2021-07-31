import {useEffect, useState} from 'react'

function MessageDate({data, dateIndex, handleDateIndex}) {

    const now = new Date()
    const date = new Date(data.createdAt)

    const [showDate, setShowDate] = useState(true)

    const day = date.getDay()
    const dayNow = now.getDay()

    const hideSelf = () => {
        if(dateIndex == 100){
            setShowDate(true)
            handleDateIndex(day)
            return
        }
        if(dateIndex != day){
            setShowDate(true)
            handleDateIndex(day)
            return
        }

        setShowDate(false)
        handleDateIndex(day)
    } 

    useEffect(() => {
        hideSelf()
    }, [])

    return (
        <>
        {showDate &&
            <>
                <div style={{
                    alignSelf: 'center',
                    padding: '2px 15px',
                    borderRadius: '5px',
                    background: '#555'
                }}>
                    Yesterday
                </div>
            </>}
        </>
    )
}

export default MessageDate
