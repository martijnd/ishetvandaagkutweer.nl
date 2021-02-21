import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [shitty, setShitty] = useState(null);
  const [windSentence, setWindSentence] = useState(null);

  async function successFunction(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    const data = await fetch(`/api/weather?lat=${lat}&long=${long}`);
    const result = await data.json();
    const id = result?.result?.weather?.[0]?.id;
    const windSpeed = result?.result?.wind?.speed;
    if (id)
      setShitty(id < 800);
      setWindSentence(getWindSentence(id < 800, windSpeed));
  }

  function getWindSentence(shitty: boolean, windSpeed: number) {
    const rounded = Math.round(windSpeed);
    if (rounded > 8) {
      if (shitty) {
        return 'En het waait tyfus hard';
      }

      return 'Maar het waait wel hard'
    } else {
      if (shitty) {
        return 'Gelukkig waait het niet hard'
      }

      return 'En het waait nauwelijks'
    }
  }

  function errorFunction(e) {
    console.log(e);
  }
  useEffect(() => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
  }, [])

  return (
    <div className={styles.container}>
      <AppHead />
      <main className={styles.main}>
        {shitty !== null ? (
          <>
            <h1>{shitty ? 'Ja' : 'Nee'}</h1>
            <h2>{shitty ? 'het is gewoon ronduit kut vandaag' : 'vandaag even geen kutweer!'}</h2>
            <h3>{windSentence}</h3>
          </>
        ) : <h1>Ff laden hoor...</h1>}
      </main>
      <footer className={styles.footer}>
        Gemaakt door <a href="https://www.martijndorsman.nl" style={{marginLeft: 6}}>Martijn Dorsman</a>
      </footer>
    </div>
  )
}

function AppHead() {
  const title = 'Is het vandaag kutweer?'
  const description = `Wanneer je wil weten of het vandaag kutweer is, 
    maar geen ramen in je huis hebt om doorheen naar buiten te kunnen kijken.`
  const siteURL = 'https://ishetvandaagkutweer.nl'
  const imageURL = ''
  return (
    <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="workshops, studiekeuze, scholieren, studenten, docenten"
        />
        <meta name="author" content="Tim van Setten van der Meer" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteURL} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageURL} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={siteURL} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Head>
  )
}