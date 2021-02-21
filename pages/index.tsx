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
      setWindSentence(getWindSentence(shitty, windSpeed));
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
      <Head>
        <title>Is het vandaag kutweer?</title>
      </Head>
      <main>
        {shitty !== null ? (
          <>
            <h1>{shitty ? 'Ja' : 'Nee'}</h1>
            <h2>{shitty ? 'het is gewoon ronduit kut vandaag' : 'vandaag even geen kutweer!'}</h2>
            <h3>{windSentence}</h3>
          </>
        ) : <h1>Ff laden hoor...</h1>}
      </main>
    </div>
  )
}
