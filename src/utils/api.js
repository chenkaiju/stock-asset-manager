const PROXY_TIMEOUT_MS = 8000;

const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return res;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
};

/**
 * Fetch JSON data using a proxy service to bypass CORS restrictions.
 * Each proxy attempt has an 8s timeout to fail fast before trying the next.
 *
 * Priority:
 * 1. Self-hosted Vercel proxy (/api/proxy) - most reliable
 * 2. corsproxy.io - free backup
 * 3. allorigins.win - last resort
 *
 * @param {string} targetUrl - The API URL to fetch
 * @returns {Promise<any>} - The JSON response
 */
export const fetchWithProxy = async (targetUrl) => {
    const encodedUrl = encodeURIComponent(targetUrl);

    // 1. Try self-hosted Vercel proxy (primary)
    try {
        const res = await fetchWithTimeout(`/api/proxy?url=${encodedUrl}`);
        if (!res.ok) throw new Error(`Self-hosted proxy returned ${res.status}`);
        return await res.json();
    } catch (e1) {
        console.warn('[proxy] Self-hosted failed, trying corsproxy.io...', e1.message);
    }

    // 2. Try corsproxy.io (backup 1)
    try {
        const res = await fetchWithTimeout(`https://corsproxy.io/?${encodedUrl}`);
        if (!res.ok) throw new Error(`corsproxy.io returned ${res.status}`);
        return await res.json();
    } catch (e2) {
        console.warn('[proxy] corsproxy.io failed, trying allorigins.win...', e2.message);
    }

    // 3. Try allorigins.win (backup 2)
    try {
        const res = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodedUrl}`);
        if (!res.ok) throw new Error(`allorigins.win returned ${res.status}`);
        const json = await res.json();
        return JSON.parse(json.contents);
    } catch (e3) {
        throw new Error(`All proxies failed for ${targetUrl}: ${e3.message}`);
    }
};

/**
 * Fetch raw HTML/text data using a proxy service.
 * Used for scraping pages (e.g. Yahoo 奇摩股市) that return HTML, not JSON.
 *
 * @param {string} targetUrl - The URL to fetch
 * @returns {Promise<string>} - The raw text/HTML response
 */
export const fetchTextWithProxy = async (targetUrl) => {
    const encodedUrl = encodeURIComponent(targetUrl);

    // 1. Try self-hosted Vercel proxy (returns raw text passthrough)
    try {
        const res = await fetchWithTimeout(`/api/proxy?url=${encodedUrl}`);
        if (!res.ok) throw new Error(`Self-hosted proxy returned ${res.status}`);
        return await res.text();
    } catch (e1) {
        console.warn('[proxy] Self-hosted failed for text, trying corsproxy.io...', e1.message);
    }

    // 2. Try corsproxy.io (backup 1)
    try {
        const res = await fetchWithTimeout(`https://corsproxy.io/?${encodedUrl}`);
        if (!res.ok) throw new Error(`corsproxy.io returned ${res.status}`);
        return await res.text();
    } catch (e2) {
        console.warn('[proxy] corsproxy.io failed for text, trying allorigins.win...', e2.message);
    }

    // 3. Try allorigins.win (backup 2) — wraps contents in JSON envelope
    try {
        const res = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodedUrl}`);
        if (!res.ok) throw new Error(`allorigins.win returned ${res.status}`);
        const json = await res.json();
        return json.contents; // raw HTML string
    } catch (e3) {
        throw new Error(`All proxies failed for ${targetUrl}: ${e3.message}`);
    }
};
