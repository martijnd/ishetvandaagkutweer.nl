import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(req.query.city as string)}&appid=${process.env.WEATHER_API_KEY}`;
    const data = await fetch(url);
    const result = await data.json();
    
    res.status(200).json({ result })
  }
  