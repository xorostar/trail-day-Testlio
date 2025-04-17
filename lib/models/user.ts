import { Model, DataTypes } from 'sequelize';
import { getConnection } from './connection';
import bcrypt from 'bcrypt';
import Role from './role';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public roles?: Role[];

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public async hasRole(roleName: string): Promise<boolean> {
    if (!this.roles) {
      await this.reload({ include: [Role] });
    }
    return this.roles?.some(role => role.name === roleName) || false;
  }

  public async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  // Define association methods
  public addRole!: (role: Role) => Promise<void>;
  public removeRole!: (role: Role) => Promise<void>;
  public setRoles!: (roles: Role[]) => Promise<void>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: getConnection(),
    modelName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

// Define many-to-many relationship with Role
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });

export default User; 