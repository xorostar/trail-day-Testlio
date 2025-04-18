import { Model, DataTypes } from 'sequelize';
import { getConnection } from './connection';
import { IIssue } from '../interfaces/db';

class Issue extends Model<IIssue> implements IIssue {
  public id!: number;
  public title!: string;
  public description!: string;
  public created_by!: string;
  public updated_by!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Issue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: {
      type: DataTypes.STRING,
      defaultValue: 'unknown'
    },
    updated_by: {
      type: DataTypes.STRING,
      defaultValue: 'unknown'
    }
  },
  {
    sequelize: getConnection(),
    modelName: 'issue',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'issues'
  }
);

export default Issue; 