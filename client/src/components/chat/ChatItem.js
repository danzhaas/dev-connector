import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { addLike, removeLike, deletePost } from '../../actions/post'

const ChatItem = ({ comment }) => (
    <div className="chat-item" key={comment.id}>
        <Link to={"/profile/"+comment.user}><strong>{comment.name}</strong></Link><p>: {comment.text} </p>
    </div>
);

ChatItem.defaultProps= {
    showActions: true
}

ChatItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(ChatItem)
