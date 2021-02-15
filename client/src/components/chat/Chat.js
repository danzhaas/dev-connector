import React from 'react'
import ChatWindow from './ChatWindow'
import UserSidebar from "./UserSidebar"
import ThreadSidebar from "./ThreadSidebar"

const Chat = ({ match }) => {

    return (
        <section className="chat">
            <div className="chat-inner" id="main-chat">
                <ThreadSidebar />
                <ChatWindow match={ match } />
                <UserSidebar />
            </div>
        </section>
    )
}

export default Chat
