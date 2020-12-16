import React from 'react';

export default function BotCard({ bot }){
    return <div className="botcard">
        <img src={`${bot.avatar}?size=2048`} alt="profile"/>
        <div className="botcard-content">
            <h2>{bot.name}</h2>
            <font style={{ opacity: 0.8 }}>{bot.description.short}</font>
            <div style={{ width: '100%', marginTop: '5px' }}>
                <a href={`/#/bot/${bot.id}`}>View</a>
                <a href={`https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot&permissions=${bot.perms}`} style={{ marginLeft: '5px' }}>Invite</a>
            </div>
        </div>
    </div>
}