const AdonisAPI = process.env.ADONIS_API_URL

export const url = {
    content_delivery_url: contentDeliveryBaseURL,
    adonis: {
        auth: {
            login: AdonisAPI + "api/v1/auth/login",
            refresh_token: AdonisAPI + "api/v1/auth/refresh_token",
            logout: AdonisAPI + "api/v1/auth/logout",
            // hide register
            register: AdonisAPI + "api/v1/register",
            me: AdonisAPI + "api/v1/auth/me",
            validatesession: AdonisAPI + "api/v1/auth/validatesession",
        },
        user: {
            list: AdonisAPI + "api/v1/users",
            register: AdonisAPI + "api/v1/user/register",
            detail: AdonisAPI + "api/v1/user/",
            update: AdonisAPI + "api/v1/user/update/",
            activation: AdonisAPI + "api/v1/user/activation/",
        },
        roles: {
            list: AdonisAPI + "api/v1/roles",
        },
    },
}
