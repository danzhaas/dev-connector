import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Spinner from '../../components/layout/Spinner'
import { connect } from 'react-redux'
import { getPost } from '../../actions/post'
import ChatForm from './ChatForm'


const ChatItem = ({ comment }) => (
    <div className="chat-item" key={comment.id} > 
        {   
            comment.name==="Anon" ? 
                <strong>{comment.name}</strong>
                :
                <Link to={"/profile/"+comment.user}>
                    <strong>{comment.name}</strong>
                </Link>
        }
        <p>: {comment.text} </p>
    </div>
);

const ChatWindow = ({ auth, getPost, post: { post, loading }, match }) => {
    useEffect(()=> {
        if (match.params.id === "main") {
            const mainChatId = "6024e3765262213ef0554571";
            getPost(mainChatId)
        } else {
            getPost(match.params.id);
        }
    },[getPost, match.params.id])

    return loading || post === null ? 
        <Spinner /> 
        :
        <div id="chat-window">

            <h2 id="thread-name" className="chat-heading">{post.text}</h2>

            <div className="chat-items">

                <div id="the-items">             
                    { ( post.comments !== undefined ) && 

                        ( 
                            [...post.comments].reverse()
                            .map( comment => 
                                <ChatItem comment={comment} auth={auth} />
                            )
                        )
                    }

                    { ( !auth.isAuthenticated ) && 
                        (<p id="anon-notice" className="chat-item">
                            <strong>SpiderBot:</strong>
                            Welcome! You are not logged in.  Register or Login to start chatting, networking, and building your web.
                        </p>)
                    }   
                </div>

                <ChatForm postId={post._id} auth={auth} />
            </div>

        </div>
}

ChatWindow.propTypes = {
    getPost: PropTypes.func.isRequired,  
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post,
    auth: state.auth
})

export default connect(mapStateToProps, { getPost })(ChatWindow)
