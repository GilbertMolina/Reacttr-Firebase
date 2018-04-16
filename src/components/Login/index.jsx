import React from 'react'
import PropTypes from 'prop-types'
import styles from './login.css'

function Login ({ onAuthGitHub, onAuthFacebook }) {
    return (
        <div className={styles.root}>
            <p className={styles.text}>
                You need to log in first with any of the following services to use the application.
            </p>
            <button
                className={styles.buttonGitHub}
                onClick={onAuthGitHub}
            >
            <div className={styles.icon}><span className='fa fa-github fa-2x'></span></div> Log In with GitHub
            </button>
            <button
                className={styles.buttonFacebook}
                onClick={onAuthFacebook}
            >
                <div className={styles.icon}><span className='fa fa-facebook fa-2x'></span></div> Log In with Facebook
            </button>
        </div>
    )
}

Login.propTypes = {
    onAuthGitHub: PropTypes.func.isRequired,
    onAuthFacebook: PropTypes.func.isRequired
}

export default Login