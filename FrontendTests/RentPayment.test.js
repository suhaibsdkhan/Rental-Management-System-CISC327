import { ValidateUser } from "../rental_project/wwwroot/js/RentPayment";
import { jest } from '@jest/globals'

delete window.location;
window.location = { href: '', pathname: '/rent-payment/9b4e3341-63a9-4a9b-98d4-3554c27e3e85' };

describe('ValidateUser', () => {
    let UserPayments;

    beforeEach(() => {
        UserPayments = new Map([
            ['5f14d9a8-d848-46c9-a2c0-6db2b3f3925f', '9b4e3341-63a9-4a9b-98d4-3554c27e3e85'],
            ['3f2877a0-8c8e-4b93-9c53-7f72f236912b', '7e57d004-2b97-44e7-8f03-8e1ecc7f10fb']
        ]);

        jest.clearAllMocks();
    });
    test('allow the user to view the page with access', () => {
        // arrange
        const userId = '5f14d9a8-d848-46c9-a2c0-6db2b3f3925f';
        const paymentId = '9b4e3341-63a9-4a9b-98d4-3554c27e3e85';

        // act
        const result = ValidateUser(userId, paymentId, UserPayments);

        // assert
        expect(result).toBe(true);
        expect(window.location.href).toBe('');
    });

    test('do not allow the user to view the page without access', () => {
        // arrange
        const userId = '5f14d9a8-d848-46c9-a2c0-6db2b3f3925f';
        const paymentId = '7e57d004-2b97-44e7-8f03-8e1ecc7f10fb';

        // act
        const result = ValidateUser(userId, paymentId, UserPayments);

        // assert
        expect(result).toBe(false);
        expect(window.location.href).toBe('/unauthorized');
    });
});