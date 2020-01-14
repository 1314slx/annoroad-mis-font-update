// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return sessionStorage.getItem("prm-authority") || "admin";
}

export function setAuthority(authority) {
  return sessionStorage.setItem("prm-authority", authority);
}

export function setToken(token) {
  sessionStorage.setItem("token", token);
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function removeItem(value) {
  sessionStorage.removeItem(value);
}

export function clear() {
  sessionStorage.clear();
}
