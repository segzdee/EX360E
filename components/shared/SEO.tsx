import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
}

export function SEO({ title, description, canonical }: SEOProps) {
  const siteName = 'ExtraStaff360'
  const fullTitle = `${title} | ${siteName}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Additional SEO best practices */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
    </Head>
  )
}

