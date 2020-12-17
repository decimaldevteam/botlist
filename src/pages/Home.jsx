/* eslint-disable react/no-direct-mutation-state */
import React from 'react';
import Header from '../components/Header';
import BotCard from '../components/BotCard';

class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = { bots: [] };
    }

    componentWillMount(){
        let alertError = () => alert('Uh Oh! This either happened due to failiure of api or the api is under maintainance!');

        fetch('https://botlistapi.decimaldev.xyz/all')
        .then(res => res.json(), alertError)
        .then(bots => this.setState({ bots }), alertError)
    }

    render(){
        const Submissions = () => this.state.bots.filter(x => x.isSubmission).map(x => <BotCard bot={x}/>)
        const bots = this.state.bots.filter(x => !x.isSubmission);
        const RandomBots = () => bots.sort(() => Math.random() - 0.5).slice(0, 8).map(x => <BotCard bot={x}/>);
        const RecentBots = () => bots.slice(0, 8).map(x => <BotCard bot={x}/>);
        const TopBots = () => bots.sort((a, b) => b.votes - a.votes).slice(0, 8).map(x => <BotCard bot={x}/>);

        return <>
            <Header/>

            <div className="coverpage">
                <h1>Decimal Botlist</h1>
                <p>A place to find bots which suits your taste!</p>
            </div>

            <div style={{ padding: '30px' }} className="home-content">
                <h1>Top Bots:</h1>
                <div className="row"><TopBots/></div>

                <h1>Recent Bots:</h1>
                <div className="row"><RecentBots/></div>

                <h1>Submissions:</h1>
                <div className="row"><Submissions/></div>
                
                <h1>Random Bots:</h1>
                <div className="row"><RandomBots/></div>
            </div>
        </>
    };

};

export default Home;