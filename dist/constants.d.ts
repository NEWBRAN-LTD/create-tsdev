export declare const PLACEHOLDER: string;
export declare const ACTION_NAME: string;
export declare const TPL_NAME: string;
export declare const CLI_NAME: string;
export declare const PKG_FILE: string;
export declare const ACTIONS: Array<string>;
export declare const TEMPLATES: Array<string>;
export declare const TARGET_KEYS: Array<string>;
export declare const BASE_FILES: Array<string>;
export declare const ACTION_MAP: any;
export declare const YML_EXT = "yml";
export declare const TPL_EXT = ".tpl";
export declare const DEFAULT_OPTIONS: {
    to: string;
    skipInstall: boolean;
    action: string;
    tpl: string;
};
declare type configObjType = {
    action?: string;
    to?: string;
    tpl?: string;
    skipInstall?: boolean;
};
export { configObjType };
