import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
interface SignupDto {
    username: string;
    role: UserRole;
    password: string;
}
interface LoginDto {
    username: string;
    password: string;
}
export declare class AuthController {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    signup(body: SignupDto): Promise<{
        success: boolean;
        message: string;
        user?: undefined;
    } | {
        success: boolean;
        user: {
            id: string;
            username: string;
            role: UserRole;
        };
        message?: undefined;
    }>;
    login(body: LoginDto): Promise<{
        success: boolean;
        user: {
            id: string;
            username: string;
            role: UserRole;
        };
    }>;
    getProfile(id: string): Promise<{
        success: boolean;
        user: any;
    }>;
    updateProfile(id: string, body: Partial<User>): Promise<{
        success: boolean;
        user: any;
    }>;
}
export {};
