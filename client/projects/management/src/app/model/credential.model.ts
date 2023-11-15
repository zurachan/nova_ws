export class Credential {
    token: string;
    user: object;
    role: []
    // image: string

    constructor(init?: Partial<Credential>) {
        Object.assign(this, init);
    }
}