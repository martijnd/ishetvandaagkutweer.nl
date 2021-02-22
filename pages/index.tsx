import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import AppHead from '../components/AppHead'

export default function Home() {
  const [shitty, setShitty] = useState(null)
  const [windSentence, setWindSentence] = useState(null)
  const [
    acceptedGeolocationPermission,
    setAcceptedGeolocationPermission,
  ] = useState(undefined)

  useEffect(() => {
    navigator.permissions &&
      navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {
        const table = {
          granted: () => getPosition(),
          denied: () => setAcceptedGeolocationPermission(false),
          prompt: () => setAcceptedGeolocationPermission(null),
        }

        table[state]?.()
      })
  }, [])

  function getPosition() {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction)
    }
  }

  async function fetchWeatherData({
    longitude,
    latitude,
  }: GeolocationCoordinates) {
    const round = (number: number) => Math.round(number * 100) / 100
    const data = await fetch(
      `/api/weather?lat=${round(latitude)}&long=${round(longitude)}`
    )
    const result = await data.json()

    return result
  }

  async function successFunction({ coords }: GeolocationPosition) {
    setAcceptedGeolocationPermission(true)

    const { id, speed } = await fetchWeatherData(coords)

    if (id && speed) {
      setShitty(id < 800)
      setWindSentence(getWindSentence(id < 800, speed))
    }
  }

  function getWindSentence(shitty: boolean, windSpeed: number) {
    const rounded = Math.round(windSpeed)
    if (rounded > 8) {
      if (shitty) {
        return 'En het waait tyfus hard'
      }

      return 'Maar het waait wel hard'
    }

    if (shitty) {
      return 'Gelukkig waait het niet hard'
    }

    return 'En het waait nauwelijks'
  }

  function errorFunction(e: GeolocationPositionError) {
    setAcceptedGeolocationPermission(false)
    console.log(e)
  }

  function onClickAcceptGeolocation() {
    getPosition()
  }

  function GeoPermissionPrompt() {
    return (
      <>
        <h2>Mag ik je locatie weten?</h2>
        <button className={styles.button} onClick={onClickAcceptGeolocation}>
          Vooruit dan maar
        </button>
      </>
    )
  }

  function WeatherInfoContainer() {
    if (acceptedGeolocationPermission === null) {
      return <GeoPermissionPrompt />
    }

    return (
      <WeatherInfo
        accepted={acceptedGeolocationPermission}
        shitty={shitty}
        windSentence={windSentence}
      />
    )
  }

  return (
    <div className={styles.container}>
      <AppHead />
      <main className={styles.main}>
        <WeatherInfoContainer />
      </main>
      <footer className={styles.footer}>
        Gemaakt door <a href="https://www.martijndorsman.nl">Martijn Dorsman</a>
      </footer>
    </div>
  )
}

type WeatherInfoProps = {
  shitty: boolean
  windSentence: string
  accepted: boolean
}

function WeatherInfo({ shitty, windSentence, accepted }: WeatherInfoProps) {
  if (accepted === false) {
    return <h3>Klik op het slotje linksboven en sta 'Locatie' toe! 😁</h3>
  }

  if (shitty !== null) {
    return (
      <>
        <h1>{shitty ? 'Ja' : 'Nee'}</h1>
        <h2>
          {shitty
            ? 'het is gewoon ronduit kut vandaag'
            : 'vandaag even geen kutweer!'}
        </h2>
        <h3>{windSentence}</h3>
      </>
    )
  }
  return <h2></h2>
}
