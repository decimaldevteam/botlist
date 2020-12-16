/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
import React from 'react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import ReviewCard from '../components/ReviewCard';
import moment from 'moment';
import { Markdown } from 'react-showdown';

const statuses = {
    online: 'green',
    idle: 'orange',
    null: 'grey',
    offline: 'grey',
    dnd: 'red'
}

export default class Bot extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            content: <h1 style={{ textAlign: 'center' }}>Loading data...</h1>, 
            bot: { description: { long: null } } ,
            reviews: []
        };
    }

    componentWillMount(){
        fetch(`https://botlistapi.decimaldev.xyz/bot/${this.props.id}`)
        .then(res => res.json(), this.make404.bind(this))
        .then(bot => {
            if(bot.message == 'not found') return this.make404();
            this.setState({ content: this.makePage(bot), bot });
        }, this.make404.bind(this));

        this.makeReviews();
    }

    makeReviews(){
        fetch(`https://botlistapi.decimaldev.xyz/bot/${this.props.id}/reviews`)
        .then(res => res.json())
        .then(reviews => this.setState({ reviews: reviews.reverse() }));
    }

    makePage(data){
        return <>
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
                        {data.tags && data.tags.length ? <Badge title="Tags" value={data.tags.join(', ')} color="#FFA500"/> : ''}
                        {data.isSubmission ? <span className="badge-mini">Waiting for approval</span> : ''}
                        <span className="badge-mini"><span className="status-circle" style={{ backgroundColor: statuses[data.status] || 'grey' }}></span> {data.status ? data.status.toUpperCase() : 'ERROR'}</span>
                    </div>
                    <div style={{ marginTop: '15px' }}>
                        <a className="badge-btn" href={`https://discord.com/oauth2/authorize?client_id=${this.props.id}&scope=bot&permissions=${data.perms}`} style={{ backgroundColor: '#3273dc' }}>Invite</a>
                        {data.isSubmission ? '' : <a className="badge-btn" onClick={this.upvote.bind(this)} id="upvote" style={{ backgroundColor: 'white', color: 'black' }}>Upvote</a>}
                        {data.support ? <a href={data.support} className="badge-btn" style={{ backgroundColor: '#23d160' }}>Support</a> : ''}
                        {data.website ? <a href={data.website} className="badge-btn" style={{ backgroundColor: '#209cee' }}>Website</a> : ''}
                        {data.author.id == this.props.user.id ?
                            <>
                                <a onClick={this.delete.bind(this)} className="badge-btn" style={{ backgroundColor: '#ff3860' }}>Delete</a>
                                <a href={`/#/edit/${this.props.id}`} className="badge-btn" style={{ backgroundColor: '#ff3860' }}>Edit</a>
                            </> :
                        ''}
                    </div>
                </div>
            </div>
        </>
    }

    delete(){
        if(!window.token) return alert('You have not logged in yet!');

        let confirmation = window.confirm('Are you sure you want to delete the bot?');
        if(!confirmation) return;

        fetch(`https://botlistapi.decimaldev.xyz/delete/${this.props.id}`, { headers: { token: window.token } })
        .then(res => res.json(), window.alertError)
        .then(data => {
            if(data.message == 'failed') return window.alertError();
            else if(data.message == 'invalid user') return alert('This bot does not belongs to you!');
            else if(data.message == 'expired') return window.expired();
            else {
                alert('Deleted');
                window.location.href = '/';
            }
        }, window.alertError)
    }

    upvote(){
        if(!window.token) return alert('You have not logged in yet!');
        document.getElementById('upvote').innerHTML = 'Upvoting...';

        fetch(`https://botlistapi.decimaldev.xyz/upvote/${this.props.id}`, { headers: { token: window.token } })
        .then(res => res.json(), window.alertError)
        .then(data => {
            if(data.message == 'OK'){
                this.componentWillMount();
                return alert('Voted successfully!');
            }
            else if(data.message == 'expired') return window.expired()
            else if(data.message == 'has voted') return alert(`You have voted ${moment(data.cooldown).fromNow()}! Default cooldown is 12 hours so vote after some time!`);

            document.getElementById('upvote').innerHTML = 'Upvote';
        }, window.alertError)
    }

    make404(){
        this.setState({ content: <div className="page-404">
            <h1>404</h1>
            <font>Not Found</font>
        </div> });
        document.querySelector('.bot-des-handler').style.display = 'none';
    }

    review(){
        let content = document.getElementById('review-input').value;
        if(!content) return alert('No Content!');

        fetch(`https://botlistapi.decimaldev.xyz/review/${this.props.id}`, { headers: { token: window.token, content } })
        .then(res => res.json(), window.alertError)
        .then(body => {
            if(body.message == 'expired') return window.expired();
            else this.makeReviews();
        }, window.alertError);
    }

    render(){
        return <>
            <Header/>

            <div style={{ padding: '30px' }} className="bot-page-handler">{this.state.content}</div>
            <div className="bot-des-handler">
                <div className="bot-des">
                    <Markdown markdown={this.state.bot.description.long || '# No Description Found'}/>
                </div>
                <div className="reviews-box">
                    <h1>Reviews</h1>
                    {
                        window.token ?
                        <div className="review">
                            <span>
                                <img src={`https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.webp?size=2048`} alt="avatar"/>
                            </span>
                            <div className="r-side">
                                <span className="r-username">
                                    {`${this.props.user.username}  `}<font className="r-time">Now</font>
                                </span><br/>
                                <textarea id="review-input"></textarea>
                                <a onClick={this.review.bind(this)} className="review-send">Send</a>
                            </div>
                        </div> : 
                        ''
                    }
                    {this.state.reviews.map(x => <ReviewCard review={x} id={this.props.user.id} parent={this}/>)}
                </div>
            </div>
        </>
    }

};