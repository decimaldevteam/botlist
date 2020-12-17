/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Me from './pages/Me';
import New from './pages/New';
import Bot from './pages/Bot';
import Bots from './pages/Bots';
import Edit from './pages/Edit';
import Tos from './pages/Tos'

window.expired = () => {
    localStorage.removeItem('token');
    window.token = undefined;
    alert('Your login session has been expired. You will be redirected to login again!');
    window.location.href = '/#/login';
}

window.getUser = async token => {
    try{
        let fetched = await fetch('https://discord.com/api/users/@me', { headers: { authorization: `Bearer ${token}` } });
        fetched = await fetched.json();
        return fetched;
    }catch(e){ window.expired() }
}

window.alertError = () => alert('Uh Oh! This either happened due to failiure of api or the api is under maintainance!');

export default class App extends React.Component{

    constructor(props){
        super(props);
        this.state = { content: null, user: {} };
    }

    componentWillMount(){
        window.token = localStorage.getItem('token');

        if(window.token){
            window.getUser(window.token)
            .then(data => {
                this.state.user = data;
                this.router();
                window.addEventListener('hashchange', this.router.bind(this));
                window.token = localStorage.getItem('token');
            });
        }else{
            this.router();
            window.addEventListener('hashchange', this.router.bind(this));
            window.token = localStorage.getItem('token');
        }
    }

    async refreshLogin(){
        if(window.token){
            let user = await window.getUser(window.token)
            this.setState({ user });
        }else{
            this.setState({ user: {} });
        }
    }

    router(){
        let route = window.location.hash.slice(2);
        window.token = localStorage.getItem('token');

        if(route === 'login') return this.setState({ content: <Login app={this}/> });
        else if(route === 'me') return this.setState({ content: <Me app={this} user={this.state.user}/> });
        else if(route === 'new') return this.setState({ content: <New user={this.state.user}/> });
        else if(route.startsWith('bot/')) return this.setState({ content: <Bot user={this.state.user} id={route.split('/')[1]}/> });
        else if(route.startsWith('edit/')) return this.setState({ content: <Edit id={route.split('/')[1]}/> });
        else if(route === 'bots') return this.setState({ content: <Bots/> });
        else if(route === 'terms') return this.setState({ content: <Tos/> });
        else if(route === 'discord') return window.location.href = 'https://discord.gg/FrduEZd';
        else return this.setState({ content: <Home/> });
    }

    render(){
        return this.state.content;
    }

}