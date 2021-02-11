import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import RoomItem from './RoomItem';
import { getPosts } from '../../actions/post'

const RoomSidebar = ({ getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts()
    }, [getPosts])
    return (
        <section className="chat-sidebar">
            { loading ? 
                <Spinner /> 
                : 
                <Fragment>
                    <div className="users bg-light">
                    <h1 className='chat-heading'>Rooms</h1>
                        {(posts.length > 0) ? (
                            posts.map(post => (
                                <RoomItem key={post._id} post={post} />
                            ))
                        ) :
                            <h4>No rooms found...</h4>
                        }
                    </div>
                </Fragment> 
            }
        </section>
    )
}

RoomSidebar.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPosts })(RoomSidebar)
