import auth from "../../../services/auth";
import { auth_service } from "./../../../services/http/requests/index";
import model from "./../__mocks__/userTableMock";

export function login(username, password) {
  return auth_service().login(username, password);
}

export function getUserByToken() {
  const { user } = auth.getUserInfo();
  return { user: _serializeUser(model, user) }
}

function _serializeUser(model, response) {
  model.username = response.username;
  model.email = response.email;
  model.fullname = `${response.first_name} ${response.last_name}`;
  model.roles = response.role;
  model.phone = response.phone_number;
  model.pic = response.picture;
  return model;
}
