import React from 'react';
import { connect } from 'react-redux'
import { getPost } from '../../actions/post';

// const ThreadItem = ({ post: { _id, text }, getPost }) => {

//     return (
//         <a className='thread-item' key={_id} href={`/chat/${_id}`} onClick={ () => getPost({_id}) } >
//             <i class="fas fa-comments"></i><strong>&nbsp;{text}</strong>
//         </a>
//     )
// }

export default connect(null, { getPost })(ThreadItem)
