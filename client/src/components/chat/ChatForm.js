import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addComment } from '../../actions/post'

const ChatForm = ({ postId, addComment }) => {
    const [text, setText] = useState('')

    return (
        <div class="post-form">
            <form class="form" onSubmit={e => {
                e.preventDefault();
                addComment(postId, { text });
                setText('');
            }}>
                <textarea
                    name="text"
                    cols="30"
                    rows="1"
                    value={text}
                    placeholder="Reply"
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter'){
                        e.preventDefault();
                        addComment(postId, { text });
                        setText('');
                        }
                    }}
                    required
                ></textarea>
            </form>
        </div>
    )
}

ChatForm.propTypes = {
    addComment:PropTypes.func.isRequired,
}

export default connect(null, { addComment })(ChatForm)
