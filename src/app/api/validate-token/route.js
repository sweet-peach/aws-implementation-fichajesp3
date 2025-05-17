import {COGNITO} from "../../../env.js";
import {CognitoJwtVerifier} from "aws-jwt-verify";

const idVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO.USER_POOL_ID,
    clientId: COGNITO.CLIENT_ID,
    tokenUse: 'id',
})

const accessVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO.USER_POOL_ID,
    clientId: COGNITO.CLIENT_ID,
    tokenUse: 'access',
})

export async function POST(request, res){

    const username = request.cookies.get(`CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.LastAuthUser`)?.value;
    if (!username) {
        return new Response('Bad Request', {
            status: 400,
        })
    }

    let idToken = request.cookies.get(`CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.${username}.idToken`)?.value
    let accessToken = request.cookies.get(`CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.${username}.accessToken`)?.value

    try {
        await idVerifier.verify(idToken);
        await accessVerifier.verify(accessToken);
    } catch (e) {
        const username = request.cookies.get(`CognitoIdentityServiceProvider.${COGNITO.CLIENT_ID}.LastAuthUser`)?.value;
        if (!username) {
            return new Response('Invalid Token', {
                status: 400,
            })
        }
    }
    return new Response('Ok', {
        status: 200
    })
}