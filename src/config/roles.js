const roles = [
  'admin',
  'user'
];

const rolePermissions = new Map();

rolePermissions.set(roles[0], ['getUsers', 'manageUsers']);
rolePermissions.set(roles[1], []);

module.exports = {
  rolePermissions,
  roles
};
