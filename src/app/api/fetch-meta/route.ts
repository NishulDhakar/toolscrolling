import { NextRequest, NextResponse } from 'next/server';

function getMeta(html: string, names: string[]): string {
  for (const name of names) {
    // property="…" content="…" and name="…" content="…", both attribute orders
    const patterns = [
      new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, 'i'),
    ];
    for (const re of patterns) {
      const m = html.match(re);
      if (m?.[1]?.trim()) return m[1].trim();
    }
  }
  return '';
}

function getTitle(html: string): string {
  const og = getMeta(html, ['og:title', 'twitter:title']);
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1]?.trim() ?? '';
}

function getFaviconUrl(html: string, baseUrl: string): string {
  const origin = new URL(baseUrl).origin;

  // Try <link rel="icon"> / <link rel="shortcut icon">
  const patterns = [
    /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      const href = m[1];
      if (href.startsWith('http')) return href;
      return href.startsWith('/') ? `${origin}${href}` : `${origin}/${href}`;
    }
  }

  // Google's reliable favicon CDN as final fallback
  const domain = new URL(baseUrl).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  if (!raw) {
    return NextResponse.json({ error: 'url param required' }, { status: 400 });
  }

  let url: string;
  try {
    url = new URL(raw.startsWith('http') ? raw : `https://${raw}`).toString();
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Site returned ${res.status}` }, { status: 400 });
    }

    // Only read first 50 KB — meta tags are always in <head>
    const reader = res.body?.getReader();
    let html = '';
    if (reader) {
      const decoder = new TextDecoder();
      let done = false;
      while (!done && html.length < 50_000) {
        const chunk = await reader.read();
        done = chunk.done;
        if (chunk.value) html += decoder.decode(chunk.value, { stream: true });
      }
      reader.cancel();
    } else {
      html = await res.text();
    }

    const title = getTitle(html);
    const description = getMeta(html, ['og:description', 'description', 'twitter:description']);
    const image = getMeta(html, ['og:image', 'twitter:image:src', 'twitter:image']);
    const favicon = getFaviconUrl(html, url);

    return NextResponse.json({ title, description, image: image || favicon, favicon });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
