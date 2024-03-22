export function getAccessToken(request: Request) {
    return request.headers['authorization'].split(' ')[1];
}