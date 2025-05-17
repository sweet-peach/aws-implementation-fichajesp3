import {Amplify} from "aws-amplify";
import {signIn, confirmSignIn} from "aws-amplify/auth/cognito";
import {cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import {CookieStorage, decodeJWT, fetchAuthSession} from "@aws-amplify/core";
import {signOut} from "aws-amplify/auth";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
            loginWith: {
                username: true
            }
        }
    }
});

export default class AuthenticationService {
    static async login(username, password) {
        cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());
        const response = await signIn({
            username: username,
            password: password
        });

        if (response.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
            const newPassword = prompt("Please enter a new password");

            await confirmSignIn({
                challengeResponse: newPassword,
            });
        }

        const session = await fetchAuthSession();

        if (!session.tokens?.idToken) {
            throw new Error("User is not authenticated.");
        }
        const { payload } = decodeJWT(session.tokens.idToken.toString());

        return payload
    }

    static async logout(){
        cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());
        await signOut();
    }
}