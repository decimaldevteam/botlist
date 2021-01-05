import Loader from '../components/Loader';
import Header from '../components/Header';
import LoginWindow from '../components/LoginWindow';
import React from 'react';

export default class Login extends React.Component{

    componentDidMount(){
        if(localStorage.getItem('token')) window.location.href = '/me';
    }

    render(){
        return <>
            <Loader title="Login" description="Login to our botlist!"/>
            <Header/>

            <div className="login-section">
                <p>You have not logged in yet!</p>
                <a onClick={() => {
                    new LoginWindow(`https://discord.com/api/oauth2/authorize?client_id=789752603679916044&redirect_uri=${encodeURIComponent(`${window.location.origin}/login.html`)}&response_type=code&scope=identify`, 'Discord Authorization', 'height=100&width=600')
                    .promise.then(code => {
                        let err = e => alert('Login api failed!');

                        fetch('https://botlistapi.decimaldev.xyz/v2/login', { headers: { code } })
                        .then(res => res.json(), err)
                        .then(({ token }) => {
                            localStorage.setItem('token', token);
                            window.location.href = '/me';
                        }, err)
                    }, () => alert('Login Failed!'))
                }}>Login</a>
            </div>
        </>
    }

}