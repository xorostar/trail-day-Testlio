import { Model, DataTypes } from 'sequelize';
import { getConnection } from './connection';
import bcrypt from 'bcryptjs';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public roles?: any[]; // We'll type this properly after associations are set up

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public async hasRole(roleName: string): Promise<boolean> {
    if (!this.roles) {
      await this.reload({ include: ['roles'] });
    }
    return this.roles?.some(role => role.name === roleName) || false;
  }

  public async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  // Define association methods
  public addRole!: (role: any) => Promise<void>;
  public removeRole!: (role: any) => Promise<void>;
  public setRoles!: (roles: any[]) => Promise<void>;

  static async createUser(user: Partial<User>): Promise<User> {
    if (!user.password) {
      throw new Error('Password is required to create a user');
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return this.create(user);
  }

  static async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    const [affectedCount] = await this.update(user, { where: { id } });
    return affectedCount > 0 ? this.findByPk(id) : null;
  }
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
    tableName: 'users'
  }
);

export default User; 