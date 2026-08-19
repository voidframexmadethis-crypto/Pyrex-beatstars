/**
 * PyrexSpinna Metadata Configuration & Next.js-Style Metadata Generator
 * Supports OpenGraph, Twitter Cards, Tumblr, and SEO keywords for social sharing crawlers.
 */

export interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'music.song' | 'music.album' | 'profile';
  keywords?: string[];
  beat?: {
    id: string;
    title: string;
    producer?: string;
    bpm?: number;
    key?: string;
    coverArtUrl?: string;
    audioUrl?: string;
    price?: number;
    primaryGenre?: string;
    tags?: string[];
  };
}

export const defaultMetadata = {
  title: "PyrexSpinna Beat Store | Premium Trap Beats, Sound Kits & Custom Production",
  description: "Browse and license high-quality trap beats, boom bap, and melodic instrumental tracks with instant delivery and secure licensing on PyrexSpinna.",
  keywords: ["trap beats", "buy beats online", "hip hop instrumental", "rap beats for sale", "PyrexSpinna beatz", "exclusive lease beats", "wav trackouts"],
  openGraph: {
    title: "PyrexSpinna Beat Store | Premium Trap Beats & Instrumentals",
    description: "Discover exclusive professional beat production, instant audio lease delivery, and custom sound design.",
    url: "https://pyrex.com",
    siteName: "PyrexSpinna Beatz",
    images: [
      {
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "PyrexSpinna Beat Store Artwork",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PyrexSpinna Beat Store | Premium Trap Beats",
    description: "License professional trap, hip-hop, and R&B instrumentals instantly.",
    images: ["https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80"],
    creator: "@pyrex",
  },
  tumblr: {
    tags: "trap beats, hip hop production, instrumental store, pyrex, music licensing",
    type: "audio",
  }
};

/**
 * Generates Next.js-compatible metadata objects dynamically for specific beats or pages.
 */
export function generateMetadata(options: MetadataOptions) {
  const {
    title = defaultMetadata.title,
    description = defaultMetadata.description,
    image = defaultMetadata.openGraph.images[0].url,
    url = "https://pyrex.com",
    type = "website",
    keywords = defaultMetadata.keywords,
    beat
  } = options;

  const fullTitle = beat 
    ? `${beat.title} by ${beat.producer || 'PyrexSpinna'} | PyrexSpinna Beat Store` 
    : title;

  const fullDesc = beat 
    ? `License "${beat.title}" (${beat.bpm || 120} BPM, ${beat.key || 'C Min'}) - Instant MP3/WAV lease delivery by ${beat.producer || 'PyrexSpinna'}.` 
    : description;

  const fullImage = beat?.coverArtUrl || image;
  const fullUrl = beat ? `${url}/beat/${beat.id}` : url;
  const beatKeywords = beat?.tags ? [...keywords, ...beat.tags, beat.primaryGenre || 'trap'].filter(Boolean) : keywords;

  return {
    title: fullTitle,
    description: fullDesc,
    keywords: beatKeywords.join(', '),
    openGraph: {
      title: fullTitle,
      description: fullDesc,
      url: fullUrl,
      siteName: "PyrexSpinna Beatz",
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: beat ? `${beat.title} Cover Art` : "PyrexSpinna Beat Store",
        },
      ],
      locale: "en_US",
      type: beat ? "music.song" : type,
      audio: beat?.audioUrl ? {
        url: beat.audioUrl,
        secureUrl: beat.audioUrl,
        type: "audio/mpeg"
      } : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDesc,
      images: [fullImage],
      creator: "@pyrex",
    },
    tumblr: {
      tags: beatKeywords.join(', '),
      content: fullDesc,
    }
  };
}
