import React from 'react'
import PropTypes from 'prop-types'
import styles from './profile.css'

function Profile ({ picture, username, displayName, emailAddress }) {
    return (
        <div className={styles.root}>
            <img className={styles.avatar} src={picture} />
            <span className={styles.name}>{displayName}</span>
            <ul className={styles.data}>
                <li>
                    <span className='fa fa-user'></span> {username}
                </li>
                <li>
                    <span className='fa fa-envelope'></span>
                    <a href={`mailto:${emailAddress}`}> {emailAddress}</a>
                </li>
            </ul>
        </div>
    )
}

Profile.propTypes = {
    picture: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
}

export default Profile