import React from "react";
import Header from "../components/Header";

export default function GenerateTosPage() {
    return (
        <>
            <Header/>

            <div className="coverpage">
                <h1>Terms of Service</h1>
                <p>Please read these terms and conditions carefully before using our service.</p>
            </div>

            <div className="tos-content">
                <h1>Accepting the terms</h1>
                <p>
                    By using and logging in to our website you are anknowledging
                    that you are above 13 years of age and showing willingness
                    to follow the <a href="https://discord.com/terms">Discord Terms Of Service</a>{' '}
                    and abide by our own terms, rules and regulations and not
                    to disrespect them anytime. By submiting your bot you grant
                    us / our development to allow your bot to be listed along
                    with the owner(s) name and you are also aknowledging that you
                    have accepted our terms and your bot is public.
                </p>
                <h1>Submitting your bot</h1>
                <ul>
                    <li>
                        While you are submiting your bot you must be in our
                        discord server.
                    </li>
                    <li>
                        Don't use abusive languages in the bot description nor
                        any kind of nsfw images in long description.
                    </li>
                    <li>
                        You must submit the bot that belongs to you / your team,
                        you are not allowed to add any kind of clone or forked
                        bot from any open source websites.
                    </li>
                    <li>
                        Any kind of promotion of nationalism, sexism, racism, etc through the bot is not allowed!
                    </li>
                </ul>
                <h1>Acceptance</h1>
                <ul>
                    <li>
                        Your bot can be denied or accepted or unapproved at any
                        time for any valid reason.
                    </li>
                    <li>
                        If you are banned from our Discord Server your bot will
                        be unlisted instantly and even if you leave our server
                        by your own the same will happen.
                    </li>
                </ul>
                <h1>Votes</h1>
                <ul>
                    <li>
                        You should not abuse the upvoting system for any reason.
                    </li>
                    <li>
                        You should not force other servers/users or blacklist
                        other servers/users for not voting for your bot.
                    </li>
                </ul>
                <h1>Decimal Development Team Rights</h1>
                <ul>
                    <li>
                        Our team has the right to ban/unban users/bots which are
                        found breaking the Discord/Our TOS at anytime.
                    </li>
                    <li>
                        Our team has the right to mute/unmute users/bots which
                        are found to be spamming at anytime.
                    </li>
                </ul>
                <h1>Conclusion</h1>
                <p>If you are caught breaking/disrespecting the TOS, you will be banned from our server and your bots and your account will be deleted.</p>
            </div>
        </>
    );
}