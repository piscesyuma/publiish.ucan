"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapabilityParseError = exports.CapabilityUnrelatedError = exports.CapabilityEscalationError = void 0;
class CapabilityEscalationError extends Error {
    constructor(msg, parent, child) {
        super(msg);
        this.parent = parent;
        this.child = child;
    }
}
exports.CapabilityEscalationError = CapabilityEscalationError;
CapabilityEscalationError.CODE = 'ERROR_CAPABILITY_ESCALATION';
class CapabilityUnrelatedError extends Error {
    constructor(parent, child) {
        super('Capabilities are unrelated.');
        this.parent = parent;
        this.child = child;
    }
}
exports.CapabilityUnrelatedError = CapabilityUnrelatedError;
CapabilityUnrelatedError.CODE = 'ERROR_CAPABILITY_UNRELEATED';
class CapabilityParseError extends Error {
    constructor(msg, cap) {
        super(msg);
        this.cap = cap;
    }
}
exports.CapabilityParseError = CapabilityParseError;
CapabilityParseError.CODE = 'ERROR_CAPABILITY_PARSE';
//# sourceMappingURL=errors.js.map