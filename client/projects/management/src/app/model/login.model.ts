export class AuthenRequest {
    username!: string;
    password!: string | null;

    constructor(init?: Partial<AuthenRequest>) {
        Object.assign(this, init);
    }
}