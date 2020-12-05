/*
 * Services
 */
import { getLang } from "./../../_metronic/i18n/index.js";
const { selectedLang } = getLang();

export default (obj) => {
    let language = require(`./../../_metronic/i18n/messages/${selectedLang}.json`);
    let new_object = obj;

    Object.entries(new_object).forEach(([key, value]) => {
        new_object[key].error = false;
        new_object[key].msj = "";
        for (let i = 0; i < value.type.length; i++) {
            switch (true) {
                case (value.type[i] === 'required'):
                    if (!value.data) {
                        new_object[key].error = true;
                        new_object[key].msj = language['GENERAL.FORM.ERROR.REQUIRED']
                        i = value.type.length;
                    }
                    break;
                case (value.type[i] === 'email'):
                    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value.data))) {
                        new_object[key].error = true;
                        new_object[key].msj = language['GENERAL.FORM.ERROR.EMAIL']
                        i = value.type.length;
                    }
                    break;
                case (value.type[i] === 'number'):
                    if (isNaN(value.data)) {
                        new_object[key].error = true;
                        new_object[key].msj = language['GENERAL.FORM.ERROR.NUMBER']
                        i = value.type.length;
                    }
                    break;
                case (value.type[i] === 'unique'):
                    break;
                case (value.type[i].includes('min:')):
                    const min = parseInt((value.type[i].split(":"))[1]);
                    if (value.data.length < min) {
                        new_object[key].error = true;
                        new_object[key].msj = (language['GENERAL.FORM.ERROR.MIN']).replace("{min}", min);
                        i = value.type.length;
                    }
                    break;
                case (value.type[i].includes('max:')):
                    const max = parseInt((value.type[i].split(":"))[1]);
                    if (value.data.length > max) {
                        new_object[key].error = true;
                        new_object[key].msj = (language['GENERAL.FORM.ERROR.MAX']).replace("{max}", max);
                        i = value.type.length;
                    }
                    break;
                case (value.type[i].includes('confirmed:')):
                    const field = (value.type[i].split(":"))[1];
                    if (value.data !== new_object[field].data) {
                        new_object[key].error = true;
                        new_object[key].msj = (language['GENERAL.FORM.ERROR.CONFIRMED']).replace("{key}", key).replace("{field}", field);
                        i = value.type.length;
                    }
                    break;
                case (value.type[i].includes('length:')):
                    const number = (value.type[i].split(":"))[1];
                    if (value.data.length < parseInt(number)) {
                        new_object[key].error = true;
                        new_object[key].msj = (language['GENERAL.FORM.ERROR.LENGTH']).replace("{number}", number).replace("{label}", new_object[key].label);
                        i = value.type.length;
                    }
                    break;
                case (value.type[i] === 'not_equal'):
                    // if (obj[property].data == obj[property].not_equal) {
                    // }
                    break;
                case (value.type[i] === 'strong_password'):
                    var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
                    if (!value.data.match(decimal)) {
                        new_object[key].error = true;
                        new_object[key].msj = language['GENERAL.FORM.ERROR.STRONG_PASSWORD'];
                        i = value.type.length;
                    };
                    break;
                default:
                    break;
                // case 'letters_numbers':
                //     if (!(/^[a-z0-9\u00f1\u00d1]+$/i.test(obj[property].data)))
                //         errors.set(property, obj[property].messages[types[i]]);
                //     break;
            }
        }
    });
    return new_object;
}