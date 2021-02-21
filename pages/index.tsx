import Head from 'next/head'
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'

export default function Home() {
  const [shitty, setShitty] = useState('Ff laden hoor...');

  async function successFunction(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    const data = await fetch(`/api/weather?lat=${lat}&long=${long}`);
    const result = await data.json();
    console.log(result);
    const id = result?.result?.weather?.[0]?.id;

    if (id)
    setShitty(id >= 800 ? 'Nee' : 'Ja');
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
      <main>
        <h1>{shitty}</h1>
      </main>
    </div>
  )
}
