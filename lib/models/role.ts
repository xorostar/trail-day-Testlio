import { Model, DataTypes } from 'sequelize';
import { getConnection } from './connection';
import User from './user';

class Role extends Model {
  public id!: number;
  public name!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize: getConnection(),
    modelName: 'role',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'roles'
  }
);

// Define many-to-many relationship with User
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });

export default Role; 