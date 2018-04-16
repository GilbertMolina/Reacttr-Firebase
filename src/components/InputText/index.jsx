import React from 'react'
import PropTypes from 'prop-types'
import styles from './input-text.css'

function InputText ({ userNameToReply, onSendText, onCloseText }) {
    return (
        <form className={styles.form} onSubmit={onSendText}>
            <textarea
                className={styles.text}
                name='text'
                defaultValue={(userNameToReply) ? `@${userNameToReply} ` : ''}
            ></textarea>
            <div className={styles.buttons}>
                <button className={styles.close} onClick={onCloseText}>Close</button>
                <button className={styles.send} type='submit'>Send</button>
            </div>
        </form>
    )
}

InputText.propTypes = {
    userNameToReply: PropTypes.string.isRequired,
    onSendText: PropTypes.func.isRequired,
    onCloseText: PropTypes.func.isRequired
}

export default InputText