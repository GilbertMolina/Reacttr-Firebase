import React, { Component } from 'react'
import Firebase from 'firebase'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import MessageList from '../MessageList'
import InputText from '../InputText'
import ProfileBar from '../ProfileBar'

class Main extends Component {
    constructor (props) {
        super(props)

        this.state = {
            user: [],

            // The structure of the user object looks like this
            //     user: {
            //         displayName: this.props.user.displayName,
            //         email: this.props.user.email,
            //         username: this.props.user.email.split('@')[0],
            //         photoURL: this.props.user.photoURL,
            //         retweets: [''],
            //         favorites: ['']
            //     },

            openText: false,
            userNameToReply: '',
            messages: []

            // The structure of the messages object looks like this
            // messages: [
            //     {
            //         id: uuid.v4(),
            //         text: 'Test message',
            //         picture: 'https://avatars1.githubusercontent.com/u/5861707?s=400&u=9816344e8bfa441b15563f516475dbe7d643710a&v=4',
            //         displayName: 'Gilbert Molina',
            //         username: 'gmolinac',
            //         date: Date.now() - 1800000,
            //         retweets: 0,
            //         favorites: 0
            //     },
            //     {
            //         id: uuid.v4(),
            //         text: 'This is another test message',
            //         picture: 'https://avatars1.githubusercontent.com/u/5861707?s=400&u=9816344e8bfa441b15563f516475dbe7d643710a&v=4',
            //         displayName: 'Gilbert Molina',
            //         username: 'gmolinac',
            //         date: Date.now() - 180000,
            //         retweets: 0,
            //         favorites: 0
            //     }
            // ]
        }

        this.handleOpenText = this.handleOpenText.bind(this)
        this.handleSendText = this.handleSendText.bind(this)
        this.handleCloseText = this.handleCloseText.bind(this)
        this.handleRetweet = this.handleRetweet.bind(this)
        this.handleFavorite = this.handleFavorite.bind(this)
        this.handleReplyTweet = this.handleReplyTweet.bind(this)
    }

    componentWillMount () {
        const messagesAdded = Firebase.database().ref().child('messages').orderByChild('date').on('child_added', snapshot => {
            this.setState({
                messages: this.state.messages.concat(snapshot.val()),
                openText: false,
                userNameToReply: ''
            })
        })

        const messagesChangedRef = Firebase.database().ref().child('messages').orderByChild('date').on('child_changed', snapshot => {
            // It gets filtered the messages without the last message changed
            let messagesWithoutTheLastMessageChanged = this.state.messages.filter(msg => msg.id != snapshot.val().id)

            // It adds the message changed to the other messages
            messagesWithoutTheLastMessageChanged.push(snapshot.val())

            this.setState({
                messages: messagesWithoutTheLastMessageChanged,
                openText: false,
                userNameToReply: ''
            })
        })

        const userRef = Firebase.database().ref().child('users').on('value', snapshot => {
            this.setState({
                user: snapshot.val()
            })
        })
    }

    handleOpenText (event) {
        event.preventDefault()
        
        this.setState({
            openText: true 
        })
    }

    handleSendText (event) {
        event.preventDefault()

        let newMessage = {
            id: uuid.v4(),
            text: event.target.text.value,
            date: Date.now(),
            retweets: 0,
            favorites: 0,
            picture: this.props.user.photoURL,
            displayName: this.props.user.displayName,
            email: this.props.user.email,
            username: this.props.user.email.split('@')[0]
        }

        let newUser = {
            displayName: this.props.user.displayName,
            email: this.props.user.email,
            username: this.props.user.email.split('@')[0],
            photoURL: this.props.user.photoURL,
            retweets: [''],
            favorites: [''],
        }
        
        Firebase.database().ref().child('messages/' + newMessage.id).set(newMessage)

        Firebase.database().ref().child('users/' + newUser.username).set(newUser)
    }

    handleCloseText (event) {
        event.preventDefault()
        
        this.setState({
            openText: false,
            userNameToReply: ''
        })
    }

    renderOpenText () {
        if (this.state.openText) {
            return (
                <InputText 
                    onSendText={this.handleSendText}
                    onCloseText={this.handleCloseText}
                    userNameToReply={this.state.userNameToReply}
                />
            )
        }
    }

