export default interface IAdministrator {
    administratorId: number;
    username: string;
    email: string;
    passwordHash: string | null;
    passwordResetLink: string | null;
    passwordResetCode: string | null;
    createdAt: string;
    isActive: boolean;
}