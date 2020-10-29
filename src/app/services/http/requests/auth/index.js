import axios from './../../axios/index'
import format from "./../format-response.js"
import routes_api from "./../routes-api.js"
import status_codes from "./../status-codes.js"

async function verifyError(error) {
    if (!error.response) return format.error(status_codes.status().HTTP_500_INTERNAL_SERVER_ERROR, { error_description: "A ocurrido un error inesperado" });
    return format.error(error.response.status, error.response.data);
}

export default {
    async login(username, pwd) {
        let data = new FormData();
        data.append('username', username);
        data.append('password', pwd);
        return await axios.post(routes_api.backend_tip_top().gateway.guest.login, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(resp => {
            return format.success(resp)
        }).catch(error => {
            return verifyError(error);
        })
    },
    async getUserByToken(token) {
        return await axios.get(routes_api.backend_tip_top().gateway.guest.login, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${token}`
            }
        }).then(resp => {
            return format.success(resp)
        }).catch(error => {
            return verifyError(error);
        })
    }
}