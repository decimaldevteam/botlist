import React from 'react';

export default function UserPage({ user }){
    return <div className="userpage">
        <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=2048`} alt="avatar"/>
        <h1>{user.username}  <font style={{ opacity: 0.7 }}># {user.discriminator}</font></h1>
    </div>;
}