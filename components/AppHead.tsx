import Head from "next/head";

export default function AppHead() {
  const title = "Is het vandaag kutweer?";
  const description = `Wanneer je wil weten of het vandaag kutweer is, 
    maar geen ramen in je huis hebt om doorheen naar buiten te kunnen kijken.`;
  const siteURL = "https://ishetvandaagkutweer.nl";
  const imageURL = "/seo_cover.png";
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content="is,het,vandaag,kutweer" />
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
  );
}
