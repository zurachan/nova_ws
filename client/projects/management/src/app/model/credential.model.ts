export class Credential {
    token: string;
    user: object;
    role: []

    constructor(init?: Partial<Credential>) {
        Object.assign(this, init);
    }
}