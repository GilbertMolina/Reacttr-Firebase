import React from 'react'
import PropTypes from 'prop-types'
import Message from '../Message'
import styles from './message-list.css'

function MessageList ({ messages, onRetweet, onFavorite, onReplyTweet }) {
    return(
        <div className={styles.root}>
            {messages.map(msg => {
                return (
                    <Message
                        msg={msg}
                        key={msg.id}
                        onRetweet={() => onRetweet(msg.id)}
                        onFavorite={() => onFavorite(msg.id)}
                        onReplyTweet={() => onReplyTweet(msg.id, msg.username)}
                    />
                )
            }).reverse()}
        </div>
    )
}

// function orderArrayByDate (messages) {
//     messages.sort((a, b) => { return b.date - a.date });
// }

MessageList.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRetweet: PropTypes.func.isRequired,
    onFavorite: PropTypes.func.isRequired,
    onReplyTweet: PropTypes.func.isRequired
}

export default MessageList