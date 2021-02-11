import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Spinner from '../../components/layout/Spinner'
import { connect } from 'react-redux'
import { getPost } from '../../actions/post'
import ChatForm from './ChatForm'
import ChatItem from './ChatItem'
import UserSidebar from "./UserSidebar"
import RoomSidebar from "./RoomSidebar"


const MainChat = ({ getPost, post: { post, loading }, match }) => {
    useEffect(()=> {
        getPost();
        // getPost("6024e3765262213ef0554571");
    },[getPost]);

    return loading || post === null ? 
    <Spinner /> 
    : 
    <section className="chat">
        <div className="chat-inner" id="main-chat">

            <RoomSidebar />
            <div id="chat-window">
                <h2 className="chat-heading">{post.text}</h2>
                <div className="chat-items">
                    {post.comments.reverse().map(comment => (
                        <ChatItem comment={comment} />
                    ))}
                    <ChatForm postId={post._id} />
                </div>
            </div>
            <UserSidebar />

        </div>
    </section>
}

MainChat.propTypes = {
    getPost: PropTypes.func.isRequired,  
    post: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPost })(MainChat)
