import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

const UserItem = ({ 
    profile: { 
        user: { _id, name }
        } 
    }) => {
    return (
        <div className='user-item'>
            <div className="">
                <strong>{name}</strong>{' '}
                <Link to={`/profile/${_id}`} >
                    <i className="fas fa-user"></i>{' '}
                </Link>
                <Link to={`/profile/${_id}`} >
                    <i class="fas fa-comment-alt"></i>
                </Link>
            </div>
        </div>
    )
}


export default UserItem
