import { getLangCode } from "../../../../_metronic/i18n/index.js";
import status_codes from "./status-codes.js"

const response = (error, status, msj, data) => {
    return { error, status, msj, data };
}

const success = async (obj) => {
    return response(false, status_codes.status().HTTP_200_OK, "", obj);
}

const error = async (code, obj, obj_data = {}) => {
    let msj;
    switch (true) {
        case (code >= status_codes.status().HTTP_400_BAD_REQUEST && code < status_codes.status().HTTP_500_INTERNAL_SERVER_ERROR):
            if (code === status_codes.status().HTTP_401_UNAUTHORIZED || code === status_codes.status().HTTP_403_FORBIDDEN) {
                window.location.href = `/logout`;
            }
            msj = await _verify_errors(obj.errors ? obj.errors : obj, []);
            if (msj.split(',').length > 1) msj = msj.split(',')[getLangCode()];
            break;
        default:
            msj = await _verify_errors(obj.errors ? obj.errors : ["Error 500"], []);
            if (msj.split(',').length > 1) msj = msj.split(',')[getLangCode()];
            break;
    }
    return response(true, code, msj, obj);
}

export default { success, error };

async function _verify_errors(obj, errors) {
    let messages;
    if (typeof obj !== 'string') {
        if (Array.isArray(obj))
            for (let i = 0; i < obj.length; i++)
                errors.push(`${obj[i].field}: ${obj[i].message}`)

        if (typeof obj === 'object')
            Object.entries(obj).forEach(([key, value]) => errors.push(`${key}: ${value}`));
    } else {
        errors.push(obj);
    }

    for (let i = 0; i < errors.length; i++) messages += `${errors[i]} `;

    return messages.replace('undefined', '').split('None:').join('');
}