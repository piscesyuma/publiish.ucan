"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
throw new Error('ucan-storage has no entry-point: consult README for usage');
__exportStar(require("./cli"), exports);
__exportStar(require("./did"), exports);
__exportStar(require("./encoding"), exports);
__exportStar(require("./errors"), exports);
__exportStar(require("./keypair"), exports);
__exportStar(require("./semantics"), exports);
__exportStar(require("./service"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./ucan-chain"), exports);
__exportStar(require("./ucan-storage"), exports);
// export * from "./ucan";
__exportStar(require("./utils"), exports);
//# sourceMappingURL=index.js.map