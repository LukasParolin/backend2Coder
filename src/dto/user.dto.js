class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.cart = user.cart;
  }

  static fromUser(user) {
    return new UserDTO(user);
  }

  static fromUsers(users) {
    return users.map(user => new UserDTO(user));
  }
}

class UserPublicDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
  }

  static fromUser(user) {
    return new UserPublicDTO(user);
  }
}

class UserCreateDTO {
  constructor(userData) {
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.email = userData.email;
    this.age = userData.age;
    this.password = userData.password;
    this.role = userData.role || 'user';
  }
}

module.exports = {
  UserDTO,
  UserPublicDTO,
  UserCreateDTO
}; 