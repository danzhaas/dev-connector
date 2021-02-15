import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addComment, anonComment } from '../../actions/post'

const ChatForm = ({ postId, addComment, auth }) => {
    const [text, setText] = useState('')

    return (
        <div class="post-form">
            <form class="form" 
                // onSubmit={e => {
                // e.preventDefault();
                // if (auth.isAuthenticated) {
                //     addComment({ postId, text });
                // } else {
                //     anonComment({ postId, text });
                // };
                // setText('');
                // }} 
            >
                <input 
                    id="chat-form"
                    type="text" 
                    name="text"
                    value={text}
                    placeholder="Reply"
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter'){
                            e.preventDefault();
                            if (auth.isAuthenticated) {
                                console.log("addComment")
                                addComment( postId,{ text });
                            } else {
                                console.log("anonComment");
                                anonComment( postId, { text })
                            };
                            setText('');
                            // e.stopPropagation();
                        }
                    }}
                    required
                ></input>
                {/* <textarea
                    id="chat-form"
                    name="text"
                    cols="30"
                    rows="1"
                    value={text}
                    placeholder="Reply"
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter'){
                        e.preventDefault();
                        e.stopPropagation();
                        if (auth.isAuthenticated) {
                            addComment({ postId, text });
                        } else {
                            anonComment({ postId, text });
                        };
                        setText('');
                        }
                    }}
                    required
                ></textarea> */}
            </form>
        </div>
    )
}

ChatForm.propTypes = {
    addComment:PropTypes.func.isRequired,
}

export default connect(null, { addComment })(ChatForm)
