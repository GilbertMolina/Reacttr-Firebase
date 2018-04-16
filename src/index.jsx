import React from 'react'
import { render } from 'react-dom'
import Firebase from 'firebase'

Firebase.initializeApp({
    apiKey: 'AIzaSyBb-K6MrJ56W6oIS3lqJ_5-m10o-ISwK4o',
    authDomain: 'reacttr-firebase.firebaseapp.com',
    databaseURL: 'https://reacttr-firebase.firebaseio.com',
    projectId: 'reacttr-firebase',
    storageBucket: 'reacttr-firebase.appspot.com',
    messagingSenderId: '197665048880'
});

import App from './components/App'

render (
    <App />,
    document.getElementById('root')
)