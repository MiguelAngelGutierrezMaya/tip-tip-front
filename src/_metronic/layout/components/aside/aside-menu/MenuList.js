import routes_api from "./../../../../../app/services/http/requests/routes-api"

export default [
    {
        url: null,
        name: "Dashboard",
        slug: "home",
        icons: {
            svg: {
                included: false,
                icon: "Design/Layers.svg",
            },
            flaticon: {
                included: true,
                icon: "flaticon-calendar-3 text-white"
            }
        },
        i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.DASHBOARD.TITLE',
        verify: {
            admin: false,
        },
        submenu: [
            {
                url: routes_api.frontend_tip_top().components.auth.home,
                name: 'Principal',
                slug: 'home/index',
                i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.DASHBOARD.PRINCIPAL',
                show: true,
                verify: {
                    admin: false,
                },
            },
            {
                url: routes_api.frontend_tip_top().components.auth.profile,
                name: 'Perfil',
                slug: 'home/profile',
                i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.DASHBOARD.PROFILE',
                show: false,
                verify: {
                    admin: false,
                },
            },
        ]
    },
    {
        url: null,
        name: "Usuarios",
        slug: "users",
        icons: {
            svg: {
                included: false,
                icon: "Communication/Group.svg",
            },
            flaticon: {
                included: true,
                icon: "flaticon-users text-white"
            }
        },
        i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.USERS.TITLE',
        verify: {
            admin: true,
        },
        submenu: [
            {
                url: routes_api.frontend_tip_top().components.auth.users.index,
                name: 'Principal',
                slug: 'users/index',
                i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.USERS.PRINCIPAL',
                show: true,
                verify: {
                    admin: true,
                },
            }
        ]
    },
    {
        url: null,
        name: "Materiales",
        slug: "materials",
        icons: {
            svg: {
                included: false,
                icon: "Shopping/Sort3.svg",
            },
            flaticon: {
                included: true,
                icon: "flaticon2-open-text-book text-white"
            }
        },
        i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.MATERIALS.TITLE',
        verify: {
            admin: true,
        },
        submenu: [
            {
                url: routes_api.frontend_tip_top().components.auth.levels.index,
                name: 'Niveles',
                slug: 'materials/levels',
                i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.MATERIALS.LEVELS.TITLE',
                show: false,
                verify: {
                    admin: true,
                },
            },
            {
                url: routes_api.frontend_tip_top().components.auth.units.index,
                name: 'Unidades',
                slug: 'materials/units',
                i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.MATERIALS.UNITS.TITLE',
                show: false,
                verify: {
                    admin: true,
                },
            },
            {
                url: routes_api.frontend_tip_top().components.auth.lessons.index,
                name: 'Lecciones',
                slug: 'materials/lessons',
                i18n: 'DASHBOARD.ASIDE.MENU.ITEMS.MATERIALS.LESSONS.TITLE',
                show: true,
                verify: {
                    admin: true,
                },
            }
        ]
    }
]