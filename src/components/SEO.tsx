import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Beat } from '../types';
import { generateMetadata } from '../lib/metadata';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'music.song' | 'music.album' | 'profile';
  beat?: Beat;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Krypside Beatz | Premium Trap Beat Store", 
  description = "High-quality trap beats, custom sound design, and professional production services by Krypside.", 
  image = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80", 
  url = "https://krypside.com",
  type = 'website',
  beat
}) => {
  const meta = generateMetadata({
    title,
    description,
    image,
    url,
    type,
    beat: beat ? {
      id: beat.id,
      title: beat.title,
      producer: beat.producer,
      bpm: beat.bpm,
      key: beat.key,
      coverArtUrl: beat.coverArtUrl,
      audioUrl: beat.audioUrl || beat.backupAudioUrl || beat.r2AudioUrl,
      price: beat.price,
      primaryGenre: beat.primaryGenre,
      tags: beat.tags
    } : undefined
  });

  const fullTitle = meta.title;
  const fullDesc = meta.description;
  const fullImage = meta.openGraph.images[0].url;
  const fullUrl = meta.openGraph.url;

  // JSON-LD Structured Data for Google MusicListing and AudioObject
  const structuredData = beat ? {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": beat.title,
    "byArtist": {
      "@type": "MusicGroup",
      "name": beat.producer
    },
    "duration": beat.duration ? `PT${Math.floor(beat.duration / 60)}M${Math.floor(beat.duration % 60)}S` : undefined,
    "url": fullUrl,
    "image": fullImage,
    "description": fullDesc,
    "genre": beat.primaryGenre,
    "datePublished": beat.releaseDate || new Date().toISOString(),
    "audio": beat.audioUrl || beat.backupAudioUrl || beat.r2AudioUrl ? {
      "@type": "AudioObject",
      "contentUrl": beat.audioUrl || beat.backupAudioUrl || beat.r2AudioUrl,
      "encodingFormat": "audio/mpeg"
    } : undefined,
    "offers": {
      "@type": "Offer",
      "price": beat.licenses?.mp3Lease?.price || (beat.price !== undefined && beat.price !== "" ? beat.price : "29.99"),
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Krypside Beatz",
    "url": url,
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      <meta name="keywords" content={meta.keywords} />
      
      {/* OpenGraph (Facebook, LinkedIn, Discord, etc.) */}
      <meta property="og:title" content={meta.openGraph.title} />
      <meta property="og:description" content={meta.openGraph.description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={meta.openGraph.type} />
      <meta property="og:site_name" content="Krypside Beatz" />
      {meta.openGraph.audio && (
        <meta property="og:audio" content={meta.openGraph.audio.url} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={meta.twitter.card} />
      <meta name="twitter:title" content={meta.twitter.title} />
      <meta name="twitter:description" content={meta.twitter.description} />
      <meta name="twitter:image" content={meta.twitter.images[0]} />
      <meta name="twitter:creator" content={meta.twitter.creator} />

      {/* Tumblr & Social Tags */}
      <meta name="tumblr:tags" content={meta.tumblr.tags} />
      <meta name="tumblr:content" content={meta.tumblr.content} />

      {/* Google Bot / Search */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;

