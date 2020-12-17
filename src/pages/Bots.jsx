/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Header from '../components/Header';
import BotCard from '../components/BotCard';

export default class Bots extends React.Component{

    constructor(props){
        super(props);
        this.state = { content: <h1>Loading bots....</h1> };
        this.bots = [];
    }

    componentWillMount(){
        let alertError = () => alert('Uh Oh! This either happened due to failiure of api or the api is under maintainance!');

        fetch('https://botlistapi.decimaldev.xyz/all')
        .then(res => res.json(), alertError)
        .then(bots => {
            this.bots = bots;
            this.setState({ content: bots.map(x => <BotCard bot={x}/> )});
        }, alertError)
    }

    search(){
        try{
            let search = document.getElementById('search').value;
            let results = [];
            if(search.match(/tag:(.*?)/g)){
                let tag = search.split('tag:')[1];
                results = this.bots.filter(x => x.tags.includes(tag));
            }
            else results = this.bots.filter(x => x.name.includes(search) || x.name.startsWith(search) || search.includes(x) || search.startsWith(x));
            this.setState({ content: results.map(x => <BotCard bot={x}/> )});
        }catch(e){}
    }

    render(){
        return <>
            <Header/>

            <div className="coverpage">
                <h1>Search Bots</h1>
                <p>Search bots which interests you!</p>
                <input id="search" placeholder="Search bots" style={{ boxShadow: 'none' }} onKeyPress={this.search.bind(this)}/>
                <div style={{ marginTop: '10px' }}>
                    {['Anime', 'Fun', 'Economy', 'Game', 'Developer', 'Moderation'].map(x => {
                        return <a onClick={function() {
                            let y = x.toLowerCase();
                            document.getElementById('search').value = `tag:${y}`;
                            this.setState({ content: this.bots.filter(x => x.tags ? x.tags.includes(y) : false).map(x => <BotCard bot={x}/> )});
                        }.bind(this)}><span className="badge-mini category-card">{x}</span></a>
                    })}
                </div>
            </div>

            <div style={{ padding: '30px' }}>
                <div className="row">
                    {this.state.content}
                </div>
            </div>
        </>
    }

};