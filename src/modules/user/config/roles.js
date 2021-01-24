const roles = [
  'admin',
  'user'
];

const rolePermissions = new Map();

rolePermissions.set(roles[0], ['login', 'getUsers', 'manageUsers']);
rolePermissions.set(roles[1], ['login']);

module.exports = {
  rolePermissions,
  roles
};
