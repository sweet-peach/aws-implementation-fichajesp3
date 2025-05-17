import {NextResponse} from "next/server";
import {COGNITO} from "./env.js";
import {decodeJWT} from "@aws-amplify/core";

async function fetchNewTokens(refresh_token) {
    const tokenEndpoint = `https://${COGNITO.DOMAIN}.auth.${COGNITO.REGION}.amazoncognito.com/oauth2/token`;

    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: COGNITO.CLIENT_ID,
        refresh_token,
    })

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch tokens: ${response.status} ${errorText}`)
    }

    return await response.json();
}

export async function middleware(request) {
    const response = NextResponse.next();
    const {pathname} = request.nextUrl;
    const goToLogin = () => {
        if (!(pathname === '/' || pathname === '/admin')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    const goToPanel = () => {
        return NextResponse.redirect(new URL('/registro', request.url));
    }

    const goToAdminPanel = () => {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }


    const username = request.cookies.get(`CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.LastAuthUser`)?.value;
    if (!username) return goToLogin();
    const cookieKeys = {
        id: `CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.${username}.idToken`,
        access: `CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.${username}.accessToken`,
        refresh: `CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.${username}.refreshToken`
    }
    const refreshToken = request.cookies.get(cookieKeys.refresh)?.value
    if (!refreshToken) {
        return goToLogin()
    }

    let idToken = request.cookies.get(cookieKeys.id)?.value
    let accessToken = request.cookies.get(cookieKeys.access)?.value

    const { origin } = new URL(request.url)
    const apiUrl = `${origin}/api/validate-token`
    const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            Cookie: request.headers.get('cookie') || '',
        },
    })

    if(!res.ok){
        try {
            const data = await fetchNewTokens(refreshToken);
            idToken = data.id_token;
            accessToken = data.accessToken;
            response.cookies.set({
                name: cookieKeys.access,
                value: accessToken,
                secure: true,
                maxAge: data.expires_in
            })

            response.cookies.set({
                name: cookieKeys.id,
                value: idToken,
                secure: true,
                maxAge: data.expires_in
            })
        } catch (e) {
            return goToLogin();
        }
    }

    try {
        const {payload} = decodeJWT(accessToken);
        const roles = payload['cognito:groups'] || [];
        const isAdmin = roles.includes('admin');
        if (isAdmin && (pathname === "/" || pathname === "/admin")) return goToAdminPanel();
        if (!isAdmin && (pathname === "/" || pathname === "/admin")) return goToPanel();
        if (!isAdmin && pathname.includes('/admin/dashboard')) return goToPanel();
    } catch (e) {
        return goToLogin();
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next|favicon\\.ico|api).*)'],
}