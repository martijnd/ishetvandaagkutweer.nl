import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.long}&appid=${process.env.WEATHER_API_KEY}`;
    const data = await fetch(url);
    const result = await data.json();

    const id = result?.weather?.[0]?.id;
    const speed = result?.wind?.speed;

    res.status(200).json({ id, speed })
  }
  