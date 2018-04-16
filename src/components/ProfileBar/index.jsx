import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import moment from 'moment'
import styles from './profile-bar.css'

function ProfileBar ({ picture, username, onOpenText }) {
    return (
        <div className={styles.root}>
            <Link to='/profile'>
                <figure>
                    <img className={styles.avatar} src={picture} />
                </figure>
            </Link>
            <span className={styles.greeting}>Good {getGreeting(moment())}</span>
            <span className={styles.username}>@{username}</span>
            <button 
                className={styles.button} 
                onClick={onOpenText}
            >
                <span className="fa fa-lg fa-edit"></span> New Tweet
            </button>
        </div>
    )
}

function getGreeting (m) {
    var g = null

    if (!m || !m.isValid()) return

    var split_afternoon = 12
    var split_evening = 17
    var currentHour = parseFloat(m.format("HH"))

    if (currentHour >= split_afternoon && currentHour <= split_evening) {
        g = "afternoon"
    } else if (currentHour >= split_evening) {
        g = "evening"
    } else {
        g = "morning"
    }

    return g
}

ProfileBar.propTypes = {
    picture: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    onOpenText: PropTypes.func.isRequired
}

export default ProfileBar