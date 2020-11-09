import secure_token from './../services/secure-token'
import MenuList from './../../_metronic/layout/components/aside/aside-menu/MenuList';
import roles from './../utils/roles';

const getUserInfo = () => {
    return secure_token.decrypt(localStorage.getItem("user"));
}

const getToken = () => {
    const { access_token } = getUserInfo();
    return access_token;
}

const login = async ({ user }) => {
    return localStorage.setItem("user", secure_token.encrypt(user));
}

const logOut = async () => {
    localStorage.removeItem("user")
}

const getPermission = (parent, children, isSubmenu = true) => {
    const parent_view = MenuList.find(el => el.name === parent);
    if (isSubmenu) var view = parent_view.submenu.filter(el => el.name === children);
    else var view = [parent_view];
    if (view[0].verify.admin) {
        if (roles[getUserInfo().user.role.name] === roles.ROLE_ADMIN)
            return true
        else
            return false
    }
    return true;
}

export default { getUserInfo, getToken, logOut, login, getPermission };
