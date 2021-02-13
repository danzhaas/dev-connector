import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
// import UserItem from './UserItem';
import { getProfiles } from '../../actions/profile'


const UserItem = ({ profile: { user: { _id, name }}}) => {
    
    return (
        <div className='user-item'>
                <strong>{name}</strong>{' '}
                <Link to={`/profile/${_id}`} >
                    <i className="fas fa-user"></i>{' '}
                </Link>
                <Link to={`/profile/${_id}`} >
                    <i class="fas fa-comment-alt"></i>
                </Link>
        </div>
    )
}

const UserSidebar = ({ getProfiles, profile:{ profiles,loading} }) => {
    useEffect(()=> {
        getProfiles("chat");
    }, [getProfiles])

    return (
        <section className="chat-sidebar">
            { loading ? 
                <Spinner /> 
                : 
                <Fragment>
                    <div className="users bg-light">
                    <h1 className='chat-heading'>Developers</h1>
                        {(profiles.length > 0) ? (
                            profiles.map(profile => (
                                <UserItem key={profile._id} profile={profile} />
                            ))
                        ) :
                            <h4>No profiles found...</h4>
                        }
                    </div>
                </Fragment> 
            }
        </section>
    )
}

UserSidebar.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(UserSidebar)
