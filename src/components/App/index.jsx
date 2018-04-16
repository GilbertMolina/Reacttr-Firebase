import React, { Component } from 'react'
import { HashRouter, Match } from 'react-router'
import Firebase from 'firebase'
import 'normalize-css'
import styles from './app.css' 

import Header from '../Header'
import Main from '../Main'
import Profile from '../Profile'
import Login from '../Login'

class App extends Component {
    constructor () {
        super()

        this.state = {
            user: null

            // The structure of the user object looks like this
            // user: {
            //         displayName: 'Gilbert Molina',
            //         username: 'gmolinac',
            //         email: 'gmolinac@outlook.com',
            //         photoURL: 'https://avatars1.githubusercontent.com/u/5861707?s=400&u=9816344e8bfa441b15563f516475dbe7d643710a&v=4'
            //     }
        }

        this.handleOnAuthGitHub = this.handleOnAuthGitHub.bind(this)
        this.handleOnAuthFacebook = this.handleOnAuthFacebook.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    componentWillMount () {
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ 
                    user: user
                 })
            } else {
                this.setState({ 
                    user: null
                 })
            }
        })
    }

    handleOnAuthGitHub () {
        const provider = new Firebase.auth.GithubAuthProvider()

        Firebase.auth().signInWithPopup(provider)
            .then()
            .catch(error => console.error(`Error: + ${error.code} (${error.message})`))
    }

    handleOnAuthFacebook () {
        const provider = new Firebase.auth.FacebookAuthProvider();

        Firebase.auth().signInWithPopup(provider)
            .then()
            .catch(error => console.error(`Error: + ${error.code} (${error.message})`))
    }

    handleLogout () {
        Firebase.auth().signOut()
            .then()
            .catch((error) => console.error(`Error: + ${error.code} (${error.message})`))
    }

    render () {
        return (
            <HashRouter>
                <div>
                    <Header
                        user={this.state.user}
                        onLogout={this.handleLogout}
                    />
                    <div className="container">
                        <Match exactly pattern='/' render={() => {
                            if (!this.state.user) {
                                return (
                                    <Login
                                        onAuthGitHub={this.handleOnAuthGitHub}
                                        onAuthFacebook={this.handleOnAuthFacebook}
                                    />
                                )
                            }

                            return (
                                <Main
                                    user={this.state.user}
                                />
                            )
                        }} />

                        <Match exactly pattern='/profile' render={() => {
                            if (!this.state.user) {
                                return (
                                    <Login
                                        onAuthGitHub={this.handleOnAuthGitHub}
                                        onAuthFacebook={this.handleOnAuthFacebook}
                                    />
                                )
                            }

                            return (
                                <Profile
                                    picture={this.state.user.photoURL}
                                    username={this.state.user.email.split('@')[0]}
                                    displayName={this.state.user.displayName}
                                    emailAddress={this.state.user.email}
                                />
                            )
                        }} />
                    </div>
                </div>
            </HashRouter>
        )
    }
}

export default App