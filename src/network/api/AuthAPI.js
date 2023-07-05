import Axios from "@/global/AxiosCall";
import { url } from '@/configs/apiUrl'
import axios from 'axios'

/**
 * default API response structure
 * {
 *     code: <integer>,
 *     message: <string>,
 *     data: <object>
 * }
 */
export default class AuthAPI {
    /**
     * call api login user
     * payload = {
     *     userDetails,
     *     notify()
     * }
     * @param payload
     * @returns {Promise<unknown>}
     */
    static Login(payload) {
        return new Promise(((resolve, reject) => {
            Axios.Post(url.adonis.auth.login, {
                "email": payload.userDetails.email,
                "password": payload.userDetails.password,
                "remember_me": payload.checkbox_remember_me
            }).then((result) => {
                if (result.code === 200)
                    resolve(result.data)
            }, (err) => {
                payload.notify(err.response.data.notify)
                reject(err)
            })
        }))
    }

    /**
     * call api register account merchant
     * payload = {
     *     userDetails,
     *     notify()
     * }
     * @param payload
     * @returns {Promise<unknown>}
     */
    // hide register
    // static Register(payload) {
    //     return new Promise(((resolve, reject) => {
    //         Axios.Post(url.adonis.auth.register, payload.userDetails)
    //             .then((result) => {
    //                 if (result.code === 200)
    //                     resolve(result)
    //             }, (err) => {
    //                 payload.notify(err.response.data.notify)
    //                 reject(err)
    //             })
    //     }))
    // }

    /**
     * call api to user info
     * @param payload
     * @returns {Promise<unknown>}
     */
    static UserInfo(payload) {
        return new Promise(((resolve, reject) => {
            Axios.Get(url.adonis.auth.me)
                .then((result) => {
                    if (result.code === 200)
                        resolve(result)
                }, (err) => {
                    if (payload !== null && payload !== undefined)
                        payload.notify(err.response.data.notify)

                    reject(err)
                })
        }))
    }

    /**
    * *call api to get session id
    * @param token
    * @returns {Promise<unknown>}
    */
    static GetSessionID(token) {
        return new Promise(((resolve, reject) => {
            axios.post(url.adonis.auth.validatesession, {}, { headers: { 'Authorization': `Bearer ${token}` } })
                .then((result) => {
                    resolve(result.data.data.id)
                }, (err) => {
                    reject(err)
                })
        }))
    }
}