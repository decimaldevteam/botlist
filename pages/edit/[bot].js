import Header from '../../components/Header';
import Loader from '../../components/Loader';
import React from 'react';
import Markdown from 'react-showdown';
import axios from 'axios';

function Entry({ name, info, id, placeholder, value = '' }){
    React.useEffect(() => document.getElementById(id).value = value, []);

    return <tr className="entry" style={{ width: '100%' }}>
        <td className="new-bot-entry-label">
            <h3 style={{ fontWeight: 'bolder' }}>{name}:</h3>
            <p>{info || null}</p>
        </td>
        <td className="new-bot-entry-cover">
            <input id={id} placeholder={placeholder}/>
        </td>
    </tr>
}

function edit(id){
    const inputs = {};

    ['prefix', 'perms', 'sserver', 'website', 'other-devs', 'tags', 'short-des', 'long-des'].forEach(x => {
        inputs[x] = document.getElementById(x).value;
    });

    if(!inputs.prefix) return alert('Prefix is missing!');
    if(!inputs['short-des']) return alert('Short description field is missing!');

    let devs = inputs['other-devs'].split(', ');
    if(devs.length > 3) return alert('Other developers fields must have only 3 or less id only!');

    const data = {
        token: localStorage.getItem('token'),
        developers: devs.filter(Boolean),
        id,
        perms: inputs.perms,
        prefix: inputs.prefix,
        website: inputs.website,
        support: inputs.sserver,
        tags: inputs.tags.split(', ').filter(Boolean),
        description: {
            short: inputs['short-des'],
            long: inputs['long-des']
        }
    };
    let alertError = () => alert('Uh Oh! This either happened due to failiure of api or the api is under maintainance!');

    fetch(`https://botlistapi.decimaldev.xyz/v2/edit/${id}`, { headers: { data: encodeURIComponent(JSON.stringify(data)) } })
    .then(res => res.json(), alertError)
    .then(data => {
        if(data.message == 'OK') window.location.href = `/bot/${id}`;
        else if(data.message == 'user not in guild') {
            alert('You have not joined our server! You will be redirected to the server invite to join our server. After joining our server, try to submit the bot. This is just for verification!');
            window.location.href = 'https://discord.gg/FrduEZd';
        }
        else if(data.message == 'invalid owner') return alert('You are not the owner of the bot!');
        else if(data.message == 'bot exists') return alert('Bot has been already registered!');
        else if(data.message == 'invalid bot') return alert('Invalid client id provided!');
        else if(data.message == 'provided bot is not a bot') return alert('Provided client id is not a bot');
        else if(data.message == 'one of dev is invalid') return alert('One of the id provided in other developers is invalid!');
        else if(data.message == 'invalid token') window.location.href = '/me';
    }, alertError)
}

function Edit({ bot }){

    React.useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/login';
        if(!bot) window.location.href = '/';
        document.getElementById('long-des').value = bot.description.long;
    }, []);

    const [description, setDescription] = React.useState(bot.description.long)

    return <>
        <Header/>
        <Loader title={bot.name} description={bot.description.short} img={`${bot.avatar}?size=2048`}/>

        <div className="coverpage">
            <h1>Edit</h1>
            <p>Edit your bot</p>
        </div>

        <div style={{ padding: '30px' }}>
            <div>
                <table style={{ width: '100%' }} className="new-box">
                    <Entry name="Prefix" id="prefix" info="Your bot's prefix" placeholder="!" value={bot.prefix}/>
                    <Entry name="Permissions" id="perms" info="Your bot's required permission interger!" placeholder="8" value={bot.perms}/>
                    <Entry name="Support Server" id="sserver" info="Invite of bot's support server!" placeholder="https://discord.gg/invite" value={bot.discord}/>
                    <Entry name="Website" id="website" info="Url of the bot's official website!" placeholder="https://example.com" value={bot.website}/>
                    <Entry name="Other Developers" id="other-devs" info="The other developers of yout bot in id seperated with commas! Max: 2" placeholder="0123456789, 9876543210"/>
                    <Entry name="Tags" id="tags" info="Tags which describes your bot seperate with commas. This will help users to find your bot!" placeholder="fun, music, developer" value={bot.tags ? bot.tags.join(',') : ''}/>
                    <Entry name="Short Description" id="short-des" info="The short description of your bot!" placeholder="An awesome bot with 8ball command!" value={bot.description.short}/>
                    <tr className="entry" style={{ width: '100%' }}>
                        <td className="new-bot-entry-label">
                            <h3 style={{ fontWeight: 'bolder' }}>Long Description:</h3>
                            <p>Long description of your bot! Supports markdown too...</p>
                        </td>
                        <td className="new-bot-entry-cover">
                            <textarea id="long-des" onKeyPress={e => setDescription(document.getElementById('long-des').value + String.fromCharCode(e.keyCode || e.which))} placeholder="Something brief about yout bot!"/>
                        </td>
                    </tr>
                    <tr className="entry" style={{ width: '100%' }}>
                        <td className="new-bot-entry-label">
                            <h3 style={{ fontWeight: 'bolder' }}>Output:</h3>
                            <p>Markdown output from long description...</p>
                        </td>
                        <td className="new-bot-entry-cover">
                            <Markdown markdown={description}/>
                        </td>
                    </tr>
                </table>
            </div>

            <a onClick={() => edit(bot.id)} className="login-btn" style={{ width: '100%' }}>Edit</a>
            <div align="center"><font>By editing, you accept our terms of service!</font></div>
        </div>
    </>

}

Edit.getInitialProps = async ctx => {
    try{
        let fetched = (await axios.get(`https://botlistapi.decimaldev.xyz/v2/bot/${ctx.query.bot}`)).data;
        fetched.id = ctx.query.bot;
        if(fetched.message == 'not found') return { bot: null };
        return { bot: fetched };
    }catch(e){
        return { bot: null }
    }
}

export default Edit;