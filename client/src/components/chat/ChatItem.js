import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

// const ChatItem = ({ comment }) => (
//     <div className="chat-item" key={comment.id}>
//         <Link to={"/profile/"+comment.user}><strong>{comment.name}</strong></Link><p>: {comment.text} </p>
//     </div>
// );

ChatItem.defaultProps= {
    showActions: true
}

ChatItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default ChatItem
