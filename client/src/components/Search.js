import './css/Search.css'
import { InputGroup, FormControl, Col, Row } from 'react-bootstrap'

function Search() {
    return (
        <>
            <InputGroup className="search">
                    <div className="column">
                        <img className="search_pic" src="/assets/feed/search.png" />
                        <FormControl className="forms" placeholder="Search" />
                    </div>
            </InputGroup>
        </>
    )
}

export default Search
