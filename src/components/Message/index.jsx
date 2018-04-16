import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styles from './message.css'

class Message extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pressRetweet: false,
            pressFavorite: false,
            mouseOverReplyTweet: false
        }

        this.onPressRetweet = this.onPressRetweet.bind(this)
        this.onPressFavorite = this.onPressFavorite.bind(this)
        this.onMouseOverReplyTweet = this.onMouseOverReplyTweet.bind(this)
        this.onMouseLeaveReplyTweet = this.onMouseLeaveReplyTweet.bind(this)
    }

    onPressRetweet () {
        this.props.onRetweet()

        this.setState({
            pressRetweet: true
        })
    }

    onPressFavorite () {
        this.props.onFavorite()

        this.setState({
            pressFavorite: true
        })
    }

    onMouseOverReplyTweet () {
        this.setState({
            mouseOverReplyTweet: true
        })
    }

    onMouseLeaveReplyTweet () {
        this.setState({
            mouseOverReplyTweet: false
        })
    }

    render () {
        let dateFormat = moment(this.props.msg.date).fromNow()

        return (
            <div className={styles.root}>
                <div className={styles.user}>
                    <figure>
                        <img className={styles.avatar} src={this.props.msg.picture} />
                    </figure>
                    <span className={styles.displayName}>{this.props.msg.displayName}</span>
                    <span className={styles.username}>{this.props.msg.username}</span>
                    <span className={styles.date}>{dateFormat}</span>
                </div>
                <h3>{this.props.msg.text}</h3>
                <div className={styles.buttons}>
                    <div 
                        className={(this.state.mouseOverReplyTweet) ? styles.mouseOverReplyTweet : styles.mouseLeaveReplyTweet} 
                        onMouseOver={this.onMouseOverReplyTweet} 
                        onMouseLeave={this.onMouseLeaveReplyTweet}
                        onClick={this.props.onReplyTweet}
                    >
                        <span className='fa fa-reply'></span>
                    </div>
                    <div 
                        className={(this.props.msg.retweets != 0) ? styles.rtGreen : ''}
                        onClick={this.onPressRetweet}
                    >
                        <span className='fa fa-retweet'></span>
                        <span className={styles.num}>{this.props.msg.retweets}</span>
                    </div>
                    <div 
                        className={(this.props.msg.favorites != 0) ? styles.favYellow : ''}
                        onClick={this.onPressFavorite}
                    >
                        <span className='fa fa-star'></span>
                        <span className={styles.num}>{this.props.msg.favorites}</span>
                    </div>
                </div>
            </div>
        )
    }
}

Message.propTypes = {
    msg: PropTypes.object.isRequired,
    onFavorite: PropTypes.func.isRequired,
    onRetweet: PropTypes.func.isRequired,
    onReplyTweet: PropTypes.func.isRequired
}

export default Message