import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Spinner from '../layout/Spinner';
import { getPost, getPosts } from '../../actions/post'


const ThreadItem = ({ post: { _id, text }, getPost }) => {
    return (
        <Link className='thread-item' key={_id} to={`/chat/${_id}`} onClick={ () => getPost({_id}) } >
            <i className="fas fa-comments"></i><strong>&nbsp;{text}</strong>
        </Link>
    )
}


const ThreadSidebar = ({ getPost, getPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getPosts()
    }, [getPosts])

    return (
        <section className="chat-sidebar">
            { loading ? 
                <Spinner /> 
                : 

                <div className="users bg-light">
                    <h1 className='chat-heading'>Threads</h1>
                    {
                        (posts.length > 0) && posts.map(
                            post => <ThreadItem post={post} getPost={getPost} />
                        )
                        ||
                        <h4>No Threads found...</h4>
                    }
                </div>
            }
        </section>
    )
}

ThreadSidebar.propTypes = {
    getPost: PropTypes.func.isRequired,
    getPosts: PropTypes.func.isRequired,
    post:PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPost, getPosts })(ThreadSidebar)
