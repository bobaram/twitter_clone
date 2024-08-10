import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import User from './user';
import { tweetValidationSchema } from '../validations/tweetValidation';

class Tweet extends Model {
    public id!: number;
    public content!: string;
    public userId!: number;

    public async validate() {
        await tweetValidationSchema.validateAsync({ content: this.content, userId: this.userId });
    }
}

Tweet.init({
    content: {
        type: DataTypes.STRING,
        allowNull: false,
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
    modelName: 'Tweet',
    hooks: {
        beforeCreate: async (tweet: Tweet) => {
            await tweet.validate();
        },
        beforeUpdate: async (tweet: Tweet) => {
            await tweet.validate();
        },
    },
});

Tweet.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Tweet, { foreignKey: 'userId', as: 'tweets' });

export default Tweet;
