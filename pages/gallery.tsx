import Head from 'next/head'

export default function Gallery() {
  return (
    <>
      <Head>
        <title>Gallery</title>
        <meta name="description" content="Explore our photo gallery showcasing beautiful moments and memories." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gallery Page
          </h1>
        </div>
      </div>
    </>
  )
} 