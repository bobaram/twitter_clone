// tests/user.test.ts
import User from '../../../../models/user';
import { authValidationSchema } from '../../../../validations/authValidation'; // Adjust the import path as needed

jest.mock('../../../../validations/authValidation', () => ({
    authValidationSchema: {
        validateAsync: jest.fn(),
    },
}));

describe('User Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should be defined', () => {
        expect(User).toBeDefined();
    });

    test('should call validate method before creating a user', async () => {
        const validateMock = jest.spyOn(User.prototype, 'validate').mockResolvedValueOnce(undefined);

        const user = User.build({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        await user.save();

        expect(validateMock).toHaveBeenCalled();
    });

    test('should handle validation errors', async () => {
        const validateMock = jest.spyOn(User.prototype, 'validate').mockRejectedValueOnce(new Error('Validation error'));

        const user = User.build({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        await expect(user.save()).rejects.toThrow('Validation error');
    });
});
