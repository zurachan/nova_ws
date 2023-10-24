export class Register {
    email!: string;
    password!: string | null;
    firstName!: string | null;
    lastName!: string | null;
    constructor(init?: Partial<Register>) {
        Object.assign(this, init);
    }
}