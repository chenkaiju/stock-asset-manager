// Vercel Serverless Function - Yahoo Finance / FRED API Proxy
// Bypasses CORS restrictions by fetching on the server side.

const ALLOWED_DOMAINS = [
  'query1.finance.yahoo.com',
  'query2.finance.yahoo.com',
  'api.stlouisfed.org',
  'api.finmindtrade.com',
  'tw.stock.yahoo.com',
];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing "url" query parameter' });
  }

  let targetUrl;
  try {
    targetUrl = new URL(decodeURIComponent(url));
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Security: Only allow whitelisted domains
  if (!ALLOWED_DOMAINS.includes(targetUrl.hostname)) {
    return res.status(403).json({ error: `Domain not allowed: ${targetUrl.hostname}` });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Upstream returned ${response.status}`,
      });
    }

    const contentType = response.headers.get('content-type') || 'application/json';
    const data = await response.text();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(data);
  } catch (err) {
    console.error('Proxy fetch error:', err);
    return res.status(500).json({ error: 'Proxy fetch failed', detail: err.message });
  }
}
