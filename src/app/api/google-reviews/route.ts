import { NextResponse } from 'next/server';

// Place ID do estabelecimento: Renata C Ribeiro – Psicóloga & Neuropsicóloga
const PLACE_ID = 'ChIJZT_hSMz5zoQROZz0H1YgP0Y';
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Cache simples em memória para evitar exceder a cota da API
let cachedData: PlacesReview[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

export interface PlacesReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  /** Unix timestamp em segundos */
  time: number;
  text: string;
  relative_time_description: string;
}

interface PlacesApiResponse {
  result?: {
    rating?: number;
    user_ratings_total?: number;
    reviews?: PlacesReview[];
  };
  status: string;
  error_message?: string;
}

export async function GET() {
  // Sem chave → retorna os dados estáticos pré-populados para não quebrar em dev
  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      { error: 'GOOGLE_PLACES_API_KEY não configurada', reviews: [], rating: 5.0, total: 15 },
      { status: 200 }
    );
  }

  // Verifica cache
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL_MS) {
    return NextResponse.json({ reviews: cachedData, rating: 5.0, total: 15 });
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', PLACE_ID);
    url.searchParams.set('fields', 'rating,user_ratings_total,reviews');
    url.searchParams.set('reviews_sort', 'newest');
    url.searchParams.set('language', 'pt-BR');
    url.searchParams.set('key', GOOGLE_PLACES_API_KEY);

    const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
    const data: PlacesApiResponse = await res.json();

    if (data.status !== 'OK' || !data.result) {
      throw new Error(data.error_message ?? `Places API status: ${data.status}`);
    }

    const reviews = data.result.reviews ?? [];
    cachedData = reviews;
    cacheTimestamp = now;

    return NextResponse.json({
      reviews,
      rating: data.result.rating ?? 5.0,
      total: data.result.user_ratings_total ?? 0,
    });
  } catch (err) {
    console.error('[google-reviews] Erro ao buscar Places API:', err);
    return NextResponse.json(
      { error: String(err), reviews: [], rating: 5.0, total: 15 },
      { status: 500 }
    );
  }
}
