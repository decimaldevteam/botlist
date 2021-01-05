import Loader from '../components/Loader';
import Header from '../components/Header';
import BotCard from '../components/BotCard';
import React from 'react';
import axios from 'axios';

function Bots({ rawData }) {

    const bots = rawData.filter(x => !x.isSubmission);
    const [content, setContent] = React.useState(bots.map(x => <BotCard bot={x}/>));

    return <>
        <Loader title="Decimal Botlist" description="A place to find great discord bots!"/>
        <Header/>

        <div className="coverpage">
            <h1>Search Bots</h1>
            <p>Search bots which interests you!</p>
            <input id="search" placeholder="Search bots" style={{ boxShadow: 'none' }} onKeyPress={() => {
                try{
                    let search = document.getElementById('search').value;
                    let results = [];
                    if(search.match(/tag:(.*?)/g)){
                        let tag = search.split('tag:')[1];
                        results = bots.filter(x => x.tags.includes(tag));
                    }
                    else results = bots.filter(x => x.name.includes(search) || x.name.startsWith(search) || search.includes(x) || search.startsWith(x));
                    setContent(results.map(x => <BotCard bot={x}/> ));
                }catch(e){}
            }}/>
            <div style={{ marginTop: '10px' }}>
                {['Anime', 'Fun', 'Economy', 'Game', 'Developer', 'Moderation'].map(x => {
                    return <a onClick={() => {
                        let y = x.toLowerCase();
                        document.getElementById('search').value = `tag:${y}`;
                        setContent(bots.filter(x => x.tags ? x.tags.includes(y) : false).map(x => <BotCard bot={x}/> ));
                    }}><span className="badge-mini category-card">{x}</span></a>
                })}
            </div>
        </div>

        <div style={{ padding: '30px' }}>
            <div className="row">{content}</div>
        </div>
    </>

}

Bots.getInitialProps = async (ctx) => {
    try{
        let fetched = await axios.get('https://botlistapi.decimaldev.xyz/all');
        return { rawData: fetched.data };
    }catch(e){
        alert('Api crashed probably!');
    }
}

export default Bots;