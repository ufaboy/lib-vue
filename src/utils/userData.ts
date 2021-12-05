import User from "../interfaces/user";
function getUsername() {
    return sessionStorage.getItem('lib-username')
}
function getRole() {
    return sessionStorage.getItem('lib-role')
}
function getToken() {
    return sessionStorage.getItem('lib-token')
}
function setUser(user: User) {
    sessionStorage.setItem('lib-username', user.username)
    sessionStorage.setItem('lib-role', user.role)
    sessionStorage.setItem('lib-token', user.token)
}
function getAdAccess() {
    return sessionStorage.getItem('lib-role') === 'librarian'
}

export {getUsername, getRole, getToken, setUser, getAdAccess}



