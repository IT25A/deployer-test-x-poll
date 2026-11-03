import { betterAuth, type OAuthMappedUser } from 'better-auth';
import { genericOAuth } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import {
	ORIGIN,
	AUTH_SECRET,
	OIDC_ISSUER,
	OIDC_CLIENT_ID,
	OIDC_CLIENT_SECRET
} from '$app/env/private';

export const auth = betterAuth({
	baseURL: ORIGIN,
	secret: AUTH_SECRET,

	session: {
		cookieCache: { enabled: true, maxAge: 60 * 60 * 8, strategy: 'jwe' }
	},
	account: {
		storeStateStrategy: 'cookie',
		storeAccountCookie: true
	},
	user: {
		additionalFields: {
			username: { type: 'string', required: true, input: true },
			sub: { type: 'string', required: true, input: true }
		}
	},

	plugins: [
		genericOAuth({
			config: [
				{
					providerId: 'oidc',
					discoveryUrl: `${OIDC_ISSUER}/.well-known/openid-configuration`,
					clientId: OIDC_CLIENT_ID,
					clientSecret: OIDC_CLIENT_SECRET,
					scopes: ['openid', 'profile', 'email'],
					postLogoutRedirectURI: `${ORIGIN}/`,
					mapProfileToUser: (profile) => {
						console.log('Profile from OIDC provider:', profile);
						return {
							username: profile.preferred_username,
							sub: profile.sub
						};
					},
					overrideUserInfo: true
				}
			]
		}),
		sveltekitCookies(getRequestEvent) // This plugin is required for SvelteKit to work with better-auth
	]
});
