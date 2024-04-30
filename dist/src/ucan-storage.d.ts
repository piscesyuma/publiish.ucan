import { UcanStorageOptions, ValidateOptions } from './types';
export declare function build(params: UcanStorageOptions): Promise<string>;
export declare function validate(jwt: string, options?: ValidateOptions): Promise<{
    header: import("./types").UcanHeader;
    payload: import("./types").UcanPayload<string>;
    signature: Uint8Array;
}>;
export { isUcan } from './ucan';
//# sourceMappingURL=ucan-storage.d.ts.map