/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import moment from "moment";

export default function Card({ review, id, parent }) {
    if(typeof review.user.id === 'undefined') return null;
    
    return (
        <div className="review-card">
            <hr/>
            <div className="review">
                <span>
                    <img src={`https://cdn.discordapp.com/avatars/${review.user.id}/${review.user.avatar}.webp`} alt="Avatar"/>
                </span>
                <div className="r-side">
                    <span className="r-username">
                        {review.user.username}{' '}<span className="r-time">{moment(review.time).fromNow()}</span>
                        {
                            review.user.id === id ?
                            <a onClick={() => {
                                fetch(`https://botlistapi.decimaldev.xyz/review/${parent.props.id}/delete`, { headers: { token: window.token, id: review.time } })
                                .then(res => res.json(), window.alertError)
                                .then(body => {
                                    if(body.message === 'OK') return parent.makeReviews();
                                    else if(body.message === 'expired') return window.expired();
                                    else return window.alertError();
                                }, window.alertError)
                            }}><span className="badge-mini" style={{ opacity: 0 }}>DELETE</span></a> :
                            ''
                        }
                    </span>
                    <div className="r-text-content">{review.review}</div>
                </div>
            </div>
        </div>
    );
}