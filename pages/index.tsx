import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [shitty, setShitty] = useState(null);
  const [windSentence, setWindSentence] = useState(null);
  const [acceptedGeolocationPermission, setAcceptedGeolocationPermission] = useState(null);

  useEffect(() => {
    navigator.permissions &&
      navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {
        const table = {
          'granted': () => getPosition(),
          'denied': () => setAcceptedGeolocationPermission(false)
        }

        table[state]?.()
      })
  }, [])

  function getPosition() {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
  }

  async function fetchWeatherData({ longitude, latitude }: GeolocationCoordinates) {
    const data = await fetch(`/api/weather?lat=${latitude}&long=${longitude}`);
    const result = await data.json();

    return result;
  }

  async function successFunction({ coords }: GeolocationPosition) {
    setAcceptedGeolocationPermission(true);

    const result = await fetchWeatherData(coords);

    const id = result?.result?.weather?.[0]?.id;
    const windSpeed = result?.result?.wind?.speed;
    if (id) {
      setShitty(id < 800);
      setWindSentence(getWindSentence(id < 800, windSpeed));
    }
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

  function errorFunction(e: GeolocationPositionError) {
    setAcceptedGeolocationPermission(false);
    console.log(e);
  }

  function onClickAcceptGeolocation() {
    getPosition();
  }

  function GeoPermissionPrompt() {
    return (
      <div>
        <h2>Mag ik je locatie weten?</h2>
        <button className={styles.button} onClick={onClickAcceptGeolocation}>Vooruit dan maar</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AppHead />
      <main className={styles.main}>
        {acceptedGeolocationPermission !== null ?
          <WeatherInfo accepted={acceptedGeolocationPermission} shitty={shitty} windSentence={windSentence} />
          : <GeoPermissionPrompt />}
      </main>
      <footer className={styles.footer}>
        Gemaakt door <a href="https://www.martijndorsman.nl">Martijn Dorsman</a>
      </footer>
    </div>
  )
}

type WeatherInfoProps = {
  shitty: boolean;
  windSentence: string;
  accepted: boolean;
}

function WeatherInfo({ shitty, windSentence, accepted }: WeatherInfoProps) {
  if (!accepted) {
    return <h3>Klik op het slotje linksboven en sta 'Locatie' toe! 😁</h3>
  }

  if (shitty !== null) {
    return (
      <>
        <h1>{shitty ? 'Ja' : 'Nee'}</h1>
        <h2>{shitty ? 'het is gewoon ronduit kut vandaag' : 'vandaag even geen kutweer!'}</h2>
        <h3>{windSentence}</h3>
      </>
    )
  }
  return <h1>Ff laden hoor...</h1>;
}

function AppHead() {
  const title = 'Is het vandaag kutweer?'
  const description = `Wanneer je wil weten of het vandaag kutweer is, 
    maar geen ramen in je huis hebt om doorheen naar buiten te kunnen kijken.`
  const siteURL = 'https://ishetvandaagkutweer.nl'
  const imageURL = '/seo_cover.png'
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="is,het,vandaag,kutweer"
      />
      <meta name="author" content="Martijn Dorsman" />
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