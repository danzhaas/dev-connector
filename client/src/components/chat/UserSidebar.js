import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import UserItem from './UserItem';
import { getProfiles } from '../../actions/profile'

const UserSidebar = ({ getProfiles, profile:{ profiles,loading} }) => {
    useEffect(()=> {
        getProfiles();
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
