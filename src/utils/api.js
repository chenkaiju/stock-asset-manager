/**
 * Fetch data using a proxy service to bypass CORS restrictions.
 * 
 * Priority:
 * 1. Self-hosted Vercel proxy (/api/proxy) - most reliable
 * 2. corsproxy.io - free backup
 * 3. allorigins.win - free backup
 * 
 * @param {string} targetUrl - The API URL to fetch
 * @returns {Promise<any>} - The JSON response
 */
export const fetchWithProxy = async (targetUrl) => {
    const encodedUrl = encodeURIComponent(targetUrl);

    // 1. Try self-hosted Vercel proxy (primary)
    try {
        const res = await fetch(`/api/proxy?url=${encodedUrl}`);
        if (!res.ok) throw new Error(`Self-hosted proxy returned ${res.status}`);
        return await res.json();
    } catch (e1) {
        console.warn('Self-hosted proxy failed, trying corsproxy.io...', e1);
    }

    // 2. Try corsproxy.io (backup 1)
    try {
        const res = await fetch(`https://corsproxy.io/?${encodedUrl}`);
        if (!res.ok) throw new Error('corsproxy.io failed');
        return await res.json();
    } catch (e2) {
        console.warn('corsproxy.io failed, trying allorigins.win...', e2);
    }

    // 3. Try allorigins.win (backup 2)
    try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodedUrl}`);
        if (!res.ok) throw new Error('allorigins.win failed');
        const json = await res.json();
        return JSON.parse(json.contents);
    } catch (e3) {
        throw new Error(`All proxies failed for ${targetUrl}`);
    }
};
