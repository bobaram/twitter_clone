import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import { authValidationSchema } from '../validations/authValidation';

class User extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;

    public async validate() {
        await authValidationSchema.validateAsync({
            username: this.username,
            email: this.email,
            password: this.password,
            action: 'signUp'
        });
    }
}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'User',
    hooks: {
        beforeCreate: async (user: User) => {
            await user.validate();
        },
        beforeUpdate: async (user: User) => {
            await user.validate();
        },
    },
});

export default User;
