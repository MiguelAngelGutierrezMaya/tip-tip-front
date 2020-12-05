const backend_tip_top = () => {
    return {
        gateway: {
            guest: {
                login: "/api/login/",
                forgot: "/api/forgot/"
            },
            auth: {
                memos: "/api/memos/",
                students: "/api/students/",
                student_classes: "/api/student-classes/",
                classes: "/api/classes/",
                materials: "/api/materials/",
                lessons: "/api/lessons/",
                units: "/api/units/",
                countries: "/api/countries/",
                cities: "/api/cities/",
                roles: "/api/roles/",
                documents: "/api/documents/",
                users: "/api/users/",
                notifications: "/api/notifications/"
            }
        }
    };
}

const frontend_tip_top = () => {
    return {
        components: {
            guest: {
                login: "/auth/login",
                forgot: "/auth/forgot-password"
            },
            auth: {
                home: "/home/index",
                profile: "/home/profile",
                users: {
                    index: "/users/index"
                },
                levels: {
                    index: "/materials/levels"
                },
                units: {
                    index: "/materials/units"
                },
                lessons: {
                    index: "/materials/lessons"
                }
            },
            general: {
                error: "/error",
                page_not_found: "/error/page-not-found",
                logout: "/logout"
            }
        },
        me: `${process.env.REACT_APP_PUBLIC_URL}api/me`
    };
}

const backend_thirds = async () => {
    return {

    };
}

export default { backend_tip_top, frontend_tip_top, backend_thirds };