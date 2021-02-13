import React from 'react'
import ChatWindow from './ChatWindow'
import UserSidebar from "./UserSidebar"
import ThreadSidebar from "./ThreadSidebar"

const MainChat = ({ match }) => {

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

export default MainChat
