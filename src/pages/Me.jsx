/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Header from '../components/Header';
import UserPage from '../components/UserPage';
import BotCard from '../components/BotCard';

export default class Me extends React.Component{

    constructor(props){
        super(props);
        this.state = { content: <h2 className="load-text">Loading user information...</h2>, bots: [] };
    }

    componentWillMount(){
        if(!window.token) window.location.href = '/#/login';
        else this.setState({ content: <>
            <UserPage user={this.props.user}/>
            <div style={{ textAlign: 'center' }}>
                <a className="login-btn" onClick={() => {
                    localStorage.removeItem('token');
                    window.token = undefined;
                    this.props.app.refreshLogin();
                    alert('Logout has been done!');
                    window.location.href = '/';
                }}>Logout</a>
            </div>
        </> })

        fetch('https://botlistapi.decimaldev.xyz/all')
        .then(res => res.json(), window.alertError)
        .then(bots => this.setState({ bots: bots.filter(x => x.author.id === this.props.user.id) }), window.alertError);
    }

    render(){
        return <>
            <Header/>

            <div style={{ padding: '20px', paddingBottom: '30px' }}>
                {this.state.content}
                                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h1 style={{ paddingBottom: '10px' }}>My Bots</h1>
                    {
                        this.state.bots.length ?
                        <div className='row'>{this.state.bots.map(x => <BotCard bot={x}/>)}</div> :
                        ''
                    }
                </div>
            </div>
        </>
    }

};