    handleRetweet (msgId) {
        let username = this.props.user.email.split('@')[0]
        let usersFromFirebase = this.state.user
        let userLoggedIn
        let usersToInsertInState = []

        // It needs to store in 'userLoggedIn' the user corresponding to the user that has started session, otherwise it needs to store in the user in the 'usersToInsertInState' array
        Object.values(usersFromFirebase).forEach(user => {
            if (user.username == username) {
                userLoggedIn = user
            } else if (user.username != username){
                usersToInsertInState.push(user)
            }
        })

        // It needs to store in 'usersToInsertInState' the users that not corresponding to the user that has started session
        Object.values(usersFromFirebase).forEach(user => {
            if (user.username != username) {
                usersToInsertInState.push(user)
            }
        })
        
        // It store in the the variable 'alreadyRetweeted' if the user has already retweeted the tweet
        let alreadyRetweeted = userLoggedIn.retweets.filter(msg => msg == msgId)

        // It validates if the user hasn't retweeted...
        if (alreadyRetweeted == 0) {
            // It increases the 'retweets' in one
            let messagesModified = this.state.messages.map(msg => {
                if (msg.id == msgId) {
                    msg.retweets++
                }
                return msg
            })

            // It creates the variable 'newMessage' to store the message where the 'msg.id' is equal to the 'msgId' gotten by the parameter
            let newMessage = this.state.messages.map(msg => { return (msg.id == msgId) ? msg : null }).filter(msg => msg != null)[0]

            // It pushes the 'msgId' to the retweets array
            userLoggedIn.retweets.push(msgId)

            // It eliminates the retweets value where the is equal to zero, because it was necessary to add a 0 value to created the retweets array
            if (userLoggedIn.retweets[0] == '') {
                userLoggedIn.retweets.splice(0, 1)
            }
            
            // It pushes the user 'userLoggedIn' with the values of retweets modified to the usersToInsertInState
            usersToInsertInState.push(userLoggedIn)

            // It modifies the state
            this.setState({
                messages: messagesModified,
                user: usersToInsertInState
            })

            // It sets the messages to Firebase to the child 'message + msgId', in order to find the correspondig child with the message id
            Firebase.database().ref().child('messages/' + msgId).set(newMessage)

            // It sets the users to Firebase to the child 'users + username', in order to find the correspondig child with the username
            Firebase.database().ref().child('users/' + username).set(userLoggedIn)
        }
    }
    
    handleFavorite (msgId) {
        let username = this.props.user.email.split('@')[0]
        let usersFromFirebase = this.state.user
        let userLoggedIn
        let usersToInsertInState = []

        // It needs to store in 'userLoggedIn' the user corresponding to the user that has started session, otherwise it needs to store in the user in the 'usersToInsertInState' array
        Object.values(usersFromFirebase).forEach(user => {
            if (user.username == username) {
                userLoggedIn = user
            } else if (user.username != username) {
                usersToInsertInState.push(user)
            }
        })

        // It store in the the variable 'alreadyFavorited' if the user has already favorited the tweet
        let alreadyFavorited = userLoggedIn.favorites.filter(msg => msg == msgId)

        // It validates if the user hasn't favorited...
        if (alreadyFavorited == 0) {
            // It increases the 'favorites' in one
            let messagesModified = this.state.messages.map(msg => {
                if (msg.id == msgId) {
                    msg.favorites++
                }
                return msg
            })

            // It creates the variable 'newMessage' to store the message where the 'msg.id' is equal to the 'msgId' gotten by the parameter
            let newMessage = this.state.messages.map(msg => { return (msg.id == msgId) ? msg : null }).filter(msg => msg != null)[0]

            // It pushes the 'msgId' to the favorites array
            userLoggedIn.favorites.push(msgId)

            // It eliminates the favorites value where the is equal to zero, because it was necessary to add a 0 value to created the favorites array
            if (userLoggedIn.favorites[0] == '') {
                userLoggedIn.favorites.splice(0, 1)
            }

            // It pushes the user 'userLoggedIn' with the values of favorites modified to the usersToInsertInState
            usersToInsertInState.push(userLoggedIn)

            // It modifies the state
            this.setState({
                messages: messagesModified,
                user: usersToInsertInState
            })
            
            // It sets the messages to Firebase to the child 'message + msgId', in order to find the correspondig child with the message id
            Firebase.database().ref().child('messages/' + msgId).set(newMessage)

            // It sets the users to Firebase to the child 'users + username', in order to find the correspondig child with the username
            Firebase.database().ref().child('users/' + username).set(userLoggedIn)
        }
    }

    handleReplyTweet (msgId, username) {
        event.preventDefault()

        this.setState({
            openText: true,
            userNameToReply: username
        })
    }

    render () {
        return (
            <div>
                <ProfileBar
                    picture={this.props.user.photoURL}
                    username={this.props.user.email.split('@')[0]}
                    onOpenText={this.handleOpenText}
                />
                {this.renderOpenText()}
                <MessageList 
                    messages={this.state.messages}
                    onRetweet={this.handleRetweet}
                    onFavorite={this.handleFavorite}
                    onReplyTweet={this.handleReplyTweet}
                />
            </div>
        )
    }
}

Main.propTypes = {
    user: PropTypes.object.isRequired
}

export default Main