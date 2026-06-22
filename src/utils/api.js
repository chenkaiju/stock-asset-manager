const PROXY_TIMEOUT_MS = 5000;

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
 * Fetch data using a proxy service to bypass CORS restrictions.
 * Each proxy attempt has a 5s timeout to fail fast before trying the next.
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
        console.warn('Self-hosted proxy failed, trying corsproxy.io...', e1);
    }

    // 2. Try corsproxy.io (backup 1)
    try {
        const res = await fetchWithTimeout(`https://corsproxy.io/?${encodedUrl}`);
        if (!res.ok) throw new Error('corsproxy.io failed');
        return await res.json();
    } catch (e2) {
        console.warn('corsproxy.io failed, trying allorigins.win...', e2);
    }

    // 3. Try allorigins.win (backup 2)
    try {
        const res = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodedUrl}`);
        if (!res.ok) throw new Error('allorigins.win failed');
        const json = await res.json();
        return JSON.parse(json.contents);
    } catch (e3) {
        throw new Error(`All proxies failed for ${targetUrl}`);
    }
};
