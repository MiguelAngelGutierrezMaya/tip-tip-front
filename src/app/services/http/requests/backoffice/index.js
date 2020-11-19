import axios from './../../axios/index.js'
import format from "./../format-response.js"
import routes_api from "./../routes-api.js"
import status_codes from "./../status-codes.js"

async function verifyError(error, obj_data = {}) {
    console.log(error);
    if (!error.response) return format.error(status_codes.status().HTTP_500_INTERNAL_SERVER_ERROR, { error_description: "A ocurrido un error inesperado" });
    return format.error(error.response.status, error.response.data, obj_data);
}

async function changeUserInfo(data, token) {
    return await axios.patch(routes_api.backend_tip_top().gateway.auth.users, data, {
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

export default {
    async getMemos({ token, class_id }) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.memos, {
            params: {
                class_id
            },
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
    },
    async getStudents({ token, page }, data = {}) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.students, {
            params: {
                page: (page + 1),
                ...data
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${token}`
            }
        }).then(resp => {
            return format.success(resp);
        }).catch(error => {
            return verifyError(error);
        })
    },
    async cancelClass({ token, data }) {
        return await axios.patch(routes_api.backend_tip_top().gateway.auth.classes, data, {
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
    },
    async createNotification({ token, data }) {
        return await axios.post(routes_api.backend_tip_top().gateway.auth.notifications, data, {
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
    },
    async createClass({ token, data }) {
        return await axios.post(routes_api.backend_tip_top().gateway.auth.classes, data, {
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
    },
    async getClasses({ token, init, end }, data = {}) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.student_classes, {
            params: {
                init,
                end,
                ...data
            },
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
    },
    async uploadMaterial({ token, form_data }) {
        return await axios.post(routes_api.backend_tip_top().gateway.auth.materials, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                "Authorization": `Token ${token}`
            }
        });
    },
    async deleteMaterial({ token, id }) {
        return await axios.delete(routes_api.backend_tip_top().gateway.auth.materials, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${token}`
            },
            data: {
                id
            }
        }).then(resp => {
            return format.success(resp)
        }).catch(error => {
            return verifyError(error);
        })
    },
    async getMaterials({ token, lesson_id, page }, data = {}) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.materials, {
            params: {
                page: (page + 1),
                lesson_id,
                ...data
            },
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
    },
    async getLessons({ token, page }, data = {}) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.lessons, {
            params: {
                page: (page + 1),
                ...data
            },
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
    },
    async getUnits({ token, page }, data = {}) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.units, {
            params: {
                page: (page + 1),
                ...data
            },
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
    },
    async getCountries({ token }) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.countries, {
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
    },
    async getCities({ token }, data = {}) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.cities, {
            params: {
                ...data
            },
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
    },
    async getRoles({ token }) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.roles, {
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
    },
    async getDocuments({ token }) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.documents, {
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
    },
    async getNotifications({ token, page }, data = {}) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.notifications, {
            params: {
                page: (page + 1),
                ...data
            },
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
    },
    async getUsers({ token, page }, data = {}) {
        return await axios.get(routes_api.backend_tip_top().gateway.auth.users, {
            params: {
                page: (page + 1),
                ...data
            },
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
    },
    async createMemo({ data, token }) {
        return await axios.post(routes_api.backend_tip_top().gateway.auth.memos, data, {
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
    },
    async editMemo({ data, token }) {
        return await axios.patch(routes_api.backend_tip_top().gateway.auth.memos, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${token}`
            }
        }).then(resp => {
            return format.success(resp)
        }).catch(error => {
            return verifyError(error);
        });
    },
    async createLesson({ data, token }) {
        return await axios.post(routes_api.backend_tip_top().gateway.auth.lessons, data, {
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
    },
    async editUser({ data, token }) {
        return await changeUserInfo(data, token);
    },
    async changePassword({ data, token }) {
        return await changeUserInfo(data, token);
    },
    async createUser({ data, token }) {
        return await axios.post(routes_api.backend_tip_top().gateway.auth.users, data, {
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