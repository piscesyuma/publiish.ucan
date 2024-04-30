import { Capability } from './types';
export declare class CapabilityEscalationError<S> extends Error {
    parent: S;
    child: S;
    constructor(msg: string, parent: S, child: S);
    static CODE: string;
}
export declare class CapabilityUnrelatedError<S> extends Error {
    parent: S;
    child: S;
    constructor(parent: S, child: S);
    static CODE: string;
}
export declare class CapabilityParseError extends Error {
    cap: Capability;
    constructor(msg: string, cap: Capability);
    static CODE: string;
}
//# sourceMappingURL=errors.d.ts.map