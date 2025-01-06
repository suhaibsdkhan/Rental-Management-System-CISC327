function UserHasAccessToPayment(paymentId, userId, UserPayments) {
    return UserPayments.get(userId) === paymentId;
}

export function ValidateUser(userId, paymentId, UserPaymentsMap) {
    let allowed = UserHasAccessToPayment(paymentId, userId, UserPaymentsMap);

    if (!allowed) {
        if (typeof window !== 'undefined') {
            window.location.href = "/unauthorized";
        }
        return false;
    }
    return true;
}
export const UserPayments = new Map([
    ['5f14d9a8-d848-46c9-a2c0-6db2b3f3925f', '9b4e3341-63a9-4a9b-98d4-3554c27e3e85'],
    ['3f2877a0-8c8e-4b93-9c53-7f72f236912b', '7e57d004-2b97-44e7-8f03-8e1ecc7f10fb']
]);

// Only run this in a browser environment
if (typeof window !== 'undefined') {
    // we would get this from the authorization token but we mock this instead
    let userId = '5f14d9a8-d848-46c9-a2c0-6db2b3f3925f';
    let path = window.location.pathname;
    let parts = path.split('/');
    let paymentId = parts[parts.length - 1];
    ValidateUser(userId, paymentId, UserPayments);
}