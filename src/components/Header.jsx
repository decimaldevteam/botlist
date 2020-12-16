/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';

class Header extends React.Component{

    render(){
        return <>
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
                        <a href="/">Home</a>
                        <a href="/#/bots">Bots</a>
                        {
                            window.token ?
                            <>
                                <a href='/#/new'>New</a>
                                <a href='/#/me'>Account</a>
                            </> :
                            <a href='/#/login'>Login</a>
                        }
                        <a href="/#/terms">Terms</a>
                    </div>
                </div>
            </div>
        </>
    };

};

export default Header;