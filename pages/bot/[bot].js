import Header from '../../components/Header';
import Loader from '../../components/Loader';
import BotCard from '../../components/BotCard';
import StarIcons from '../../components/StarIcon';
import React from 'react';
import Markdown from 'react-showdown';
import Head from 'next/head';
import moment from 'moment';
import axios from 'axios';

const statuses = {
    online: '#10ac84',
    idle: 'orange',
    null: 'grey',
    offline: 'grey',
    dnd: 'red'
}

Array.repeat = (elem, times) => {
    let res = [];
    for(let i = 0; i < times; i++) res.push(elem);
    return res;
}

function Badge({ title, value, color }){

    return <span className="badge">
        <span className="badge-content">{title}</span>
        <span className="badge-cover" style={{ backgroundColor: color }} id={`badge-${title}`}>{value}</span>
    </span>

}

export default class BotPage extends React.Component{

    constructor(props){
        super(props);
        this.state = { reviews: [] };
        this.stars = 5;
        this.user = {};
        this.bot = null;
    }

    static async getInitialProps(ctx){
        try{
            let fetched = (await axios.get(`https://botlistapi.decimaldev.xyz/v2/bot/${ctx.query.bot}`)).data;
            fetched.id = ctx.query.bot;
            if(fetched.message == 'not found') return { bot: null };
            return { bot: fetched };
        }catch(e){
            console.log(e);
            return { bot: null }
        }
    }

    setStars(i){
        this.stars = i;
    }
    
    delete(){
        if(this.user.id != this.bot.author.id) return alert('You are not the owner of the bot!');

        let confirmation = window.confirm('Are you sure you want to delete this bot?');
        if(!confirmation) return;

        let err = () => alert('Failed while sending request to delete your bot!');

        fetch(`https://botlistapi.decimaldev.xyz/v2/delete/${this.props.bot.id}`, { headers: { token: localStorage.getItem('token')} })
        .then(res => res.json(), err)
        .then(data => {
            if(data.message == 'failed') return err();
            else if(data.message == 'invalid user') return alert('This bot does not belongs to you!');
            else if(data.message == 'expired') window.location.href = '/me';
            else if(data.message == 'bot doesnt exists') return err();
            else window.location.href = '/';
        }, err);
    }

    upvote(){
        if(!this.user) return alert('You have not logged in yet!');
        let err = () => alert('Failed while upvoting!');
        document.getElementById('upvote').innerHTML = 'Upvoting...';
        fetch(`https://botlistapi.decimaldev.xyz/v2/upvote/${this.bot.id}`, { headers: { token: localStorage.getItem('token') } })
        .then(res => res.json(), err)
        .then(data => {
            document.getElementById('upvote').innerHTML = 'Upvote';

            if(data.message == 'OK'){
                let upvoteElem = document.getElementById('badge-Upvotes');
                upvoteElem.innerHTML = parseInt(upvoteElem.innerHTML) + 1;
                return alert('Voted successfully!');
            }
            else if(data.message == 'expired') window.location.href = '/me';
            else if(data.message == 'has voted') return alert(`You have voted ${moment(data.cooldown).fromNow()}! Default cooldown is 12 hours so vote after some time!`);
        }, err)
    }

    review(){
        if(!this.user) return alert('You have not logged in yet!');
        let err = () => alert('Failed while reviewing!');

        let content = document.getElementById('review-input').value;
        if(!content) return alert('No content to send as a review!');

        fetch(`https://botlistapi.decimaldev.xyz/v2/review/${this.bot.id}`, { headers: { token: localStorage.getItem('token'), content: encodeURIComponent(content), stars: this.stars } })
        .then(res => res.json(), err)
        .then(body => {
            if(body.message == 'expired') window.location.href = '/me';
            else if(body.message == 'reviewed') alert('You have already reviewed the bot! You can delete the old review and send a new one!');
            else {
                this.setState({ reviews: body });
                this.makeReviews(body);
            }
        }, err);
    }

    make404(){
        return <>
            <Head>
                <title>404</title>

                <link href="https://fonts.googleapis.com/css?family=Alata" rel="stylesheet"/>
                <link href="https://fonts.googleapis.com/css?family=News+Cycle" rel="stylesheet"/>
                <link rel="icon" href="/favicon.png" type="image/icon type"/>

                <script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
            </Head>

            <Header/>

            <div className="page-404">
                <h1>404</h1>
                <font>Not Found</font>
            </div>
        </>
    }

