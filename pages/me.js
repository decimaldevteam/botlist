import Loader from '../components/Loader';
import React from 'react';
import Header from '../components/Header';
import BotCard from '../components/BotCard';

export default class Me extends React.Component{

    constructor(props){
        super(props);
        this.state = { content: null };
    }

    componentDidMount(){
        let token = localStorage.getItem('token');

        if(!token) window.location.href = '/login';
        else {
            const err = () => alert('Api Failed!');

            fetch('https://botlistapi.decimaldev.xyz/v2/user', { headers: { token, whole: 'true' } })
            .then(res => res.json(), err)
            .then(data => {
                if(data.message == 'broken') {
                    alert('Login has been outdated');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                };

                this.setState({ 
                    content: <>
                        <div className="userpage">
                            <img src={`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp?size=2048`} alt="avatar"/>
                            <h1>{data.username}  <font style={{ opacity: 0.7 }}># {data.discriminator}</font></h1>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <a className="login-btn" onClick={() => {
                                localStorage.removeItem('token');
                                alert('Logout has been done!');
                                window.location.href = '/login';
                            }}>Logout</a>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <h1 style={{ paddingBottom: '10px' }}>My Bots</h1>
                            {data.bots.length ? <div className='row'>{data.bots.map(x => <BotCard bot={x}/>)}</div> : ''}    
                        </div>
                    </>
                })
            }, err);
        }

    }

    render(){
        return <>
            <Loader title="Me" description="Your profile information is here!"/>
            <Header/>

            <div style={{ padding: '20px', paddingBottom: '30px' }}>
                {this.state.content}
            </div>
        </>
    }
};