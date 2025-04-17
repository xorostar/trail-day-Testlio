import User from './user';
import Role from './role';

export function setupAssociations() {
  // Define many-to-many relationship between User and Role
  User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
  Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });
} 