    makePage(data){
        this.bot = data;
        
        return <div>
            <div style={{ padding: '30px' }} className="bot-page-handler">
                <div className="bot-page">
                    <div className="bot-img">
                        <img src={`${data.avatar}?size=2048`} alt="Bot Avatar"/>
                    </div>
                    <div className="bot-info">
                        <h1>{data.name}</h1>
                        <p>{data.description.short}</p>
                        <div style={{ marginTop: '10px' }}>
                            <Badge title="Prefix" value={data.prefix} color="#3273dc"/>
                            <Badge title="Developers" value={[data.author.tag, ...data.developers].join(', ')} color="#ff3860"/>
                            <Badge title="Upvotes" value={data.votes} color="#f8c600"/>
                            <Badge title="Reviews" value={this.state.reviews.length} color="#10ac84"/>
                            {data.tags && data.tags.length ? <Badge title="Tags" value={data.tags.join(', ')} color="#FFA500"/> : ''}
                            {data.isSubmission ? <span className="badge-mini">Waiting for approval</span> : ''}
                            <span className="badge-mini"><span className="status-circle" style={{ backgroundColor: statuses[data.status] || 'grey' }}></span> {data.status ? data.status.toUpperCase() : 'ERROR'}</span>
                        </div>
                        <div style={{ marginTop: '15px' }}>
                            <a className="badge-btn" href={`https://discord.com/oauth2/authorize?client_id=${data.id}&scope=bot&permissions=${data.perms}`} style={{ backgroundColor: '#3273dc' }}>Invite</a>
                            {data.isSubmission ? '' : <a className="badge-btn" onClick={this.upvote.bind(this)} id="upvote" style={{ backgroundColor: 'white', color: 'black' }}>Upvote</a>}
                            {data.support ? <a href={data.support} className="badge-btn" style={{ backgroundColor: '#23d160' }}>Support</a> : ''}
                            {data.website ? <a href={data.website} className="badge-btn" style={{ backgroundColor: '#209cee' }}>Website</a> : ''}
                            {this.user.id == this.bot.author.id ?
                                <>
                                    <a onClick={this.delete.bind(this)} className="badge-btn" style={{ backgroundColor: '#ff3860' }}>Delete</a>
                                    <a href={`/edit/${this.bot.id}`} className="badge-btn" style={{ backgroundColor: '#ff3860' }}>Edit</a>
                                </> :
                            ''}
                        </div>
                        <div id="stars" style={{ marginTop: '20px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    makeReviews(reviews){
        let stars = 0;
        reviews.forEach(x => x.stars ? stars += x.stars : 0);
        stars = Math.floor((stars/(reviews.length*5))*5) || 0;

        document.getElementById('stars').innerHTML = `${Array(stars+1).join('<i class="fa fa-star glowing-star" aria-hidden="true"></i>')}${Array((5-stars)+1).join('<i class="fa fa-star unglowing-star" aria-hidden="true"></i>')}`;
    }

    componentDidUpdate(){
        let root = document.getElementById('all-reviews');
        root.innerHTML = '';
        root.appendHTML = html => root.innerHTML = `${root.innerHTML}${html}`;

        this.state.reviews.reverse().forEach((review, i) => {
            let isAuthor = review.user.id === this.user.id;

            root.appendHTML(`
                <div class="review-card">
                    <hr/>
                    <div class="review">
                        <span>
                            <img src=${`https://cdn.discordapp.com/avatars/${review.user.id}/${review.user.avatar}.webp`} alt="Avatar"/>
                        </span>
                        <div class="r-side">
                            <span class="r-username">
                                ${review.user.username} <span class="r-time">${moment(review.time).fromNow()}
                            </span>
                            ${['662207542486630401', '460751723342987274'].includes(review.user.id) ? `<span class="badge-mini" style="background-color: #10ac84;">STAFF</span>`: ''}
                            ${isAuthor ? `<a id="review-delete-${i}" onclick="window.deleteReview()"><span class="badge-mini" style="opacity: 0;">DELETE</span></a>` : ''}
                            </span>
                            <div class="r-text-content">${review.review}</div>
                            <div style={{ marginTop: '5px' }}>
                               ${Array.repeat(`<i class="fa fa-star glowing-star" aria-hidden="true"></i>`, review.stars).join('')}
                               ${Array.repeat(`<i class="fa fa-star unglowing-star" aria-hidden="true"></i>`, 5-review.stars).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `);

            if(isAuthor){
                window.deleteReview = () => {
                    let err = () => alert('Could not delete review!');

                    fetch(`https://botlistapi.decimaldev.xyz/v2/review/${this.bot.id}/delete`, { headers: { token: localStorage.getItem('token'), id: review.time } })
                    .then(res => res.json(), err)
                    .then(body => {
                        if(body.message === 'expired') window.location.href = '/me';
                        else {
                            this.setState({ reviews: body });
                            this.makeReviews(body);
                        }
                    }, err)
                };
            }
        })
    }

    componentDidMount(){
        if(!this.bot) return;

        let token = localStorage.getItem('token');
        let err = () => alert('Failed fetching sub details of the bot!');

        fetch(`https://botlistapi.decimaldev.xyz/v2/bot/${this.bot.id}/others`, { headers: { user: token } })
        .then(res => res.json(), err)
        .then(({ reviews, current_user }) => {
            this.user = current_user || {};
            this.makeReviews(reviews);
            this.setState({ reviews });
        }, err)
    }

    render(){
        let { bot } = this.props;

        if(!bot) return this.make404();

        return <>
            <Loader title={bot.name} description={bot.description.short} img={`${bot.avatar}?size=2048`}/>
            <Header/>

            {this.makePage(bot)}

            <div className="bot-des-handler">
                <div className="bot-des">
                    <Markdown markdown={this.bot.description.long || '# No description found'}/>
                </div>

                <div className="reviews-box">
                    <h1>Reviews:</h1>
                    {this.user.id && !this.state.reviews.find(x => x.user.id == this.user.id) ? <>
                        <div className="review">
                            <span>
                                <img src={`https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.webp?size=2048`} alt="avatar"/>
                            </span>
                            <div className="r-side">
                                <span className="r-username">
                                    {`${this.user.username}  `}<font className="r-time">Now</font>
                                </span><br/>
                                <textarea id="review-input"></textarea>
                                <a onClick={this.review.bind(this)} className="review-send">Send</a>
                                <span style={{ marginTop: '5px' }} className="star-rate"><StarIcons parent={this}/></span>
                            </div>
                        </div>
                    </> : 'You have already reviewed the bot!'}
                    <div id="all-reviews"/>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h1>Similar Bots:</h1>
                    <div className="row">{this.bot.similar.map(x => <BotCard bot={x}/>)}</div>
                </div>
            </div>
        </>;
    }

};