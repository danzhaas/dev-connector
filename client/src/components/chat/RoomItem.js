import React from 'react';
import { Link } from 'react-router-dom';
import { getPost } from '../../actions/post';

const RoomItem = ({ post: { _id, text } }) => {
    
    return (
        <div className='room-item'>                
            {/* <Link to={`/post/${_id}`} > */}
                <p onClick={ () => getPost({_id}) } >{text}</p>
            {/* </Link> */}
        </div>
    )
}


export default RoomItem
