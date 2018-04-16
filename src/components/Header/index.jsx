import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import styles from './header.css'

function Header ({ user, onLogout }) {
    return (
        <header className={styles.root}>
            <Link to='/'>
                <h1 className={styles.logo}>Reacttr</h1>
            </Link>
            {handleShowLogoutButton(user, onLogout)}
        </header>
    )
}

function handleShowLogoutButton (user, onLogout) {
    if (user) {
        return (
            <button
                className={styles.button}
                onClick={onLogout}
            >
                <span className="fa fa-lg fa-sign-out"></span> Logout
            </button>
        )
    }
}

Header.prototypes = {
    user: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
}

export default Header