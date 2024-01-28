export function checkForHttp(url) {
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'http://' + url;
}
