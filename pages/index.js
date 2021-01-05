import Loader from '../components/Loader';
import Header from '../components/Header';
import BotCard from '../components/BotCard';
import axios from 'axios';

function Home({ rawData }) {

    const bots = rawData.filter(x => !x.isSubmission);
    const Submissions = () => rawData.filter(x => x.isSubmission).map(x => <BotCard bot={x}/>)
    const RandomBots = () => bots.sort(() => Math.random() - 0.5).slice(0, 8).map(x => <BotCard bot={x}/>);
    const RecentBots = () => bots.reverse().slice(0, 8).map(x => <BotCard bot={x}/>);
    const TopBots = () => bots.sort((a, b) => b.votes - a.votes).slice(0, 8).map(x => <BotCard bot={x}/>);

    return <>
        <Loader title="Decimal Botlist" description="A place to find great discord bots!"/>
        <Header/>

        <div className="coverpage">
            <h1>Decimal Botlist</h1>
            <p>A place to find bots which suits your taste!</p>
        </div>

        <div style={{ padding: '30px', paddingBottom: '100px' }} className="home-content">
            <h1>Top Bots:</h1>
            <div className="row"><TopBots/></div>

            <h1>Recent Bots:</h1>
            <div className="row"><RecentBots/></div>

            <h1>Submissions:</h1>
            <div className="row"><Submissions/></div>

            <h1>Random Bots:</h1>
            <div className="row"><RandomBots/></div>
        </div>
    </>

}

Home.getInitialProps = async (ctx) => {
    try{
        let fetched = await axios.get('https://botlistapi.decimaldev.xyz/all');
        return { rawData: fetched.data };
    }catch(e){
        console.log(e);
        return { rawData: [] };
    }
}

export default Home;