/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Header from '../components/Header';
import LoginWindow from '../utils/LoginWindow';

export default class Login extends React.Component{

    componentWillMount(){
        if(window.token) window.location.href = '/#/me';
    }

    login(){
        let popup = new LoginWindow(`https://discord.com/api/oauth2/authorize?client_id=757917277164273820&redirect_uri=${encodeURIComponent(`${window.location.origin}/login.html`)}&response_type=code&scope=identify`, 'Discord Authorization', 'height=100&width=600');
        popup.promise.catch(() => alert('Login Failed!'));
        popup.promise.then(code => {
            fetch('https://botlistapi.decimaldev.xyz/login', { headers: { code } })
            .then(res => res.json(), window.alertError)
            .then(data => {
                if(data.token){
                    window.token = data.token;
                    localStorage.setItem('token', data.token);
                    this.props.app.refreshLogin().then(x => {
                        window.location.href = '/#/me';
                    })
                }else{
                    window.alertError();
                } 
            }, window.alertError)
        });
    }

    render(){
        return <>
            <Header/>

            <div className="login-section">
                <p>You have not logged in yet!</p>
                <a onClick={this.login.bind(this)}>Login</a>
            </div>
        </>
    }

}