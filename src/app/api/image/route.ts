import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy de imagens para evitar problemas de CORS, VPN e Proxy
 * As imagens são buscadas pelo servidor e servidas para o cliente
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');
  
  if (!imageUrl) {
    return new NextResponse('URL da imagem não fornecida', { status: 400 });
  }

  try {
    // Decodifica a URL se estiver encodada
    const decodedUrl = decodeURIComponent(imageUrl);
    
    // Faz fetch da imagem do Firebase Storage
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
      },
      // Cache por 1 hora no servidor
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error(`[ImageProxy] Failed to fetch image: ${response.status} ${response.statusText}`);
      return new NextResponse('Imagem não encontrada', { status: 404 });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    // Retorna a imagem com headers de cache
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[ImageProxy] Error:', error);
    return new NextResponse('Erro ao carregar imagem', { status: 500 });
  }
}
