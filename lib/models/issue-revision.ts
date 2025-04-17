import { Model, DataTypes } from 'sequelize';
import { getConnection } from './connection';
import Issue from './issue';

class IssueRevision extends Model {
  public id!: number;
  public issue_id!: number;
  public title!: string;
  public description!: string;
  public changes!: Record<string, any>;
  public created_by!: string;
  public readonly created_at!: Date;
}

IssueRevision.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    issue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'issues',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: getConnection(),
    modelName: 'issue_revision',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
    tableName: 'issue_revisions'
  }
);

// Define associations
IssueRevision.belongsTo(Issue, { foreignKey: 'issue_id' });
Issue.hasMany(IssueRevision, { foreignKey: 'issue_id' });

export default IssueRevision; 