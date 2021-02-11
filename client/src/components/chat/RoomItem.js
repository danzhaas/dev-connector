import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { getPost } from '../../actions/post';

const RoomItem = ({ 
    auth, 
    post: { 
        _id, 
        text, 
        name, 
        user
    },
    getPost
}) => {

    return (
            <a className='room-item' key={_id} href={`/chat/${_id}`} onClick={ () => getPost({_id}) } >
                {text}
            </a>
    )
}

export default connect(null, { getPost })(RoomItem)
