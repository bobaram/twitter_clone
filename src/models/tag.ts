import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import { tagValidationSchema } from '../validations/tagValidation';
import Tweet from './tweet';
import User from './user';

class Tag extends Model {
    public id!: number;
    public tweetId!: number;
    public userId!: number;

    public async validate() {
        await tagValidationSchema.validateAsync({ tweetId: this.tweetId, userId: this.userId });
    }
}

Tag.init({
    tweetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tweet,
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Tag',
    hooks: {
        beforeCreate: async (tag: Tag) => {
            await tag.validate();
        },
        beforeUpdate: async (tag: Tag) => {
            await tag.validate();
        },
    },
});

Tag.belongsTo(Tweet, { foreignKey: 'tweetId' });
Tag.belongsTo(User, { foreignKey: 'userId' });
Tweet.hasMany(Tag, { foreignKey: 'tweetId' });
User.hasMany(Tag, { foreignKey: 'userId' });

export default Tag;
