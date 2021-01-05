import Head from 'next/head';

export default function Loader({ title, description, img }){

    img = img || '/favicon.png';

    return <>
        <Head>
            <title>{title}</title>

            <meta itemProp="name" content={title}/>
            <meta itemProp="description" content={description}/>
            <meta itemProp="image" content={img}/>

            <meta property="og:url" content="https://botlist.decimaldev.xyz"/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            <meta property="og:image" content={img}/>
            <meta name="theme-color" content="#7298da"/> 

            <meta name="twitter:title" content={title}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={img}/>

            <link href="https://fonts.googleapis.com/css?family=Alata" rel="stylesheet"/>
            <link href="https://fonts.googleapis.com/css?family=News+Cycle" rel="stylesheet"/>
            <link rel="icon" href="/favicon.png" type="image/icon type"/>

            <script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
        </Head>
    </>

}