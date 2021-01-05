import React from 'react';

export default function Header(){

    React.useEffect(() => {
        document.querySelector('.header-links').innerHTML = `
            <a href="/">Home</a>
            <a href="/bots">Bots</a>
            ${localStorage.getItem('token') ? "<a href='/new'>New</a><a href='/me'>Account</a>" : "<a href='/login'>Login</a>"}
            <a href="/terms">Terms</a>
            <a href="https://discord.gg/2v78n3E8">Discord</a>
        `;
    })

    return <div>
        <div className="header">
            <div className="header-content">
                <div className="header-logo">
                    <img
                        src="https://cdn.decimaldev.xyz/white-logo.svg"
                        draggable="false"
                        width="50"
                    />
                </div>
                <div className="header-links">
                </div>
            </div>
        </div>
    </div>

}