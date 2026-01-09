/**
 * Fetch data using a proxy service to bypass CORS restrictions.
 * Tries corsproxy.io first, then falls back to api.allorigins.win.
 * 
 * @param {string} targetUrl - The API URL to fetch
 * @returns {Promise<any>} - The JSON response
 */
export const fetchWithProxy = async (targetUrl) => {
    const encodedUrl = encodeURIComponent(targetUrl);

    // Try Primary Proxy (corsproxy.io)
    try {
        const res = await fetch(`https://corsproxy.io/?${encodedUrl}`);
        if (!res.ok) throw new Error('Proxy 1 failed');
        return await res.json();
    } catch (e1) {
        console.warn('Primary proxy failed, trying backup...', e1);
        // Try Backup Proxy (allorigins.win)
        try {
            const res = await fetch(`https://api.allorigins.win/get?url=${encodedUrl}`);
            if (!res.ok) throw new Error('Proxy 2 failed');
            const json = await res.json();
            // allorigins wraps response in "contents"
            return JSON.parse(json.contents);
        } catch (e2) {
            throw new Error(`All proxies failed for ${targetUrl}`);
        }
    }
};
