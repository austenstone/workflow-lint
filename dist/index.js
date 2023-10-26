/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@actions/core/lib/command.js":
/*!***************************************************!*\
  !*** ./node_modules/@actions/core/lib/command.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__webpack_require__(/*! os */ "os"));
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/@actions/core/lib/utils.js");
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ "./node_modules/@actions/core/lib/core.js":
/*!************************************************!*\
  !*** ./node_modules/@actions/core/lib/core.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __webpack_require__(/*! ./command */ "./node_modules/@actions/core/lib/command.js");
const file_command_1 = __webpack_require__(/*! ./file-command */ "./node_modules/@actions/core/lib/file-command.js");
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/@actions/core/lib/utils.js");
const os = __importStar(__webpack_require__(/*! os */ "os"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const oidc_utils_1 = __webpack_require__(/*! ./oidc-utils */ "./node_modules/@actions/core/lib/oidc-utils.js");
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __webpack_require__(/*! ./summary */ "./node_modules/@actions/core/lib/summary.js");
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __webpack_require__(/*! ./summary */ "./node_modules/@actions/core/lib/summary.js");
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __webpack_require__(/*! ./path-utils */ "./node_modules/@actions/core/lib/path-utils.js");
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ "./node_modules/@actions/core/lib/file-command.js":
/*!********************************************************!*\
  !*** ./node_modules/@actions/core/lib/file-command.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const os = __importStar(__webpack_require__(/*! os */ "os"));
const uuid_1 = __webpack_require__(/*! uuid */ "./node_modules/uuid/dist/esm-node/index.js");
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/@actions/core/lib/utils.js");
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ "./node_modules/@actions/core/lib/oidc-utils.js":
/*!******************************************************!*\
  !*** ./node_modules/@actions/core/lib/oidc-utils.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __webpack_require__(/*! @actions/http-client */ "./node_modules/@actions/http-client/lib/index.js");
const auth_1 = __webpack_require__(/*! @actions/http-client/lib/auth */ "./node_modules/@actions/http-client/lib/auth.js");
const core_1 = __webpack_require__(/*! ./core */ "./node_modules/@actions/core/lib/core.js");
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ "./node_modules/@actions/core/lib/path-utils.js":
/*!******************************************************!*\
  !*** ./node_modules/@actions/core/lib/path-utils.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__webpack_require__(/*! path */ "path"));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ "./node_modules/@actions/core/lib/summary.js":
/*!***************************************************!*\
  !*** ./node_modules/@actions/core/lib/summary.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __webpack_require__(/*! os */ "os");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ "./node_modules/@actions/core/lib/utils.js":
/*!*************************************************!*\
  !*** ./node_modules/@actions/core/lib/utils.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/@actions/http-client/lib/auth.js":
/*!*******************************************************!*\
  !*** ./node_modules/@actions/http-client/lib/auth.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ "./node_modules/@actions/http-client/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@actions/http-client/lib/index.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__webpack_require__(/*! http */ "http"));
const https = __importStar(__webpack_require__(/*! https */ "https"));
const pm = __importStar(__webpack_require__(/*! ./proxy */ "./node_modules/@actions/http-client/lib/proxy.js"));
const tunnel = __importStar(__webpack_require__(/*! tunnel */ "./node_modules/tunnel/index.js"));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@actions/http-client/lib/proxy.js":
/*!********************************************************!*\
  !*** ./node_modules/@actions/http-client/lib/proxy.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ "./node_modules/cronstrue/dist/cronstrue.js":
/*!**************************************************!*\
  !*** ./node_modules/cronstrue/dist/cronstrue.js ***!
  \**************************************************/
/***/ ((module) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(globalThis, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 794:
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_540__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CronParser = void 0;
var rangeValidator_1 = __nested_webpack_require_540__(586);
var CronParser = (function () {
    function CronParser(expression, dayOfWeekStartIndexZero, monthStartIndexZero) {
        if (dayOfWeekStartIndexZero === void 0) { dayOfWeekStartIndexZero = true; }
        if (monthStartIndexZero === void 0) { monthStartIndexZero = false; }
        this.expression = expression;
        this.dayOfWeekStartIndexZero = dayOfWeekStartIndexZero;
        this.monthStartIndexZero = monthStartIndexZero;
    }
    CronParser.prototype.parse = function () {
        var parsed = this.extractParts(this.expression);
        this.normalize(parsed);
        this.validate(parsed);
        return parsed;
    };
    CronParser.prototype.extractParts = function (expression) {
        if (!this.expression) {
            throw new Error("Expression is empty");
        }
        var parsed = expression.trim().split(/[ ]+/);
        if (parsed.length < 5) {
            throw new Error("Expression has only ".concat(parsed.length, " part").concat(parsed.length == 1 ? "" : "s", ". At least 5 parts are required."));
        }
        else if (parsed.length == 5) {
            parsed.unshift("");
            parsed.push("");
        }
        else if (parsed.length == 6) {
            var isYearWithNoSecondsPart = /\d{4}$/.test(parsed[5]) || parsed[4] == "?" || parsed[2] == "?";
            if (isYearWithNoSecondsPart) {
                parsed.unshift("");
            }
            else {
                parsed.push("");
            }
        }
        else if (parsed.length > 7) {
            throw new Error("Expression has ".concat(parsed.length, " parts; too many!"));
        }
        return parsed;
    };
    CronParser.prototype.normalize = function (expressionParts) {
        var _this = this;
        expressionParts[3] = expressionParts[3].replace("?", "*");
        expressionParts[5] = expressionParts[5].replace("?", "*");
        expressionParts[2] = expressionParts[2].replace("?", "*");
        if (expressionParts[0].indexOf("0/") == 0) {
            expressionParts[0] = expressionParts[0].replace("0/", "*/");
        }
        if (expressionParts[1].indexOf("0/") == 0) {
            expressionParts[1] = expressionParts[1].replace("0/", "*/");
        }
        if (expressionParts[2].indexOf("0/") == 0) {
            expressionParts[2] = expressionParts[2].replace("0/", "*/");
        }
        if (expressionParts[3].indexOf("1/") == 0) {
            expressionParts[3] = expressionParts[3].replace("1/", "*/");
        }
        if (expressionParts[4].indexOf("1/") == 0) {
            expressionParts[4] = expressionParts[4].replace("1/", "*/");
        }
        if (expressionParts[6].indexOf("1/") == 0) {
            expressionParts[6] = expressionParts[6].replace("1/", "*/");
        }
        expressionParts[5] = expressionParts[5].replace(/(^\d)|([^#/\s]\d)/g, function (t) {
            var dowDigits = t.replace(/\D/, "");
            var dowDigitsAdjusted = dowDigits;
            if (_this.dayOfWeekStartIndexZero) {
                if (dowDigits == "7") {
                    dowDigitsAdjusted = "0";
                }
            }
            else {
                dowDigitsAdjusted = (parseInt(dowDigits) - 1).toString();
            }
            return t.replace(dowDigits, dowDigitsAdjusted);
        });
        if (expressionParts[5] == "L") {
            expressionParts[5] = "6";
        }
        if (expressionParts[3] == "?") {
            expressionParts[3] = "*";
        }
        if (expressionParts[3].indexOf("W") > -1 &&
            (expressionParts[3].indexOf(",") > -1 || expressionParts[3].indexOf("-") > -1)) {
            throw new Error("The 'W' character can be specified only when the day-of-month is a single day, not a range or list of days.");
        }
        var days = {
            SUN: 0,
            MON: 1,
            TUE: 2,
            WED: 3,
            THU: 4,
            FRI: 5,
            SAT: 6,
        };
        for (var day in days) {
            expressionParts[5] = expressionParts[5].replace(new RegExp(day, "gi"), days[day].toString());
        }
        expressionParts[4] = expressionParts[4].replace(/(^\d{1,2})|([^#/\s]\d{1,2})/g, function (t) {
            var dowDigits = t.replace(/\D/, "");
            var dowDigitsAdjusted = dowDigits;
            if (_this.monthStartIndexZero) {
                dowDigitsAdjusted = (parseInt(dowDigits) + 1).toString();
            }
            return t.replace(dowDigits, dowDigitsAdjusted);
        });
        var months = {
            JAN: 1,
            FEB: 2,
            MAR: 3,
            APR: 4,
            MAY: 5,
            JUN: 6,
            JUL: 7,
            AUG: 8,
            SEP: 9,
            OCT: 10,
            NOV: 11,
            DEC: 12,
        };
        for (var month in months) {
            expressionParts[4] = expressionParts[4].replace(new RegExp(month, "gi"), months[month].toString());
        }
        if (expressionParts[0] == "0") {
            expressionParts[0] = "";
        }
        if (!/\*|\-|\,|\//.test(expressionParts[2]) &&
            (/\*|\//.test(expressionParts[1]) || /\*|\//.test(expressionParts[0]))) {
            expressionParts[2] += "-".concat(expressionParts[2]);
        }
        for (var i = 0; i < expressionParts.length; i++) {
            if (expressionParts[i].indexOf(",") != -1) {
                expressionParts[i] =
                    expressionParts[i]
                        .split(",")
                        .filter(function (str) { return str !== ""; })
                        .join(",") || "*";
            }
            if (expressionParts[i] == "*/1") {
                expressionParts[i] = "*";
            }
            if (expressionParts[i].indexOf("/") > -1 && !/^\*|\-|\,/.test(expressionParts[i])) {
                var stepRangeThrough = null;
                switch (i) {
                    case 4:
                        stepRangeThrough = "12";
                        break;
                    case 5:
                        stepRangeThrough = "6";
                        break;
                    case 6:
                        stepRangeThrough = "9999";
                        break;
                    default:
                        stepRangeThrough = null;
                        break;
                }
                if (stepRangeThrough !== null) {
                    var parts = expressionParts[i].split("/");
                    expressionParts[i] = "".concat(parts[0], "-").concat(stepRangeThrough, "/").concat(parts[1]);
                }
            }
        }
    };
    CronParser.prototype.validate = function (parsed) {
        this.assertNoInvalidCharacters("DOW", parsed[5]);
        this.assertNoInvalidCharacters("DOM", parsed[3]);
        this.validateRange(parsed);
    };
    CronParser.prototype.validateRange = function (parsed) {
        rangeValidator_1.default.secondRange(parsed[0]);
        rangeValidator_1.default.minuteRange(parsed[1]);
        rangeValidator_1.default.hourRange(parsed[2]);
        rangeValidator_1.default.dayOfMonthRange(parsed[3]);
        rangeValidator_1.default.monthRange(parsed[4], this.monthStartIndexZero);
        rangeValidator_1.default.dayOfWeekRange(parsed[5], this.dayOfWeekStartIndexZero);
    };
    CronParser.prototype.assertNoInvalidCharacters = function (partDescription, expression) {
        var invalidChars = expression.match(/[A-KM-VX-Z]+/gi);
        if (invalidChars && invalidChars.length) {
            throw new Error("".concat(partDescription, " part contains invalid values: '").concat(invalidChars.toString(), "'"));
        }
    };
    return CronParser;
}());
exports.CronParser = CronParser;


/***/ }),

/***/ 728:
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_8463__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExpressionDescriptor = void 0;
var stringUtilities_1 = __nested_webpack_require_8463__(910);
var cronParser_1 = __nested_webpack_require_8463__(794);
var ExpressionDescriptor = (function () {
    function ExpressionDescriptor(expression, options) {
        this.expression = expression;
        this.options = options;
        this.expressionParts = new Array(5);
        if (!this.options.locale && ExpressionDescriptor.defaultLocale) {
            this.options.locale = ExpressionDescriptor.defaultLocale;
        }
        if (!ExpressionDescriptor.locales[this.options.locale]) {
            var fallBackLocale = Object.keys(ExpressionDescriptor.locales)[0];
            console.warn("Locale '".concat(this.options.locale, "' could not be found; falling back to '").concat(fallBackLocale, "'."));
            this.options.locale = fallBackLocale;
        }
        this.i18n = ExpressionDescriptor.locales[this.options.locale];
        if (options.use24HourTimeFormat === undefined) {
            options.use24HourTimeFormat = this.i18n.use24HourTimeFormatByDefault();
        }
    }
    ExpressionDescriptor.toString = function (expression, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.throwExceptionOnParseError, throwExceptionOnParseError = _c === void 0 ? true : _c, _d = _b.verbose, verbose = _d === void 0 ? false : _d, _e = _b.dayOfWeekStartIndexZero, dayOfWeekStartIndexZero = _e === void 0 ? true : _e, _f = _b.monthStartIndexZero, monthStartIndexZero = _f === void 0 ? false : _f, use24HourTimeFormat = _b.use24HourTimeFormat, _g = _b.locale, locale = _g === void 0 ? null : _g, _h = _b.tzOffset, tzOffset = _h === void 0 ? 0 : _h;
        var options = {
            throwExceptionOnParseError: throwExceptionOnParseError,
            verbose: verbose,
            dayOfWeekStartIndexZero: dayOfWeekStartIndexZero,
            monthStartIndexZero: monthStartIndexZero,
            use24HourTimeFormat: use24HourTimeFormat,
            locale: locale,
            tzOffset: tzOffset
        };
        var descripter = new ExpressionDescriptor(expression, options);
        return descripter.getFullDescription();
    };
    ExpressionDescriptor.initialize = function (localesLoader, defaultLocale) {
        if (defaultLocale === void 0) { defaultLocale = "en"; }
        ExpressionDescriptor.specialCharacters = ["/", "-", ",", "*"];
        ExpressionDescriptor.defaultLocale = defaultLocale;
        localesLoader.load(ExpressionDescriptor.locales);
    };
    ExpressionDescriptor.prototype.getFullDescription = function () {
        var description = "";
        try {
            var parser = new cronParser_1.CronParser(this.expression, this.options.dayOfWeekStartIndexZero, this.options.monthStartIndexZero);
            this.expressionParts = parser.parse();
            var timeSegment = this.getTimeOfDayDescription();
            var dayOfMonthDesc = this.getDayOfMonthDescription();
            var monthDesc = this.getMonthDescription();
            var dayOfWeekDesc = this.getDayOfWeekDescription();
            var yearDesc = this.getYearDescription();
            description += timeSegment + dayOfMonthDesc + dayOfWeekDesc + monthDesc + yearDesc;
            description = this.transformVerbosity(description, !!this.options.verbose);
            description = description.charAt(0).toLocaleUpperCase() + description.substr(1);
        }
        catch (ex) {
            if (!this.options.throwExceptionOnParseError) {
                description = this.i18n.anErrorOccuredWhenGeneratingTheExpressionD();
            }
            else {
                throw "".concat(ex);
            }
        }
        return description;
    };
    ExpressionDescriptor.prototype.getTimeOfDayDescription = function () {
        var secondsExpression = this.expressionParts[0];
        var minuteExpression = this.expressionParts[1];
        var hourExpression = this.expressionParts[2];
        var description = "";
        if (!stringUtilities_1.StringUtilities.containsAny(minuteExpression, ExpressionDescriptor.specialCharacters) &&
            !stringUtilities_1.StringUtilities.containsAny(hourExpression, ExpressionDescriptor.specialCharacters) &&
            !stringUtilities_1.StringUtilities.containsAny(secondsExpression, ExpressionDescriptor.specialCharacters)) {
            description += this.i18n.atSpace() + this.formatTime(hourExpression, minuteExpression, secondsExpression);
        }
        else if (!secondsExpression &&
            minuteExpression.indexOf("-") > -1 &&
            !(minuteExpression.indexOf(",") > -1) &&
            !(minuteExpression.indexOf("/") > -1) &&
            !stringUtilities_1.StringUtilities.containsAny(hourExpression, ExpressionDescriptor.specialCharacters)) {
            var minuteParts = minuteExpression.split("-");
            description += stringUtilities_1.StringUtilities.format(this.i18n.everyMinuteBetweenX0AndX1(), this.formatTime(hourExpression, minuteParts[0], ""), this.formatTime(hourExpression, minuteParts[1], ""));
        }
        else if (!secondsExpression &&
            hourExpression.indexOf(",") > -1 &&
            hourExpression.indexOf("-") == -1 &&
            hourExpression.indexOf("/") == -1 &&
            !stringUtilities_1.StringUtilities.containsAny(minuteExpression, ExpressionDescriptor.specialCharacters)) {
            var hourParts = hourExpression.split(",");
            description += this.i18n.at();
            for (var i = 0; i < hourParts.length; i++) {
                description += " ";
                description += this.formatTime(hourParts[i], minuteExpression, "");
                if (i < hourParts.length - 2) {
                    description += ",";
                }
                if (i == hourParts.length - 2) {
                    description += this.i18n.spaceAnd();
                }
            }
        }
        else {
            var secondsDescription = this.getSecondsDescription();
            var minutesDescription = this.getMinutesDescription();
            var hoursDescription = this.getHoursDescription();
            description += secondsDescription;
            if (description && minutesDescription) {
                description += ", ";
            }
            description += minutesDescription;
            if (minutesDescription === hoursDescription) {
                return description;
            }
            if (description && hoursDescription) {
                description += ", ";
            }
            description += hoursDescription;
        }
        return description;
    };
    ExpressionDescriptor.prototype.getSecondsDescription = function () {
        var _this = this;
        var description = this.getSegmentDescription(this.expressionParts[0], this.i18n.everySecond(), function (s) {
            return s;
        }, function (s) {
            return stringUtilities_1.StringUtilities.format(_this.i18n.everyX0Seconds(s), s);
        }, function (s) {
            return _this.i18n.secondsX0ThroughX1PastTheMinute();
        }, function (s) {
            return s == "0"
                ? ""
                : parseInt(s) < 20
                    ? _this.i18n.atX0SecondsPastTheMinute(s)
                    : _this.i18n.atX0SecondsPastTheMinuteGt20() || _this.i18n.atX0SecondsPastTheMinute(s);
        });
        return description;
    };
    ExpressionDescriptor.prototype.getMinutesDescription = function () {
        var _this = this;
        var secondsExpression = this.expressionParts[0];
        var hourExpression = this.expressionParts[2];
        var description = this.getSegmentDescription(this.expressionParts[1], this.i18n.everyMinute(), function (s) {
            return s;
        }, function (s) {
            return stringUtilities_1.StringUtilities.format(_this.i18n.everyX0Minutes(s), s);
        }, function (s) {
            return _this.i18n.minutesX0ThroughX1PastTheHour();
        }, function (s) {
            try {
                return s == "0" && hourExpression.indexOf("/") == -1 && secondsExpression == ""
                    ? _this.i18n.everyHour()
                    : parseInt(s) < 20
                        ? _this.i18n.atX0MinutesPastTheHour(s)
                        : _this.i18n.atX0MinutesPastTheHourGt20() || _this.i18n.atX0MinutesPastTheHour(s);
            }
            catch (e) {
                return _this.i18n.atX0MinutesPastTheHour(s);
            }
        });
        return description;
    };
    ExpressionDescriptor.prototype.getHoursDescription = function () {
        var _this = this;
        var expression = this.expressionParts[2];
        var description = this.getSegmentDescription(expression, this.i18n.everyHour(), function (s) {
            return _this.formatTime(s, "0", "");
        }, function (s) {
            return stringUtilities_1.StringUtilities.format(_this.i18n.everyX0Hours(s), s);
        }, function (s) {
            return _this.i18n.betweenX0AndX1();
        }, function (s) {
            return _this.i18n.atX0();
        });
        if (description && expression.includes("-") && this.expressionParts[1] != "0") {
            var atTheHourMatches = Array.from(description.matchAll(/:00/g));
            if (atTheHourMatches.length > 1) {
                var lastAtTheHourMatchIndex = atTheHourMatches[atTheHourMatches.length - 1].index;
                description =
                    description.substring(0, lastAtTheHourMatchIndex) +
                        ":59" +
                        description.substring(lastAtTheHourMatchIndex + 3);
            }
        }
        return description;
    };
    ExpressionDescriptor.prototype.getDayOfWeekDescription = function () {
        var _this = this;
        var daysOfWeekNames = this.i18n.daysOfTheWeek();
        var description = null;
        if (this.expressionParts[5] == "*") {
            description = "";
        }
        else {
            description = this.getSegmentDescription(this.expressionParts[5], this.i18n.commaEveryDay(), function (s, form) {
                var exp = s;
                if (s.indexOf("#") > -1) {
                    exp = s.substring(0, s.indexOf("#"));
                }
                else if (s.indexOf("L") > -1) {
                    exp = exp.replace("L", "");
                }
                var description = _this.i18n.daysOfTheWeekInCase
                    ? _this.i18n.daysOfTheWeekInCase(form)[parseInt(exp)]
                    : daysOfWeekNames[parseInt(exp)];
                if (s.indexOf("#") > -1) {
                    var dayOfWeekOfMonthDescription = null;
                    var dayOfWeekOfMonthNumber = s.substring(s.indexOf("#") + 1);
                    var dayOfWeekNumber = s.substring(0, s.indexOf("#"));
                    switch (dayOfWeekOfMonthNumber) {
                        case "1":
                            dayOfWeekOfMonthDescription = _this.i18n.first(dayOfWeekNumber);
                            break;
                        case "2":
                            dayOfWeekOfMonthDescription = _this.i18n.second(dayOfWeekNumber);
                            break;
                        case "3":
                            dayOfWeekOfMonthDescription = _this.i18n.third(dayOfWeekNumber);
                            break;
                        case "4":
                            dayOfWeekOfMonthDescription = _this.i18n.fourth(dayOfWeekNumber);
                            break;
                        case "5":
                            dayOfWeekOfMonthDescription = _this.i18n.fifth(dayOfWeekNumber);
                            break;
                    }
                    description = dayOfWeekOfMonthDescription + " " + description;
                }
                return description;
            }, function (s) {
                if (parseInt(s) == 1) {
                    return "";
                }
                else {
                    return stringUtilities_1.StringUtilities.format(_this.i18n.commaEveryX0DaysOfTheWeek(s), s);
                }
            }, function (s) {
                var beginFrom = s.substring(0, s.indexOf("-"));
                var domSpecified = _this.expressionParts[3] != "*";
                return domSpecified ? _this.i18n.commaAndX0ThroughX1(beginFrom) : _this.i18n.commaX0ThroughX1(beginFrom);
            }, function (s) {
                var format = null;
                if (s.indexOf("#") > -1) {
                    var dayOfWeekOfMonthNumber = s.substring(s.indexOf("#") + 1);
                    format = _this.i18n.commaOnThe(dayOfWeekOfMonthNumber).trim() + _this.i18n.spaceX0OfTheMonth();
                }
                else if (s.indexOf("L") > -1) {
                    format = _this.i18n.commaOnTheLastX0OfTheMonth(s.replace("L", ""));
                }
                else {
                    var domSpecified = _this.expressionParts[3] != "*";
                    format = domSpecified ? _this.i18n.commaAndOnX0() : _this.i18n.commaOnlyOnX0(s);
                }
                return format;
            });
        }
        return description;
    };
    ExpressionDescriptor.prototype.getMonthDescription = function () {
        var _this = this;
        var monthNames = this.i18n.monthsOfTheYear();
        var description = this.getSegmentDescription(this.expressionParts[4], "", function (s, form) {
            return form && _this.i18n.monthsOfTheYearInCase
                ? _this.i18n.monthsOfTheYearInCase(form)[parseInt(s) - 1]
                : monthNames[parseInt(s) - 1];
        }, function (s) {
            if (parseInt(s) == 1) {
                return "";
            }
            else {
                return stringUtilities_1.StringUtilities.format(_this.i18n.commaEveryX0Months(s), s);
            }
        }, function (s) {
            return _this.i18n.commaMonthX0ThroughMonthX1() || _this.i18n.commaX0ThroughX1();
        }, function (s) {
            return _this.i18n.commaOnlyInMonthX0 ? _this.i18n.commaOnlyInMonthX0() : _this.i18n.commaOnlyInX0();
        });
        return description;
    };
    ExpressionDescriptor.prototype.getDayOfMonthDescription = function () {
        var _this = this;
        var description = null;
        var expression = this.expressionParts[3];
        switch (expression) {
            case "L":
                description = this.i18n.commaOnTheLastDayOfTheMonth();
                break;
            case "WL":
            case "LW":
                description = this.i18n.commaOnTheLastWeekdayOfTheMonth();
                break;
            default:
                var weekDayNumberMatches = expression.match(/(\d{1,2}W)|(W\d{1,2})/);
                if (weekDayNumberMatches) {
                    var dayNumber = parseInt(weekDayNumberMatches[0].replace("W", ""));
                    var dayString = dayNumber == 1
                        ? this.i18n.firstWeekday()
                        : stringUtilities_1.StringUtilities.format(this.i18n.weekdayNearestDayX0(), dayNumber.toString());
                    description = stringUtilities_1.StringUtilities.format(this.i18n.commaOnTheX0OfTheMonth(), dayString);
                    break;
                }
                else {
                    var lastDayOffSetMatches = expression.match(/L-(\d{1,2})/);
                    if (lastDayOffSetMatches) {
                        var offSetDays = lastDayOffSetMatches[1];
                        description = stringUtilities_1.StringUtilities.format(this.i18n.commaDaysBeforeTheLastDayOfTheMonth(offSetDays), offSetDays);
                        break;
                    }
                    else if (expression == "*" && this.expressionParts[5] != "*") {
                        return "";
                    }
                    else {
                        description = this.getSegmentDescription(expression, this.i18n.commaEveryDay(), function (s) {
                            return s == "L"
                                ? _this.i18n.lastDay()
                                : _this.i18n.dayX0
                                    ? stringUtilities_1.StringUtilities.format(_this.i18n.dayX0(), s)
                                    : s;
                        }, function (s) {
                            return s == "1" ? _this.i18n.commaEveryDay() : _this.i18n.commaEveryX0Days(s);
                        }, function (s) {
                            return _this.i18n.commaBetweenDayX0AndX1OfTheMonth(s);
                        }, function (s) {
                            return _this.i18n.commaOnDayX0OfTheMonth(s);
                        });
                    }
                    break;
                }
        }
        return description;
    };
    ExpressionDescriptor.prototype.getYearDescription = function () {
        var _this = this;
        var description = this.getSegmentDescription(this.expressionParts[6], "", function (s) {
            return /^\d+$/.test(s) ? new Date(parseInt(s), 1).getFullYear().toString() : s;
        }, function (s) {
            return stringUtilities_1.StringUtilities.format(_this.i18n.commaEveryX0Years(s), s);
        }, function (s) {
            return _this.i18n.commaYearX0ThroughYearX1() || _this.i18n.commaX0ThroughX1();
        }, function (s) {
            return _this.i18n.commaOnlyInYearX0 ? _this.i18n.commaOnlyInYearX0() : _this.i18n.commaOnlyInX0();
        });
        return description;
    };
    ExpressionDescriptor.prototype.getSegmentDescription = function (expression, allDescription, getSingleItemDescription, getIncrementDescriptionFormat, getRangeDescriptionFormat, getDescriptionFormat) {
        var description = null;
        var doesExpressionContainIncrement = expression.indexOf("/") > -1;
        var doesExpressionContainRange = expression.indexOf("-") > -1;
        var doesExpressionContainMultipleValues = expression.indexOf(",") > -1;
        if (!expression) {
            description = "";
        }
        else if (expression === "*") {
            description = allDescription;
        }
        else if (!doesExpressionContainIncrement && !doesExpressionContainRange && !doesExpressionContainMultipleValues) {
            description = stringUtilities_1.StringUtilities.format(getDescriptionFormat(expression), getSingleItemDescription(expression));
        }
        else if (doesExpressionContainMultipleValues) {
            var segments = expression.split(",");
            var descriptionContent = "";
            for (var i = 0; i < segments.length; i++) {
                if (i > 0 && segments.length > 2) {
                    descriptionContent += ",";
                    if (i < segments.length - 1) {
                        descriptionContent += " ";
                    }
                }
                if (i > 0 && segments.length > 1 && (i == segments.length - 1 || segments.length == 2)) {
                    descriptionContent += "".concat(this.i18n.spaceAnd(), " ");
                }
                if (segments[i].indexOf("/") > -1 || segments[i].indexOf("-") > -1) {
                    var isSegmentRangeWithoutIncrement = segments[i].indexOf("-") > -1 && segments[i].indexOf("/") == -1;
                    var currentDescriptionContent = this.getSegmentDescription(segments[i], allDescription, getSingleItemDescription, getIncrementDescriptionFormat, isSegmentRangeWithoutIncrement ? this.i18n.commaX0ThroughX1 : getRangeDescriptionFormat, getDescriptionFormat);
                    if (isSegmentRangeWithoutIncrement) {
                        currentDescriptionContent = currentDescriptionContent.replace(", ", "");
                    }
                    descriptionContent += currentDescriptionContent;
                }
                else if (!doesExpressionContainIncrement) {
                    descriptionContent += getSingleItemDescription(segments[i]);
                }
                else {
                    descriptionContent += this.getSegmentDescription(segments[i], allDescription, getSingleItemDescription, getIncrementDescriptionFormat, getRangeDescriptionFormat, getDescriptionFormat);
                }
            }
            if (!doesExpressionContainIncrement) {
                description = stringUtilities_1.StringUtilities.format(getDescriptionFormat(expression), descriptionContent);
            }
            else {
                description = descriptionContent;
            }
        }
        else if (doesExpressionContainIncrement) {
            var segments = expression.split("/");
            description = stringUtilities_1.StringUtilities.format(getIncrementDescriptionFormat(segments[1]), segments[1]);
            if (segments[0].indexOf("-") > -1) {
                var rangeSegmentDescription = this.generateRangeSegmentDescription(segments[0], getRangeDescriptionFormat, getSingleItemDescription);
                if (rangeSegmentDescription.indexOf(", ") != 0) {
                    description += ", ";
                }
                description += rangeSegmentDescription;
            }
            else if (segments[0].indexOf("*") == -1) {
                var rangeItemDescription = stringUtilities_1.StringUtilities.format(getDescriptionFormat(segments[0]), getSingleItemDescription(segments[0]));
                rangeItemDescription = rangeItemDescription.replace(", ", "");
                description += stringUtilities_1.StringUtilities.format(this.i18n.commaStartingX0(), rangeItemDescription);
            }
        }
        else if (doesExpressionContainRange) {
            description = this.generateRangeSegmentDescription(expression, getRangeDescriptionFormat, getSingleItemDescription);
        }
        return description;
    };
    ExpressionDescriptor.prototype.generateRangeSegmentDescription = function (rangeExpression, getRangeDescriptionFormat, getSingleItemDescription) {
        var description = "";
        var rangeSegments = rangeExpression.split("-");
        var rangeSegment1Description = getSingleItemDescription(rangeSegments[0], 1);
        var rangeSegment2Description = getSingleItemDescription(rangeSegments[1], 2);
        var rangeDescriptionFormat = getRangeDescriptionFormat(rangeExpression);
        description += stringUtilities_1.StringUtilities.format(rangeDescriptionFormat, rangeSegment1Description, rangeSegment2Description);
        return description;
    };
    ExpressionDescriptor.prototype.formatTime = function (hourExpression, minuteExpression, secondExpression) {
        var hour = parseInt(hourExpression) + (this.options.tzOffset ? this.options.tzOffset : 0);
        if (hour >= 24) {
            hour = hour - 24;
        }
        else if (hour < 0) {
            hour = 24 + hour;
        }
        var period = "";
        var setPeriodBeforeTime = false;
        if (!this.options.use24HourTimeFormat) {
            setPeriodBeforeTime = !!(this.i18n.setPeriodBeforeTime && this.i18n.setPeriodBeforeTime());
            period = setPeriodBeforeTime ? "".concat(this.getPeriod(hour), " ") : " ".concat(this.getPeriod(hour));
            if (hour > 12) {
                hour -= 12;
            }
            if (hour === 0) {
                hour = 12;
            }
        }
        var minute = minuteExpression;
        var second = "";
        if (secondExpression) {
            second = ":".concat(("00" + secondExpression).substring(secondExpression.length));
        }
        return "".concat(setPeriodBeforeTime ? period : "").concat(("00" + hour.toString()).substring(hour.toString().length), ":").concat(("00" + minute.toString()).substring(minute.toString().length)).concat(second).concat(!setPeriodBeforeTime ? period : "");
    };
    ExpressionDescriptor.prototype.transformVerbosity = function (description, useVerboseFormat) {
        if (!useVerboseFormat) {
            description = description.replace(new RegExp(", ".concat(this.i18n.everyMinute()), "g"), "");
            description = description.replace(new RegExp(", ".concat(this.i18n.everyHour()), "g"), "");
            description = description.replace(new RegExp(this.i18n.commaEveryDay(), "g"), "");
            description = description.replace(/\, ?$/, "");
        }
        return description;
    };
    ExpressionDescriptor.prototype.getPeriod = function (hour) {
        return hour >= 12 ? (this.i18n.pm && this.i18n.pm()) || "PM" : (this.i18n.am && this.i18n.am()) || "AM";
    };
    ExpressionDescriptor.locales = {};
    return ExpressionDescriptor;
}());
exports.ExpressionDescriptor = ExpressionDescriptor;


/***/ }),

/***/ 336:
/***/ ((__unused_webpack_module, exports, __nested_webpack_require_33146__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.enLocaleLoader = void 0;
var en_1 = __nested_webpack_require_33146__(751);
var enLocaleLoader = (function () {
    function enLocaleLoader() {
    }
    enLocaleLoader.prototype.load = function (availableLocales) {
        availableLocales["en"] = new en_1.en();
    };
    return enLocaleLoader;
}());
exports.enLocaleLoader = enLocaleLoader;


/***/ }),

/***/ 751:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.en = void 0;
var en = (function () {
    function en() {
    }
    en.prototype.atX0SecondsPastTheMinuteGt20 = function () {
        return null;
    };
    en.prototype.atX0MinutesPastTheHourGt20 = function () {
        return null;
    };
    en.prototype.commaMonthX0ThroughMonthX1 = function () {
        return null;
    };
    en.prototype.commaYearX0ThroughYearX1 = function () {
        return null;
    };
    en.prototype.use24HourTimeFormatByDefault = function () {
        return false;
    };
    en.prototype.anErrorOccuredWhenGeneratingTheExpressionD = function () {
        return "An error occured when generating the expression description.  Check the cron expression syntax.";
    };
    en.prototype.everyMinute = function () {
        return "every minute";
    };
    en.prototype.everyHour = function () {
        return "every hour";
    };
    en.prototype.atSpace = function () {
        return "At ";
    };
    en.prototype.everyMinuteBetweenX0AndX1 = function () {
        return "Every minute between %s and %s";
    };
    en.prototype.at = function () {
        return "At";
    };
    en.prototype.spaceAnd = function () {
        return " and";
    };
    en.prototype.everySecond = function () {
        return "every second";
    };
    en.prototype.everyX0Seconds = function () {
        return "every %s seconds";
    };
    en.prototype.secondsX0ThroughX1PastTheMinute = function () {
        return "seconds %s through %s past the minute";
    };
    en.prototype.atX0SecondsPastTheMinute = function () {
        return "at %s seconds past the minute";
    };
    en.prototype.everyX0Minutes = function () {
        return "every %s minutes";
    };
    en.prototype.minutesX0ThroughX1PastTheHour = function () {
        return "minutes %s through %s past the hour";
    };
    en.prototype.atX0MinutesPastTheHour = function () {
        return "at %s minutes past the hour";
    };
    en.prototype.everyX0Hours = function () {
        return "every %s hours";
    };
    en.prototype.betweenX0AndX1 = function () {
        return "between %s and %s";
    };
    en.prototype.atX0 = function () {
        return "at %s";
    };
    en.prototype.commaEveryDay = function () {
        return ", every day";
    };
    en.prototype.commaEveryX0DaysOfTheWeek = function () {
        return ", every %s days of the week";
    };
    en.prototype.commaX0ThroughX1 = function () {
        return ", %s through %s";
    };
    en.prototype.commaAndX0ThroughX1 = function () {
        return ", %s through %s";
    };
    en.prototype.first = function () {
        return "first";
    };
    en.prototype.second = function () {
        return "second";
    };
    en.prototype.third = function () {
        return "third";
    };
    en.prototype.fourth = function () {
        return "fourth";
    };
    en.prototype.fifth = function () {
        return "fifth";
    };
    en.prototype.commaOnThe = function () {
        return ", on the ";
    };
    en.prototype.spaceX0OfTheMonth = function () {
        return " %s of the month";
    };
    en.prototype.lastDay = function () {
        return "the last day";
    };
    en.prototype.commaOnTheLastX0OfTheMonth = function () {
        return ", on the last %s of the month";
    };
    en.prototype.commaOnlyOnX0 = function () {
        return ", only on %s";
    };
    en.prototype.commaAndOnX0 = function () {
        return ", and on %s";
    };
    en.prototype.commaEveryX0Months = function () {
        return ", every %s months";
    };
    en.prototype.commaOnlyInX0 = function () {
        return ", only in %s";
    };
    en.prototype.commaOnTheLastDayOfTheMonth = function () {
        return ", on the last day of the month";
    };
    en.prototype.commaOnTheLastWeekdayOfTheMonth = function () {
        return ", on the last weekday of the month";
    };
    en.prototype.commaDaysBeforeTheLastDayOfTheMonth = function () {
        return ", %s days before the last day of the month";
    };
    en.prototype.firstWeekday = function () {
        return "first weekday";
    };
    en.prototype.weekdayNearestDayX0 = function () {
        return "weekday nearest day %s";
    };
    en.prototype.commaOnTheX0OfTheMonth = function () {
        return ", on the %s of the month";
    };
    en.prototype.commaEveryX0Days = function () {
        return ", every %s days";
    };
    en.prototype.commaBetweenDayX0AndX1OfTheMonth = function () {
        return ", between day %s and %s of the month";
    };
    en.prototype.commaOnDayX0OfTheMonth = function () {
        return ", on day %s of the month";
    };
    en.prototype.commaEveryHour = function () {
        return ", every hour";
    };
    en.prototype.commaEveryX0Years = function () {
        return ", every %s years";
    };
    en.prototype.commaStartingX0 = function () {
        return ", starting %s";
    };
    en.prototype.daysOfTheWeek = function () {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    };
    en.prototype.monthsOfTheYear = function () {
        return [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
    };
    return en;
}());
exports.en = en;


/***/ }),

/***/ 586:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function assert(value, message) {
    if (!value) {
        throw new Error(message);
    }
}
var RangeValidator = (function () {
    function RangeValidator() {
    }
    RangeValidator.secondRange = function (parse) {
        var parsed = parse.split(',');
        for (var i = 0; i < parsed.length; i++) {
            if (!isNaN(parseInt(parsed[i], 10))) {
                var second = parseInt(parsed[i], 10);
                assert(second >= 0 && second <= 59, 'seconds part must be >= 0 and <= 59');
            }
        }
    };
    RangeValidator.minuteRange = function (parse) {
        var parsed = parse.split(',');
        for (var i = 0; i < parsed.length; i++) {
            if (!isNaN(parseInt(parsed[i], 10))) {
                var minute = parseInt(parsed[i], 10);
                assert(minute >= 0 && minute <= 59, 'minutes part must be >= 0 and <= 59');
            }
        }
    };
    RangeValidator.hourRange = function (parse) {
        var parsed = parse.split(',');
        for (var i = 0; i < parsed.length; i++) {
            if (!isNaN(parseInt(parsed[i], 10))) {
                var hour = parseInt(parsed[i], 10);
                assert(hour >= 0 && hour <= 23, 'hours part must be >= 0 and <= 23');
            }
        }
    };
    RangeValidator.dayOfMonthRange = function (parse) {
        var parsed = parse.split(',');
        for (var i = 0; i < parsed.length; i++) {
            if (!isNaN(parseInt(parsed[i], 10))) {
                var dayOfMonth = parseInt(parsed[i], 10);
                assert(dayOfMonth >= 1 && dayOfMonth <= 31, 'DOM part must be >= 1 and <= 31');
            }
        }
    };
    RangeValidator.monthRange = function (parse, monthStartIndexZero) {
        var parsed = parse.split(',');
        for (var i = 0; i < parsed.length; i++) {
            if (!isNaN(parseInt(parsed[i], 10))) {
                var month = parseInt(parsed[i], 10);
                assert(month >= 1 && month <= 12, monthStartIndexZero ? 'month part must be >= 0 and <= 11' : 'month part must be >= 1 and <= 12');
            }
        }
    };
    RangeValidator.dayOfWeekRange = function (parse, dayOfWeekStartIndexZero) {
        var parsed = parse.split(',');
        for (var i = 0; i < parsed.length; i++) {
            if (!isNaN(parseInt(parsed[i], 10))) {
                var dayOfWeek = parseInt(parsed[i], 10);
                assert(dayOfWeek >= 0 && dayOfWeek <= 6, dayOfWeekStartIndexZero ? 'DOW part must be >= 0 and <= 6' : 'DOW part must be >= 1 and <= 7');
            }
        }
    };
    return RangeValidator;
}());
exports["default"] = RangeValidator;


/***/ }),

/***/ 910:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringUtilities = void 0;
var StringUtilities = (function () {
    function StringUtilities() {
    }
    StringUtilities.format = function (template) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return template.replace(/%s/g, function (substring) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return values.shift();
        });
    };
    StringUtilities.containsAny = function (text, searchStrings) {
        return searchStrings.some(function (c) {
            return text.indexOf(c) > -1;
        });
    };
    return StringUtilities;
}());
exports.StringUtilities = StringUtilities;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_43082__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_43082__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __nested_webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toString = void 0;
var expressionDescriptor_1 = __nested_webpack_require_43082__(728);
var enLocaleLoader_1 = __nested_webpack_require_43082__(336);
expressionDescriptor_1.ExpressionDescriptor.initialize(new enLocaleLoader_1.enLocaleLoader());
exports["default"] = expressionDescriptor_1.ExpressionDescriptor;
var toString = expressionDescriptor_1.ExpressionDescriptor.toString;
exports.toString = toString;

})();

/******/ 	return __nested_webpack_exports__;
/******/ })()
;
});

/***/ }),

/***/ "./node_modules/tunnel/index.js":
/*!**************************************!*\
  !*** ./node_modules/tunnel/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/tunnel */ "./node_modules/tunnel/lib/tunnel.js");


/***/ }),

/***/ "./node_modules/tunnel/lib/tunnel.js":
/*!*******************************************!*\
  !*** ./node_modules/tunnel/lib/tunnel.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var net = __webpack_require__(/*! net */ "net");
var tls = __webpack_require__(/*! tls */ "tls");
var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var events = __webpack_require__(/*! events */ "events");
var assert = __webpack_require__(/*! assert */ "assert");
var util = __webpack_require__(/*! util */ "util");


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/index.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NIL: () => (/* reexport safe */ _nil_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   parse: () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   stringify: () => (/* reexport safe */ _stringify_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   v1: () => (/* reexport safe */ _v1_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   v3: () => (/* reexport safe */ _v3_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   v4: () => (/* reexport safe */ _v4_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   v5: () => (/* reexport safe */ _v5_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   validate: () => (/* reexport safe */ _validate_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   version: () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _v1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v1.js */ "./node_modules/uuid/dist/esm-node/v1.js");
/* harmony import */ var _v3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v3.js */ "./node_modules/uuid/dist/esm-node/v3.js");
/* harmony import */ var _v4_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./v4.js */ "./node_modules/uuid/dist/esm-node/v4.js");
/* harmony import */ var _v5_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./v5.js */ "./node_modules/uuid/dist/esm-node/v5.js");
/* harmony import */ var _nil_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nil.js */ "./node_modules/uuid/dist/esm-node/nil.js");
/* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./version.js */ "./node_modules/uuid/dist/esm-node/version.js");
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-node/validate.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-node/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-node/parse.js");










/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/md5.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/md5.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);


function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash('md5').update(bytes).digest();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (md5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/nil.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/nil.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ('00000000-0000-0000-0000-000000000000');

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/parse.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/parse.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-node/validate.js");


function parse(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parse);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/regex.js":
/*!**************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/regex.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/rng.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/rng.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rng)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto__WEBPACK_IMPORTED_MODULE_0___default().randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/sha1.js":
/*!*************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/sha1.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto */ "crypto");
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);


function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return crypto__WEBPACK_IMPORTED_MODULE_0___default().createHash('sha1').update(bytes).digest();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sha1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/stringify.js":
/*!******************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/stringify.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-node/validate.js");

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stringify);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v1.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v1.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-node/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-node/stringify.js");

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(b);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v1);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v3.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v3.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-node/v35.js");
/* harmony import */ var _md5_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./md5.js */ "./node_modules/uuid/dist/esm-node/md5.js");


const v3 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v3', 0x30, _md5_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v3);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v35.js":
/*!************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v35.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DNS: () => (/* binding */ DNS),
/* harmony export */   URL: () => (/* binding */ URL),
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-node/stringify.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./node_modules/uuid/dist/esm-node/parse.js");



function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v4.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v4.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rng.js */ "./node_modules/uuid/dist/esm-node/rng.js");
/* harmony import */ var _stringify_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stringify.js */ "./node_modules/uuid/dist/esm-node/stringify.js");



function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || _rng_js__WEBPACK_IMPORTED_MODULE_0__["default"])(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0,_stringify_js__WEBPACK_IMPORTED_MODULE_1__["default"])(rnds);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v4);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/v5.js":
/*!***********************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/v5.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _v35_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./v35.js */ "./node_modules/uuid/dist/esm-node/v35.js");
/* harmony import */ var _sha1_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sha1.js */ "./node_modules/uuid/dist/esm-node/sha1.js");


const v5 = (0,_v35_js__WEBPACK_IMPORTED_MODULE_0__["default"])('v5', 0x50, _sha1_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (v5);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/validate.js":
/*!*****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/validate.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _regex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex.js */ "./node_modules/uuid/dist/esm-node/regex.js");


function validate(uuid) {
  return typeof uuid === 'string' && _regex_js__WEBPACK_IMPORTED_MODULE_0__["default"].test(uuid);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validate);

/***/ }),

/***/ "./node_modules/uuid/dist/esm-node/version.js":
/*!****************************************************!*\
  !*** ./node_modules/uuid/dist/esm-node/version.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _validate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validate.js */ "./node_modules/uuid/dist/esm-node/validate.js");


function version(uuid) {
  if (!(0,_validate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (version);

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "./node_modules/yaml/dist/compose/compose-collection.js":
/*!**************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/compose-collection.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Scalar = __webpack_require__(/*! ../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var YAMLMap = __webpack_require__(/*! ../nodes/YAMLMap.js */ "./node_modules/yaml/dist/nodes/YAMLMap.js");
var YAMLSeq = __webpack_require__(/*! ../nodes/YAMLSeq.js */ "./node_modules/yaml/dist/nodes/YAMLSeq.js");
var resolveBlockMap = __webpack_require__(/*! ./resolve-block-map.js */ "./node_modules/yaml/dist/compose/resolve-block-map.js");
var resolveBlockSeq = __webpack_require__(/*! ./resolve-block-seq.js */ "./node_modules/yaml/dist/compose/resolve-block-seq.js");
var resolveFlowCollection = __webpack_require__(/*! ./resolve-flow-collection.js */ "./node_modules/yaml/dist/compose/resolve-flow-collection.js");

function resolveCollection(CN, ctx, token, onError, tagName, tag) {
    const coll = token.type === 'block-map'
        ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag)
        : token.type === 'block-seq'
            ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag)
            : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
    const Coll = coll.constructor;
    // If we got a tagName matching the class, or the tag name is '!',
    // then use the tagName from the node class used to create it.
    if (tagName === '!' || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
    }
    if (tagName)
        coll.tag = tagName;
    return coll;
}
function composeCollection(CN, ctx, token, tagToken, onError) {
    const tagName = !tagToken
        ? null
        : ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg));
    const expType = token.type === 'block-map'
        ? 'map'
        : token.type === 'block-seq'
            ? 'seq'
            : token.start.source === '{'
                ? 'map'
                : 'seq';
    // shortcut: check if it's a generic YAMLMap or YAMLSeq
    // before jumping into the custom tag logic.
    if (!tagToken ||
        !tagName ||
        tagName === '!' ||
        (tagName === YAMLMap.YAMLMap.tagName && expType === 'map') ||
        (tagName === YAMLSeq.YAMLSeq.tagName && expType === 'seq') ||
        !expType) {
        return resolveCollection(CN, ctx, token, onError, tagName);
    }
    let tag = ctx.schema.tags.find(t => t.tag === tagName && t.collection === expType);
    if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt && kt.collection === expType) {
            ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
            tag = kt;
        }
        else {
            if (kt?.collection) {
                onError(tagToken, 'BAD_COLLECTION_TYPE', `${kt.tag} used for ${expType} collection, but expects ${kt.collection}`, true);
            }
            else {
                onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, true);
            }
            return resolveCollection(CN, ctx, token, onError, tagName);
        }
    }
    const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
    const res = tag.resolve?.(coll, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg), ctx.options) ?? coll;
    const node = identity.isNode(res)
        ? res
        : new Scalar.Scalar(res);
    node.range = coll.range;
    node.tag = tagName;
    if (tag?.format)
        node.format = tag.format;
    return node;
}

exports.composeCollection = composeCollection;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/compose-doc.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/compose/compose-doc.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Document = __webpack_require__(/*! ../doc/Document.js */ "./node_modules/yaml/dist/doc/Document.js");
var composeNode = __webpack_require__(/*! ./compose-node.js */ "./node_modules/yaml/dist/compose/compose-node.js");
var resolveEnd = __webpack_require__(/*! ./resolve-end.js */ "./node_modules/yaml/dist/compose/resolve-end.js");
var resolveProps = __webpack_require__(/*! ./resolve-props.js */ "./node_modules/yaml/dist/compose/resolve-props.js");

function composeDoc(options, directives, { offset, start, value, end }, onError) {
    const opts = Object.assign({ _directives: directives }, options);
    const doc = new Document.Document(undefined, opts);
    const ctx = {
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
    };
    const props = resolveProps.resolveProps(start, {
        indicator: 'doc-start',
        next: value ?? end?.[0],
        offset,
        onError,
        startOnNewline: true
    });
    if (props.found) {
        doc.directives.docStart = true;
        if (value &&
            (value.type === 'block-map' || value.type === 'block-seq') &&
            !props.hasNewline)
            onError(props.end, 'MISSING_CHAR', 'Block collection cannot start on same line with directives-end marker');
    }
    // @ts-expect-error If Contents is set, let's trust the user
    doc.contents = value
        ? composeNode.composeNode(ctx, value, props, onError)
        : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
    const contentEnd = doc.contents.range[2];
    const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
    if (re.comment)
        doc.comment = re.comment;
    doc.range = [offset, contentEnd, re.offset];
    return doc;
}

exports.composeDoc = composeDoc;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/compose-node.js":
/*!********************************************************!*\
  !*** ./node_modules/yaml/dist/compose/compose-node.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Alias = __webpack_require__(/*! ../nodes/Alias.js */ "./node_modules/yaml/dist/nodes/Alias.js");
var composeCollection = __webpack_require__(/*! ./compose-collection.js */ "./node_modules/yaml/dist/compose/compose-collection.js");
var composeScalar = __webpack_require__(/*! ./compose-scalar.js */ "./node_modules/yaml/dist/compose/compose-scalar.js");
var resolveEnd = __webpack_require__(/*! ./resolve-end.js */ "./node_modules/yaml/dist/compose/resolve-end.js");
var utilEmptyScalarPosition = __webpack_require__(/*! ./util-empty-scalar-position.js */ "./node_modules/yaml/dist/compose/util-empty-scalar-position.js");

const CN = { composeNode, composeEmptyNode };
function composeNode(ctx, token, props, onError) {
    const { spaceBefore, comment, anchor, tag } = props;
    let node;
    let isSrcToken = true;
    switch (token.type) {
        case 'alias':
            node = composeAlias(ctx, token, onError);
            if (anchor || tag)
                onError(token, 'ALIAS_PROPS', 'An alias node must not specify any properties');
            break;
        case 'scalar':
        case 'single-quoted-scalar':
        case 'double-quoted-scalar':
        case 'block-scalar':
            node = composeScalar.composeScalar(ctx, token, tag, onError);
            if (anchor)
                node.anchor = anchor.source.substring(1);
            break;
        case 'block-map':
        case 'block-seq':
        case 'flow-collection':
            node = composeCollection.composeCollection(CN, ctx, token, tag, onError);
            if (anchor)
                node.anchor = anchor.source.substring(1);
            break;
        default: {
            const message = token.type === 'error'
                ? token.message
                : `Unsupported token (type: ${token.type})`;
            onError(token, 'UNEXPECTED_TOKEN', message);
            node = composeEmptyNode(ctx, token.offset, undefined, null, props, onError);
            isSrcToken = false;
        }
    }
    if (anchor && node.anchor === '')
        onError(anchor, 'BAD_ALIAS', 'Anchor cannot be an empty string');
    if (spaceBefore)
        node.spaceBefore = true;
    if (comment) {
        if (token.type === 'scalar' && token.source === '')
            node.comment = comment;
        else
            node.commentBefore = comment;
    }
    // @ts-expect-error Type checking misses meaning of isSrcToken
    if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
    return node;
}
function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
    const token = {
        type: 'scalar',
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ''
    };
    const node = composeScalar.composeScalar(ctx, token, tag, onError);
    if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === '')
            onError(anchor, 'BAD_ALIAS', 'Anchor cannot be an empty string');
    }
    if (spaceBefore)
        node.spaceBefore = true;
    if (comment) {
        node.comment = comment;
        node.range[2] = end;
    }
    return node;
}
function composeAlias({ options }, { offset, source, end }, onError) {
    const alias = new Alias.Alias(source.substring(1));
    if (alias.source === '')
        onError(offset, 'BAD_ALIAS', 'Alias cannot be an empty string');
    if (alias.source.endsWith(':'))
        onError(offset + source.length - 1, 'BAD_ALIAS', 'Alias ending in : is ambiguous', true);
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
    alias.range = [offset, valueEnd, re.offset];
    if (re.comment)
        alias.comment = re.comment;
    return alias;
}

exports.composeEmptyNode = composeEmptyNode;
exports.composeNode = composeNode;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/compose-scalar.js":
/*!**********************************************************!*\
  !*** ./node_modules/yaml/dist/compose/compose-scalar.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Scalar = __webpack_require__(/*! ../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var resolveBlockScalar = __webpack_require__(/*! ./resolve-block-scalar.js */ "./node_modules/yaml/dist/compose/resolve-block-scalar.js");
var resolveFlowScalar = __webpack_require__(/*! ./resolve-flow-scalar.js */ "./node_modules/yaml/dist/compose/resolve-flow-scalar.js");

function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment, range } = token.type === 'block-scalar'
        ? resolveBlockScalar.resolveBlockScalar(token, ctx.options.strict, onError)
        : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken
        ? ctx.directives.tagName(tagToken.source, msg => onError(tagToken, 'TAG_RESOLVE_FAILED', msg))
        : null;
    const tag = tagToken && tagName
        ? findScalarTagByName(ctx.schema, value, tagName, tagToken, onError)
        : token.type === 'scalar'
            ? findScalarTagByTest(ctx, value, token, onError)
            : ctx.schema[identity.SCALAR];
    let scalar;
    try {
        const res = tag.resolve(value, msg => onError(tagToken ?? token, 'TAG_RESOLVE_FAILED', msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, 'TAG_RESOLVE_FAILED', msg);
        scalar = new Scalar.Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
        scalar.type = type;
    if (tagName)
        scalar.tag = tagName;
    if (tag.format)
        scalar.format = tag.format;
    if (comment)
        scalar.comment = comment;
    return scalar;
}
function findScalarTagByName(schema, value, tagName, tagToken, onError) {
    if (tagName === '!')
        return schema[identity.SCALAR]; // non-specific tag
    const matchWithTest = [];
    for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
            if (tag.default && tag.test)
                matchWithTest.push(tag);
            else
                return tag;
        }
    }
    for (const tag of matchWithTest)
        if (tag.test?.test(value))
            return tag;
    const kt = schema.knownTags[tagName];
    if (kt && !kt.collection) {
        // Ensure that the known tag is available for stringifying,
        // but does not get used by default.
        schema.tags.push(Object.assign({}, kt, { default: false, test: undefined }));
        return kt;
    }
    onError(tagToken, 'TAG_RESOLVE_FAILED', `Unresolved tag: ${tagName}`, tagName !== 'tag:yaml.org,2002:str');
    return schema[identity.SCALAR];
}
function findScalarTagByTest({ directives, schema }, value, token, onError) {
    const tag = schema.tags.find(tag => tag.default && tag.test?.test(value)) || schema[identity.SCALAR];
    if (schema.compat) {
        const compat = schema.compat.find(tag => tag.default && tag.test?.test(value)) ??
            schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
            const ts = directives.tagString(tag.tag);
            const cs = directives.tagString(compat.tag);
            const msg = `Value may be parsed as either ${ts} or ${cs}`;
            onError(token, 'TAG_RESOLVE_FAILED', msg, true);
        }
    }
    return tag;
}

exports.composeScalar = composeScalar;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/composer.js":
/*!****************************************************!*\
  !*** ./node_modules/yaml/dist/compose/composer.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var directives = __webpack_require__(/*! ../doc/directives.js */ "./node_modules/yaml/dist/doc/directives.js");
var Document = __webpack_require__(/*! ../doc/Document.js */ "./node_modules/yaml/dist/doc/Document.js");
var errors = __webpack_require__(/*! ../errors.js */ "./node_modules/yaml/dist/errors.js");
var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var composeDoc = __webpack_require__(/*! ./compose-doc.js */ "./node_modules/yaml/dist/compose/compose-doc.js");
var resolveEnd = __webpack_require__(/*! ./resolve-end.js */ "./node_modules/yaml/dist/compose/resolve-end.js");

function getErrorPos(src) {
    if (typeof src === 'number')
        return [src, src + 1];
    if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
    const { offset, source } = src;
    return [offset, offset + (typeof source === 'string' ? source.length : 1)];
}
function parsePrelude(prelude) {
    let comment = '';
    let atComment = false;
    let afterEmptyLine = false;
    for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
            case '#':
                comment +=
                    (comment === '' ? '' : afterEmptyLine ? '\n\n' : '\n') +
                        (source.substring(1) || ' ');
                atComment = true;
                afterEmptyLine = false;
                break;
            case '%':
                if (prelude[i + 1]?.[0] !== '#')
                    i += 1;
                atComment = false;
                break;
            default:
                // This may be wrong after doc-end, but in that case it doesn't matter
                if (!atComment)
                    afterEmptyLine = true;
                atComment = false;
        }
    }
    return { comment, afterEmptyLine };
}
/**
 * Compose a stream of CST nodes into a stream of YAML Documents.
 *
 * ```ts
 * import { Composer, Parser } from 'yaml'
 *
 * const src: string = ...
 * const tokens = new Parser().parse(src)
 * const docs = new Composer().compose(tokens)
 * ```
 */
class Composer {
    constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
            const pos = getErrorPos(source);
            if (warning)
                this.warnings.push(new errors.YAMLWarning(pos, code, message));
            else
                this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        this.directives = new directives.Directives({ version: options.version || '1.2' });
        this.options = options;
    }
    decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        //console.log({ dc: doc.comment, prelude, comment })
        if (comment) {
            const dc = doc.contents;
            if (afterDoc) {
                doc.comment = doc.comment ? `${doc.comment}\n${comment}` : comment;
            }
            else if (afterEmptyLine || doc.directives.docStart || !dc) {
                doc.commentBefore = comment;
            }
            else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
                let it = dc.items[0];
                if (identity.isPair(it))
                    it = it.key;
                const cb = it.commentBefore;
                it.commentBefore = cb ? `${comment}\n${cb}` : comment;
            }
            else {
                const cb = dc.commentBefore;
                dc.commentBefore = cb ? `${comment}\n${cb}` : comment;
            }
        }
        if (afterDoc) {
            Array.prototype.push.apply(doc.errors, this.errors);
            Array.prototype.push.apply(doc.warnings, this.warnings);
        }
        else {
            doc.errors = this.errors;
            doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
    }
    /**
     * Current stream status information.
     *
     * Mostly useful at the end of input for an empty stream.
     */
    streamInfo() {
        return {
            comment: parsePrelude(this.prelude).comment,
            directives: this.directives,
            errors: this.errors,
            warnings: this.warnings
        };
    }
    /**
     * Compose tokens into documents.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
            yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
    }
    /** Advance the composer by one CST token. */
    *next(token) {
        if (process.env.LOG_STREAM)
            console.dir(token, { depth: null });
        switch (token.type) {
            case 'directive':
                this.directives.add(token.source, (offset, message, warning) => {
                    const pos = getErrorPos(token);
                    pos[0] += offset;
                    this.onError(pos, 'BAD_DIRECTIVE', message, warning);
                });
                this.prelude.push(token.source);
                this.atDirectives = true;
                break;
            case 'document': {
                const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
                if (this.atDirectives && !doc.directives.docStart)
                    this.onError(token, 'MISSING_CHAR', 'Missing directives-end/doc-start indicator line');
                this.decorate(doc, false);
                if (this.doc)
                    yield this.doc;
                this.doc = doc;
                this.atDirectives = false;
                break;
            }
            case 'byte-order-mark':
            case 'space':
                break;
            case 'comment':
            case 'newline':
                this.prelude.push(token.source);
                break;
            case 'error': {
                const msg = token.source
                    ? `${token.message}: ${JSON.stringify(token.source)}`
                    : token.message;
                const error = new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', msg);
                if (this.atDirectives || !this.doc)
                    this.errors.push(error);
                else
                    this.doc.errors.push(error);
                break;
            }
            case 'doc-end': {
                if (!this.doc) {
                    const msg = 'Unexpected doc-end without preceding document';
                    this.errors.push(new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', msg));
                    break;
                }
                this.doc.directives.docEnd = true;
                const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
                this.decorate(this.doc, true);
                if (end.comment) {
                    const dc = this.doc.comment;
                    this.doc.comment = dc ? `${dc}\n${end.comment}` : end.comment;
                }
                this.doc.range[2] = end.offset;
                break;
            }
            default:
                this.errors.push(new errors.YAMLParseError(getErrorPos(token), 'UNEXPECTED_TOKEN', `Unsupported token ${token.type}`));
        }
    }
    /**
     * Call at end of input to yield any remaining document.
     *
     * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
     * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
     */
    *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
            this.decorate(this.doc, true);
            yield this.doc;
            this.doc = null;
        }
        else if (forceDoc) {
            const opts = Object.assign({ _directives: this.directives }, this.options);
            const doc = new Document.Document(undefined, opts);
            if (this.atDirectives)
                this.onError(endOffset, 'MISSING_CHAR', 'Missing directives-end indicator line');
            doc.range = [0, endOffset, endOffset];
            this.decorate(doc, false);
            yield doc;
        }
    }
}

exports.Composer = Composer;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/resolve-block-map.js":
/*!*************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/resolve-block-map.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Pair = __webpack_require__(/*! ../nodes/Pair.js */ "./node_modules/yaml/dist/nodes/Pair.js");
var YAMLMap = __webpack_require__(/*! ../nodes/YAMLMap.js */ "./node_modules/yaml/dist/nodes/YAMLMap.js");
var resolveProps = __webpack_require__(/*! ./resolve-props.js */ "./node_modules/yaml/dist/compose/resolve-props.js");
var utilContainsNewline = __webpack_require__(/*! ./util-contains-newline.js */ "./node_modules/yaml/dist/compose/util-contains-newline.js");
var utilFlowIndentCheck = __webpack_require__(/*! ./util-flow-indent-check.js */ "./node_modules/yaml/dist/compose/util-flow-indent-check.js");
var utilMapIncludes = __webpack_require__(/*! ./util-map-includes.js */ "./node_modules/yaml/dist/compose/util-map-includes.js");

const startColMsg = 'All mapping items must start at the same column';
function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
    const map = new NodeClass(ctx.schema);
    if (ctx.atRoot)
        ctx.atRoot = false;
    let offset = bm.offset;
    let commentEnd = null;
    for (const collItem of bm.items) {
        const { start, key, sep, value } = collItem;
        // key properties
        const keyProps = resolveProps.resolveProps(start, {
            indicator: 'explicit-key-ind',
            next: key ?? sep?.[0],
            offset,
            onError,
            startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
            if (key) {
                if (key.type === 'block-seq')
                    onError(offset, 'BLOCK_AS_IMPLICIT_KEY', 'A block sequence may not be used as an implicit map key');
                else if ('indent' in key && key.indent !== bm.indent)
                    onError(offset, 'BAD_INDENT', startColMsg);
            }
            if (!keyProps.anchor && !keyProps.tag && !sep) {
                commentEnd = keyProps.end;
                if (keyProps.comment) {
                    if (map.comment)
                        map.comment += '\n' + keyProps.comment;
                    else
                        map.comment = keyProps.comment;
                }
                continue;
            }
            if (keyProps.hasNewlineAfterProp || utilContainsNewline.containsNewline(key)) {
                onError(key ?? start[start.length - 1], 'MULTILINE_IMPLICIT_KEY', 'Implicit keys need to be on a single line');
            }
        }
        else if (keyProps.found?.indent !== bm.indent) {
            onError(offset, 'BAD_INDENT', startColMsg);
        }
        // key value
        const keyStart = keyProps.end;
        const keyNode = key
            ? composeNode(ctx, key, keyProps, onError)
            : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
            onError(keyStart, 'DUPLICATE_KEY', 'Map keys must be unique');
        // value properties
        const valueProps = resolveProps.resolveProps(sep ?? [], {
            indicator: 'map-value-ind',
            next: value,
            offset: keyNode.range[2],
            onError,
            startOnNewline: !key || key.type === 'block-scalar'
        });
        offset = valueProps.end;
        if (valueProps.found) {
            if (implicitKey) {
                if (value?.type === 'block-map' && !valueProps.hasNewline)
                    onError(offset, 'BLOCK_AS_IMPLICIT_KEY', 'Nested mappings are not allowed in compact mappings');
                if (ctx.options.strict &&
                    keyProps.start < valueProps.found.offset - 1024)
                    onError(keyNode.range, 'KEY_OVER_1024_CHARS', 'The : indicator must be at most 1024 chars after the start of an implicit block mapping key');
            }
            // value value
            const valueNode = value
                ? composeNode(ctx, value, valueProps, onError)
                : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
            if (ctx.schema.compat)
                utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
            offset = valueNode.range[2];
            const pair = new Pair.Pair(keyNode, valueNode);
            if (ctx.options.keepSourceTokens)
                pair.srcToken = collItem;
            map.items.push(pair);
        }
        else {
            // key with no value
            if (implicitKey)
                onError(keyNode.range, 'MISSING_CHAR', 'Implicit map keys need to be followed by map values');
            if (valueProps.comment) {
                if (keyNode.comment)
                    keyNode.comment += '\n' + valueProps.comment;
                else
                    keyNode.comment = valueProps.comment;
            }
            const pair = new Pair.Pair(keyNode);
            if (ctx.options.keepSourceTokens)
                pair.srcToken = collItem;
            map.items.push(pair);
        }
    }
    if (commentEnd && commentEnd < offset)
        onError(commentEnd, 'IMPOSSIBLE', 'Map comment with trailing content');
    map.range = [bm.offset, offset, commentEnd ?? offset];
    return map;
}

exports.resolveBlockMap = resolveBlockMap;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/resolve-block-scalar.js":
/*!****************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/resolve-block-scalar.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");

function resolveBlockScalar(scalar, strict, onError) {
    const start = scalar.offset;
    const header = parseBlockScalarHeader(scalar, strict, onError);
    if (!header)
        return { value: '', type: null, comment: '', range: [start, start, start] };
    const type = header.mode === '>' ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
    const lines = scalar.source ? splitLines(scalar.source) : [];
    // determine the end of content & start of chomping
    let chompStart = lines.length;
    for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === '' || content === '\r')
            chompStart = i;
        else
            break;
    }
    // shortcut for empty contents
    if (chompStart === 0) {
        const value = header.chomp === '+' && lines.length > 0
            ? '\n'.repeat(Math.max(1, lines.length - 1))
            : '';
        let end = start + header.length;
        if (scalar.source)
            end += scalar.source.length;
        return { value, type, comment: header.comment, range: [start, end, end] };
    }
    // find the indentation level to trim from start
    let trimIndent = scalar.indent + header.indent;
    let offset = scalar.offset + header.length;
    let contentStart = 0;
    for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === '' || content === '\r') {
            if (header.indent === 0 && indent.length > trimIndent)
                trimIndent = indent.length;
        }
        else {
            if (indent.length < trimIndent) {
                const message = 'Block scalars with more-indented leading empty lines must use an explicit indentation indicator';
                onError(offset + indent.length, 'MISSING_CHAR', message);
            }
            if (header.indent === 0)
                trimIndent = indent.length;
            contentStart = i;
            break;
        }
        offset += indent.length + content.length + 1;
    }
    // include trailing more-indented empty lines in content
    for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
            chompStart = i + 1;
    }
    let value = '';
    let sep = '';
    let prevMoreIndented = false;
    // leading whitespace is kept intact
    for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + '\n';
    for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === '\r';
        if (crlf)
            content = content.slice(0, -1);
        /* istanbul ignore if already caught in lexer */
        if (content && indent.length < trimIndent) {
            const src = header.indent
                ? 'explicit indentation indicator'
                : 'first line';
            const message = `Block scalar lines must not be less indented than their ${src}`;
            onError(offset - content.length - (crlf ? 2 : 1), 'BAD_INDENT', message);
            indent = '';
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
            value += sep + indent.slice(trimIndent) + content;
            sep = '\n';
        }
        else if (indent.length > trimIndent || content[0] === '\t') {
            // more-indented content within a folded block
            if (sep === ' ')
                sep = '\n';
            else if (!prevMoreIndented && sep === '\n')
                sep = '\n\n';
            value += sep + indent.slice(trimIndent) + content;
            sep = '\n';
            prevMoreIndented = true;
        }
        else if (content === '') {
            // empty line
            if (sep === '\n')
                value += '\n';
            else
                sep = '\n';
        }
        else {
            value += sep + content;
            sep = ' ';
            prevMoreIndented = false;
        }
    }
    switch (header.chomp) {
        case '-':
            break;
        case '+':
            for (let i = chompStart; i < lines.length; ++i)
                value += '\n' + lines[i][0].slice(trimIndent);
            if (value[value.length - 1] !== '\n')
                value += '\n';
            break;
        default:
            value += '\n';
    }
    const end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
}
function parseBlockScalarHeader({ offset, props }, strict, onError) {
    /* istanbul ignore if should not happen */
    if (props[0].type !== 'block-scalar-header') {
        onError(props[0], 'IMPOSSIBLE', 'Block scalar header not found');
        return null;
    }
    const { source } = props[0];
    const mode = source[0];
    let indent = 0;
    let chomp = '';
    let error = -1;
    for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === '-' || ch === '+'))
            chomp = ch;
        else {
            const n = Number(ch);
            if (!indent && n)
                indent = n;
            else if (error === -1)
                error = offset + i;
        }
    }
    if (error !== -1)
        onError(error, 'UNEXPECTED_TOKEN', `Block scalar header includes extra characters: ${source}`);
    let hasSpace = false;
    let comment = '';
    let length = source.length;
    for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
            case 'space':
                hasSpace = true;
            // fallthrough
            case 'newline':
                length += token.source.length;
                break;
            case 'comment':
                if (strict && !hasSpace) {
                    const message = 'Comments must be separated from other tokens by white space characters';
                    onError(token, 'MISSING_CHAR', message);
                }
                length += token.source.length;
                comment = token.source.substring(1);
                break;
            case 'error':
                onError(token, 'UNEXPECTED_TOKEN', token.message);
                length += token.source.length;
                break;
            /* istanbul ignore next should not happen */
            default: {
                const message = `Unexpected token in block scalar header: ${token.type}`;
                onError(token, 'UNEXPECTED_TOKEN', message);
                const ts = token.source;
                if (ts && typeof ts === 'string')
                    length += ts.length;
            }
        }
    }
    return { mode, indent, chomp, comment, length };
}
/** @returns Array of lines split up as `[indent, content]` */
function splitLines(source) {
    const split = source.split(/\n( *)/);
    const first = split[0];
    const m = first.match(/^( *)/);
    const line0 = m?.[1]
        ? [m[1], first.slice(m[1].length)]
        : ['', first];
    const lines = [line0];
    for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
    return lines;
}

exports.resolveBlockScalar = resolveBlockScalar;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/resolve-block-seq.js":
/*!*************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/resolve-block-seq.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var YAMLSeq = __webpack_require__(/*! ../nodes/YAMLSeq.js */ "./node_modules/yaml/dist/nodes/YAMLSeq.js");
var resolveProps = __webpack_require__(/*! ./resolve-props.js */ "./node_modules/yaml/dist/compose/resolve-props.js");
var utilFlowIndentCheck = __webpack_require__(/*! ./util-flow-indent-check.js */ "./node_modules/yaml/dist/compose/util-flow-indent-check.js");

function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
    const seq = new NodeClass(ctx.schema);
    if (ctx.atRoot)
        ctx.atRoot = false;
    let offset = bs.offset;
    let commentEnd = null;
    for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
            indicator: 'seq-item-ind',
            next: value,
            offset,
            onError,
            startOnNewline: true
        });
        if (!props.found) {
            if (props.anchor || props.tag || value) {
                if (value && value.type === 'block-seq')
                    onError(props.end, 'BAD_INDENT', 'All sequence items must start at the same column');
                else
                    onError(offset, 'MISSING_CHAR', 'Sequence item without - indicator');
            }
            else {
                commentEnd = props.end;
                if (props.comment)
                    seq.comment = props.comment;
                continue;
            }
        }
        const node = value
            ? composeNode(ctx, value, props, onError)
            : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
    }
    seq.range = [bs.offset, offset, commentEnd ?? offset];
    return seq;
}

exports.resolveBlockSeq = resolveBlockSeq;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/resolve-end.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/compose/resolve-end.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function resolveEnd(end, offset, reqSpace, onError) {
    let comment = '';
    if (end) {
        let hasSpace = false;
        let sep = '';
        for (const token of end) {
            const { source, type } = token;
            switch (type) {
                case 'space':
                    hasSpace = true;
                    break;
                case 'comment': {
                    if (reqSpace && !hasSpace)
                        onError(token, 'MISSING_CHAR', 'Comments must be separated from other tokens by white space characters');
                    const cb = source.substring(1) || ' ';
                    if (!comment)
                        comment = cb;
                    else
                        comment += sep + cb;
                    sep = '';
                    break;
                }
                case 'newline':
                    if (comment)
                        sep += source;
                    hasSpace = true;
                    break;
                default:
                    onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${type} at node end`);
            }
            offset += source.length;
        }
    }
    return { comment, offset };
}

exports.resolveEnd = resolveEnd;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/resolve-flow-collection.js":
/*!*******************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/resolve-flow-collection.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Pair = __webpack_require__(/*! ../nodes/Pair.js */ "./node_modules/yaml/dist/nodes/Pair.js");
var YAMLMap = __webpack_require__(/*! ../nodes/YAMLMap.js */ "./node_modules/yaml/dist/nodes/YAMLMap.js");
var YAMLSeq = __webpack_require__(/*! ../nodes/YAMLSeq.js */ "./node_modules/yaml/dist/nodes/YAMLSeq.js");
var resolveEnd = __webpack_require__(/*! ./resolve-end.js */ "./node_modules/yaml/dist/compose/resolve-end.js");
var resolveProps = __webpack_require__(/*! ./resolve-props.js */ "./node_modules/yaml/dist/compose/resolve-props.js");
var utilContainsNewline = __webpack_require__(/*! ./util-contains-newline.js */ "./node_modules/yaml/dist/compose/util-contains-newline.js");
var utilMapIncludes = __webpack_require__(/*! ./util-map-includes.js */ "./node_modules/yaml/dist/compose/util-map-includes.js");

const blockMsg = 'Block collections are not allowed within flow collections';
const isBlock = (token) => token && (token.type === 'block-map' || token.type === 'block-seq');
function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
    const isMap = fc.start.source === '{';
    const fcName = isMap ? 'flow map' : 'flow sequence';
    const NodeClass = (tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq));
    const coll = new NodeClass(ctx.schema);
    coll.flow = true;
    const atRoot = ctx.atRoot;
    if (atRoot)
        ctx.atRoot = false;
    let offset = fc.offset + fc.start.source.length;
    for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start, {
            flow: fcName,
            indicator: 'explicit-key-ind',
            next: key ?? sep?.[0],
            offset,
            onError,
            startOnNewline: false
        });
        if (!props.found) {
            if (!props.anchor && !props.tag && !sep && !value) {
                if (i === 0 && props.comma)
                    onError(props.comma, 'UNEXPECTED_TOKEN', `Unexpected , in ${fcName}`);
                else if (i < fc.items.length - 1)
                    onError(props.start, 'UNEXPECTED_TOKEN', `Unexpected empty item in ${fcName}`);
                if (props.comment) {
                    if (coll.comment)
                        coll.comment += '\n' + props.comment;
                    else
                        coll.comment = props.comment;
                }
                offset = props.end;
                continue;
            }
            if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
                onError(key, // checked by containsNewline()
                'MULTILINE_IMPLICIT_KEY', 'Implicit keys of flow sequence pairs need to be on a single line');
        }
        if (i === 0) {
            if (props.comma)
                onError(props.comma, 'UNEXPECTED_TOKEN', `Unexpected , in ${fcName}`);
        }
        else {
            if (!props.comma)
                onError(props.start, 'MISSING_CHAR', `Missing , between ${fcName} items`);
            if (props.comment) {
                let prevItemComment = '';
                loop: for (const st of start) {
                    switch (st.type) {
                        case 'comma':
                        case 'space':
                            break;
                        case 'comment':
                            prevItemComment = st.source.substring(1);
                            break loop;
                        default:
                            break loop;
                    }
                }
                if (prevItemComment) {
                    let prev = coll.items[coll.items.length - 1];
                    if (identity.isPair(prev))
                        prev = prev.value ?? prev.key;
                    if (prev.comment)
                        prev.comment += '\n' + prevItemComment;
                    else
                        prev.comment = prevItemComment;
                    props.comment = props.comment.substring(prevItemComment.length + 1);
                }
            }
        }
        if (!isMap && !sep && !props.found) {
            // item is a value in a seq
            // → key & sep are empty, start does not include ? or :
            const valueNode = value
                ? composeNode(ctx, value, props, onError)
                : composeEmptyNode(ctx, props.end, sep, null, props, onError);
            coll.items.push(valueNode);
            offset = valueNode.range[2];
            if (isBlock(value))
                onError(valueNode.range, 'BLOCK_IN_FLOW', blockMsg);
        }
        else {
            // item is a key+value pair
            // key value
            const keyStart = props.end;
            const keyNode = key
                ? composeNode(ctx, key, props, onError)
                : composeEmptyNode(ctx, keyStart, start, null, props, onError);
            if (isBlock(key))
                onError(keyNode.range, 'BLOCK_IN_FLOW', blockMsg);
            // value properties
            const valueProps = resolveProps.resolveProps(sep ?? [], {
                flow: fcName,
                indicator: 'map-value-ind',
                next: value,
                offset: keyNode.range[2],
                onError,
                startOnNewline: false
            });
            if (valueProps.found) {
                if (!isMap && !props.found && ctx.options.strict) {
                    if (sep)
                        for (const st of sep) {
                            if (st === valueProps.found)
                                break;
                            if (st.type === 'newline') {
                                onError(st, 'MULTILINE_IMPLICIT_KEY', 'Implicit keys of flow sequence pairs need to be on a single line');
                                break;
                            }
                        }
                    if (props.start < valueProps.found.offset - 1024)
                        onError(valueProps.found, 'KEY_OVER_1024_CHARS', 'The : indicator must be at most 1024 chars after the start of an implicit flow sequence key');
                }
            }
            else if (value) {
                if ('source' in value && value.source && value.source[0] === ':')
                    onError(value, 'MISSING_CHAR', `Missing space after : in ${fcName}`);
                else
                    onError(valueProps.start, 'MISSING_CHAR', `Missing , or : between ${fcName} items`);
            }
            // value value
            const valueNode = value
                ? composeNode(ctx, value, valueProps, onError)
                : valueProps.found
                    ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError)
                    : null;
            if (valueNode) {
                if (isBlock(value))
                    onError(valueNode.range, 'BLOCK_IN_FLOW', blockMsg);
            }
            else if (valueProps.comment) {
                if (keyNode.comment)
                    keyNode.comment += '\n' + valueProps.comment;
                else
                    keyNode.comment = valueProps.comment;
            }
            const pair = new Pair.Pair(keyNode, valueNode);
            if (ctx.options.keepSourceTokens)
                pair.srcToken = collItem;
            if (isMap) {
                const map = coll;
                if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
                    onError(keyStart, 'DUPLICATE_KEY', 'Map keys must be unique');
                map.items.push(pair);
            }
            else {
                const map = new YAMLMap.YAMLMap(ctx.schema);
                map.flow = true;
                map.items.push(pair);
                coll.items.push(map);
            }
            offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
    }
    const expectedEnd = isMap ? '}' : ']';
    const [ce, ...ee] = fc.end;
    let cePos = offset;
    if (ce && ce.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
    else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot
            ? `${name} must end with a ${expectedEnd}`
            : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? 'MISSING_CHAR' : 'BAD_INDENT', msg);
        if (ce && ce.source.length !== 1)
            ee.unshift(ce);
    }
    if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
            if (coll.comment)
                coll.comment += '\n' + end.comment;
            else
                coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
    }
    else {
        coll.range = [fc.offset, cePos, cePos];
    }
    return coll;
}

exports.resolveFlowCollection = resolveFlowCollection;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/resolve-flow-scalar.js":
/*!***************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/resolve-flow-scalar.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var resolveEnd = __webpack_require__(/*! ./resolve-end.js */ "./node_modules/yaml/dist/compose/resolve-end.js");

function resolveFlowScalar(scalar, strict, onError) {
    const { offset, type, source, end } = scalar;
    let _type;
    let value;
    const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
    switch (type) {
        case 'scalar':
            _type = Scalar.Scalar.PLAIN;
            value = plainValue(source, _onError);
            break;
        case 'single-quoted-scalar':
            _type = Scalar.Scalar.QUOTE_SINGLE;
            value = singleQuotedValue(source, _onError);
            break;
        case 'double-quoted-scalar':
            _type = Scalar.Scalar.QUOTE_DOUBLE;
            value = doubleQuotedValue(source, _onError);
            break;
        /* istanbul ignore next should not happen */
        default:
            onError(scalar, 'UNEXPECTED_TOKEN', `Expected a flow scalar value, but found: ${type}`);
            return {
                value: '',
                type: null,
                comment: '',
                range: [offset, offset + source.length, offset + source.length]
            };
    }
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
    return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
    };
}
function plainValue(source, onError) {
    let badChar = '';
    switch (source[0]) {
        /* istanbul ignore next should not happen */
        case '\t':
            badChar = 'a tab character';
            break;
        case ',':
            badChar = 'flow indicator character ,';
            break;
        case '%':
            badChar = 'directive indicator character %';
            break;
        case '|':
        case '>': {
            badChar = `block scalar indicator ${source[0]}`;
            break;
        }
        case '@':
        case '`': {
            badChar = `reserved character ${source[0]}`;
            break;
        }
    }
    if (badChar)
        onError(0, 'BAD_SCALAR_START', `Plain value cannot start with ${badChar}`);
    return foldLines(source);
}
function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, 'MISSING_CHAR', "Missing closing 'quote");
    return foldLines(source.slice(1, -1)).replace(/''/g, "'");
}
function foldLines(source) {
    /**
     * The negative lookbehind here and in the `re` RegExp is to
     * prevent causing a polynomial search time in certain cases.
     *
     * The try-catch is for Safari, which doesn't support this yet:
     * https://caniuse.com/js-regexp-lookbehind
     */
    let first, line;
    try {
        first = new RegExp('(.*?)(?<![ \t])[ \t]*\r?\n', 'sy');
        line = new RegExp('[ \t]*(.*?)(?:(?<![ \t])[ \t]*)?\r?\n', 'sy');
    }
    catch (_) {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
    }
    let match = first.exec(source);
    if (!match)
        return source;
    let res = match[1];
    let sep = ' ';
    let pos = first.lastIndex;
    line.lastIndex = pos;
    while ((match = line.exec(source))) {
        if (match[1] === '') {
            if (sep === '\n')
                res += sep;
            else
                sep = '\n';
        }
        else {
            res += sep + match[1];
            sep = ' ';
        }
        pos = line.lastIndex;
    }
    const last = /[ \t]*(.*)/sy;
    last.lastIndex = pos;
    match = last.exec(source);
    return res + sep + (match?.[1] ?? '');
}
function doubleQuotedValue(source, onError) {
    let res = '';
    for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === '\r' && source[i + 1] === '\n')
            continue;
        if (ch === '\n') {
            const { fold, offset } = foldNewline(source, i);
            res += fold;
            i = offset;
        }
        else if (ch === '\\') {
            let next = source[++i];
            const cc = escapeCodes[next];
            if (cc)
                res += cc;
            else if (next === '\n') {
                // skip escaped newlines, but still trim the following line
                next = source[i + 1];
                while (next === ' ' || next === '\t')
                    next = source[++i + 1];
            }
            else if (next === '\r' && source[i + 1] === '\n') {
                // skip escaped CRLF newlines, but still trim the following line
                next = source[++i + 1];
                while (next === ' ' || next === '\t')
                    next = source[++i + 1];
            }
            else if (next === 'x' || next === 'u' || next === 'U') {
                const length = { x: 2, u: 4, U: 8 }[next];
                res += parseCharCode(source, i + 1, length, onError);
                i += length;
            }
            else {
                const raw = source.substr(i - 1, 2);
                onError(i - 1, 'BAD_DQ_ESCAPE', `Invalid escape sequence ${raw}`);
                res += raw;
            }
        }
        else if (ch === ' ' || ch === '\t') {
            // trim trailing whitespace
            const wsStart = i;
            let next = source[i + 1];
            while (next === ' ' || next === '\t')
                next = source[++i + 1];
            if (next !== '\n' && !(next === '\r' && source[i + 2] === '\n'))
                res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        }
        else {
            res += ch;
        }
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, 'MISSING_CHAR', 'Missing closing "quote');
    return res;
}
/**
 * Fold a single newline into a space, multiple newlines to N - 1 newlines.
 * Presumes `source[offset] === '\n'`
 */
function foldNewline(source, offset) {
    let fold = '';
    let ch = source[offset + 1];
    while (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
        if (ch === '\r' && source[offset + 2] !== '\n')
            break;
        if (ch === '\n')
            fold += '\n';
        offset += 1;
        ch = source[offset + 1];
    }
    if (!fold)
        fold = ' ';
    return { fold, offset };
}
const escapeCodes = {
    '0': '\0',
    a: '\x07',
    b: '\b',
    e: '\x1b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    v: '\v',
    N: '\u0085',
    _: '\u00a0',
    L: '\u2028',
    P: '\u2029',
    ' ': ' ',
    '"': '"',
    '/': '/',
    '\\': '\\',
    '\t': '\t'
};
function parseCharCode(source, offset, length, onError) {
    const cc = source.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;
    if (isNaN(code)) {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, 'BAD_DQ_ESCAPE', `Invalid escape sequence ${raw}`);
        return raw;
    }
    return String.fromCodePoint(code);
}

exports.resolveFlowScalar = resolveFlowScalar;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/resolve-props.js":
/*!*********************************************************!*\
  !*** ./node_modules/yaml/dist/compose/resolve-props.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function resolveProps(tokens, { flow, indicator, next, offset, onError, startOnNewline }) {
    let spaceBefore = false;
    let atNewline = startOnNewline;
    let hasSpace = startOnNewline;
    let comment = '';
    let commentSep = '';
    let hasNewline = false;
    let hasNewlineAfterProp = false;
    let reqSpace = false;
    let anchor = null;
    let tag = null;
    let comma = null;
    let found = null;
    let start = null;
    for (const token of tokens) {
        if (reqSpace) {
            if (token.type !== 'space' &&
                token.type !== 'newline' &&
                token.type !== 'comma')
                onError(token.offset, 'MISSING_CHAR', 'Tags and anchors must be separated from the next token by white space');
            reqSpace = false;
        }
        switch (token.type) {
            case 'space':
                // At the doc level, tabs at line start may be parsed
                // as leading white space rather than indentation.
                // In a flow collection, only the parser handles indent.
                if (!flow &&
                    atNewline &&
                    indicator !== 'doc-start' &&
                    token.source[0] === '\t')
                    onError(token, 'TAB_AS_INDENT', 'Tabs are not allowed as indentation');
                hasSpace = true;
                break;
            case 'comment': {
                if (!hasSpace)
                    onError(token, 'MISSING_CHAR', 'Comments must be separated from other tokens by white space characters');
                const cb = token.source.substring(1) || ' ';
                if (!comment)
                    comment = cb;
                else
                    comment += commentSep + cb;
                commentSep = '';
                atNewline = false;
                break;
            }
            case 'newline':
                if (atNewline) {
                    if (comment)
                        comment += token.source;
                    else
                        spaceBefore = true;
                }
                else
                    commentSep += token.source;
                atNewline = true;
                hasNewline = true;
                if (anchor || tag)
                    hasNewlineAfterProp = true;
                hasSpace = true;
                break;
            case 'anchor':
                if (anchor)
                    onError(token, 'MULTIPLE_ANCHORS', 'A node can have at most one anchor');
                if (token.source.endsWith(':'))
                    onError(token.offset + token.source.length - 1, 'BAD_ALIAS', 'Anchor ending in : is ambiguous', true);
                anchor = token;
                if (start === null)
                    start = token.offset;
                atNewline = false;
                hasSpace = false;
                reqSpace = true;
                break;
            case 'tag': {
                if (tag)
                    onError(token, 'MULTIPLE_TAGS', 'A node can have at most one tag');
                tag = token;
                if (start === null)
                    start = token.offset;
                atNewline = false;
                hasSpace = false;
                reqSpace = true;
                break;
            }
            case indicator:
                // Could here handle preceding comments differently
                if (anchor || tag)
                    onError(token, 'BAD_PROP_ORDER', `Anchors and tags must be after the ${token.source} indicator`);
                if (found)
                    onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${token.source} in ${flow ?? 'collection'}`);
                found = token;
                atNewline = false;
                hasSpace = false;
                break;
            case 'comma':
                if (flow) {
                    if (comma)
                        onError(token, 'UNEXPECTED_TOKEN', `Unexpected , in ${flow}`);
                    comma = token;
                    atNewline = false;
                    hasSpace = false;
                    break;
                }
            // else fallthrough
            default:
                onError(token, 'UNEXPECTED_TOKEN', `Unexpected ${token.type} token`);
                atNewline = false;
                hasSpace = false;
        }
    }
    const last = tokens[tokens.length - 1];
    const end = last ? last.offset + last.source.length : offset;
    if (reqSpace &&
        next &&
        next.type !== 'space' &&
        next.type !== 'newline' &&
        next.type !== 'comma' &&
        (next.type !== 'scalar' || next.source !== ''))
        onError(next.offset, 'MISSING_CHAR', 'Tags and anchors must be separated from the next token by white space');
    return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        hasNewlineAfterProp,
        anchor,
        tag,
        end,
        start: start ?? end
    };
}

exports.resolveProps = resolveProps;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/util-contains-newline.js":
/*!*****************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/util-contains-newline.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function containsNewline(key) {
    if (!key)
        return null;
    switch (key.type) {
        case 'alias':
        case 'scalar':
        case 'double-quoted-scalar':
        case 'single-quoted-scalar':
            if (key.source.includes('\n'))
                return true;
            if (key.end)
                for (const st of key.end)
                    if (st.type === 'newline')
                        return true;
            return false;
        case 'flow-collection':
            for (const it of key.items) {
                for (const st of it.start)
                    if (st.type === 'newline')
                        return true;
                if (it.sep)
                    for (const st of it.sep)
                        if (st.type === 'newline')
                            return true;
                if (containsNewline(it.key) || containsNewline(it.value))
                    return true;
            }
            return false;
        default:
            return true;
    }
}

exports.containsNewline = containsNewline;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/util-empty-scalar-position.js":
/*!**********************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/util-empty-scalar-position.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function emptyScalarPosition(offset, before, pos) {
    if (before) {
        if (pos === null)
            pos = before.length;
        for (let i = pos - 1; i >= 0; --i) {
            let st = before[i];
            switch (st.type) {
                case 'space':
                case 'comment':
                case 'newline':
                    offset -= st.source.length;
                    continue;
            }
            // Technically, an empty scalar is immediately after the last non-empty
            // node, but it's more useful to place it after any whitespace.
            st = before[++i];
            while (st?.type === 'space') {
                offset += st.source.length;
                st = before[++i];
            }
            break;
        }
    }
    return offset;
}

exports.emptyScalarPosition = emptyScalarPosition;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/util-flow-indent-check.js":
/*!******************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/util-flow-indent-check.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var utilContainsNewline = __webpack_require__(/*! ./util-contains-newline.js */ "./node_modules/yaml/dist/compose/util-contains-newline.js");

function flowIndentCheck(indent, fc, onError) {
    if (fc?.type === 'flow-collection') {
        const end = fc.end[0];
        if (end.indent === indent &&
            (end.source === ']' || end.source === '}') &&
            utilContainsNewline.containsNewline(fc)) {
            const msg = 'Flow end indicator should be more indented than parent';
            onError(end, 'BAD_INDENT', msg, true);
        }
    }
}

exports.flowIndentCheck = flowIndentCheck;


/***/ }),

/***/ "./node_modules/yaml/dist/compose/util-map-includes.js":
/*!*************************************************************!*\
  !*** ./node_modules/yaml/dist/compose/util-map-includes.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");

function mapIncludes(ctx, items, search) {
    const { uniqueKeys } = ctx.options;
    if (uniqueKeys === false)
        return false;
    const isEqual = typeof uniqueKeys === 'function'
        ? uniqueKeys
        : (a, b) => a === b ||
            (identity.isScalar(a) &&
                identity.isScalar(b) &&
                a.value === b.value &&
                !(a.value === '<<' && ctx.schema.merge));
    return items.some(pair => isEqual(pair.key, search));
}

exports.mapIncludes = mapIncludes;


/***/ }),

/***/ "./node_modules/yaml/dist/doc/Document.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/doc/Document.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Alias = __webpack_require__(/*! ../nodes/Alias.js */ "./node_modules/yaml/dist/nodes/Alias.js");
var Collection = __webpack_require__(/*! ../nodes/Collection.js */ "./node_modules/yaml/dist/nodes/Collection.js");
var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Pair = __webpack_require__(/*! ../nodes/Pair.js */ "./node_modules/yaml/dist/nodes/Pair.js");
var toJS = __webpack_require__(/*! ../nodes/toJS.js */ "./node_modules/yaml/dist/nodes/toJS.js");
var Schema = __webpack_require__(/*! ../schema/Schema.js */ "./node_modules/yaml/dist/schema/Schema.js");
var stringifyDocument = __webpack_require__(/*! ../stringify/stringifyDocument.js */ "./node_modules/yaml/dist/stringify/stringifyDocument.js");
var anchors = __webpack_require__(/*! ./anchors.js */ "./node_modules/yaml/dist/doc/anchors.js");
var applyReviver = __webpack_require__(/*! ./applyReviver.js */ "./node_modules/yaml/dist/doc/applyReviver.js");
var createNode = __webpack_require__(/*! ./createNode.js */ "./node_modules/yaml/dist/doc/createNode.js");
var directives = __webpack_require__(/*! ./directives.js */ "./node_modules/yaml/dist/doc/directives.js");

class Document {
    constructor(value, replacer, options) {
        /** A comment before this Document */
        this.commentBefore = null;
        /** A comment immediately after this Document */
        this.comment = null;
        /** Errors encountered during parsing. */
        this.errors = [];
        /** Warnings encountered during parsing. */
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === 'function' || Array.isArray(replacer)) {
            _replacer = replacer;
        }
        else if (options === undefined && replacer) {
            options = replacer;
            replacer = undefined;
        }
        const opt = Object.assign({
            intAsBigInt: false,
            keepSourceTokens: false,
            logLevel: 'warn',
            prettyErrors: true,
            strict: true,
            uniqueKeys: true,
            version: '1.2'
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
            this.directives = options._directives.atDocument();
            if (this.directives.yaml.explicit)
                version = this.directives.yaml.version;
        }
        else
            this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        // @ts-expect-error We can't really know that this matches Contents.
        this.contents =
            value === undefined ? null : this.createNode(value, _replacer, options);
    }
    /**
     * Create a deep copy of this Document and its contents.
     *
     * Custom Node values that inherit from `Object` still refer to their original instances.
     */
    clone() {
        const copy = Object.create(Document.prototype, {
            [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
            copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        // @ts-expect-error We can't really know that this matches Contents.
        copy.contents = identity.isNode(this.contents)
            ? this.contents.clone(copy.schema)
            : this.contents;
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
    /** Adds a value to the document. */
    add(value) {
        if (assertCollection(this.contents))
            this.contents.add(value);
    }
    /** Adds a value to the document. */
    addIn(path, value) {
        if (assertCollection(this.contents))
            this.contents.addIn(path, value);
    }
    /**
     * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
     *
     * If `node` already has an anchor, `name` is ignored.
     * Otherwise, the `node.anchor` value will be set to `name`,
     * or if an anchor with that name is already present in the document,
     * `name` will be used as a prefix for a new unique anchor.
     * If `name` is undefined, the generated anchor will use 'a' as a prefix.
     */
    createAlias(node, name) {
        if (!node.anchor) {
            const prev = anchors.anchorNames(this);
            node.anchor =
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                !name || prev.has(name) ? anchors.findNewAnchor(name || 'a', prev) : name;
        }
        return new Alias.Alias(node.anchor);
    }
    createNode(value, replacer, options) {
        let _replacer = undefined;
        if (typeof replacer === 'function') {
            value = replacer.call({ '': value }, '', value);
            _replacer = replacer;
        }
        else if (Array.isArray(replacer)) {
            const keyToStr = (v) => typeof v === 'number' || v instanceof String || v instanceof Number;
            const asStr = replacer.filter(keyToStr).map(String);
            if (asStr.length > 0)
                replacer = replacer.concat(asStr);
            _replacer = replacer;
        }
        else if (options === undefined && replacer) {
            options = replacer;
            replacer = undefined;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(this, 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        anchorPrefix || 'a');
        const ctx = {
            aliasDuplicateObjects: aliasDuplicateObjects ?? true,
            keepUndefined: keepUndefined ?? false,
            onAnchor,
            onTagObj,
            replacer: _replacer,
            schema: this.schema,
            sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
            node.flow = true;
        setAnchors();
        return node;
    }
    /**
     * Convert a key and a value into a `Pair` using the current schema,
     * recursively wrapping all values as `Scalar` or `Collection` nodes.
     */
    createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
    }
    /**
     * Removes a value from the document.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
            if (this.contents == null)
                return false;
            // @ts-expect-error Presumed impossible if Strict extends false
            this.contents = null;
            return true;
        }
        return assertCollection(this.contents)
            ? this.contents.deleteIn(path)
            : false;
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    get(key, keepScalar) {
        return identity.isCollection(this.contents)
            ? this.contents.get(key, keepScalar)
            : undefined;
    }
    /**
     * Returns item at `path`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
            return !keepScalar && identity.isScalar(this.contents)
                ? this.contents.value
                : this.contents;
        return identity.isCollection(this.contents)
            ? this.contents.getIn(path, keepScalar)
            : undefined;
    }
    /**
     * Checks if the document includes a value with the key `key`.
     */
    has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
    }
    /**
     * Checks if the document includes a value at `path`.
     */
    hasIn(path) {
        if (Collection.isEmptyPath(path))
            return this.contents !== undefined;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    set(key, value) {
        if (this.contents == null) {
            // @ts-expect-error We can't really know that this matches Contents.
            this.contents = Collection.collectionFromPath(this.schema, [key], value);
        }
        else if (assertCollection(this.contents)) {
            this.contents.set(key, value);
        }
    }
    /**
     * Sets a value in this document. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
            // @ts-expect-error We can't really know that this matches Contents.
            this.contents = value;
        }
        else if (this.contents == null) {
            // @ts-expect-error We can't really know that this matches Contents.
            this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        }
        else if (assertCollection(this.contents)) {
            this.contents.setIn(path, value);
        }
    }
    /**
     * Change the YAML version and schema used by the document.
     * A `null` version disables support for directives, explicit tags, anchors, and aliases.
     * It also requires the `schema` option to be given as a `Schema` instance value.
     *
     * Overrides all previously set schema options.
     */
    setSchema(version, options = {}) {
        if (typeof version === 'number')
            version = String(version);
        let opt;
        switch (version) {
            case '1.1':
                if (this.directives)
                    this.directives.yaml.version = '1.1';
                else
                    this.directives = new directives.Directives({ version: '1.1' });
                opt = { merge: true, resolveKnownTags: false, schema: 'yaml-1.1' };
                break;
            case '1.2':
            case 'next':
                if (this.directives)
                    this.directives.yaml.version = version;
                else
                    this.directives = new directives.Directives({ version });
                opt = { merge: false, resolveKnownTags: true, schema: 'core' };
                break;
            case null:
                if (this.directives)
                    delete this.directives;
                opt = null;
                break;
            default: {
                const sv = JSON.stringify(version);
                throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
            }
        }
        // Not using `instanceof Schema` to allow for duck typing
        if (options.schema instanceof Object)
            this.schema = options.schema;
        else if (opt)
            this.schema = new Schema.Schema(Object.assign(opt, options));
        else
            throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
    }
    // json & jsonArg are only used from toJSON()
    toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
            anchors: new Map(),
            doc: this,
            keep: !json,
            mapAsMap: mapAsMap === true,
            mapKeyWarned: false,
            maxAliasCount: typeof maxAliasCount === 'number' ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? '', ctx);
        if (typeof onAnchor === 'function')
            for (const { count, res } of ctx.anchors.values())
                onAnchor(res, count);
        return typeof reviver === 'function'
            ? applyReviver.applyReviver(reviver, { '': res }, '', res)
            : res;
    }
    /**
     * A JSON representation of the document `contents`.
     *
     * @param jsonArg Used by `JSON.stringify` to indicate the array index or
     *   property name.
     */
    toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
    }
    /** A YAML representation of the document. */
    toString(options = {}) {
        if (this.errors.length > 0)
            throw new Error('Document with errors cannot be stringified');
        if ('indent' in options &&
            (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
            const s = JSON.stringify(options.indent);
            throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
    }
}
function assertCollection(contents) {
    if (identity.isCollection(contents))
        return true;
    throw new Error('Expected a YAML collection as document contents');
}

exports.Document = Document;


/***/ }),

/***/ "./node_modules/yaml/dist/doc/anchors.js":
/*!***********************************************!*\
  !*** ./node_modules/yaml/dist/doc/anchors.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var visit = __webpack_require__(/*! ../visit.js */ "./node_modules/yaml/dist/visit.js");

/**
 * Verify that the input string is a valid anchor.
 *
 * Will throw on errors.
 */
function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
    }
    return true;
}
function anchorNames(root) {
    const anchors = new Set();
    visit.visit(root, {
        Value(_key, node) {
            if (node.anchor)
                anchors.add(node.anchor);
        }
    });
    return anchors;
}
/** Find a new anchor name with the given `prefix` and a one-indexed suffix. */
function findNewAnchor(prefix, exclude) {
    for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
            return name;
    }
}
function createNodeAnchors(doc, prefix) {
    const aliasObjects = [];
    const sourceObjects = new Map();
    let prevAnchors = null;
    return {
        onAnchor: (source) => {
            aliasObjects.push(source);
            if (!prevAnchors)
                prevAnchors = anchorNames(doc);
            const anchor = findNewAnchor(prefix, prevAnchors);
            prevAnchors.add(anchor);
            return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
            for (const source of aliasObjects) {
                const ref = sourceObjects.get(source);
                if (typeof ref === 'object' &&
                    ref.anchor &&
                    (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
                    ref.node.anchor = ref.anchor;
                }
                else {
                    const error = new Error('Failed to resolve repeated object (this should not happen)');
                    error.source = source;
                    throw error;
                }
            }
        },
        sourceObjects
    };
}

exports.anchorIsValid = anchorIsValid;
exports.anchorNames = anchorNames;
exports.createNodeAnchors = createNodeAnchors;
exports.findNewAnchor = findNewAnchor;


/***/ }),

/***/ "./node_modules/yaml/dist/doc/applyReviver.js":
/*!****************************************************!*\
  !*** ./node_modules/yaml/dist/doc/applyReviver.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Applies the JSON.parse reviver algorithm as defined in the ECMA-262 spec,
 * in section 24.5.1.1 "Runtime Semantics: InternalizeJSONProperty" of the
 * 2021 edition: https://tc39.es/ecma262/#sec-json.parse
 *
 * Includes extensions for handling Map and Set objects.
 */
function applyReviver(reviver, obj, key, val) {
    if (val && typeof val === 'object') {
        if (Array.isArray(val)) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const v0 = val[i];
                const v1 = applyReviver(reviver, val, String(i), v0);
                if (v1 === undefined)
                    delete val[i];
                else if (v1 !== v0)
                    val[i] = v1;
            }
        }
        else if (val instanceof Map) {
            for (const k of Array.from(val.keys())) {
                const v0 = val.get(k);
                const v1 = applyReviver(reviver, val, k, v0);
                if (v1 === undefined)
                    val.delete(k);
                else if (v1 !== v0)
                    val.set(k, v1);
            }
        }
        else if (val instanceof Set) {
            for (const v0 of Array.from(val)) {
                const v1 = applyReviver(reviver, val, v0, v0);
                if (v1 === undefined)
                    val.delete(v0);
                else if (v1 !== v0) {
                    val.delete(v0);
                    val.add(v1);
                }
            }
        }
        else {
            for (const [k, v0] of Object.entries(val)) {
                const v1 = applyReviver(reviver, val, k, v0);
                if (v1 === undefined)
                    delete val[k];
                else if (v1 !== v0)
                    val[k] = v1;
            }
        }
    }
    return reviver.call(obj, key, val);
}

exports.applyReviver = applyReviver;


/***/ }),

/***/ "./node_modules/yaml/dist/doc/createNode.js":
/*!**************************************************!*\
  !*** ./node_modules/yaml/dist/doc/createNode.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Alias = __webpack_require__(/*! ../nodes/Alias.js */ "./node_modules/yaml/dist/nodes/Alias.js");
var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Scalar = __webpack_require__(/*! ../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");

const defaultTagPrefix = 'tag:yaml.org,2002:';
function findTagObject(value, tagName, tags) {
    if (tagName) {
        const match = tags.filter(t => t.tag === tagName);
        const tagObj = match.find(t => !t.format) ?? match[0];
        if (!tagObj)
            throw new Error(`Tag ${tagName} not found`);
        return tagObj;
    }
    return tags.find(t => t.identify?.(value) && !t.format);
}
function createNode(value, tagName, ctx) {
    if (identity.isDocument(value))
        value = value.contents;
    if (identity.isNode(value))
        return value;
    if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
    }
    if (value instanceof String ||
        value instanceof Number ||
        value instanceof Boolean ||
        (typeof BigInt !== 'undefined' && value instanceof BigInt) // not supported everywhere
    ) {
        // https://tc39.es/ecma262/#sec-serializejsonproperty
        value = value.valueOf();
    }
    const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
    // Detect duplicate references to the same object & use Alias nodes for all
    // after first. The `ref` wrapper allows for circular references to resolve.
    let ref = undefined;
    if (aliasDuplicateObjects && value && typeof value === 'object') {
        ref = sourceObjects.get(value);
        if (ref) {
            if (!ref.anchor)
                ref.anchor = onAnchor(value);
            return new Alias.Alias(ref.anchor);
        }
        else {
            ref = { anchor: null, node: null };
            sourceObjects.set(value, ref);
        }
    }
    if (tagName?.startsWith('!!'))
        tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema.tags);
    if (!tagObj) {
        if (value && typeof value.toJSON === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            value = value.toJSON();
        }
        if (!value || typeof value !== 'object') {
            const node = new Scalar.Scalar(value);
            if (ref)
                ref.node = node;
            return node;
        }
        tagObj =
            value instanceof Map
                ? schema[identity.MAP]
                : Symbol.iterator in Object(value)
                    ? schema[identity.SEQ]
                    : schema[identity.MAP];
    }
    if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
    }
    const node = tagObj?.createNode
        ? tagObj.createNode(ctx.schema, value, ctx)
        : typeof tagObj?.nodeClass?.from === 'function'
            ? tagObj.nodeClass.from(ctx.schema, value, ctx)
            : new Scalar.Scalar(value);
    if (tagName)
        node.tag = tagName;
    else if (!tagObj.default)
        node.tag = tagObj.tag;
    if (ref)
        ref.node = node;
    return node;
}

exports.createNode = createNode;


/***/ }),

/***/ "./node_modules/yaml/dist/doc/directives.js":
/*!**************************************************!*\
  !*** ./node_modules/yaml/dist/doc/directives.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var visit = __webpack_require__(/*! ../visit.js */ "./node_modules/yaml/dist/visit.js");

const escapeChars = {
    '!': '%21',
    ',': '%2C',
    '[': '%5B',
    ']': '%5D',
    '{': '%7B',
    '}': '%7D'
};
const escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, ch => escapeChars[ch]);
class Directives {
    constructor(yaml, tags) {
        /**
         * The directives-end/doc-start marker `---`. If `null`, a marker may still be
         * included in the document's stringified representation.
         */
        this.docStart = null;
        /** The doc-end marker `...`.  */
        this.docEnd = false;
        this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, Directives.defaultTags, tags);
    }
    clone() {
        const copy = new Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
    }
    /**
     * During parsing, get a Directives instance for the current document and
     * update the stream state according to the current version's spec.
     */
    atDocument() {
        const res = new Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
            case '1.1':
                this.atNextDocument = true;
                break;
            case '1.2':
                this.atNextDocument = false;
                this.yaml = {
                    explicit: Directives.defaultYaml.explicit,
                    version: '1.2'
                };
                this.tags = Object.assign({}, Directives.defaultTags);
                break;
        }
        return res;
    }
    /**
     * @param onError - May be called even if the action was successful
     * @returns `true` on success
     */
    add(line, onError) {
        if (this.atNextDocument) {
            this.yaml = { explicit: Directives.defaultYaml.explicit, version: '1.1' };
            this.tags = Object.assign({}, Directives.defaultTags);
            this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
            case '%TAG': {
                if (parts.length !== 2) {
                    onError(0, '%TAG directive should contain exactly two parts');
                    if (parts.length < 2)
                        return false;
                }
                const [handle, prefix] = parts;
                this.tags[handle] = prefix;
                return true;
            }
            case '%YAML': {
                this.yaml.explicit = true;
                if (parts.length !== 1) {
                    onError(0, '%YAML directive should contain exactly one part');
                    return false;
                }
                const [version] = parts;
                if (version === '1.1' || version === '1.2') {
                    this.yaml.version = version;
                    return true;
                }
                else {
                    const isValid = /^\d+\.\d+$/.test(version);
                    onError(6, `Unsupported YAML version ${version}`, isValid);
                    return false;
                }
            }
            default:
                onError(0, `Unknown directive ${name}`, true);
                return false;
        }
    }
    /**
     * Resolves a tag, matching handles to those defined in %TAG directives.
     *
     * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
     *   `'!local'` tag, or `null` if unresolvable.
     */
    tagName(source, onError) {
        if (source === '!')
            return '!'; // non-specific tag
        if (source[0] !== '!') {
            onError(`Not a valid tag: ${source}`);
            return null;
        }
        if (source[1] === '<') {
            const verbatim = source.slice(2, -1);
            if (verbatim === '!' || verbatim === '!!') {
                onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
                return null;
            }
            if (source[source.length - 1] !== '>')
                onError('Verbatim tags must end with a >');
            return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/);
        if (!suffix)
            onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix)
            return prefix + decodeURIComponent(suffix);
        if (handle === '!')
            return source; // local tag
        onError(`Could not resolve tag: ${source}`);
        return null;
    }
    /**
     * Given a fully resolved tag, returns its printable string form,
     * taking into account current tag prefixes and defaults.
     */
    tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
            if (tag.startsWith(prefix))
                return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === '!' ? tag : `!<${tag}>`;
    }
    toString(doc) {
        const lines = this.yaml.explicit
            ? [`%YAML ${this.yaml.version || '1.2'}`]
            : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
            const tags = {};
            visit.visit(doc.contents, (_key, node) => {
                if (identity.isNode(node) && node.tag)
                    tags[node.tag] = true;
            });
            tagNames = Object.keys(tags);
        }
        else
            tagNames = [];
        for (const [handle, prefix] of tagEntries) {
            if (handle === '!!' && prefix === 'tag:yaml.org,2002:')
                continue;
            if (!doc || tagNames.some(tn => tn.startsWith(prefix)))
                lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join('\n');
    }
}
Directives.defaultYaml = { explicit: false, version: '1.2' };
Directives.defaultTags = { '!!': 'tag:yaml.org,2002:' };

exports.Directives = Directives;


/***/ }),

/***/ "./node_modules/yaml/dist/errors.js":
/*!******************************************!*\
  !*** ./node_modules/yaml/dist/errors.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


class YAMLError extends Error {
    constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
    }
}
class YAMLParseError extends YAMLError {
    constructor(pos, code, message) {
        super('YAMLParseError', pos, code, message);
    }
}
class YAMLWarning extends YAMLError {
    constructor(pos, code, message) {
        super('YAMLWarning', pos, code, message);
    }
}
const prettifyError = (src, lc) => (error) => {
    if (error.pos[0] === -1)
        return;
    error.linePos = error.pos.map(pos => lc.linePos(pos));
    const { line, col } = error.linePos[0];
    error.message += ` at line ${line}, column ${col}`;
    let ci = col - 1;
    let lineStr = src
        .substring(lc.lineStarts[line - 1], lc.lineStarts[line])
        .replace(/[\n\r]+$/, '');
    // Trim to max 80 chars, keeping col position near the middle
    if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = '…' + lineStr.substring(trimStart);
        ci -= trimStart - 1;
    }
    if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + '…';
    // Include previous line in context if pointing at line start
    if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        // Regexp won't match if start is trimmed
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
            prev = prev.substring(0, 79) + '…\n';
        lineStr = prev + lineStr;
    }
    if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end && end.line === line && end.col > col) {
            count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = ' '.repeat(ci) + '^'.repeat(count);
        error.message += `:\n\n${lineStr}\n${pointer}\n`;
    }
};

exports.YAMLError = YAMLError;
exports.YAMLParseError = YAMLParseError;
exports.YAMLWarning = YAMLWarning;
exports.prettifyError = prettifyError;


/***/ }),

/***/ "./node_modules/yaml/dist/index.js":
/*!*****************************************!*\
  !*** ./node_modules/yaml/dist/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var composer = __webpack_require__(/*! ./compose/composer.js */ "./node_modules/yaml/dist/compose/composer.js");
var Document = __webpack_require__(/*! ./doc/Document.js */ "./node_modules/yaml/dist/doc/Document.js");
var Schema = __webpack_require__(/*! ./schema/Schema.js */ "./node_modules/yaml/dist/schema/Schema.js");
var errors = __webpack_require__(/*! ./errors.js */ "./node_modules/yaml/dist/errors.js");
var Alias = __webpack_require__(/*! ./nodes/Alias.js */ "./node_modules/yaml/dist/nodes/Alias.js");
var identity = __webpack_require__(/*! ./nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Pair = __webpack_require__(/*! ./nodes/Pair.js */ "./node_modules/yaml/dist/nodes/Pair.js");
var Scalar = __webpack_require__(/*! ./nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var YAMLMap = __webpack_require__(/*! ./nodes/YAMLMap.js */ "./node_modules/yaml/dist/nodes/YAMLMap.js");
var YAMLSeq = __webpack_require__(/*! ./nodes/YAMLSeq.js */ "./node_modules/yaml/dist/nodes/YAMLSeq.js");
var cst = __webpack_require__(/*! ./parse/cst.js */ "./node_modules/yaml/dist/parse/cst.js");
var lexer = __webpack_require__(/*! ./parse/lexer.js */ "./node_modules/yaml/dist/parse/lexer.js");
var lineCounter = __webpack_require__(/*! ./parse/line-counter.js */ "./node_modules/yaml/dist/parse/line-counter.js");
var parser = __webpack_require__(/*! ./parse/parser.js */ "./node_modules/yaml/dist/parse/parser.js");
var publicApi = __webpack_require__(/*! ./public-api.js */ "./node_modules/yaml/dist/public-api.js");
var visit = __webpack_require__(/*! ./visit.js */ "./node_modules/yaml/dist/visit.js");



exports.Composer = composer.Composer;
exports.Document = Document.Document;
exports.Schema = Schema.Schema;
exports.YAMLError = errors.YAMLError;
exports.YAMLParseError = errors.YAMLParseError;
exports.YAMLWarning = errors.YAMLWarning;
exports.Alias = Alias.Alias;
exports.isAlias = identity.isAlias;
exports.isCollection = identity.isCollection;
exports.isDocument = identity.isDocument;
exports.isMap = identity.isMap;
exports.isNode = identity.isNode;
exports.isPair = identity.isPair;
exports.isScalar = identity.isScalar;
exports.isSeq = identity.isSeq;
exports.Pair = Pair.Pair;
exports.Scalar = Scalar.Scalar;
exports.YAMLMap = YAMLMap.YAMLMap;
exports.YAMLSeq = YAMLSeq.YAMLSeq;
exports.CST = cst;
exports.Lexer = lexer.Lexer;
exports.LineCounter = lineCounter.LineCounter;
exports.Parser = parser.Parser;
exports.parse = publicApi.parse;
exports.parseAllDocuments = publicApi.parseAllDocuments;
exports.parseDocument = publicApi.parseDocument;
exports.stringify = publicApi.stringify;
exports.visit = visit.visit;
exports.visitAsync = visit.visitAsync;


/***/ }),

/***/ "./node_modules/yaml/dist/log.js":
/*!***************************************!*\
  !*** ./node_modules/yaml/dist/log.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function debug(logLevel, ...messages) {
    if (logLevel === 'debug')
        console.log(...messages);
}
function warn(logLevel, warning) {
    if (logLevel === 'debug' || logLevel === 'warn') {
        // https://github.com/typescript-eslint/typescript-eslint/issues/7478
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (typeof process !== 'undefined' && process.emitWarning)
            process.emitWarning(warning);
        else
            console.warn(warning);
    }
}

exports.debug = debug;
exports.warn = warn;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/Alias.js":
/*!***********************************************!*\
  !*** ./node_modules/yaml/dist/nodes/Alias.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var anchors = __webpack_require__(/*! ../doc/anchors.js */ "./node_modules/yaml/dist/doc/anchors.js");
var visit = __webpack_require__(/*! ../visit.js */ "./node_modules/yaml/dist/visit.js");
var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Node = __webpack_require__(/*! ./Node.js */ "./node_modules/yaml/dist/nodes/Node.js");
var toJS = __webpack_require__(/*! ./toJS.js */ "./node_modules/yaml/dist/nodes/toJS.js");

class Alias extends Node.NodeBase {
    constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, 'tag', {
            set() {
                throw new Error('Alias nodes cannot have tags');
            }
        });
    }
    /**
     * Resolve the value of this alias within `doc`, finding the last
     * instance of the `source` anchor before this node.
     */
    resolve(doc) {
        let found = undefined;
        visit.visit(doc, {
            Node: (_key, node) => {
                if (node === this)
                    return visit.visit.BREAK;
                if (node.anchor === this.source)
                    found = node;
            }
        });
        return found;
    }
    toJSON(_arg, ctx) {
        if (!ctx)
            return { source: this.source };
        const { anchors, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc);
        if (!source) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new ReferenceError(msg);
        }
        let data = anchors.get(source);
        if (!data) {
            // Resolve anchors for Node.prototype.toJS()
            toJS.toJS(source, null, ctx);
            data = anchors.get(source);
        }
        /* istanbul ignore if */
        if (!data || data.res === undefined) {
            const msg = 'This should not happen: Alias anchor was not resolved?';
            throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
                data.aliasCount = getAliasCount(doc, source, anchors);
            if (data.count * data.aliasCount > maxAliasCount) {
                const msg = 'Excessive alias count indicates a resource exhaustion attack';
                throw new ReferenceError(msg);
            }
        }
        return data.res;
    }
    toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
            anchors.anchorIsValid(this.source);
            if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
                const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
                throw new Error(msg);
            }
            if (ctx.implicitKey)
                return `${src} `;
        }
        return src;
    }
}
function getAliasCount(doc, node, anchors) {
    if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors && source && anchors.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
    }
    else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
            const c = getAliasCount(doc, item, anchors);
            if (c > count)
                count = c;
        }
        return count;
    }
    else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors);
        const vc = getAliasCount(doc, node.value, anchors);
        return Math.max(kc, vc);
    }
    return 1;
}

exports.Alias = Alias;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/Collection.js":
/*!****************************************************!*\
  !*** ./node_modules/yaml/dist/nodes/Collection.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var createNode = __webpack_require__(/*! ../doc/createNode.js */ "./node_modules/yaml/dist/doc/createNode.js");
var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Node = __webpack_require__(/*! ./Node.js */ "./node_modules/yaml/dist/nodes/Node.js");

function collectionFromPath(schema, path, value) {
    let v = value;
    for (let i = path.length - 1; i >= 0; --i) {
        const k = path[i];
        if (typeof k === 'number' && Number.isInteger(k) && k >= 0) {
            const a = [];
            a[k] = v;
            v = a;
        }
        else {
            v = new Map([[k, v]]);
        }
    }
    return createNode.createNode(v, undefined, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
            throw new Error('This should not happen, please report a bug.');
        },
        schema,
        sourceObjects: new Map()
    });
}
// Type guard is intentionally a little wrong so as to be more useful,
// as it does not cover untypable empty non-string iterables (e.g. []).
const isEmptyPath = (path) => path == null ||
    (typeof path === 'object' && !!path[Symbol.iterator]().next().done);
class Collection extends Node.NodeBase {
    constructor(type, schema) {
        super(type);
        Object.defineProperty(this, 'schema', {
            value: schema,
            configurable: true,
            enumerable: false,
            writable: true
        });
    }
    /**
     * Create a copy of this collection.
     *
     * @param schema - If defined, overwrites the original's schema
     */
    clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
            copy.schema = schema;
        copy.items = copy.items.map(it => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
    /**
     * Adds a value to the collection. For `!!map` and `!!omap` the value must
     * be a Pair instance or a `{ key, value }` object, which may not have a key
     * that already exists in the map.
     */
    addIn(path, value) {
        if (isEmptyPath(path))
            this.add(value);
        else {
            const [key, ...rest] = path;
            const node = this.get(key, true);
            if (identity.isCollection(node))
                node.addIn(rest, value);
            else if (node === undefined && this.schema)
                this.set(key, collectionFromPath(this.schema, rest, value));
            else
                throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
    }
    /**
     * Removes a value from the collection.
     * @returns `true` if the item was found and removed.
     */
    deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
            return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
            return node.deleteIn(rest);
        else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    /**
     * Returns item at `key`, or `undefined` if not found. By default unwraps
     * scalar values from their surrounding node; to disable set `keepScalar` to
     * `true` (collections are always returned intact).
     */
    getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
            return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
            return identity.isCollection(node) ? node.getIn(rest, keepScalar) : undefined;
    }
    hasAllNullValues(allowScalar) {
        return this.items.every(node => {
            if (!identity.isPair(node))
                return false;
            const n = node.value;
            return (n == null ||
                (allowScalar &&
                    identity.isScalar(n) &&
                    n.value == null &&
                    !n.commentBefore &&
                    !n.comment &&
                    !n.tag));
        });
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     */
    hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
            return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     */
    setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
            this.set(key, value);
        }
        else {
            const node = this.get(key, true);
            if (identity.isCollection(node))
                node.setIn(rest, value);
            else if (node === undefined && this.schema)
                this.set(key, collectionFromPath(this.schema, rest, value));
            else
                throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
    }
}
Collection.maxFlowStringSingleLineLength = 60;

exports.Collection = Collection;
exports.collectionFromPath = collectionFromPath;
exports.isEmptyPath = isEmptyPath;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/Node.js":
/*!**********************************************!*\
  !*** ./node_modules/yaml/dist/nodes/Node.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var applyReviver = __webpack_require__(/*! ../doc/applyReviver.js */ "./node_modules/yaml/dist/doc/applyReviver.js");
var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var toJS = __webpack_require__(/*! ./toJS.js */ "./node_modules/yaml/dist/nodes/toJS.js");

class NodeBase {
    constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
    }
    /** Create a copy of this node.  */
    clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
            copy.range = this.range.slice();
        return copy;
    }
    /** A plain JavaScript representation of this node. */
    toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
            throw new TypeError('A document argument is required');
        const ctx = {
            anchors: new Map(),
            doc,
            keep: true,
            mapAsMap: mapAsMap === true,
            mapKeyWarned: false,
            maxAliasCount: typeof maxAliasCount === 'number' ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, '', ctx);
        if (typeof onAnchor === 'function')
            for (const { count, res } of ctx.anchors.values())
                onAnchor(res, count);
        return typeof reviver === 'function'
            ? applyReviver.applyReviver(reviver, { '': res }, '', res)
            : res;
    }
}

exports.NodeBase = NodeBase;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/Pair.js":
/*!**********************************************!*\
  !*** ./node_modules/yaml/dist/nodes/Pair.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var createNode = __webpack_require__(/*! ../doc/createNode.js */ "./node_modules/yaml/dist/doc/createNode.js");
var stringifyPair = __webpack_require__(/*! ../stringify/stringifyPair.js */ "./node_modules/yaml/dist/stringify/stringifyPair.js");
var addPairToJSMap = __webpack_require__(/*! ./addPairToJSMap.js */ "./node_modules/yaml/dist/nodes/addPairToJSMap.js");
var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");

function createPair(key, value, ctx) {
    const k = createNode.createNode(key, undefined, ctx);
    const v = createNode.createNode(value, undefined, ctx);
    return new Pair(k, v);
}
class Pair {
    constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
    }
    clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
            key = key.clone(schema);
        if (identity.isNode(value))
            value = value.clone(schema);
        return new Pair(key, value);
    }
    toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
    }
    toString(ctx, onComment, onChompKeep) {
        return ctx?.doc
            ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep)
            : JSON.stringify(this);
    }
}

exports.Pair = Pair;
exports.createPair = createPair;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/Scalar.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/nodes/Scalar.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Node = __webpack_require__(/*! ./Node.js */ "./node_modules/yaml/dist/nodes/Node.js");
var toJS = __webpack_require__(/*! ./toJS.js */ "./node_modules/yaml/dist/nodes/toJS.js");

const isScalarValue = (value) => !value || (typeof value !== 'function' && typeof value !== 'object');
class Scalar extends Node.NodeBase {
    constructor(value) {
        super(identity.SCALAR);
        this.value = value;
    }
    toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
    }
    toString() {
        return String(this.value);
    }
}
Scalar.BLOCK_FOLDED = 'BLOCK_FOLDED';
Scalar.BLOCK_LITERAL = 'BLOCK_LITERAL';
Scalar.PLAIN = 'PLAIN';
Scalar.QUOTE_DOUBLE = 'QUOTE_DOUBLE';
Scalar.QUOTE_SINGLE = 'QUOTE_SINGLE';

exports.Scalar = Scalar;
exports.isScalarValue = isScalarValue;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/YAMLMap.js":
/*!*************************************************!*\
  !*** ./node_modules/yaml/dist/nodes/YAMLMap.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var stringifyCollection = __webpack_require__(/*! ../stringify/stringifyCollection.js */ "./node_modules/yaml/dist/stringify/stringifyCollection.js");
var addPairToJSMap = __webpack_require__(/*! ./addPairToJSMap.js */ "./node_modules/yaml/dist/nodes/addPairToJSMap.js");
var Collection = __webpack_require__(/*! ./Collection.js */ "./node_modules/yaml/dist/nodes/Collection.js");
var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Pair = __webpack_require__(/*! ./Pair.js */ "./node_modules/yaml/dist/nodes/Pair.js");
var Scalar = __webpack_require__(/*! ./Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");

function findPair(items, key) {
    const k = identity.isScalar(key) ? key.value : key;
    for (const it of items) {
        if (identity.isPair(it)) {
            if (it.key === key || it.key === k)
                return it;
            if (identity.isScalar(it.key) && it.key.value === k)
                return it;
        }
    }
    return undefined;
}
class YAMLMap extends Collection.Collection {
    static get tagName() {
        return 'tag:yaml.org,2002:map';
    }
    constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
    }
    /**
     * A generic collection parsing method that can be extended
     * to other node classes that inherit from YAMLMap
     */
    static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
            if (typeof replacer === 'function')
                value = replacer.call(obj, key, value);
            else if (Array.isArray(replacer) && !replacer.includes(key))
                return;
            if (value !== undefined || keepUndefined)
                map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
            for (const [key, value] of obj)
                add(key, value);
        }
        else if (obj && typeof obj === 'object') {
            for (const key of Object.keys(obj))
                add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === 'function') {
            map.items.sort(schema.sortMapEntries);
        }
        return map;
    }
    /**
     * Adds a value to the collection.
     *
     * @param overwrite - If not set `true`, using a key that is already in the
     *   collection will throw. Otherwise, overwrites the previous value.
     */
    add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
            _pair = pair;
        else if (!pair || typeof pair !== 'object' || !('key' in pair)) {
            // In TypeScript, this never happens.
            _pair = new Pair.Pair(pair, pair?.value);
        }
        else
            _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
            if (!overwrite)
                throw new Error(`Key ${_pair.key} already set`);
            // For scalars, keep the old node & its comments and anchors
            if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
                prev.value.value = _pair.value;
            else
                prev.value = _pair.value;
        }
        else if (sortEntries) {
            const i = this.items.findIndex(item => sortEntries(_pair, item) < 0);
            if (i === -1)
                this.items.push(_pair);
            else
                this.items.splice(i, 0, _pair);
        }
        else {
            this.items.push(_pair);
        }
    }
    delete(key) {
        const it = findPair(this.items, key);
        if (!it)
            return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
    }
    get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? undefined;
    }
    has(key) {
        return !!findPair(this.items, key);
    }
    set(key, value) {
        this.add(new Pair.Pair(key, value), true);
    }
    /**
     * @param ctx - Conversion context, originally set in Document#toJS()
     * @param {Class} Type - If set, forces the returned collection type
     * @returns Instance of Type, Map, or Object
     */
    toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? new Map() : {};
        if (ctx?.onCreate)
            ctx.onCreate(map);
        for (const item of this.items)
            addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        for (const item of this.items) {
            if (!identity.isPair(item))
                throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
            ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
            blockItemPrefix: '',
            flowChars: { start: '{', end: '}' },
            itemIndent: ctx.indent || '',
            onChompKeep,
            onComment
        });
    }
}

exports.YAMLMap = YAMLMap;
exports.findPair = findPair;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/YAMLSeq.js":
/*!*************************************************!*\
  !*** ./node_modules/yaml/dist/nodes/YAMLSeq.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var createNode = __webpack_require__(/*! ../doc/createNode.js */ "./node_modules/yaml/dist/doc/createNode.js");
var stringifyCollection = __webpack_require__(/*! ../stringify/stringifyCollection.js */ "./node_modules/yaml/dist/stringify/stringifyCollection.js");
var Collection = __webpack_require__(/*! ./Collection.js */ "./node_modules/yaml/dist/nodes/Collection.js");
var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Scalar = __webpack_require__(/*! ./Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var toJS = __webpack_require__(/*! ./toJS.js */ "./node_modules/yaml/dist/nodes/toJS.js");

class YAMLSeq extends Collection.Collection {
    static get tagName() {
        return 'tag:yaml.org,2002:seq';
    }
    constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
    }
    add(value) {
        this.items.push(value);
    }
    /**
     * Removes a value from the collection.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     *
     * @returns `true` if the item was found and removed.
     */
    delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
    }
    get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            return undefined;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
    }
    /**
     * Checks if the collection includes a value with the key `key`.
     *
     * `key` must contain a representation of an integer for this to succeed.
     * It may be wrapped in a `Scalar`.
     */
    has(key) {
        const idx = asItemIndex(key);
        return typeof idx === 'number' && idx < this.items.length;
    }
    /**
     * Sets a value in this collection. For `!!set`, `value` needs to be a
     * boolean to add/remove the item from the set.
     *
     * If `key` does not contain a representation of an integer, this will throw.
     * It may be wrapped in a `Scalar`.
     */
    set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== 'number')
            throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
            prev.value = value;
        else
            this.items[idx] = value;
    }
    toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
            ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
            seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
            blockItemPrefix: '- ',
            flowChars: { start: '[', end: ']' },
            itemIndent: (ctx.indent || '') + '  ',
            onChompKeep,
            onComment
        });
    }
    static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
            let i = 0;
            for (let it of obj) {
                if (typeof replacer === 'function') {
                    const key = obj instanceof Set ? it : String(i++);
                    it = replacer.call(obj, key, it);
                }
                seq.items.push(createNode.createNode(it, undefined, ctx));
            }
        }
        return seq;
    }
}
function asItemIndex(key) {
    let idx = identity.isScalar(key) ? key.value : key;
    if (idx && typeof idx === 'string')
        idx = Number(idx);
    return typeof idx === 'number' && Number.isInteger(idx) && idx >= 0
        ? idx
        : null;
}

exports.YAMLSeq = YAMLSeq;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/addPairToJSMap.js":
/*!********************************************************!*\
  !*** ./node_modules/yaml/dist/nodes/addPairToJSMap.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var log = __webpack_require__(/*! ../log.js */ "./node_modules/yaml/dist/log.js");
var stringify = __webpack_require__(/*! ../stringify/stringify.js */ "./node_modules/yaml/dist/stringify/stringify.js");
var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Scalar = __webpack_require__(/*! ./Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var toJS = __webpack_require__(/*! ./toJS.js */ "./node_modules/yaml/dist/nodes/toJS.js");

const MERGE_KEY = '<<';
function addPairToJSMap(ctx, map, { key, value }) {
    if (ctx?.doc.schema.merge && isMergeKey(key)) {
        value = identity.isAlias(value) ? value.resolve(ctx.doc) : value;
        if (identity.isSeq(value))
            for (const it of value.items)
                mergeToJSMap(ctx, map, it);
        else if (Array.isArray(value))
            for (const it of value)
                mergeToJSMap(ctx, map, it);
        else
            mergeToJSMap(ctx, map, value);
    }
    else {
        const jsKey = toJS.toJS(key, '', ctx);
        if (map instanceof Map) {
            map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        }
        else if (map instanceof Set) {
            map.add(jsKey);
        }
        else {
            const stringKey = stringifyKey(key, jsKey, ctx);
            const jsValue = toJS.toJS(value, stringKey, ctx);
            if (stringKey in map)
                Object.defineProperty(map, stringKey, {
                    value: jsValue,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            else
                map[stringKey] = jsValue;
        }
    }
    return map;
}
const isMergeKey = (key) => key === MERGE_KEY ||
    (identity.isScalar(key) &&
        key.value === MERGE_KEY &&
        (!key.type || key.type === Scalar.Scalar.PLAIN));
// If the value associated with a merge key is a single mapping node, each of
// its key/value pairs is inserted into the current mapping, unless the key
// already exists in it. If the value associated with the merge key is a
// sequence, then this sequence is expected to contain mapping nodes and each
// of these nodes is merged in turn according to its order in the sequence.
// Keys in mapping nodes earlier in the sequence override keys specified in
// later mapping nodes. -- http://yaml.org/type/merge.html
function mergeToJSMap(ctx, map, value) {
    const source = ctx && identity.isAlias(value) ? value.resolve(ctx.doc) : value;
    if (!identity.isMap(source))
        throw new Error('Merge sources must be maps or map aliases');
    const srcMap = source.toJSON(null, ctx, Map);
    for (const [key, value] of srcMap) {
        if (map instanceof Map) {
            if (!map.has(key))
                map.set(key, value);
        }
        else if (map instanceof Set) {
            map.add(key);
        }
        else if (!Object.prototype.hasOwnProperty.call(map, key)) {
            Object.defineProperty(map, key, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
    }
    return map;
}
function stringifyKey(key, jsKey, ctx) {
    if (jsKey === null)
        return '';
    if (typeof jsKey !== 'object')
        return String(jsKey);
    if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = new Set();
        for (const node of ctx.anchors.keys())
            strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
            let jsonStr = JSON.stringify(strKey);
            if (jsonStr.length > 40)
                jsonStr = jsonStr.substring(0, 36) + '..."';
            log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
            ctx.mapKeyWarned = true;
        }
        return strKey;
    }
    return JSON.stringify(jsKey);
}

exports.addPairToJSMap = addPairToJSMap;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/identity.js":
/*!**************************************************!*\
  !*** ./node_modules/yaml/dist/nodes/identity.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const ALIAS = Symbol.for('yaml.alias');
const DOC = Symbol.for('yaml.document');
const MAP = Symbol.for('yaml.map');
const PAIR = Symbol.for('yaml.pair');
const SCALAR = Symbol.for('yaml.scalar');
const SEQ = Symbol.for('yaml.seq');
const NODE_TYPE = Symbol.for('yaml.node.type');
const isAlias = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === ALIAS;
const isDocument = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === DOC;
const isMap = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === MAP;
const isPair = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === PAIR;
const isScalar = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === SCALAR;
const isSeq = (node) => !!node && typeof node === 'object' && node[NODE_TYPE] === SEQ;
function isCollection(node) {
    if (node && typeof node === 'object')
        switch (node[NODE_TYPE]) {
            case MAP:
            case SEQ:
                return true;
        }
    return false;
}
function isNode(node) {
    if (node && typeof node === 'object')
        switch (node[NODE_TYPE]) {
            case ALIAS:
            case MAP:
            case SCALAR:
            case SEQ:
                return true;
        }
    return false;
}
const hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;

exports.ALIAS = ALIAS;
exports.DOC = DOC;
exports.MAP = MAP;
exports.NODE_TYPE = NODE_TYPE;
exports.PAIR = PAIR;
exports.SCALAR = SCALAR;
exports.SEQ = SEQ;
exports.hasAnchor = hasAnchor;
exports.isAlias = isAlias;
exports.isCollection = isCollection;
exports.isDocument = isDocument;
exports.isMap = isMap;
exports.isNode = isNode;
exports.isPair = isPair;
exports.isScalar = isScalar;
exports.isSeq = isSeq;


/***/ }),

/***/ "./node_modules/yaml/dist/nodes/toJS.js":
/*!**********************************************!*\
  !*** ./node_modules/yaml/dist/nodes/toJS.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ./identity.js */ "./node_modules/yaml/dist/nodes/identity.js");

/**
 * Recursively convert any node or its contents to native JavaScript
 *
 * @param value - The input value
 * @param arg - If `value` defines a `toJSON()` method, use this
 *   as its first argument
 * @param ctx - Conversion context, originally set in Document#toJS(). If
 *   `{ keep: true }` is not set, output should be suitable for JSON
 *   stringification.
 */
function toJS(value, arg, ctx) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
    if (value && typeof value.toJSON === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (!ctx || !identity.hasAnchor(value))
            return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: undefined };
        ctx.anchors.set(value, data);
        ctx.onCreate = res => {
            data.res = res;
            delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
            ctx.onCreate(res);
        return res;
    }
    if (typeof value === 'bigint' && !ctx?.keep)
        return Number(value);
    return value;
}

exports.toJS = toJS;


/***/ }),

/***/ "./node_modules/yaml/dist/parse/cst-scalar.js":
/*!****************************************************!*\
  !*** ./node_modules/yaml/dist/parse/cst-scalar.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var resolveBlockScalar = __webpack_require__(/*! ../compose/resolve-block-scalar.js */ "./node_modules/yaml/dist/compose/resolve-block-scalar.js");
var resolveFlowScalar = __webpack_require__(/*! ../compose/resolve-flow-scalar.js */ "./node_modules/yaml/dist/compose/resolve-flow-scalar.js");
var errors = __webpack_require__(/*! ../errors.js */ "./node_modules/yaml/dist/errors.js");
var stringifyString = __webpack_require__(/*! ../stringify/stringifyString.js */ "./node_modules/yaml/dist/stringify/stringifyString.js");

function resolveAsScalar(token, strict = true, onError) {
    if (token) {
        const _onError = (pos, code, message) => {
            const offset = typeof pos === 'number' ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
            if (onError)
                onError(offset, code, message);
            else
                throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
            case 'block-scalar':
                return resolveBlockScalar.resolveBlockScalar(token, strict, _onError);
        }
    }
    return null;
}
/**
 * Create a new scalar token with `value`
 *
 * Values that represent an actual string but may be parsed as a different type should use a `type` other than `'PLAIN'`,
 * as this function does not support any schema operations and won't check for such conflicts.
 *
 * @param value The string representation of the value, which will have its content properly indented.
 * @param context.end Comments and whitespace after the end of the value, or after the block scalar header. If undefined, a newline will be added.
 * @param context.implicitKey Being within an implicit key may affect the resolved type of the token's value.
 * @param context.indent The indent level of the token.
 * @param context.inFlow Is this scalar within a flow collection? This may affect the resolved type of the token's value.
 * @param context.offset The offset position of the token.
 * @param context.type The preferred type of the scalar token. If undefined, the previous type of the `token` will be used, defaulting to `'PLAIN'`.
 */
function createScalarToken(value, context) {
    const { implicitKey = false, indent, inFlow = false, offset = -1, type = 'PLAIN' } = context;
    const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? ' '.repeat(indent) : '',
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
    });
    const end = context.end ?? [
        { type: 'newline', offset: -1, indent, source: '\n' }
    ];
    switch (source[0]) {
        case '|':
        case '>': {
            const he = source.indexOf('\n');
            const head = source.substring(0, he);
            const body = source.substring(he + 1) + '\n';
            const props = [
                { type: 'block-scalar-header', offset, indent, source: head }
            ];
            if (!addEndtoBlockProps(props, end))
                props.push({ type: 'newline', offset: -1, indent, source: '\n' });
            return { type: 'block-scalar', offset, indent, props, source: body };
        }
        case '"':
            return { type: 'double-quoted-scalar', offset, indent, source, end };
        case "'":
            return { type: 'single-quoted-scalar', offset, indent, source, end };
        default:
            return { type: 'scalar', offset, indent, source, end };
    }
}
/**
 * Set the value of `token` to the given string `value`, overwriting any previous contents and type that it may have.
 *
 * Best efforts are made to retain any comments previously associated with the `token`,
 * though all contents within a collection's `items` will be overwritten.
 *
 * Values that represent an actual string but may be parsed as a different type should use a `type` other than `'PLAIN'`,
 * as this function does not support any schema operations and won't check for such conflicts.
 *
 * @param token Any token. If it does not include an `indent` value, the value will be stringified as if it were an implicit key.
 * @param value The string representation of the value, which will have its content properly indented.
 * @param context.afterKey In most cases, values after a key should have an additional level of indentation.
 * @param context.implicitKey Being within an implicit key may affect the resolved type of the token's value.
 * @param context.inFlow Being within a flow collection may affect the resolved type of the token's value.
 * @param context.type The preferred type of the scalar token. If undefined, the previous type of the `token` will be used, defaulting to `'PLAIN'`.
 */
function setScalarValue(token, value, context = {}) {
    let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
    let indent = 'indent' in token ? token.indent : null;
    if (afterKey && typeof indent === 'number')
        indent += 2;
    if (!type)
        switch (token.type) {
            case 'single-quoted-scalar':
                type = 'QUOTE_SINGLE';
                break;
            case 'double-quoted-scalar':
                type = 'QUOTE_DOUBLE';
                break;
            case 'block-scalar': {
                const header = token.props[0];
                if (header.type !== 'block-scalar-header')
                    throw new Error('Invalid block scalar header');
                type = header.source[0] === '>' ? 'BLOCK_FOLDED' : 'BLOCK_LITERAL';
                break;
            }
            default:
                type = 'PLAIN';
        }
    const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? ' '.repeat(indent) : '',
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
    });
    switch (source[0]) {
        case '|':
        case '>':
            setBlockScalarValue(token, source);
            break;
        case '"':
            setFlowScalarValue(token, source, 'double-quoted-scalar');
            break;
        case "'":
            setFlowScalarValue(token, source, 'single-quoted-scalar');
            break;
        default:
            setFlowScalarValue(token, source, 'scalar');
    }
}
function setBlockScalarValue(token, source) {
    const he = source.indexOf('\n');
    const head = source.substring(0, he);
    const body = source.substring(he + 1) + '\n';
    if (token.type === 'block-scalar') {
        const header = token.props[0];
        if (header.type !== 'block-scalar-header')
            throw new Error('Invalid block scalar header');
        header.source = head;
        token.source = body;
    }
    else {
        const { offset } = token;
        const indent = 'indent' in token ? token.indent : -1;
        const props = [
            { type: 'block-scalar-header', offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, 'end' in token ? token.end : undefined))
            props.push({ type: 'newline', offset: -1, indent, source: '\n' });
        for (const key of Object.keys(token))
            if (key !== 'type' && key !== 'offset')
                delete token[key];
        Object.assign(token, { type: 'block-scalar', indent, props, source: body });
    }
}
/** @returns `true` if last token is a newline */
function addEndtoBlockProps(props, end) {
    if (end)
        for (const st of end)
            switch (st.type) {
                case 'space':
                case 'comment':
                    props.push(st);
                    break;
                case 'newline':
                    props.push(st);
                    return true;
            }
    return false;
}
function setFlowScalarValue(token, source, type) {
    switch (token.type) {
        case 'scalar':
        case 'double-quoted-scalar':
        case 'single-quoted-scalar':
            token.type = type;
            token.source = source;
            break;
        case 'block-scalar': {
            const end = token.props.slice(1);
            let oa = source.length;
            if (token.props[0].type === 'block-scalar-header')
                oa -= token.props[0].source.length;
            for (const tok of end)
                tok.offset += oa;
            delete token.props;
            Object.assign(token, { type, source, end });
            break;
        }
        case 'block-map':
        case 'block-seq': {
            const offset = token.offset + source.length;
            const nl = { type: 'newline', offset, indent: token.indent, source: '\n' };
            delete token.items;
            Object.assign(token, { type, source, end: [nl] });
            break;
        }
        default: {
            const indent = 'indent' in token ? token.indent : -1;
            const end = 'end' in token && Array.isArray(token.end)
                ? token.end.filter(st => st.type === 'space' ||
                    st.type === 'comment' ||
                    st.type === 'newline')
                : [];
            for (const key of Object.keys(token))
                if (key !== 'type' && key !== 'offset')
                    delete token[key];
            Object.assign(token, { type, indent, source, end });
        }
    }
}

exports.createScalarToken = createScalarToken;
exports.resolveAsScalar = resolveAsScalar;
exports.setScalarValue = setScalarValue;


/***/ }),

/***/ "./node_modules/yaml/dist/parse/cst-stringify.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/parse/cst-stringify.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Stringify a CST document, token, or collection item
 *
 * Fair warning: This applies no validation whatsoever, and
 * simply concatenates the sources in their logical order.
 */
const stringify = (cst) => 'type' in cst ? stringifyToken(cst) : stringifyItem(cst);
function stringifyToken(token) {
    switch (token.type) {
        case 'block-scalar': {
            let res = '';
            for (const tok of token.props)
                res += stringifyToken(tok);
            return res + token.source;
        }
        case 'block-map':
        case 'block-seq': {
            let res = '';
            for (const item of token.items)
                res += stringifyItem(item);
            return res;
        }
        case 'flow-collection': {
            let res = token.start.source;
            for (const item of token.items)
                res += stringifyItem(item);
            for (const st of token.end)
                res += st.source;
            return res;
        }
        case 'document': {
            let res = stringifyItem(token);
            if (token.end)
                for (const st of token.end)
                    res += st.source;
            return res;
        }
        default: {
            let res = token.source;
            if ('end' in token && token.end)
                for (const st of token.end)
                    res += st.source;
            return res;
        }
    }
}
function stringifyItem({ start, key, sep, value }) {
    let res = '';
    for (const st of start)
        res += st.source;
    if (key)
        res += stringifyToken(key);
    if (sep)
        for (const st of sep)
            res += st.source;
    if (value)
        res += stringifyToken(value);
    return res;
}

exports.stringify = stringify;


/***/ }),

/***/ "./node_modules/yaml/dist/parse/cst-visit.js":
/*!***************************************************!*\
  !*** ./node_modules/yaml/dist/parse/cst-visit.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const BREAK = Symbol('break visit');
const SKIP = Symbol('skip children');
const REMOVE = Symbol('remove item');
/**
 * Apply a visitor to a CST document or item.
 *
 * Walks through the tree (depth-first) starting from the root, calling a
 * `visitor` function with two arguments when entering each item:
 *   - `item`: The current item, which included the following members:
 *     - `start: SourceToken[]` – Source tokens before the key or value,
 *       possibly including its anchor or tag.
 *     - `key?: Token | null` – Set for pair values. May then be `null`, if
 *       the key before the `:` separator is empty.
 *     - `sep?: SourceToken[]` – Source tokens between the key and the value,
 *       which should include the `:` map value indicator if `value` is set.
 *     - `value?: Token` – The value of a sequence item, or of a map pair.
 *   - `path`: The steps from the root to the current node, as an array of
 *     `['key' | 'value', number]` tuples.
 *
 * The return value of the visitor may be used to control the traversal:
 *   - `undefined` (default): Do nothing and continue
 *   - `visit.SKIP`: Do not visit the children of this token, continue with
 *      next sibling
 *   - `visit.BREAK`: Terminate traversal completely
 *   - `visit.REMOVE`: Remove the current item, then continue with the next one
 *   - `number`: Set the index of the next step. This is useful especially if
 *     the index of the current token has changed.
 *   - `function`: Define the next visitor for this item. After the original
 *     visitor is called on item entry, next visitors are called after handling
 *     a non-empty `key` and when exiting the item.
 */
function visit(cst, visitor) {
    if ('type' in cst && cst.type === 'document')
        cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
}
// Without the `as symbol` casts, TS declares these in the `visit`
// namespace using `var`, but then complains about that because
// `unique symbol` must be `const`.
/** Terminate visit traversal completely */
visit.BREAK = BREAK;
/** Do not visit the children of the current item */
visit.SKIP = SKIP;
/** Remove the current item */
visit.REMOVE = REMOVE;
/** Find the item at `path` from `cst` as the root */
visit.itemAtPath = (cst, path) => {
    let item = cst;
    for (const [field, index] of path) {
        const tok = item?.[field];
        if (tok && 'items' in tok) {
            item = tok.items[index];
        }
        else
            return undefined;
    }
    return item;
};
/**
 * Get the immediate parent collection of the item at `path` from `cst` as the root.
 *
 * Throws an error if the collection is not found, which should never happen if the item itself exists.
 */
visit.parentCollection = (cst, path) => {
    const parent = visit.itemAtPath(cst, path.slice(0, -1));
    const field = path[path.length - 1][0];
    const coll = parent?.[field];
    if (coll && 'items' in coll)
        return coll;
    throw new Error('Parent collection not found');
};
function _visit(path, item, visitor) {
    let ctrl = visitor(item, path);
    if (typeof ctrl === 'symbol')
        return ctrl;
    for (const field of ['key', 'value']) {
        const token = item[field];
        if (token && 'items' in token) {
            for (let i = 0; i < token.items.length; ++i) {
                const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
                if (typeof ci === 'number')
                    i = ci - 1;
                else if (ci === BREAK)
                    return BREAK;
                else if (ci === REMOVE) {
                    token.items.splice(i, 1);
                    i -= 1;
                }
            }
            if (typeof ctrl === 'function' && field === 'key')
                ctrl = ctrl(item, path);
        }
    }
    return typeof ctrl === 'function' ? ctrl(item, path) : ctrl;
}

exports.visit = visit;


/***/ }),

/***/ "./node_modules/yaml/dist/parse/cst.js":
/*!*********************************************!*\
  !*** ./node_modules/yaml/dist/parse/cst.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var cstScalar = __webpack_require__(/*! ./cst-scalar.js */ "./node_modules/yaml/dist/parse/cst-scalar.js");
var cstStringify = __webpack_require__(/*! ./cst-stringify.js */ "./node_modules/yaml/dist/parse/cst-stringify.js");
var cstVisit = __webpack_require__(/*! ./cst-visit.js */ "./node_modules/yaml/dist/parse/cst-visit.js");

/** The byte order mark */
const BOM = '\u{FEFF}';
/** Start of doc-mode */
const DOCUMENT = '\x02'; // C0: Start of Text
/** Unexpected end of flow-mode */
const FLOW_END = '\x18'; // C0: Cancel
/** Next token is a scalar value */
const SCALAR = '\x1f'; // C0: Unit Separator
/** @returns `true` if `token` is a flow or block collection */
const isCollection = (token) => !!token && 'items' in token;
/** @returns `true` if `token` is a flow or block scalar; not an alias */
const isScalar = (token) => !!token &&
    (token.type === 'scalar' ||
        token.type === 'single-quoted-scalar' ||
        token.type === 'double-quoted-scalar' ||
        token.type === 'block-scalar');
/* istanbul ignore next */
/** Get a printable representation of a lexer token */
function prettyToken(token) {
    switch (token) {
        case BOM:
            return '<BOM>';
        case DOCUMENT:
            return '<DOC>';
        case FLOW_END:
            return '<FLOW_END>';
        case SCALAR:
            return '<SCALAR>';
        default:
            return JSON.stringify(token);
    }
}
/** Identify the type of a lexer token. May return `null` for unknown tokens. */
function tokenType(source) {
    switch (source) {
        case BOM:
            return 'byte-order-mark';
        case DOCUMENT:
            return 'doc-mode';
        case FLOW_END:
            return 'flow-error-end';
        case SCALAR:
            return 'scalar';
        case '---':
            return 'doc-start';
        case '...':
            return 'doc-end';
        case '':
        case '\n':
        case '\r\n':
            return 'newline';
        case '-':
            return 'seq-item-ind';
        case '?':
            return 'explicit-key-ind';
        case ':':
            return 'map-value-ind';
        case '{':
            return 'flow-map-start';
        case '}':
            return 'flow-map-end';
        case '[':
            return 'flow-seq-start';
        case ']':
            return 'flow-seq-end';
        case ',':
            return 'comma';
    }
    switch (source[0]) {
        case ' ':
        case '\t':
            return 'space';
        case '#':
            return 'comment';
        case '%':
            return 'directive-line';
        case '*':
            return 'alias';
        case '&':
            return 'anchor';
        case '!':
            return 'tag';
        case "'":
            return 'single-quoted-scalar';
        case '"':
            return 'double-quoted-scalar';
        case '|':
        case '>':
            return 'block-scalar-header';
    }
    return null;
}

exports.createScalarToken = cstScalar.createScalarToken;
exports.resolveAsScalar = cstScalar.resolveAsScalar;
exports.setScalarValue = cstScalar.setScalarValue;
exports.stringify = cstStringify.stringify;
exports.visit = cstVisit.visit;
exports.BOM = BOM;
exports.DOCUMENT = DOCUMENT;
exports.FLOW_END = FLOW_END;
exports.SCALAR = SCALAR;
exports.isCollection = isCollection;
exports.isScalar = isScalar;
exports.prettyToken = prettyToken;
exports.tokenType = tokenType;


/***/ }),

/***/ "./node_modules/yaml/dist/parse/lexer.js":
/*!***********************************************!*\
  !*** ./node_modules/yaml/dist/parse/lexer.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var cst = __webpack_require__(/*! ./cst.js */ "./node_modules/yaml/dist/parse/cst.js");

/*
START -> stream

stream
  directive -> line-end -> stream
  indent + line-end -> stream
  [else] -> line-start

line-end
  comment -> line-end
  newline -> .
  input-end -> END

line-start
  doc-start -> doc
  doc-end -> stream
  [else] -> indent -> block-start

block-start
  seq-item-start -> block-start
  explicit-key-start -> block-start
  map-value-start -> block-start
  [else] -> doc

doc
  line-end -> line-start
  spaces -> doc
  anchor -> doc
  tag -> doc
  flow-start -> flow -> doc
  flow-end -> error -> doc
  seq-item-start -> error -> doc
  explicit-key-start -> error -> doc
  map-value-start -> doc
  alias -> doc
  quote-start -> quoted-scalar -> doc
  block-scalar-header -> line-end -> block-scalar(min) -> line-start
  [else] -> plain-scalar(false, min) -> doc

flow
  line-end -> flow
  spaces -> flow
  anchor -> flow
  tag -> flow
  flow-start -> flow -> flow
  flow-end -> .
  seq-item-start -> error -> flow
  explicit-key-start -> flow
  map-value-start -> flow
  alias -> flow
  quote-start -> quoted-scalar -> flow
  comma -> flow
  [else] -> plain-scalar(true, 0) -> flow

quoted-scalar
  quote-end -> .
  [else] -> quoted-scalar

block-scalar(min)
  newline + peek(indent < min) -> .
  [else] -> block-scalar(min)

plain-scalar(is-flow, min)
  scalar-end(is-flow) -> .
  peek(newline + (indent < min)) -> .
  [else] -> plain-scalar(min)
*/
function isEmpty(ch) {
    switch (ch) {
        case undefined:
        case ' ':
        case '\n':
        case '\r':
        case '\t':
            return true;
        default:
            return false;
    }
}
const hexDigits = '0123456789ABCDEFabcdef'.split('');
const tagChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()".split('');
const invalidFlowScalarChars = ',[]{}'.split('');
const invalidAnchorChars = ' ,[]{}\n\r\t'.split('');
const isNotAnchorChar = (ch) => !ch || invalidAnchorChars.includes(ch);
/**
 * Splits an input string into lexical tokens, i.e. smaller strings that are
 * easily identifiable by `tokens.tokenType()`.
 *
 * Lexing starts always in a "stream" context. Incomplete input may be buffered
 * until a complete token can be emitted.
 *
 * In addition to slices of the original input, the following control characters
 * may also be emitted:
 *
 * - `\x02` (Start of Text): A document starts with the next token
 * - `\x18` (Cancel): Unexpected end of flow-mode (indicates an error)
 * - `\x1f` (Unit Separator): Next token is a scalar value
 * - `\u{FEFF}` (Byte order mark): Emitted separately outside documents
 */
class Lexer {
    constructor() {
        /**
         * Flag indicating whether the end of the current buffer marks the end of
         * all input
         */
        this.atEnd = false;
        /**
         * Explicit indent set in block scalar header, as an offset from the current
         * minimum indent, so e.g. set to 1 from a header `|2+`. Set to -1 if not
         * explicitly set.
         */
        this.blockScalarIndent = -1;
        /**
         * Block scalars that include a + (keep) chomping indicator in their header
         * include trailing empty lines, which are otherwise excluded from the
         * scalar's contents.
         */
        this.blockScalarKeep = false;
        /** Current input */
        this.buffer = '';
        /**
         * Flag noting whether the map value indicator : can immediately follow this
         * node within a flow context.
         */
        this.flowKey = false;
        /** Count of surrounding flow collection levels. */
        this.flowLevel = 0;
        /**
         * Minimum level of indentation required for next lines to be parsed as a
         * part of the current scalar value.
         */
        this.indentNext = 0;
        /** Indentation level of the current line. */
        this.indentValue = 0;
        /** Position of the next \n character. */
        this.lineEndPos = null;
        /** Stores the state of the lexer if reaching the end of incpomplete input */
        this.next = null;
        /** A pointer to `buffer`; the current position of the lexer. */
        this.pos = 0;
    }
    /**
     * Generate YAML tokens from the `source` string. If `incomplete`,
     * a part of the last line may be left as a buffer for the next call.
     *
     * @returns A generator of lexical tokens
     */
    *lex(source, incomplete = false) {
        if (source) {
            this.buffer = this.buffer ? this.buffer + source : source;
            this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? 'stream';
        while (next && (incomplete || this.hasChars(1)))
            next = yield* this.parseNext(next);
    }
    atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === ' ' || ch === '\t')
            ch = this.buffer[++i];
        if (!ch || ch === '#' || ch === '\n')
            return true;
        if (ch === '\r')
            return this.buffer[i + 1] === '\n';
        return false;
    }
    charAt(n) {
        return this.buffer[this.pos + n];
    }
    continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
            let indent = 0;
            while (ch === ' ')
                ch = this.buffer[++indent + offset];
            if (ch === '\r') {
                const next = this.buffer[indent + offset + 1];
                if (next === '\n' || (!next && !this.atEnd))
                    return offset + indent + 1;
            }
            return ch === '\n' || indent >= this.indentNext || (!ch && !this.atEnd)
                ? offset + indent
                : -1;
        }
        if (ch === '-' || ch === '.') {
            const dt = this.buffer.substr(offset, 3);
            if ((dt === '---' || dt === '...') && isEmpty(this.buffer[offset + 3]))
                return -1;
        }
        return offset;
    }
    getLine() {
        let end = this.lineEndPos;
        if (typeof end !== 'number' || (end !== -1 && end < this.pos)) {
            end = this.buffer.indexOf('\n', this.pos);
            this.lineEndPos = end;
        }
        if (end === -1)
            return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === '\r')
            end -= 1;
        return this.buffer.substring(this.pos, end);
    }
    hasChars(n) {
        return this.pos + n <= this.buffer.length;
    }
    setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
    }
    peek(n) {
        return this.buffer.substr(this.pos, n);
    }
    *parseNext(next) {
        switch (next) {
            case 'stream':
                return yield* this.parseStream();
            case 'line-start':
                return yield* this.parseLineStart();
            case 'block-start':
                return yield* this.parseBlockStart();
            case 'doc':
                return yield* this.parseDocument();
            case 'flow':
                return yield* this.parseFlowCollection();
            case 'quoted-scalar':
                return yield* this.parseQuotedScalar();
            case 'block-scalar':
                return yield* this.parseBlockScalar();
            case 'plain-scalar':
                return yield* this.parsePlainScalar();
        }
    }
    *parseStream() {
        let line = this.getLine();
        if (line === null)
            return this.setNext('stream');
        if (line[0] === cst.BOM) {
            yield* this.pushCount(1);
            line = line.substring(1);
        }
        if (line[0] === '%') {
            let dirEnd = line.length;
            const cs = line.indexOf('#');
            if (cs !== -1) {
                const ch = line[cs - 1];
                if (ch === ' ' || ch === '\t')
                    dirEnd = cs - 1;
            }
            while (true) {
                const ch = line[dirEnd - 1];
                if (ch === ' ' || ch === '\t')
                    dirEnd -= 1;
                else
                    break;
            }
            const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
            yield* this.pushCount(line.length - n); // possible comment
            this.pushNewline();
            return 'stream';
        }
        if (this.atLineEnd()) {
            const sp = yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - sp);
            yield* this.pushNewline();
            return 'stream';
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
    }
    *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
            return this.setNext('line-start');
        if (ch === '-' || ch === '.') {
            if (!this.atEnd && !this.hasChars(4))
                return this.setNext('line-start');
            const s = this.peek(3);
            if (s === '---' && isEmpty(this.charAt(3))) {
                yield* this.pushCount(3);
                this.indentValue = 0;
                this.indentNext = 0;
                return 'doc';
            }
            else if (s === '...' && isEmpty(this.charAt(3))) {
                yield* this.pushCount(3);
                return 'stream';
            }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
            this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
            return this.setNext('block-start');
        if ((ch0 === '-' || ch0 === '?' || ch0 === ':') && isEmpty(ch1)) {
            const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
            this.indentNext = this.indentValue + 1;
            this.indentValue += n;
            return yield* this.parseBlockStart();
        }
        return 'doc';
    }
    *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
            return this.setNext('doc');
        let n = yield* this.pushIndicators();
        switch (line[n]) {
            case '#':
                yield* this.pushCount(line.length - n);
            // fallthrough
            case undefined:
                yield* this.pushNewline();
                return yield* this.parseLineStart();
            case '{':
            case '[':
                yield* this.pushCount(1);
                this.flowKey = false;
                this.flowLevel = 1;
                return 'flow';
            case '}':
            case ']':
                // this is an error
                yield* this.pushCount(1);
                return 'doc';
            case '*':
                yield* this.pushUntil(isNotAnchorChar);
                return 'doc';
            case '"':
            case "'":
                return yield* this.parseQuotedScalar();
            case '|':
            case '>':
                n += yield* this.parseBlockScalarHeader();
                n += yield* this.pushSpaces(true);
                yield* this.pushCount(line.length - n);
                yield* this.pushNewline();
                return yield* this.parseBlockScalar();
            default:
                return yield* this.parsePlainScalar();
        }
    }
    *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
            nl = yield* this.pushNewline();
            if (nl > 0) {
                sp = yield* this.pushSpaces(false);
                this.indentValue = indent = sp;
            }
            else {
                sp = 0;
            }
            sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
            return this.setNext('flow');
        if ((indent !== -1 && indent < this.indentNext && line[0] !== '#') ||
            (indent === 0 &&
                (line.startsWith('---') || line.startsWith('...')) &&
                isEmpty(line[3]))) {
            // Allowing for the terminal ] or } at the same (rather than greater)
            // indent level as the initial [ or { is technically invalid, but
            // failing here would be surprising to users.
            const atFlowEndMarker = indent === this.indentNext - 1 &&
                this.flowLevel === 1 &&
                (line[0] === ']' || line[0] === '}');
            if (!atFlowEndMarker) {
                // this is an error
                this.flowLevel = 0;
                yield cst.FLOW_END;
                return yield* this.parseLineStart();
            }
        }
        let n = 0;
        while (line[n] === ',') {
            n += yield* this.pushCount(1);
            n += yield* this.pushSpaces(true);
            this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
            case undefined:
                return 'flow';
            case '#':
                yield* this.pushCount(line.length - n);
                return 'flow';
            case '{':
            case '[':
                yield* this.pushCount(1);
                this.flowKey = false;
                this.flowLevel += 1;
                return 'flow';
            case '}':
            case ']':
                yield* this.pushCount(1);
                this.flowKey = true;
                this.flowLevel -= 1;
                return this.flowLevel ? 'flow' : 'doc';
            case '*':
                yield* this.pushUntil(isNotAnchorChar);
                return 'flow';
            case '"':
            case "'":
                this.flowKey = true;
                return yield* this.parseQuotedScalar();
            case ':': {
                const next = this.charAt(1);
                if (this.flowKey || isEmpty(next) || next === ',') {
                    this.flowKey = false;
                    yield* this.pushCount(1);
                    yield* this.pushSpaces(true);
                    return 'flow';
                }
            }
            // fallthrough
            default:
                this.flowKey = false;
                return yield* this.parsePlainScalar();
        }
    }
    *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
            while (end !== -1 && this.buffer[end + 1] === "'")
                end = this.buffer.indexOf("'", end + 2);
        }
        else {
            // double-quote
            while (end !== -1) {
                let n = 0;
                while (this.buffer[end - 1 - n] === '\\')
                    n += 1;
                if (n % 2 === 0)
                    break;
                end = this.buffer.indexOf('"', end + 1);
            }
        }
        // Only looking for newlines within the quotes
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf('\n', this.pos);
        if (nl !== -1) {
            while (nl !== -1) {
                const cs = this.continueScalar(nl + 1);
                if (cs === -1)
                    break;
                nl = qb.indexOf('\n', cs);
            }
            if (nl !== -1) {
                // this is an error caused by an unexpected unindent
                end = nl - (qb[nl - 1] === '\r' ? 2 : 1);
            }
        }
        if (end === -1) {
            if (!this.atEnd)
                return this.setNext('quoted-scalar');
            end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? 'flow' : 'doc';
    }
    *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
            const ch = this.buffer[++i];
            if (ch === '+')
                this.blockScalarKeep = true;
            else if (ch > '0' && ch <= '9')
                this.blockScalarIndent = Number(ch) - 1;
            else if (ch !== '-')
                break;
        }
        return yield* this.pushUntil(ch => isEmpty(ch) || ch === '#');
    }
    *parseBlockScalar() {
        let nl = this.pos - 1; // may be -1 if this.pos === 0
        let indent = 0;
        let ch;
        loop: for (let i = this.pos; (ch = this.buffer[i]); ++i) {
            switch (ch) {
                case ' ':
                    indent += 1;
                    break;
                case '\n':
                    nl = i;
                    indent = 0;
                    break;
                case '\r': {
                    const next = this.buffer[i + 1];
                    if (!next && !this.atEnd)
                        return this.setNext('block-scalar');
                    if (next === '\n')
                        break;
                } // fallthrough
                default:
                    break loop;
            }
        }
        if (!ch && !this.atEnd)
            return this.setNext('block-scalar');
        if (indent >= this.indentNext) {
            if (this.blockScalarIndent === -1)
                this.indentNext = indent;
            else
                this.indentNext += this.blockScalarIndent;
            do {
                const cs = this.continueScalar(nl + 1);
                if (cs === -1)
                    break;
                nl = this.buffer.indexOf('\n', cs);
            } while (nl !== -1);
            if (nl === -1) {
                if (!this.atEnd)
                    return this.setNext('block-scalar');
                nl = this.buffer.length;
            }
        }
        if (!this.blockScalarKeep) {
            do {
                let i = nl - 1;
                let ch = this.buffer[i];
                if (ch === '\r')
                    ch = this.buffer[--i];
                const lastChar = i; // Drop the line if last char not more indented
                while (ch === ' ' || ch === '\t')
                    ch = this.buffer[--i];
                if (ch === '\n' && i >= this.pos && i + 1 + indent > lastChar)
                    nl = i;
                else
                    break;
            } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
    }
    *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while ((ch = this.buffer[++i])) {
            if (ch === ':') {
                const next = this.buffer[i + 1];
                if (isEmpty(next) || (inFlow && next === ','))
                    break;
                end = i;
            }
            else if (isEmpty(ch)) {
                let next = this.buffer[i + 1];
                if (ch === '\r') {
                    if (next === '\n') {
                        i += 1;
                        ch = '\n';
                        next = this.buffer[i + 1];
                    }
                    else
                        end = i;
                }
                if (next === '#' || (inFlow && invalidFlowScalarChars.includes(next)))
                    break;
                if (ch === '\n') {
                    const cs = this.continueScalar(i + 1);
                    if (cs === -1)
                        break;
                    i = Math.max(i, cs - 2); // to advance, but still account for ' #'
                }
            }
            else {
                if (inFlow && invalidFlowScalarChars.includes(ch))
                    break;
                end = i;
            }
        }
        if (!ch && !this.atEnd)
            return this.setNext('plain-scalar');
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? 'flow' : 'doc';
    }
    *pushCount(n) {
        if (n > 0) {
            yield this.buffer.substr(this.pos, n);
            this.pos += n;
            return n;
        }
        return 0;
    }
    *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
            yield s;
            this.pos += s.length;
            return s.length;
        }
        else if (allowEmpty)
            yield '';
        return 0;
    }
    *pushIndicators() {
        switch (this.charAt(0)) {
            case '!':
                return ((yield* this.pushTag()) +
                    (yield* this.pushSpaces(true)) +
                    (yield* this.pushIndicators()));
            case '&':
                return ((yield* this.pushUntil(isNotAnchorChar)) +
                    (yield* this.pushSpaces(true)) +
                    (yield* this.pushIndicators()));
            case '-': // this is an error
            case '?': // this is an error outside flow collections
            case ':': {
                const inFlow = this.flowLevel > 0;
                const ch1 = this.charAt(1);
                if (isEmpty(ch1) || (inFlow && invalidFlowScalarChars.includes(ch1))) {
                    if (!inFlow)
                        this.indentNext = this.indentValue + 1;
                    else if (this.flowKey)
                        this.flowKey = false;
                    return ((yield* this.pushCount(1)) +
                        (yield* this.pushSpaces(true)) +
                        (yield* this.pushIndicators()));
                }
            }
        }
        return 0;
    }
    *pushTag() {
        if (this.charAt(1) === '<') {
            let i = this.pos + 2;
            let ch = this.buffer[i];
            while (!isEmpty(ch) && ch !== '>')
                ch = this.buffer[++i];
            return yield* this.pushToIndex(ch === '>' ? i + 1 : i, false);
        }
        else {
            let i = this.pos + 1;
            let ch = this.buffer[i];
            while (ch) {
                if (tagChars.includes(ch))
                    ch = this.buffer[++i];
                else if (ch === '%' &&
                    hexDigits.includes(this.buffer[i + 1]) &&
                    hexDigits.includes(this.buffer[i + 2])) {
                    ch = this.buffer[(i += 3)];
                }
                else
                    break;
            }
            return yield* this.pushToIndex(i, false);
        }
    }
    *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === '\n')
            return yield* this.pushCount(1);
        else if (ch === '\r' && this.charAt(1) === '\n')
            return yield* this.pushCount(2);
        else
            return 0;
    }
    *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
            ch = this.buffer[++i];
        } while (ch === ' ' || (allowTabs && ch === '\t'));
        const n = i - this.pos;
        if (n > 0) {
            yield this.buffer.substr(this.pos, n);
            this.pos = i;
        }
        return n;
    }
    *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
            ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
    }
}

exports.Lexer = Lexer;


/***/ }),

/***/ "./node_modules/yaml/dist/parse/line-counter.js":
/*!******************************************************!*\
  !*** ./node_modules/yaml/dist/parse/line-counter.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Tracks newlines during parsing in order to provide an efficient API for
 * determining the one-indexed `{ line, col }` position for any offset
 * within the input.
 */
class LineCounter {
    constructor() {
        this.lineStarts = [];
        /**
         * Should be called in ascending order. Otherwise, call
         * `lineCounter.lineStarts.sort()` before calling `linePos()`.
         */
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        /**
         * Performs a binary search and returns the 1-indexed { line, col }
         * position of `offset`. If `line === 0`, `addNewLine` has never been
         * called or `offset` is before the first known newline.
         */
        this.linePos = (offset) => {
            let low = 0;
            let high = this.lineStarts.length;
            while (low < high) {
                const mid = (low + high) >> 1; // Math.floor((low + high) / 2)
                if (this.lineStarts[mid] < offset)
                    low = mid + 1;
                else
                    high = mid;
            }
            if (this.lineStarts[low] === offset)
                return { line: low + 1, col: 1 };
            if (low === 0)
                return { line: 0, col: offset };
            const start = this.lineStarts[low - 1];
            return { line: low, col: offset - start + 1 };
        };
    }
}

exports.LineCounter = LineCounter;


/***/ }),

/***/ "./node_modules/yaml/dist/parse/parser.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/parse/parser.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var cst = __webpack_require__(/*! ./cst.js */ "./node_modules/yaml/dist/parse/cst.js");
var lexer = __webpack_require__(/*! ./lexer.js */ "./node_modules/yaml/dist/parse/lexer.js");

function includesToken(list, type) {
    for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
            return true;
    return false;
}
function findNonEmptyIndex(list) {
    for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
            case 'space':
            case 'comment':
            case 'newline':
                break;
            default:
                return i;
        }
    }
    return -1;
}
function isFlowToken(token) {
    switch (token?.type) {
        case 'alias':
        case 'scalar':
        case 'single-quoted-scalar':
        case 'double-quoted-scalar':
        case 'flow-collection':
            return true;
        default:
            return false;
    }
}
function getPrevProps(parent) {
    switch (parent.type) {
        case 'document':
            return parent.start;
        case 'block-map': {
            const it = parent.items[parent.items.length - 1];
            return it.sep ?? it.start;
        }
        case 'block-seq':
            return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
            return [];
    }
}
/** Note: May modify input array */
function getFirstKeyStartProps(prev) {
    if (prev.length === 0)
        return [];
    let i = prev.length;
    loop: while (--i >= 0) {
        switch (prev[i].type) {
            case 'doc-start':
            case 'explicit-key-ind':
            case 'map-value-ind':
            case 'seq-item-ind':
            case 'newline':
                break loop;
        }
    }
    while (prev[++i]?.type === 'space') {
        /* loop */
    }
    return prev.splice(i, prev.length);
}
function fixFlowSeqItems(fc) {
    if (fc.start.type === 'flow-seq-start') {
        for (const it of fc.items) {
            if (it.sep &&
                !it.value &&
                !includesToken(it.start, 'explicit-key-ind') &&
                !includesToken(it.sep, 'map-value-ind')) {
                if (it.key)
                    it.value = it.key;
                delete it.key;
                if (isFlowToken(it.value)) {
                    if (it.value.end)
                        Array.prototype.push.apply(it.value.end, it.sep);
                    else
                        it.value.end = it.sep;
                }
                else
                    Array.prototype.push.apply(it.start, it.sep);
                delete it.sep;
            }
        }
    }
}
/**
 * A YAML concrete syntax tree (CST) parser
 *
 * ```ts
 * const src: string = ...
 * for (const token of new Parser().parse(src)) {
 *   // token: Token
 * }
 * ```
 *
 * To use the parser with a user-provided lexer:
 *
 * ```ts
 * function* parse(source: string, lexer: Lexer) {
 *   const parser = new Parser()
 *   for (const lexeme of lexer.lex(source))
 *     yield* parser.next(lexeme)
 *   yield* parser.end()
 * }
 *
 * const src: string = ...
 * const lexer = new Lexer()
 * for (const token of parse(src, lexer)) {
 *   // token: Token
 * }
 * ```
 */
class Parser {
    /**
     * @param onNewLine - If defined, called separately with the start position of
     *   each new line (in `parse()`, including the start of input).
     */
    constructor(onNewLine) {
        /** If true, space and sequence indicators count as indentation */
        this.atNewLine = true;
        /** If true, next token is a scalar value */
        this.atScalar = false;
        /** Current indentation level */
        this.indent = 0;
        /** Current offset since the start of parsing */
        this.offset = 0;
        /** On the same line with a block map key */
        this.onKeyLine = false;
        /** Top indicates the node that's currently being built */
        this.stack = [];
        /** The source of the current token, set in parse() */
        this.source = '';
        /** The type of the current token, set in parse() */
        this.type = '';
        // Must be defined after `next()`
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
    }
    /**
     * Parse `source` as a YAML stream.
     * If `incomplete`, a part of the last line may be left as a buffer for the next call.
     *
     * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
     *
     * @returns A generator of tokens representing each directive, document, and other structure.
     */
    *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
            this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
            yield* this.next(lexeme);
        if (!incomplete)
            yield* this.end();
    }
    /**
     * Advance the parser by the `source` of one lexical token.
     */
    *next(source) {
        this.source = source;
        if (process.env.LOG_TOKENS)
            console.log('|', cst.prettyToken(source));
        if (this.atScalar) {
            this.atScalar = false;
            yield* this.step();
            this.offset += source.length;
            return;
        }
        const type = cst.tokenType(source);
        if (!type) {
            const message = `Not a YAML token: ${source}`;
            yield* this.pop({ type: 'error', offset: this.offset, message, source });
            this.offset += source.length;
        }
        else if (type === 'scalar') {
            this.atNewLine = false;
            this.atScalar = true;
            this.type = 'scalar';
        }
        else {
            this.type = type;
            yield* this.step();
            switch (type) {
                case 'newline':
                    this.atNewLine = true;
                    this.indent = 0;
                    if (this.onNewLine)
                        this.onNewLine(this.offset + source.length);
                    break;
                case 'space':
                    if (this.atNewLine && source[0] === ' ')
                        this.indent += source.length;
                    break;
                case 'explicit-key-ind':
                case 'map-value-ind':
                case 'seq-item-ind':
                    if (this.atNewLine)
                        this.indent += source.length;
                    break;
                case 'doc-mode':
                case 'flow-error-end':
                    return;
                default:
                    this.atNewLine = false;
            }
            this.offset += source.length;
        }
    }
    /** Call at end of input to push out any remaining constructions */
    *end() {
        while (this.stack.length > 0)
            yield* this.pop();
    }
    get sourceToken() {
        const st = {
            type: this.type,
            offset: this.offset,
            indent: this.indent,
            source: this.source
        };
        return st;
    }
    *step() {
        const top = this.peek(1);
        if (this.type === 'doc-end' && (!top || top.type !== 'doc-end')) {
            while (this.stack.length > 0)
                yield* this.pop();
            this.stack.push({
                type: 'doc-end',
                offset: this.offset,
                source: this.source
            });
            return;
        }
        if (!top)
            return yield* this.stream();
        switch (top.type) {
            case 'document':
                return yield* this.document(top);
            case 'alias':
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return yield* this.scalar(top);
            case 'block-scalar':
                return yield* this.blockScalar(top);
            case 'block-map':
                return yield* this.blockMap(top);
            case 'block-seq':
                return yield* this.blockSequence(top);
            case 'flow-collection':
                return yield* this.flowCollection(top);
            case 'doc-end':
                return yield* this.documentEnd(top);
        }
        /* istanbul ignore next should not happen */
        yield* this.pop();
    }
    peek(n) {
        return this.stack[this.stack.length - n];
    }
    *pop(error) {
        const token = error ?? this.stack.pop();
        /* istanbul ignore if should not happen */
        if (!token) {
            const message = 'Tried to pop an empty stack';
            yield { type: 'error', offset: this.offset, source: '', message };
        }
        else if (this.stack.length === 0) {
            yield token;
        }
        else {
            const top = this.peek(1);
            if (token.type === 'block-scalar') {
                // Block scalars use their parent rather than header indent
                token.indent = 'indent' in top ? top.indent : 0;
            }
            else if (token.type === 'flow-collection' && top.type === 'document') {
                // Ignore all indent for top-level flow collections
                token.indent = 0;
            }
            if (token.type === 'flow-collection')
                fixFlowSeqItems(token);
            switch (top.type) {
                case 'document':
                    top.value = token;
                    break;
                case 'block-scalar':
                    top.props.push(token); // error
                    break;
                case 'block-map': {
                    const it = top.items[top.items.length - 1];
                    if (it.value) {
                        top.items.push({ start: [], key: token, sep: [] });
                        this.onKeyLine = true;
                        return;
                    }
                    else if (it.sep) {
                        it.value = token;
                    }
                    else {
                        Object.assign(it, { key: token, sep: [] });
                        this.onKeyLine = !includesToken(it.start, 'explicit-key-ind');
                        return;
                    }
                    break;
                }
                case 'block-seq': {
                    const it = top.items[top.items.length - 1];
                    if (it.value)
                        top.items.push({ start: [], value: token });
                    else
                        it.value = token;
                    break;
                }
                case 'flow-collection': {
                    const it = top.items[top.items.length - 1];
                    if (!it || it.value)
                        top.items.push({ start: [], key: token, sep: [] });
                    else if (it.sep)
                        it.value = token;
                    else
                        Object.assign(it, { key: token, sep: [] });
                    return;
                }
                /* istanbul ignore next should not happen */
                default:
                    yield* this.pop();
                    yield* this.pop(token);
            }
            if ((top.type === 'document' ||
                top.type === 'block-map' ||
                top.type === 'block-seq') &&
                (token.type === 'block-map' || token.type === 'block-seq')) {
                const last = token.items[token.items.length - 1];
                if (last &&
                    !last.sep &&
                    !last.value &&
                    last.start.length > 0 &&
                    findNonEmptyIndex(last.start) === -1 &&
                    (token.indent === 0 ||
                        last.start.every(st => st.type !== 'comment' || st.indent < token.indent))) {
                    if (top.type === 'document')
                        top.end = last.start;
                    else
                        top.items.push({ start: last.start });
                    token.items.splice(-1, 1);
                }
            }
        }
    }
    *stream() {
        switch (this.type) {
            case 'directive-line':
                yield { type: 'directive', offset: this.offset, source: this.source };
                return;
            case 'byte-order-mark':
            case 'space':
            case 'comment':
            case 'newline':
                yield this.sourceToken;
                return;
            case 'doc-mode':
            case 'doc-start': {
                const doc = {
                    type: 'document',
                    offset: this.offset,
                    start: []
                };
                if (this.type === 'doc-start')
                    doc.start.push(this.sourceToken);
                this.stack.push(doc);
                return;
            }
        }
        yield {
            type: 'error',
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML stream`,
            source: this.source
        };
    }
    *document(doc) {
        if (doc.value)
            return yield* this.lineEnd(doc);
        switch (this.type) {
            case 'doc-start': {
                if (findNonEmptyIndex(doc.start) !== -1) {
                    yield* this.pop();
                    yield* this.step();
                }
                else
                    doc.start.push(this.sourceToken);
                return;
            }
            case 'anchor':
            case 'tag':
            case 'space':
            case 'comment':
            case 'newline':
                doc.start.push(this.sourceToken);
                return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
            this.stack.push(bv);
        else {
            yield {
                type: 'error',
                offset: this.offset,
                message: `Unexpected ${this.type} token in YAML document`,
                source: this.source
            };
        }
    }
    *scalar(scalar) {
        if (this.type === 'map-value-ind') {
            const prev = getPrevProps(this.peek(2));
            const start = getFirstKeyStartProps(prev);
            let sep;
            if (scalar.end) {
                sep = scalar.end;
                sep.push(this.sourceToken);
                delete scalar.end;
            }
            else
                sep = [this.sourceToken];
            const map = {
                type: 'block-map',
                offset: scalar.offset,
                indent: scalar.indent,
                items: [{ start, key: scalar, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
        }
        else
            yield* this.lineEnd(scalar);
    }
    *blockScalar(scalar) {
        switch (this.type) {
            case 'space':
            case 'comment':
            case 'newline':
                scalar.props.push(this.sourceToken);
                return;
            case 'scalar':
                scalar.source = this.source;
                // block-scalar source includes trailing newline
                this.atNewLine = true;
                this.indent = 0;
                if (this.onNewLine) {
                    let nl = this.source.indexOf('\n') + 1;
                    while (nl !== 0) {
                        this.onNewLine(this.offset + nl);
                        nl = this.source.indexOf('\n', nl) + 1;
                    }
                }
                yield* this.pop();
                break;
            /* istanbul ignore next should not happen */
            default:
                yield* this.pop();
                yield* this.step();
        }
    }
    *blockMap(map) {
        const it = map.items[map.items.length - 1];
        // it.sep is true-ish if pair already has key or : separator
        switch (this.type) {
            case 'newline':
                this.onKeyLine = false;
                if (it.value) {
                    const end = 'end' in it.value ? it.value.end : undefined;
                    const last = Array.isArray(end) ? end[end.length - 1] : undefined;
                    if (last?.type === 'comment')
                        end?.push(this.sourceToken);
                    else
                        map.items.push({ start: [this.sourceToken] });
                }
                else if (it.sep) {
                    it.sep.push(this.sourceToken);
                }
                else {
                    it.start.push(this.sourceToken);
                }
                return;
            case 'space':
            case 'comment':
                if (it.value) {
                    map.items.push({ start: [this.sourceToken] });
                }
                else if (it.sep) {
                    it.sep.push(this.sourceToken);
                }
                else {
                    if (this.atIndentedComment(it.start, map.indent)) {
                        const prev = map.items[map.items.length - 2];
                        const end = prev?.value?.end;
                        if (Array.isArray(end)) {
                            Array.prototype.push.apply(end, it.start);
                            end.push(this.sourceToken);
                            map.items.pop();
                            return;
                        }
                    }
                    it.start.push(this.sourceToken);
                }
                return;
        }
        if (this.indent >= map.indent) {
            const atNextItem = !this.onKeyLine && this.indent === map.indent && it.sep;
            // For empty nodes, assign newline-separated not indented empty tokens to following node
            let start = [];
            if (atNextItem && it.sep && !it.value) {
                const nl = [];
                for (let i = 0; i < it.sep.length; ++i) {
                    const st = it.sep[i];
                    switch (st.type) {
                        case 'newline':
                            nl.push(i);
                            break;
                        case 'space':
                            break;
                        case 'comment':
                            if (st.indent > map.indent)
                                nl.length = 0;
                            break;
                        default:
                            nl.length = 0;
                    }
                }
                if (nl.length >= 2)
                    start = it.sep.splice(nl[1]);
            }
            switch (this.type) {
                case 'anchor':
                case 'tag':
                    if (atNextItem || it.value) {
                        start.push(this.sourceToken);
                        map.items.push({ start });
                        this.onKeyLine = true;
                    }
                    else if (it.sep) {
                        it.sep.push(this.sourceToken);
                    }
                    else {
                        it.start.push(this.sourceToken);
                    }
                    return;
                case 'explicit-key-ind':
                    if (!it.sep && !includesToken(it.start, 'explicit-key-ind')) {
                        it.start.push(this.sourceToken);
                    }
                    else if (atNextItem || it.value) {
                        start.push(this.sourceToken);
                        map.items.push({ start });
                    }
                    else {
                        this.stack.push({
                            type: 'block-map',
                            offset: this.offset,
                            indent: this.indent,
                            items: [{ start: [this.sourceToken] }]
                        });
                    }
                    this.onKeyLine = true;
                    return;
                case 'map-value-ind':
                    if (includesToken(it.start, 'explicit-key-ind')) {
                        if (!it.sep) {
                            if (includesToken(it.start, 'newline')) {
                                Object.assign(it, { key: null, sep: [this.sourceToken] });
                            }
                            else {
                                const start = getFirstKeyStartProps(it.start);
                                this.stack.push({
                                    type: 'block-map',
                                    offset: this.offset,
                                    indent: this.indent,
                                    items: [{ start, key: null, sep: [this.sourceToken] }]
                                });
                            }
                        }
                        else if (it.value) {
                            map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                        }
                        else if (includesToken(it.sep, 'map-value-ind')) {
                            this.stack.push({
                                type: 'block-map',
                                offset: this.offset,
                                indent: this.indent,
                                items: [{ start, key: null, sep: [this.sourceToken] }]
                            });
                        }
                        else if (isFlowToken(it.key) &&
                            !includesToken(it.sep, 'newline')) {
                            const start = getFirstKeyStartProps(it.start);
                            const key = it.key;
                            const sep = it.sep;
                            sep.push(this.sourceToken);
                            // @ts-expect-error type guard is wrong here
                            delete it.key, delete it.sep;
                            this.stack.push({
                                type: 'block-map',
                                offset: this.offset,
                                indent: this.indent,
                                items: [{ start, key, sep }]
                            });
                        }
                        else if (start.length > 0) {
                            // Not actually at next item
                            it.sep = it.sep.concat(start, this.sourceToken);
                        }
                        else {
                            it.sep.push(this.sourceToken);
                        }
                    }
                    else {
                        if (!it.sep) {
                            Object.assign(it, { key: null, sep: [this.sourceToken] });
                        }
                        else if (it.value || atNextItem) {
                            map.items.push({ start, key: null, sep: [this.sourceToken] });
                        }
                        else if (includesToken(it.sep, 'map-value-ind')) {
                            this.stack.push({
                                type: 'block-map',
                                offset: this.offset,
                                indent: this.indent,
                                items: [{ start: [], key: null, sep: [this.sourceToken] }]
                            });
                        }
                        else {
                            it.sep.push(this.sourceToken);
                        }
                    }
                    this.onKeyLine = true;
                    return;
                case 'alias':
                case 'scalar':
                case 'single-quoted-scalar':
                case 'double-quoted-scalar': {
                    const fs = this.flowScalar(this.type);
                    if (atNextItem || it.value) {
                        map.items.push({ start, key: fs, sep: [] });
                        this.onKeyLine = true;
                    }
                    else if (it.sep) {
                        this.stack.push(fs);
                    }
                    else {
                        Object.assign(it, { key: fs, sep: [] });
                        this.onKeyLine = true;
                    }
                    return;
                }
                default: {
                    const bv = this.startBlockValue(map);
                    if (bv) {
                        if (atNextItem &&
                            bv.type !== 'block-seq' &&
                            includesToken(it.start, 'explicit-key-ind')) {
                            map.items.push({ start });
                        }
                        this.stack.push(bv);
                        return;
                    }
                }
            }
        }
        yield* this.pop();
        yield* this.step();
    }
    *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
            case 'newline':
                if (it.value) {
                    const end = 'end' in it.value ? it.value.end : undefined;
                    const last = Array.isArray(end) ? end[end.length - 1] : undefined;
                    if (last?.type === 'comment')
                        end?.push(this.sourceToken);
                    else
                        seq.items.push({ start: [this.sourceToken] });
                }
                else
                    it.start.push(this.sourceToken);
                return;
            case 'space':
            case 'comment':
                if (it.value)
                    seq.items.push({ start: [this.sourceToken] });
                else {
                    if (this.atIndentedComment(it.start, seq.indent)) {
                        const prev = seq.items[seq.items.length - 2];
                        const end = prev?.value?.end;
                        if (Array.isArray(end)) {
                            Array.prototype.push.apply(end, it.start);
                            end.push(this.sourceToken);
                            seq.items.pop();
                            return;
                        }
                    }
                    it.start.push(this.sourceToken);
                }
                return;
            case 'anchor':
            case 'tag':
                if (it.value || this.indent <= seq.indent)
                    break;
                it.start.push(this.sourceToken);
                return;
            case 'seq-item-ind':
                if (this.indent !== seq.indent)
                    break;
                if (it.value || includesToken(it.start, 'seq-item-ind'))
                    seq.items.push({ start: [this.sourceToken] });
                else
                    it.start.push(this.sourceToken);
                return;
        }
        if (this.indent > seq.indent) {
            const bv = this.startBlockValue(seq);
            if (bv) {
                this.stack.push(bv);
                return;
            }
        }
        yield* this.pop();
        yield* this.step();
    }
    *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === 'flow-error-end') {
            let top;
            do {
                yield* this.pop();
                top = this.peek(1);
            } while (top && top.type === 'flow-collection');
        }
        else if (fc.end.length === 0) {
            switch (this.type) {
                case 'comma':
                case 'explicit-key-ind':
                    if (!it || it.sep)
                        fc.items.push({ start: [this.sourceToken] });
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'map-value-ind':
                    if (!it || it.value)
                        fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        Object.assign(it, { key: null, sep: [this.sourceToken] });
                    return;
                case 'space':
                case 'comment':
                case 'newline':
                case 'anchor':
                case 'tag':
                    if (!it || it.value)
                        fc.items.push({ start: [this.sourceToken] });
                    else if (it.sep)
                        it.sep.push(this.sourceToken);
                    else
                        it.start.push(this.sourceToken);
                    return;
                case 'alias':
                case 'scalar':
                case 'single-quoted-scalar':
                case 'double-quoted-scalar': {
                    const fs = this.flowScalar(this.type);
                    if (!it || it.value)
                        fc.items.push({ start: [], key: fs, sep: [] });
                    else if (it.sep)
                        this.stack.push(fs);
                    else
                        Object.assign(it, { key: fs, sep: [] });
                    return;
                }
                case 'flow-map-end':
                case 'flow-seq-end':
                    fc.end.push(this.sourceToken);
                    return;
            }
            const bv = this.startBlockValue(fc);
            /* istanbul ignore else should not happen */
            if (bv)
                this.stack.push(bv);
            else {
                yield* this.pop();
                yield* this.step();
            }
        }
        else {
            const parent = this.peek(2);
            if (parent.type === 'block-map' &&
                ((this.type === 'map-value-ind' && parent.indent === fc.indent) ||
                    (this.type === 'newline' &&
                        !parent.items[parent.items.length - 1].sep))) {
                yield* this.pop();
                yield* this.step();
            }
            else if (this.type === 'map-value-ind' &&
                parent.type !== 'flow-collection') {
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                fixFlowSeqItems(fc);
                const sep = fc.end.splice(1, fc.end.length);
                sep.push(this.sourceToken);
                const map = {
                    type: 'block-map',
                    offset: fc.offset,
                    indent: fc.indent,
                    items: [{ start, key: fc, sep }]
                };
                this.onKeyLine = true;
                this.stack[this.stack.length - 1] = map;
            }
            else {
                yield* this.lineEnd(fc);
            }
        }
    }
    flowScalar(type) {
        if (this.onNewLine) {
            let nl = this.source.indexOf('\n') + 1;
            while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf('\n', nl) + 1;
            }
        }
        return {
            type,
            offset: this.offset,
            indent: this.indent,
            source: this.source
        };
    }
    startBlockValue(parent) {
        switch (this.type) {
            case 'alias':
            case 'scalar':
            case 'single-quoted-scalar':
            case 'double-quoted-scalar':
                return this.flowScalar(this.type);
            case 'block-scalar-header':
                return {
                    type: 'block-scalar',
                    offset: this.offset,
                    indent: this.indent,
                    props: [this.sourceToken],
                    source: ''
                };
            case 'flow-map-start':
            case 'flow-seq-start':
                return {
                    type: 'flow-collection',
                    offset: this.offset,
                    indent: this.indent,
                    start: this.sourceToken,
                    items: [],
                    end: []
                };
            case 'seq-item-ind':
                return {
                    type: 'block-seq',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [this.sourceToken] }]
                };
            case 'explicit-key-ind': {
                this.onKeyLine = true;
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                start.push(this.sourceToken);
                return {
                    type: 'block-map',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start }]
                };
            }
            case 'map-value-ind': {
                this.onKeyLine = true;
                const prev = getPrevProps(parent);
                const start = getFirstKeyStartProps(prev);
                return {
                    type: 'block-map',
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                };
            }
        }
        return null;
    }
    atIndentedComment(start, indent) {
        if (this.type !== 'comment')
            return false;
        if (this.indent <= indent)
            return false;
        return start.every(st => st.type === 'newline' || st.type === 'space');
    }
    *documentEnd(docEnd) {
        if (this.type !== 'doc-mode') {
            if (docEnd.end)
                docEnd.end.push(this.sourceToken);
            else
                docEnd.end = [this.sourceToken];
            if (this.type === 'newline')
                yield* this.pop();
        }
    }
    *lineEnd(token) {
        switch (this.type) {
            case 'comma':
            case 'doc-start':
            case 'doc-end':
            case 'flow-seq-end':
            case 'flow-map-end':
            case 'map-value-ind':
                yield* this.pop();
                yield* this.step();
                break;
            case 'newline':
                this.onKeyLine = false;
            // fallthrough
            case 'space':
            case 'comment':
            default:
                // all other values are errors
                if (token.end)
                    token.end.push(this.sourceToken);
                else
                    token.end = [this.sourceToken];
                if (this.type === 'newline')
                    yield* this.pop();
        }
    }
}

exports.Parser = Parser;


/***/ }),

/***/ "./node_modules/yaml/dist/public-api.js":
/*!**********************************************!*\
  !*** ./node_modules/yaml/dist/public-api.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var composer = __webpack_require__(/*! ./compose/composer.js */ "./node_modules/yaml/dist/compose/composer.js");
var Document = __webpack_require__(/*! ./doc/Document.js */ "./node_modules/yaml/dist/doc/Document.js");
var errors = __webpack_require__(/*! ./errors.js */ "./node_modules/yaml/dist/errors.js");
var log = __webpack_require__(/*! ./log.js */ "./node_modules/yaml/dist/log.js");
var lineCounter = __webpack_require__(/*! ./parse/line-counter.js */ "./node_modules/yaml/dist/parse/line-counter.js");
var parser = __webpack_require__(/*! ./parse/parser.js */ "./node_modules/yaml/dist/parse/parser.js");

function parseOptions(options) {
    const prettyErrors = options.prettyErrors !== false;
    const lineCounter$1 = options.lineCounter || (prettyErrors && new lineCounter.LineCounter()) || null;
    return { lineCounter: lineCounter$1, prettyErrors };
}
/**
 * Parse the input as a stream of YAML documents.
 *
 * Documents should be separated from each other by `...` or `---` marker lines.
 *
 * @returns If an empty `docs` array is returned, it will be of type
 *   EmptyStream and contain additional stream information. In
 *   TypeScript, you should use `'empty' in docs` as a type guard for it.
 */
function parseAllDocuments(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter?.addNewLine);
    const composer$1 = new composer.Composer(options);
    const docs = Array.from(composer$1.compose(parser$1.parse(source)));
    if (prettyErrors && lineCounter)
        for (const doc of docs) {
            doc.errors.forEach(errors.prettifyError(source, lineCounter));
            doc.warnings.forEach(errors.prettifyError(source, lineCounter));
        }
    if (docs.length > 0)
        return docs;
    return Object.assign([], { empty: true }, composer$1.streamInfo());
}
/** Parse an input string into a single YAML.Document */
function parseDocument(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter?.addNewLine);
    const composer$1 = new composer.Composer(options);
    // `doc` is always set by compose.end(true) at the very latest
    let doc = null;
    for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
            doc = _doc;
        else if (doc.options.logLevel !== 'silent') {
            doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), 'MULTIPLE_DOCS', 'Source contains multiple documents; please use YAML.parseAllDocuments()'));
            break;
        }
    }
    if (prettyErrors && lineCounter) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter));
    }
    return doc;
}
function parse(src, reviver, options) {
    let _reviver = undefined;
    if (typeof reviver === 'function') {
        _reviver = reviver;
    }
    else if (options === undefined && reviver && typeof reviver === 'object') {
        options = reviver;
    }
    const doc = parseDocument(src, options);
    if (!doc)
        return null;
    doc.warnings.forEach(warning => log.warn(doc.options.logLevel, warning));
    if (doc.errors.length > 0) {
        if (doc.options.logLevel !== 'silent')
            throw doc.errors[0];
        else
            doc.errors = [];
    }
    return doc.toJS(Object.assign({ reviver: _reviver }, options));
}
function stringify(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === 'function' || Array.isArray(replacer)) {
        _replacer = replacer;
    }
    else if (options === undefined && replacer) {
        options = replacer;
    }
    if (typeof options === 'string')
        options = options.length;
    if (typeof options === 'number') {
        const indent = Math.round(options);
        options = indent < 1 ? undefined : indent > 8 ? { indent: 8 } : { indent };
    }
    if (value === undefined) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
            return undefined;
    }
    return new Document.Document(value, _replacer, options).toString(options);
}

exports.parse = parse;
exports.parseAllDocuments = parseAllDocuments;
exports.parseDocument = parseDocument;
exports.stringify = stringify;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/Schema.js":
/*!*************************************************!*\
  !*** ./node_modules/yaml/dist/schema/Schema.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var map = __webpack_require__(/*! ./common/map.js */ "./node_modules/yaml/dist/schema/common/map.js");
var seq = __webpack_require__(/*! ./common/seq.js */ "./node_modules/yaml/dist/schema/common/seq.js");
var string = __webpack_require__(/*! ./common/string.js */ "./node_modules/yaml/dist/schema/common/string.js");
var tags = __webpack_require__(/*! ./tags.js */ "./node_modules/yaml/dist/schema/tags.js");

const sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
class Schema {
    constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat)
            ? tags.getTags(compat, 'compat')
            : compat
                ? tags.getTags(null, compat)
                : null;
        this.merge = !!merge;
        this.name = (typeof schema === 'string' && schema) || 'core';
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        // Used by createMap()
        this.sortMapEntries =
            typeof sortMapEntries === 'function'
                ? sortMapEntries
                : sortMapEntries === true
                    ? sortMapEntriesByKey
                    : null;
    }
    clone() {
        const copy = Object.create(Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
    }
}

exports.Schema = Schema;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/common/map.js":
/*!*****************************************************!*\
  !*** ./node_modules/yaml/dist/schema/common/map.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var YAMLMap = __webpack_require__(/*! ../../nodes/YAMLMap.js */ "./node_modules/yaml/dist/nodes/YAMLMap.js");

const map = {
    collection: 'map',
    default: true,
    nodeClass: YAMLMap.YAMLMap,
    tag: 'tag:yaml.org,2002:map',
    resolve(map, onError) {
        if (!identity.isMap(map))
            onError('Expected a mapping for this tag');
        return map;
    },
    createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
};

exports.map = map;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/common/null.js":
/*!******************************************************!*\
  !*** ./node_modules/yaml/dist/schema/common/null.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");

const nullTag = {
    identify: value => value == null,
    createNode: () => new Scalar.Scalar(null),
    default: true,
    tag: 'tag:yaml.org,2002:null',
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => new Scalar.Scalar(null),
    stringify: ({ source }, ctx) => typeof source === 'string' && nullTag.test.test(source)
        ? source
        : ctx.options.nullStr
};

exports.nullTag = nullTag;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/common/seq.js":
/*!*****************************************************!*\
  !*** ./node_modules/yaml/dist/schema/common/seq.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var YAMLSeq = __webpack_require__(/*! ../../nodes/YAMLSeq.js */ "./node_modules/yaml/dist/nodes/YAMLSeq.js");

const seq = {
    collection: 'seq',
    default: true,
    nodeClass: YAMLSeq.YAMLSeq,
    tag: 'tag:yaml.org,2002:seq',
    resolve(seq, onError) {
        if (!identity.isSeq(seq))
            onError('Expected a sequence for this tag');
        return seq;
    },
    createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
};

exports.seq = seq;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/common/string.js":
/*!********************************************************!*\
  !*** ./node_modules/yaml/dist/schema/common/string.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var stringifyString = __webpack_require__(/*! ../../stringify/stringifyString.js */ "./node_modules/yaml/dist/stringify/stringifyString.js");

const string = {
    identify: value => typeof value === 'string',
    default: true,
    tag: 'tag:yaml.org,2002:str',
    resolve: str => str,
    stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
    }
};

exports.string = string;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/core/bool.js":
/*!****************************************************!*\
  !*** ./node_modules/yaml/dist/schema/core/bool.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");

const boolTag = {
    identify: value => typeof value === 'boolean',
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: str => new Scalar.Scalar(str[0] === 't' || str[0] === 'T'),
    stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
            const sv = source[0] === 't' || source[0] === 'T';
            if (value === sv)
                return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
};

exports.boolTag = boolTag;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/core/float.js":
/*!*****************************************************!*\
  !*** ./node_modules/yaml/dist/schema/core/float.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var stringifyNumber = __webpack_require__(/*! ../../stringify/stringifyNumber.js */ "./node_modules/yaml/dist/stringify/stringifyNumber.js");

const floatNaN = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^(?:[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN))$/,
    resolve: str => str.slice(-3).toLowerCase() === 'nan'
        ? NaN
        : str[0] === '-'
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
};
const floatExp = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: str => parseFloat(str),
    stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
};
const float = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
    resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf('.');
        if (dot !== -1 && str[str.length - 1] === '0')
            node.minFractionDigits = str.length - dot - 1;
        return node;
    },
    stringify: stringifyNumber.stringifyNumber
};

exports.float = float;
exports.floatExp = floatExp;
exports.floatNaN = floatNaN;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/core/int.js":
/*!***************************************************!*\
  !*** ./node_modules/yaml/dist/schema/core/int.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var stringifyNumber = __webpack_require__(/*! ../../stringify/stringifyNumber.js */ "./node_modules/yaml/dist/stringify/stringifyNumber.js");

const intIdentify = (value) => typeof value === 'bigint' || Number.isInteger(value);
const intResolve = (str, offset, radix, { intAsBigInt }) => (intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix));
function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
    return stringifyNumber.stringifyNumber(node);
}
const intOct = {
    identify: value => intIdentify(value) && value >= 0,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^0o[0-7]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
    stringify: node => intStringify(node, 8, '0o')
};
const int = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^[-+]?[0-9]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
};
const intHex = {
    identify: value => intIdentify(value) && value >= 0,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^0x[0-9a-fA-F]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: node => intStringify(node, 16, '0x')
};

exports.int = int;
exports.intHex = intHex;
exports.intOct = intOct;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/core/schema.js":
/*!******************************************************!*\
  !*** ./node_modules/yaml/dist/schema/core/schema.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var map = __webpack_require__(/*! ../common/map.js */ "./node_modules/yaml/dist/schema/common/map.js");
var _null = __webpack_require__(/*! ../common/null.js */ "./node_modules/yaml/dist/schema/common/null.js");
var seq = __webpack_require__(/*! ../common/seq.js */ "./node_modules/yaml/dist/schema/common/seq.js");
var string = __webpack_require__(/*! ../common/string.js */ "./node_modules/yaml/dist/schema/common/string.js");
var bool = __webpack_require__(/*! ./bool.js */ "./node_modules/yaml/dist/schema/core/bool.js");
var float = __webpack_require__(/*! ./float.js */ "./node_modules/yaml/dist/schema/core/float.js");
var int = __webpack_require__(/*! ./int.js */ "./node_modules/yaml/dist/schema/core/int.js");

const schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.boolTag,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float
];

exports.schema = schema;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/json/schema.js":
/*!******************************************************!*\
  !*** ./node_modules/yaml/dist/schema/json/schema.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var map = __webpack_require__(/*! ../common/map.js */ "./node_modules/yaml/dist/schema/common/map.js");
var seq = __webpack_require__(/*! ../common/seq.js */ "./node_modules/yaml/dist/schema/common/seq.js");

function intIdentify(value) {
    return typeof value === 'bigint' || Number.isInteger(value);
}
const stringifyJSON = ({ value }) => JSON.stringify(value);
const jsonScalars = [
    {
        identify: value => typeof value === 'string',
        default: true,
        tag: 'tag:yaml.org,2002:str',
        resolve: str => str,
        stringify: stringifyJSON
    },
    {
        identify: value => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: 'tag:yaml.org,2002:null',
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
    },
    {
        identify: value => typeof value === 'boolean',
        default: true,
        tag: 'tag:yaml.org,2002:bool',
        test: /^true|false$/,
        resolve: str => str === 'true',
        stringify: stringifyJSON
    },
    {
        identify: intIdentify,
        default: true,
        tag: 'tag:yaml.org,2002:int',
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
    },
    {
        identify: value => typeof value === 'number',
        default: true,
        tag: 'tag:yaml.org,2002:float',
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: str => parseFloat(str),
        stringify: stringifyJSON
    }
];
const jsonError = {
    default: true,
    tag: '',
    test: /^/,
    resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
    }
};
const schema = [map.map, seq.seq].concat(jsonScalars, jsonError);

exports.schema = schema;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/tags.js":
/*!***********************************************!*\
  !*** ./node_modules/yaml/dist/schema/tags.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var map = __webpack_require__(/*! ./common/map.js */ "./node_modules/yaml/dist/schema/common/map.js");
var _null = __webpack_require__(/*! ./common/null.js */ "./node_modules/yaml/dist/schema/common/null.js");
var seq = __webpack_require__(/*! ./common/seq.js */ "./node_modules/yaml/dist/schema/common/seq.js");
var string = __webpack_require__(/*! ./common/string.js */ "./node_modules/yaml/dist/schema/common/string.js");
var bool = __webpack_require__(/*! ./core/bool.js */ "./node_modules/yaml/dist/schema/core/bool.js");
var float = __webpack_require__(/*! ./core/float.js */ "./node_modules/yaml/dist/schema/core/float.js");
var int = __webpack_require__(/*! ./core/int.js */ "./node_modules/yaml/dist/schema/core/int.js");
var schema = __webpack_require__(/*! ./core/schema.js */ "./node_modules/yaml/dist/schema/core/schema.js");
var schema$1 = __webpack_require__(/*! ./json/schema.js */ "./node_modules/yaml/dist/schema/json/schema.js");
var binary = __webpack_require__(/*! ./yaml-1.1/binary.js */ "./node_modules/yaml/dist/schema/yaml-1.1/binary.js");
var omap = __webpack_require__(/*! ./yaml-1.1/omap.js */ "./node_modules/yaml/dist/schema/yaml-1.1/omap.js");
var pairs = __webpack_require__(/*! ./yaml-1.1/pairs.js */ "./node_modules/yaml/dist/schema/yaml-1.1/pairs.js");
var schema$2 = __webpack_require__(/*! ./yaml-1.1/schema.js */ "./node_modules/yaml/dist/schema/yaml-1.1/schema.js");
var set = __webpack_require__(/*! ./yaml-1.1/set.js */ "./node_modules/yaml/dist/schema/yaml-1.1/set.js");
var timestamp = __webpack_require__(/*! ./yaml-1.1/timestamp.js */ "./node_modules/yaml/dist/schema/yaml-1.1/timestamp.js");

const schemas = new Map([
    ['core', schema.schema],
    ['failsafe', [map.map, seq.seq, string.string]],
    ['json', schema$1.schema],
    ['yaml11', schema$2.schema],
    ['yaml-1.1', schema$2.schema]
]);
const tagsByName = {
    binary: binary.binary,
    bool: bool.boolTag,
    float: float.float,
    floatExp: float.floatExp,
    floatNaN: float.floatNaN,
    floatTime: timestamp.floatTime,
    int: int.int,
    intHex: int.intHex,
    intOct: int.intOct,
    intTime: timestamp.intTime,
    map: map.map,
    null: _null.nullTag,
    omap: omap.omap,
    pairs: pairs.pairs,
    seq: seq.seq,
    set: set.set,
    timestamp: timestamp.timestamp
};
const coreKnownTags = {
    'tag:yaml.org,2002:binary': binary.binary,
    'tag:yaml.org,2002:omap': omap.omap,
    'tag:yaml.org,2002:pairs': pairs.pairs,
    'tag:yaml.org,2002:set': set.set,
    'tag:yaml.org,2002:timestamp': timestamp.timestamp
};
function getTags(customTags, schemaName) {
    let tags = schemas.get(schemaName);
    if (!tags) {
        if (Array.isArray(customTags))
            tags = [];
        else {
            const keys = Array.from(schemas.keys())
                .filter(key => key !== 'yaml11')
                .map(key => JSON.stringify(key))
                .join(', ');
            throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
    }
    if (Array.isArray(customTags)) {
        for (const tag of customTags)
            tags = tags.concat(tag);
    }
    else if (typeof customTags === 'function') {
        tags = customTags(tags.slice());
    }
    return tags.map(tag => {
        if (typeof tag !== 'string')
            return tag;
        const tagObj = tagsByName[tag];
        if (tagObj)
            return tagObj;
        const keys = Object.keys(tagsByName)
            .map(key => JSON.stringify(key))
            .join(', ');
        throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
    });
}

exports.coreKnownTags = coreKnownTags;
exports.getTags = getTags;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/binary.js":
/*!**********************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/binary.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var stringifyString = __webpack_require__(/*! ../../stringify/stringifyString.js */ "./node_modules/yaml/dist/stringify/stringifyString.js");

const binary = {
    identify: value => value instanceof Uint8Array,
    default: false,
    tag: 'tag:yaml.org,2002:binary',
    /**
     * Returns a Buffer in node and an Uint8Array in browsers
     *
     * To use the resulting buffer as an image, you'll want to do something like:
     *
     *   const blob = new Blob([buffer], { type: 'image/jpeg' })
     *   document.querySelector('#photo').src = URL.createObjectURL(blob)
     */
    resolve(src, onError) {
        if (typeof Buffer === 'function') {
            return Buffer.from(src, 'base64');
        }
        else if (typeof atob === 'function') {
            // On IE 11, atob() can't handle newlines
            const str = atob(src.replace(/[\n\r]/g, ''));
            const buffer = new Uint8Array(str.length);
            for (let i = 0; i < str.length; ++i)
                buffer[i] = str.charCodeAt(i);
            return buffer;
        }
        else {
            onError('This environment does not support reading binary tags; either Buffer or atob is required');
            return src;
        }
    },
    stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        const buf = value; // checked earlier by binary.identify()
        let str;
        if (typeof Buffer === 'function') {
            str =
                buf instanceof Buffer
                    ? buf.toString('base64')
                    : Buffer.from(buf.buffer).toString('base64');
        }
        else if (typeof btoa === 'function') {
            let s = '';
            for (let i = 0; i < buf.length; ++i)
                s += String.fromCharCode(buf[i]);
            str = btoa(s);
        }
        else {
            throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
        }
        if (!type)
            type = Scalar.Scalar.BLOCK_LITERAL;
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
            const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
            const n = Math.ceil(str.length / lineWidth);
            const lines = new Array(n);
            for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
                lines[i] = str.substr(o, lineWidth);
            }
            str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? '\n' : ' ');
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
    }
};

exports.binary = binary;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/bool.js":
/*!********************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/bool.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");

function boolStringify({ value, source }, ctx) {
    const boolObj = value ? trueTag : falseTag;
    if (source && boolObj.test.test(source))
        return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
}
const trueTag = {
    identify: value => value === true,
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => new Scalar.Scalar(true),
    stringify: boolStringify
};
const falseTag = {
    identify: value => value === false,
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
    resolve: () => new Scalar.Scalar(false),
    stringify: boolStringify
};

exports.falseTag = falseTag;
exports.trueTag = trueTag;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/float.js":
/*!*********************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/float.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var stringifyNumber = __webpack_require__(/*! ../../stringify/stringifyNumber.js */ "./node_modules/yaml/dist/stringify/stringifyNumber.js");

const floatNaN = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?\.(?:inf|Inf|INF|nan|NaN|NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === 'nan'
        ? NaN
        : str[0] === '-'
            ? Number.NEGATIVE_INFINITY
            : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
};
const floatExp = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, '')),
    stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
};
const float = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
    resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, '')));
        const dot = str.indexOf('.');
        if (dot !== -1) {
            const f = str.substring(dot + 1).replace(/_/g, '');
            if (f[f.length - 1] === '0')
                node.minFractionDigits = f.length;
        }
        return node;
    },
    stringify: stringifyNumber.stringifyNumber
};

exports.float = float;
exports.floatExp = floatExp;
exports.floatNaN = floatNaN;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/int.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/int.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var stringifyNumber = __webpack_require__(/*! ../../stringify/stringifyNumber.js */ "./node_modules/yaml/dist/stringify/stringifyNumber.js");

const intIdentify = (value) => typeof value === 'bigint' || Number.isInteger(value);
function intResolve(str, offset, radix, { intAsBigInt }) {
    const sign = str[0];
    if (sign === '-' || sign === '+')
        offset += 1;
    str = str.substring(offset).replace(/_/g, '');
    if (intAsBigInt) {
        switch (radix) {
            case 2:
                str = `0b${str}`;
                break;
            case 8:
                str = `0o${str}`;
                break;
            case 16:
                str = `0x${str}`;
                break;
        }
        const n = BigInt(str);
        return sign === '-' ? BigInt(-1) * n : n;
    }
    const n = parseInt(str, radix);
    return sign === '-' ? -1 * n : n;
}
function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber.stringifyNumber(node);
}
const intBin = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'BIN',
    test: /^[-+]?0b[0-1_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
    stringify: node => intStringify(node, 2, '0b')
};
const intOct = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^[-+]?0[0-7_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
    stringify: node => intStringify(node, 8, '0')
};
const int = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^[-+]?[0-9][0-9_]*$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
};
const intHex = {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^[-+]?0x[0-9a-fA-F_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: node => intStringify(node, 16, '0x')
};

exports.int = int;
exports.intBin = intBin;
exports.intHex = intHex;
exports.intOct = intOct;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/omap.js":
/*!********************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/omap.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var toJS = __webpack_require__(/*! ../../nodes/toJS.js */ "./node_modules/yaml/dist/nodes/toJS.js");
var YAMLMap = __webpack_require__(/*! ../../nodes/YAMLMap.js */ "./node_modules/yaml/dist/nodes/YAMLMap.js");
var YAMLSeq = __webpack_require__(/*! ../../nodes/YAMLSeq.js */ "./node_modules/yaml/dist/nodes/YAMLSeq.js");
var pairs = __webpack_require__(/*! ./pairs.js */ "./node_modules/yaml/dist/schema/yaml-1.1/pairs.js");

class YAMLOMap extends YAMLSeq.YAMLSeq {
    constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = YAMLOMap.tag;
    }
    /**
     * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
     * but TypeScript won't allow widening the signature of a child method.
     */
    toJSON(_, ctx) {
        if (!ctx)
            return super.toJSON(_);
        const map = new Map();
        if (ctx?.onCreate)
            ctx.onCreate(map);
        for (const pair of this.items) {
            let key, value;
            if (identity.isPair(pair)) {
                key = toJS.toJS(pair.key, '', ctx);
                value = toJS.toJS(pair.value, key, ctx);
            }
            else {
                key = toJS.toJS(pair, '', ctx);
            }
            if (map.has(key))
                throw new Error('Ordered maps must not include duplicate keys');
            map.set(key, value);
        }
        return map;
    }
    static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap = new this();
        omap.items = pairs$1.items;
        return omap;
    }
}
YAMLOMap.tag = 'tag:yaml.org,2002:omap';
const omap = {
    collection: 'seq',
    identify: value => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: 'tag:yaml.org,2002:omap',
    resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
            if (identity.isScalar(key)) {
                if (seenKeys.includes(key.value)) {
                    onError(`Ordered maps must not include duplicate keys: ${key.value}`);
                }
                else {
                    seenKeys.push(key.value);
                }
            }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
    },
    createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
};

exports.YAMLOMap = YAMLOMap;
exports.omap = omap;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/pairs.js":
/*!*********************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/pairs.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Pair = __webpack_require__(/*! ../../nodes/Pair.js */ "./node_modules/yaml/dist/nodes/Pair.js");
var Scalar = __webpack_require__(/*! ../../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var YAMLSeq = __webpack_require__(/*! ../../nodes/YAMLSeq.js */ "./node_modules/yaml/dist/nodes/YAMLSeq.js");

function resolvePairs(seq, onError) {
    if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
            let item = seq.items[i];
            if (identity.isPair(item))
                continue;
            else if (identity.isMap(item)) {
                if (item.items.length > 1)
                    onError('Each pair must have its own sequence indicator');
                const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
                if (item.commentBefore)
                    pair.key.commentBefore = pair.key.commentBefore
                        ? `${item.commentBefore}\n${pair.key.commentBefore}`
                        : item.commentBefore;
                if (item.comment) {
                    const cn = pair.value ?? pair.key;
                    cn.comment = cn.comment
                        ? `${item.comment}\n${cn.comment}`
                        : item.comment;
                }
                item = pair;
            }
            seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
    }
    else
        onError('Expected a sequence for this tag');
    return seq;
}
function createPairs(schema, iterable, ctx) {
    const { replacer } = ctx;
    const pairs = new YAMLSeq.YAMLSeq(schema);
    pairs.tag = 'tag:yaml.org,2002:pairs';
    let i = 0;
    if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
            if (typeof replacer === 'function')
                it = replacer.call(iterable, String(i++), it);
            let key, value;
            if (Array.isArray(it)) {
                if (it.length === 2) {
                    key = it[0];
                    value = it[1];
                }
                else
                    throw new TypeError(`Expected [key, value] tuple: ${it}`);
            }
            else if (it && it instanceof Object) {
                const keys = Object.keys(it);
                if (keys.length === 1) {
                    key = keys[0];
                    value = it[key];
                }
                else {
                    throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
                }
            }
            else {
                key = it;
            }
            pairs.items.push(Pair.createPair(key, value, ctx));
        }
    return pairs;
}
const pairs = {
    collection: 'seq',
    default: false,
    tag: 'tag:yaml.org,2002:pairs',
    resolve: resolvePairs,
    createNode: createPairs
};

exports.createPairs = createPairs;
exports.pairs = pairs;
exports.resolvePairs = resolvePairs;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/schema.js":
/*!**********************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/schema.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var map = __webpack_require__(/*! ../common/map.js */ "./node_modules/yaml/dist/schema/common/map.js");
var _null = __webpack_require__(/*! ../common/null.js */ "./node_modules/yaml/dist/schema/common/null.js");
var seq = __webpack_require__(/*! ../common/seq.js */ "./node_modules/yaml/dist/schema/common/seq.js");
var string = __webpack_require__(/*! ../common/string.js */ "./node_modules/yaml/dist/schema/common/string.js");
var binary = __webpack_require__(/*! ./binary.js */ "./node_modules/yaml/dist/schema/yaml-1.1/binary.js");
var bool = __webpack_require__(/*! ./bool.js */ "./node_modules/yaml/dist/schema/yaml-1.1/bool.js");
var float = __webpack_require__(/*! ./float.js */ "./node_modules/yaml/dist/schema/yaml-1.1/float.js");
var int = __webpack_require__(/*! ./int.js */ "./node_modules/yaml/dist/schema/yaml-1.1/int.js");
var omap = __webpack_require__(/*! ./omap.js */ "./node_modules/yaml/dist/schema/yaml-1.1/omap.js");
var pairs = __webpack_require__(/*! ./pairs.js */ "./node_modules/yaml/dist/schema/yaml-1.1/pairs.js");
var set = __webpack_require__(/*! ./set.js */ "./node_modules/yaml/dist/schema/yaml-1.1/set.js");
var timestamp = __webpack_require__(/*! ./timestamp.js */ "./node_modules/yaml/dist/schema/yaml-1.1/timestamp.js");

const schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.trueTag,
    bool.falseTag,
    int.intBin,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float,
    binary.binary,
    omap.omap,
    pairs.pairs,
    set.set,
    timestamp.intTime,
    timestamp.floatTime,
    timestamp.timestamp
];

exports.schema = schema;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/set.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/set.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Pair = __webpack_require__(/*! ../../nodes/Pair.js */ "./node_modules/yaml/dist/nodes/Pair.js");
var YAMLMap = __webpack_require__(/*! ../../nodes/YAMLMap.js */ "./node_modules/yaml/dist/nodes/YAMLMap.js");

class YAMLSet extends YAMLMap.YAMLMap {
    constructor(schema) {
        super(schema);
        this.tag = YAMLSet.tag;
    }
    add(key) {
        let pair;
        if (identity.isPair(key))
            pair = key;
        else if (key &&
            typeof key === 'object' &&
            'key' in key &&
            'value' in key &&
            key.value === null)
            pair = new Pair.Pair(key.key, null);
        else
            pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
            this.items.push(pair);
    }
    /**
     * If `keepPair` is `true`, returns the Pair matching `key`.
     * Otherwise, returns the value of that Pair's key.
     */
    get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair)
            ? identity.isScalar(pair.key)
                ? pair.key.value
                : pair.key
            : pair;
    }
    set(key, value) {
        if (typeof value !== 'boolean')
            throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
            this.items.splice(this.items.indexOf(prev), 1);
        }
        else if (!prev && value) {
            this.items.push(new Pair.Pair(key));
        }
    }
    toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
        if (!ctx)
            return JSON.stringify(this);
        if (this.hasAllNullValues(true))
            return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
            throw new Error('Set items must all have null values');
    }
    static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
            for (let value of iterable) {
                if (typeof replacer === 'function')
                    value = replacer.call(iterable, value, value);
                set.items.push(Pair.createPair(value, null, ctx));
            }
        return set;
    }
}
YAMLSet.tag = 'tag:yaml.org,2002:set';
const set = {
    collection: 'map',
    identify: value => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: 'tag:yaml.org,2002:set',
    createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
    resolve(map, onError) {
        if (identity.isMap(map)) {
            if (map.hasAllNullValues(true))
                return Object.assign(new YAMLSet(), map);
            else
                onError('Set items must all have null values');
        }
        else
            onError('Expected a mapping for this tag');
        return map;
    }
};

exports.YAMLSet = YAMLSet;
exports.set = set;


/***/ }),

/***/ "./node_modules/yaml/dist/schema/yaml-1.1/timestamp.js":
/*!*************************************************************!*\
  !*** ./node_modules/yaml/dist/schema/yaml-1.1/timestamp.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var stringifyNumber = __webpack_require__(/*! ../../stringify/stringifyNumber.js */ "./node_modules/yaml/dist/stringify/stringifyNumber.js");

/** Internal types handle bigint as number, because TS can't figure it out. */
function parseSexagesimal(str, asBigInt) {
    const sign = str[0];
    const parts = sign === '-' || sign === '+' ? str.substring(1) : str;
    const num = (n) => asBigInt ? BigInt(n) : Number(n);
    const res = parts
        .replace(/_/g, '')
        .split(':')
        .reduce((res, p) => res * num(60) + num(p), num(0));
    return (sign === '-' ? num(-1) * res : res);
}
/**
 * hhhh:mm:ss.sss
 *
 * Internal types handle bigint as number, because TS can't figure it out.
 */
function stringifySexagesimal(node) {
    let { value } = node;
    let num = (n) => n;
    if (typeof value === 'bigint')
        num = n => BigInt(n);
    else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
    let sign = '';
    if (value < 0) {
        sign = '-';
        value *= num(-1);
    }
    const _60 = num(60);
    const parts = [value % _60]; // seconds, including ms
    if (value < 60) {
        parts.unshift(0); // at least one : is required
    }
    else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60); // minutes
        if (value >= 60) {
            value = (value - parts[0]) / _60;
            parts.unshift(value); // hours
        }
    }
    return (sign +
        parts
            .map(n => String(n).padStart(2, '0'))
            .join(':')
            .replace(/000000\d*$/, '') // % 60 may introduce error
    );
}
const intTime = {
    identify: value => typeof value === 'bigint' || Number.isInteger(value),
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'TIME',
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
    resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
    stringify: stringifySexagesimal
};
const floatTime = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'TIME',
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
    resolve: str => parseSexagesimal(str, false),
    stringify: stringifySexagesimal
};
const timestamp = {
    identify: value => value instanceof Date,
    default: true,
    tag: 'tag:yaml.org,2002:timestamp',
    // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
    // may be omitted altogether, resulting in a date format. In such a case, the time part is
    // assumed to be 00:00:00Z (start of day, UTC).
    test: RegExp('^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
        '(?:' + // time is optional
        '(?:t|T|[ \\t]+)' + // t | T | whitespace
        '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
        '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
        ')?$'),
    resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
            throw new Error('!!timestamp expects a date, starting with yyyy-mm-dd');
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + '00').substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== 'Z') {
            let d = parseSexagesimal(tz, false);
            if (Math.abs(d) < 30)
                d *= 60;
            date -= 60000 * d;
        }
        return new Date(date);
    },
    stringify: ({ value }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
};

exports.floatTime = floatTime;
exports.intTime = intTime;
exports.timestamp = timestamp;


/***/ }),

/***/ "./node_modules/yaml/dist/stringify/foldFlowLines.js":
/*!***********************************************************!*\
  !*** ./node_modules/yaml/dist/stringify/foldFlowLines.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


const FOLD_FLOW = 'flow';
const FOLD_BLOCK = 'block';
const FOLD_QUOTED = 'quoted';
/**
 * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
 * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
 * terminated with `\n` and started with `indent`.
 */
function foldFlowLines(text, indent, mode = 'flow', { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth || lineWidth < 0)
        return text;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
        return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;
    if (typeof indentAtStart === 'number') {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
            folds.push(0);
        else
            end = lineWidth - indentAtStart;
    }
    let split = undefined;
    let prev = undefined;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i);
        if (i !== -1)
            end = i + endStep;
    }
    for (let ch; (ch = text[(i += 1)]);) {
        if (mode === FOLD_QUOTED && ch === '\\') {
            escStart = i;
            switch (text[i + 1]) {
                case 'x':
                    i += 3;
                    break;
                case 'u':
                    i += 5;
                    break;
                case 'U':
                    i += 9;
                    break;
                default:
                    i += 1;
            }
            escEnd = i;
        }
        if (ch === '\n') {
            if (mode === FOLD_BLOCK)
                i = consumeMoreIndentedLines(text, i);
            end = i + endStep;
            split = undefined;
        }
        else {
            if (ch === ' ' &&
                prev &&
                prev !== ' ' &&
                prev !== '\n' &&
                prev !== '\t') {
                // space surrounded by non-space can be replaced with newline + indent
                const next = text[i + 1];
                if (next && next !== ' ' && next !== '\n' && next !== '\t')
                    split = i;
            }
            if (i >= end) {
                if (split) {
                    folds.push(split);
                    end = split + endStep;
                    split = undefined;
                }
                else if (mode === FOLD_QUOTED) {
                    // white-space collected at end may stretch past lineWidth
                    while (prev === ' ' || prev === '\t') {
                        prev = ch;
                        ch = text[(i += 1)];
                        overflow = true;
                    }
                    // Account for newline escape, but don't break preceding escape
                    const j = i > escEnd + 1 ? i - 2 : escStart - 1;
                    // Bail out if lineWidth & minContentWidth are shorter than an escape string
                    if (escapedFolds[j])
                        return text;
                    folds.push(j);
                    escapedFolds[j] = true;
                    end = j + endStep;
                    split = undefined;
                }
                else {
                    overflow = true;
                }
            }
        }
        prev = ch;
    }
    if (overflow && onOverflow)
        onOverflow();
    if (folds.length === 0)
        return text;
    if (onFold)
        onFold();
    let res = text.slice(0, folds[0]);
    for (let i = 0; i < folds.length; ++i) {
        const fold = folds[i];
        const end = folds[i + 1] || text.length;
        if (fold === 0)
            res = `\n${indent}${text.slice(0, end)}`;
        else {
            if (mode === FOLD_QUOTED && escapedFolds[fold])
                res += `${text[fold]}\\`;
            res += `\n${indent}${text.slice(fold + 1, end)}`;
        }
    }
    return res;
}
/**
 * Presumes `i + 1` is at the start of a line
 * @returns index of last newline in more-indented block
 */
function consumeMoreIndentedLines(text, i) {
    let ch = text[i + 1];
    while (ch === ' ' || ch === '\t') {
        do {
            ch = text[(i += 1)];
        } while (ch && ch !== '\n');
        ch = text[i + 1];
    }
    return i;
}

exports.FOLD_BLOCK = FOLD_BLOCK;
exports.FOLD_FLOW = FOLD_FLOW;
exports.FOLD_QUOTED = FOLD_QUOTED;
exports.foldFlowLines = foldFlowLines;


/***/ }),

/***/ "./node_modules/yaml/dist/stringify/stringify.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/stringify/stringify.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var anchors = __webpack_require__(/*! ../doc/anchors.js */ "./node_modules/yaml/dist/doc/anchors.js");
var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var stringifyComment = __webpack_require__(/*! ./stringifyComment.js */ "./node_modules/yaml/dist/stringify/stringifyComment.js");
var stringifyString = __webpack_require__(/*! ./stringifyString.js */ "./node_modules/yaml/dist/stringify/stringifyString.js");

function createStringifyContext(doc, options) {
    const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: 'PLAIN',
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: 'false',
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: 'null',
        simpleKeys: false,
        singleQuote: null,
        trueStr: 'true',
        verifyAliasOrder: true
    }, doc.schema.toStringOptions, options);
    let inFlow;
    switch (opt.collectionStyle) {
        case 'block':
            inFlow = false;
            break;
        case 'flow':
            inFlow = true;
            break;
        default:
            inFlow = null;
    }
    return {
        anchors: new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? ' ' : '',
        indent: '',
        indentStep: typeof opt.indent === 'number' ? ' '.repeat(opt.indent) : '  ',
        inFlow,
        options: opt
    };
}
function getTagObject(tags, item) {
    if (item.tag) {
        const match = tags.filter(t => t.tag === item.tag);
        if (match.length > 0)
            return match.find(t => t.format === item.format) ?? match[0];
    }
    let tagObj = undefined;
    let obj;
    if (identity.isScalar(item)) {
        obj = item.value;
        const match = tags.filter(t => t.identify?.(obj));
        tagObj =
            match.find(t => t.format === item.format) ?? match.find(t => !t.format);
    }
    else {
        obj = item;
        tagObj = tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
        const name = obj?.constructor?.name ?? typeof obj;
        throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
}
// needs to be called before value stringifier to allow for circular anchor refs
function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
    if (!doc.directives)
        return '';
    const props = [];
    const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
    if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
    }
    const tag = node.tag ? node.tag : tagObj.default ? null : tagObj.tag;
    if (tag)
        props.push(doc.directives.tagString(tag));
    return props.join(' ');
}
function stringify(item, ctx, onComment, onChompKeep) {
    if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
    if (identity.isAlias(item)) {
        if (ctx.doc.directives)
            return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
            throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        }
        else {
            if (ctx.resolvedAliases)
                ctx.resolvedAliases.add(item);
            else
                ctx.resolvedAliases = new Set([item]);
            item = item.resolve(ctx.doc);
        }
    }
    let tagObj = undefined;
    const node = identity.isNode(item)
        ? item
        : ctx.doc.createNode(item, { onTagObj: o => (tagObj = o) });
    if (!tagObj)
        tagObj = getTagObject(ctx.doc.schema.tags, node);
    const props = stringifyProps(node, tagObj, ctx);
    if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
    const str = typeof tagObj.stringify === 'function'
        ? tagObj.stringify(node, ctx, onComment, onChompKeep)
        : identity.isScalar(node)
            ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep)
            : node.toString(ctx, onComment, onChompKeep);
    if (!props)
        return str;
    return identity.isScalar(node) || str[0] === '{' || str[0] === '['
        ? `${props} ${str}`
        : `${props}\n${ctx.indent}${str}`;
}

exports.createStringifyContext = createStringifyContext;
exports.stringify = stringify;


/***/ }),

/***/ "./node_modules/yaml/dist/stringify/stringifyCollection.js":
/*!*****************************************************************!*\
  !*** ./node_modules/yaml/dist/stringify/stringifyCollection.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Collection = __webpack_require__(/*! ../nodes/Collection.js */ "./node_modules/yaml/dist/nodes/Collection.js");
var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var stringify = __webpack_require__(/*! ./stringify.js */ "./node_modules/yaml/dist/stringify/stringify.js");
var stringifyComment = __webpack_require__(/*! ./stringifyComment.js */ "./node_modules/yaml/dist/stringify/stringifyComment.js");

function stringifyCollection(collection, ctx, options) {
    const flow = ctx.inFlow ?? collection.flow;
    const stringify = flow ? stringifyFlowCollection : stringifyBlockCollection;
    return stringify(collection, ctx, options);
}
function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
    const { indent, options: { commentString } } = ctx;
    const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
    let chompKeep = false; // flag for the preceding node's status
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
            if (!chompKeep && item.spaceBefore)
                lines.push('');
            addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
            if (item.comment)
                comment = item.comment;
        }
        else if (identity.isPair(item)) {
            const ik = identity.isNode(item.key) ? item.key : null;
            if (ik) {
                if (!chompKeep && ik.spaceBefore)
                    lines.push('');
                addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
            }
        }
        chompKeep = false;
        let str = stringify.stringify(item, itemCtx, () => (comment = null), () => (chompKeep = true));
        if (comment)
            str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        if (chompKeep && comment)
            chompKeep = false;
        lines.push(blockItemPrefix + str);
    }
    let str;
    if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
    }
    else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
            const line = lines[i];
            str += line ? `\n${indent}${line}` : '\n';
        }
    }
    if (comment) {
        str += '\n' + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
            onComment();
    }
    else if (chompKeep && onChompKeep)
        onChompKeep();
    return str;
}
function stringifyFlowCollection({ comment, items }, ctx, { flowChars, itemIndent, onComment }) {
    const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
    itemIndent += indentStep;
    const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
    });
    let reqNewline = false;
    let linesAtValue = 0;
    const lines = [];
    for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
            if (item.spaceBefore)
                lines.push('');
            addCommentBefore(ctx, lines, item.commentBefore, false);
            if (item.comment)
                comment = item.comment;
        }
        else if (identity.isPair(item)) {
            const ik = identity.isNode(item.key) ? item.key : null;
            if (ik) {
                if (ik.spaceBefore)
                    lines.push('');
                addCommentBefore(ctx, lines, ik.commentBefore, false);
                if (ik.comment)
                    reqNewline = true;
            }
            const iv = identity.isNode(item.value) ? item.value : null;
            if (iv) {
                if (iv.comment)
                    comment = iv.comment;
                if (iv.commentBefore)
                    reqNewline = true;
            }
            else if (item.value == null && ik?.comment) {
                comment = ik.comment;
            }
        }
        if (comment)
            reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => (comment = null));
        if (i < items.length - 1)
            str += ',';
        if (comment)
            str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        if (!reqNewline && (lines.length > linesAtValue || str.includes('\n')))
            reqNewline = true;
        lines.push(str);
        linesAtValue = lines.length;
    }
    let str;
    const { start, end } = flowChars;
    if (lines.length === 0) {
        str = start + end;
    }
    else {
        if (!reqNewline) {
            const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
            reqNewline = len > Collection.Collection.maxFlowStringSingleLineLength;
        }
        if (reqNewline) {
            str = start;
            for (const line of lines)
                str += line ? `\n${indentStep}${indent}${line}` : '\n';
            str += `\n${indent}${end}`;
        }
        else {
            str = `${start}${fcPadding}${lines.join(' ')}${fcPadding}${end}`;
        }
    }
    if (comment) {
        str += stringifyComment.lineComment(str, indent, commentString(comment));
        if (onComment)
            onComment();
    }
    return str;
}
function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
    if (comment && chompKeep)
        comment = comment.replace(/^\n+/, '');
    if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart()); // Avoid double indent on first line
    }
}

exports.stringifyCollection = stringifyCollection;


/***/ }),

/***/ "./node_modules/yaml/dist/stringify/stringifyComment.js":
/*!**************************************************************!*\
  !*** ./node_modules/yaml/dist/stringify/stringifyComment.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Stringifies a comment.
 *
 * Empty comment lines are left empty,
 * lines consisting of a single space are replaced by `#`,
 * and all other lines are prefixed with a `#`.
 */
const stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, '#');
function indentComment(comment, indent) {
    if (/^\n+$/.test(comment))
        return comment.substring(1);
    return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
}
const lineComment = (str, indent, comment) => str.endsWith('\n')
    ? indentComment(comment, indent)
    : comment.includes('\n')
        ? '\n' + indentComment(comment, indent)
        : (str.endsWith(' ') ? '' : ' ') + comment;

exports.indentComment = indentComment;
exports.lineComment = lineComment;
exports.stringifyComment = stringifyComment;


/***/ }),

/***/ "./node_modules/yaml/dist/stringify/stringifyDocument.js":
/*!***************************************************************!*\
  !*** ./node_modules/yaml/dist/stringify/stringifyDocument.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var stringify = __webpack_require__(/*! ./stringify.js */ "./node_modules/yaml/dist/stringify/stringify.js");
var stringifyComment = __webpack_require__(/*! ./stringifyComment.js */ "./node_modules/yaml/dist/stringify/stringifyComment.js");

function stringifyDocument(doc, options) {
    const lines = [];
    let hasDirectives = options.directives === true;
    if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
            lines.push(dir);
            hasDirectives = true;
        }
        else if (doc.directives.docStart)
            hasDirectives = true;
    }
    if (hasDirectives)
        lines.push('---');
    const ctx = stringify.createStringifyContext(doc, options);
    const { commentString } = ctx.options;
    if (doc.commentBefore) {
        if (lines.length !== 1)
            lines.unshift('');
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ''));
    }
    let chompKeep = false;
    let contentComment = null;
    if (doc.contents) {
        if (identity.isNode(doc.contents)) {
            if (doc.contents.spaceBefore && hasDirectives)
                lines.push('');
            if (doc.contents.commentBefore) {
                const cs = commentString(doc.contents.commentBefore);
                lines.push(stringifyComment.indentComment(cs, ''));
            }
            // top-level block scalars need to be indented if followed by a comment
            ctx.forceBlockIndent = !!doc.comment;
            contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? undefined : () => (chompKeep = true);
        let body = stringify.stringify(doc.contents, ctx, () => (contentComment = null), onChompKeep);
        if (contentComment)
            body += stringifyComment.lineComment(body, '', commentString(contentComment));
        if ((body[0] === '|' || body[0] === '>') &&
            lines[lines.length - 1] === '---') {
            // Top-level block scalars with a preceding doc marker ought to use the
            // same line for their header.
            lines[lines.length - 1] = `--- ${body}`;
        }
        else
            lines.push(body);
    }
    else {
        lines.push(stringify.stringify(doc.contents, ctx));
    }
    if (doc.directives?.docEnd) {
        if (doc.comment) {
            const cs = commentString(doc.comment);
            if (cs.includes('\n')) {
                lines.push('...');
                lines.push(stringifyComment.indentComment(cs, ''));
            }
            else {
                lines.push(`... ${cs}`);
            }
        }
        else {
            lines.push('...');
        }
    }
    else {
        let dc = doc.comment;
        if (dc && chompKeep)
            dc = dc.replace(/^\n+/, '');
        if (dc) {
            if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '')
                lines.push('');
            lines.push(stringifyComment.indentComment(commentString(dc), ''));
        }
    }
    return lines.join('\n') + '\n';
}

exports.stringifyDocument = stringifyDocument;


/***/ }),

/***/ "./node_modules/yaml/dist/stringify/stringifyNumber.js":
/*!*************************************************************!*\
  !*** ./node_modules/yaml/dist/stringify/stringifyNumber.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function stringifyNumber({ format, minFractionDigits, tag, value }) {
    if (typeof value === 'bigint')
        return String(value);
    const num = typeof value === 'number' ? value : Number(value);
    if (!isFinite(num))
        return isNaN(num) ? '.nan' : num < 0 ? '-.inf' : '.inf';
    let n = JSON.stringify(value);
    if (!format &&
        minFractionDigits &&
        (!tag || tag === 'tag:yaml.org,2002:float') &&
        /^\d/.test(n)) {
        let i = n.indexOf('.');
        if (i < 0) {
            i = n.length;
            n += '.';
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
            n += '0';
    }
    return n;
}

exports.stringifyNumber = stringifyNumber;


/***/ }),

/***/ "./node_modules/yaml/dist/stringify/stringifyPair.js":
/*!***********************************************************!*\
  !*** ./node_modules/yaml/dist/stringify/stringifyPair.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ../nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");
var Scalar = __webpack_require__(/*! ../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var stringify = __webpack_require__(/*! ./stringify.js */ "./node_modules/yaml/dist/stringify/stringify.js");
var stringifyComment = __webpack_require__(/*! ./stringifyComment.js */ "./node_modules/yaml/dist/stringify/stringifyComment.js");

function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
    const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
    let keyComment = (identity.isNode(key) && key.comment) || null;
    if (simpleKeys) {
        if (keyComment) {
            throw new Error('With simple keys, key nodes cannot have comments');
        }
        if (identity.isCollection(key)) {
            const msg = 'With simple keys, collection cannot be used as a key value';
            throw new Error(msg);
        }
    }
    let explicitKey = !simpleKeys &&
        (!key ||
            (keyComment && value == null && !ctx.inFlow) ||
            identity.isCollection(key) ||
            (identity.isScalar(key)
                ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL
                : typeof key === 'object'));
    ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
    });
    let keyCommentDone = false;
    let chompKeep = false;
    let str = stringify.stringify(key, ctx, () => (keyCommentDone = true), () => (chompKeep = true));
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
            throw new Error('With simple keys, single line scalar must not span more than 1024 characters');
        explicitKey = true;
    }
    if (ctx.inFlow) {
        if (allNullValues || value == null) {
            if (keyCommentDone && onComment)
                onComment();
            return str === '' ? '?' : explicitKey ? `? ${str}` : str;
        }
    }
    else if ((allNullValues && !simpleKeys) || (value == null && explicitKey)) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
            str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        }
        else if (chompKeep && onChompKeep)
            onChompKeep();
        return str;
    }
    if (keyCommentDone)
        keyComment = null;
    if (explicitKey) {
        if (keyComment)
            str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}\n${indent}:`;
    }
    else {
        str = `${str}:`;
        if (keyComment)
            str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
    }
    let vsb, vcb, valueComment;
    if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
    }
    else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === 'object')
            value = doc.createNode(value);
    }
    ctx.implicitKey = false;
    if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
    chompKeep = false;
    if (!indentSeq &&
        indentStep.length >= 2 &&
        !ctx.inFlow &&
        !explicitKey &&
        identity.isSeq(value) &&
        !value.flow &&
        !value.tag &&
        !value.anchor) {
        // If indentSeq === false, consider '- ' as part of indentation where possible
        ctx.indent = ctx.indent.substring(2);
    }
    let valueCommentDone = false;
    const valueStr = stringify.stringify(value, ctx, () => (valueCommentDone = true), () => (chompKeep = true));
    let ws = ' ';
    if (keyComment || vsb || vcb) {
        ws = vsb ? '\n' : '';
        if (vcb) {
            const cs = commentString(vcb);
            ws += `\n${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === '' && !ctx.inFlow) {
            if (ws === '\n')
                ws = '\n\n';
        }
        else {
            ws += `\n${ctx.indent}`;
        }
    }
    else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf('\n');
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
            let hasPropsLine = false;
            if (hasNewline && (vs0 === '&' || vs0 === '!')) {
                let sp0 = valueStr.indexOf(' ');
                if (vs0 === '&' &&
                    sp0 !== -1 &&
                    sp0 < nl0 &&
                    valueStr[sp0 + 1] === '!') {
                    sp0 = valueStr.indexOf(' ', sp0 + 1);
                }
                if (sp0 === -1 || nl0 < sp0)
                    hasPropsLine = true;
            }
            if (!hasPropsLine)
                ws = `\n${ctx.indent}`;
        }
    }
    else if (valueStr === '' || valueStr[0] === '\n') {
        ws = '';
    }
    str += ws + valueStr;
    if (ctx.inFlow) {
        if (valueCommentDone && onComment)
            onComment();
    }
    else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
    }
    else if (chompKeep && onChompKeep) {
        onChompKeep();
    }
    return str;
}

exports.stringifyPair = stringifyPair;


/***/ }),

/***/ "./node_modules/yaml/dist/stringify/stringifyString.js":
/*!*************************************************************!*\
  !*** ./node_modules/yaml/dist/stringify/stringifyString.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var Scalar = __webpack_require__(/*! ../nodes/Scalar.js */ "./node_modules/yaml/dist/nodes/Scalar.js");
var foldFlowLines = __webpack_require__(/*! ./foldFlowLines.js */ "./node_modules/yaml/dist/stringify/foldFlowLines.js");

const getFoldOptions = (ctx, isBlock) => ({
    indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
    lineWidth: ctx.options.lineWidth,
    minContentWidth: ctx.options.minContentWidth
});
// Also checks for lines starting with %, as parsing the output as YAML 1.1 will
// presume that's starting a new document.
const containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
        return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
        return false;
    for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === '\n') {
            if (i - start > limit)
                return true;
            start = i + 1;
            if (strLen - start <= limit)
                return false;
        }
    }
    return true;
}
function doubleQuotedString(value, ctx) {
    const json = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
        return json;
    const { implicitKey } = ctx;
    const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
    const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
    let str = '';
    let start = 0;
    for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
            // space before newline needs to be escaped to not be folded
            str += json.slice(start, i) + '\\ ';
            i += 1;
            start = i;
            ch = '\\';
        }
        if (ch === '\\')
            switch (json[i + 1]) {
                case 'u':
                    {
                        str += json.slice(start, i);
                        const code = json.substr(i + 2, 4);
                        switch (code) {
                            case '0000':
                                str += '\\0';
                                break;
                            case '0007':
                                str += '\\a';
                                break;
                            case '000b':
                                str += '\\v';
                                break;
                            case '001b':
                                str += '\\e';
                                break;
                            case '0085':
                                str += '\\N';
                                break;
                            case '00a0':
                                str += '\\_';
                                break;
                            case '2028':
                                str += '\\L';
                                break;
                            case '2029':
                                str += '\\P';
                                break;
                            default:
                                if (code.substr(0, 2) === '00')
                                    str += '\\x' + code.substr(2);
                                else
                                    str += json.substr(i, 6);
                        }
                        i += 5;
                        start = i + 1;
                    }
                    break;
                case 'n':
                    if (implicitKey ||
                        json[i + 2] === '"' ||
                        json.length < minMultiLineLength) {
                        i += 1;
                    }
                    else {
                        // folding will eat first newline
                        str += json.slice(start, i) + '\n\n';
                        while (json[i + 2] === '\\' &&
                            json[i + 3] === 'n' &&
                            json[i + 4] !== '"') {
                            str += '\n';
                            i += 2;
                        }
                        str += indent;
                        // space after newline needs to be escaped to not be folded
                        if (json[i + 2] === ' ')
                            str += '\\';
                        i += 1;
                        start = i + 1;
                    }
                    break;
                default:
                    i += 1;
            }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey
        ? str
        : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
}
function singleQuotedString(value, ctx) {
    if (ctx.options.singleQuote === false ||
        (ctx.implicitKey && value.includes('\n')) ||
        /[ \t]\n|\n[ \t]/.test(value) // single quoted string can't have leading or trailing whitespace around newline
    )
        return doubleQuotedString(value, ctx);
    const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
    return ctx.implicitKey
        ? res
        : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
}
function quotedString(value, ctx) {
    const { singleQuote } = ctx.options;
    let qs;
    if (singleQuote === false)
        qs = doubleQuotedString;
    else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
            qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
            qs = doubleQuotedString;
        else
            qs = singleQuote ? singleQuotedString : doubleQuotedString;
    }
    return qs(value, ctx);
}
// The negative lookbehind avoids a polynomial search,
// but isn't supported yet on Safari: https://caniuse.com/js-regexp-lookbehind
let blockEndNewlines;
try {
    blockEndNewlines = new RegExp('(^|(?<!\n))\n+(?!\n|$)', 'g');
}
catch {
    blockEndNewlines = /\n+(?!\n|$)/g;
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
    const { blockQuote, commentString, lineWidth } = ctx.options;
    // 1. Block can't end in whitespace unless the last line is non-empty.
    // 2. Strings consisting of only whitespace are best rendered explicitly.
    if (!blockQuote || /\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
        return quotedString(value, ctx);
    }
    const indent = ctx.indent ||
        (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
    const literal = blockQuote === 'literal'
        ? true
        : blockQuote === 'folded' || type === Scalar.Scalar.BLOCK_FOLDED
            ? false
            : type === Scalar.Scalar.BLOCK_LITERAL
                ? true
                : !lineLengthOverLimit(value, lineWidth, indent.length);
    if (!value)
        return literal ? '|\n' : '>\n';
    // determine chomping from whitespace at value end
    let chomp;
    let endStart;
    for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== '\n' && ch !== '\t' && ch !== ' ')
            break;
    }
    let end = value.substring(endStart);
    const endNlPos = end.indexOf('\n');
    if (endNlPos === -1) {
        chomp = '-'; // strip
    }
    else if (value === end || endNlPos !== end.length - 1) {
        chomp = '+'; // keep
        if (onChompKeep)
            onChompKeep();
    }
    else {
        chomp = ''; // clip
    }
    if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === '\n')
            end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
    }
    // determine indent indicator from whitespace at value start
    let startWithSpace = false;
    let startEnd;
    let startNlPos = -1;
    for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === ' ')
            startWithSpace = true;
        else if (ch === '\n')
            startNlPos = startEnd;
        else
            break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
    }
    const indentSize = indent ? '2' : '1'; // root is at -1
    let header = (literal ? '|' : '>') + (startWithSpace ? indentSize : '') + chomp;
    if (comment) {
        header += ' ' + commentString(comment.replace(/ ?[\r\n]+/g, ' '));
        if (onComment)
            onComment();
    }
    if (literal) {
        value = value.replace(/\n+/g, `$&${indent}`);
        return `${header}\n${indent}${start}${value}${end}`;
    }
    value = value
        .replace(/\n+/g, '\n$&')
        .replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
        //                ^ more-ind. ^ empty     ^ capture next empty lines only at end of indent
        .replace(/\n+/g, `$&${indent}`);
    const body = foldFlowLines.foldFlowLines(`${start}${value}${end}`, indent, foldFlowLines.FOLD_BLOCK, getFoldOptions(ctx, true));
    return `${header}\n${indent}${body}`;
}
function plainString(item, ctx, onComment, onChompKeep) {
    const { type, value } = item;
    const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
    if ((implicitKey && value.includes('\n')) ||
        (inFlow && /[[\]{},]/.test(value))) {
        return quotedString(value, ctx);
    }
    if (!value ||
        /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        // not allowed:
        // - empty string, '-' or '?'
        // - start with an indicator character (except [?:-]) or /[?-] /
        // - '\n ', ': ' or ' \n' anywhere
        // - '#' not preceded by a non-space char
        // - end with ' ' or ':'
        return implicitKey || inFlow || !value.includes('\n')
            ? quotedString(value, ctx)
            : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey &&
        !inFlow &&
        type !== Scalar.Scalar.PLAIN &&
        value.includes('\n')) {
        // Where allowed & type not set explicitly, prefer block style for multiline strings
        return blockString(item, ctx, onComment, onChompKeep);
    }
    if (containsDocumentMarker(value)) {
        if (indent === '') {
            ctx.forceBlockIndent = true;
            return blockString(item, ctx, onComment, onChompKeep);
        }
        else if (implicitKey && indent === indentStep) {
            return quotedString(value, ctx);
        }
    }
    const str = value.replace(/\n+/g, `$&\n${indent}`);
    // Verify that output will be parsed as a string, as e.g. plain numbers and
    // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
    // and others in v1.1.
    if (actualString) {
        const test = (tag) => tag.default && tag.tag !== 'tag:yaml.org,2002:str' && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
            return quotedString(value, ctx);
    }
    return implicitKey
        ? str
        : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
}
function stringifyString(item, ctx, onComment, onChompKeep) {
    const { implicitKey, inFlow } = ctx;
    const ss = typeof item.value === 'string'
        ? item
        : Object.assign({}, item, { value: String(item.value) });
    let { type } = item;
    if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        // force double quotes on control characters & unpaired surrogates
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
            type = Scalar.Scalar.QUOTE_DOUBLE;
    }
    const _stringify = (_type) => {
        switch (_type) {
            case Scalar.Scalar.BLOCK_FOLDED:
            case Scalar.Scalar.BLOCK_LITERAL:
                return implicitKey || inFlow
                    ? quotedString(ss.value, ctx) // blocks are not valid inside flow containers
                    : blockString(ss, ctx, onComment, onChompKeep);
            case Scalar.Scalar.QUOTE_DOUBLE:
                return doubleQuotedString(ss.value, ctx);
            case Scalar.Scalar.QUOTE_SINGLE:
                return singleQuotedString(ss.value, ctx);
            case Scalar.Scalar.PLAIN:
                return plainString(ss, ctx, onComment, onChompKeep);
            default:
                return null;
        }
    };
    let res = _stringify(type);
    if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = (implicitKey && defaultKeyType) || defaultStringType;
        res = _stringify(t);
        if (res === null)
            throw new Error(`Unsupported default string type ${t}`);
    }
    return res;
}

exports.stringifyString = stringifyString;


/***/ }),

/***/ "./node_modules/yaml/dist/visit.js":
/*!*****************************************!*\
  !*** ./node_modules/yaml/dist/visit.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


var identity = __webpack_require__(/*! ./nodes/identity.js */ "./node_modules/yaml/dist/nodes/identity.js");

const BREAK = Symbol('break visit');
const SKIP = Symbol('skip children');
const REMOVE = Symbol('remove node');
/**
 * Apply a visitor to an AST node or document.
 *
 * Walks through the tree (depth-first) starting from `node`, calling a
 * `visitor` function with three arguments:
 *   - `key`: For sequence values and map `Pair`, the node's index in the
 *     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
 *     `null` for the root node.
 *   - `node`: The current node.
 *   - `path`: The ancestry of the current node.
 *
 * The return value of the visitor may be used to control the traversal:
 *   - `undefined` (default): Do nothing and continue
 *   - `visit.SKIP`: Do not visit the children of this node, continue with next
 *     sibling
 *   - `visit.BREAK`: Terminate traversal completely
 *   - `visit.REMOVE`: Remove the current node, then continue with the next one
 *   - `Node`: Replace the current node, then continue by visiting it
 *   - `number`: While iterating the items of a sequence or map, set the index
 *     of the next step. This is useful especially if the index of the current
 *     node has changed.
 *
 * If `visitor` is a single function, it will be called with all values
 * encountered in the tree, including e.g. `null` values. Alternatively,
 * separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
 * `Alias` and `Scalar` node. To define the same visitor function for more than
 * one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
 * and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
 * specific defined one will be used for each node.
 */
function visit(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
            node.contents = null;
    }
    else
        visit_(null, node, visitor_, Object.freeze([]));
}
// Without the `as symbol` casts, TS declares these in the `visit`
// namespace using `var`, but then complains about that because
// `unique symbol` must be `const`.
/** Terminate visit traversal completely */
visit.BREAK = BREAK;
/** Do not visit the children of the current node */
visit.SKIP = SKIP;
/** Remove the current node */
visit.REMOVE = REMOVE;
function visit_(key, node, visitor, path) {
    const ctrl = callVisitor(key, node, visitor, path);
    if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== 'symbol') {
        if (identity.isCollection(node)) {
            path = Object.freeze(path.concat(node));
            for (let i = 0; i < node.items.length; ++i) {
                const ci = visit_(i, node.items[i], visitor, path);
                if (typeof ci === 'number')
                    i = ci - 1;
                else if (ci === BREAK)
                    return BREAK;
                else if (ci === REMOVE) {
                    node.items.splice(i, 1);
                    i -= 1;
                }
            }
        }
        else if (identity.isPair(node)) {
            path = Object.freeze(path.concat(node));
            const ck = visit_('key', node.key, visitor, path);
            if (ck === BREAK)
                return BREAK;
            else if (ck === REMOVE)
                node.key = null;
            const cv = visit_('value', node.value, visitor, path);
            if (cv === BREAK)
                return BREAK;
            else if (cv === REMOVE)
                node.value = null;
        }
    }
    return ctrl;
}
/**
 * Apply an async visitor to an AST node or document.
 *
 * Walks through the tree (depth-first) starting from `node`, calling a
 * `visitor` function with three arguments:
 *   - `key`: For sequence values and map `Pair`, the node's index in the
 *     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
 *     `null` for the root node.
 *   - `node`: The current node.
 *   - `path`: The ancestry of the current node.
 *
 * The return value of the visitor may be used to control the traversal:
 *   - `Promise`: Must resolve to one of the following values
 *   - `undefined` (default): Do nothing and continue
 *   - `visit.SKIP`: Do not visit the children of this node, continue with next
 *     sibling
 *   - `visit.BREAK`: Terminate traversal completely
 *   - `visit.REMOVE`: Remove the current node, then continue with the next one
 *   - `Node`: Replace the current node, then continue by visiting it
 *   - `number`: While iterating the items of a sequence or map, set the index
 *     of the next step. This is useful especially if the index of the current
 *     node has changed.
 *
 * If `visitor` is a single function, it will be called with all values
 * encountered in the tree, including e.g. `null` values. Alternatively,
 * separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
 * `Alias` and `Scalar` node. To define the same visitor function for more than
 * one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
 * and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
 * specific defined one will be used for each node.
 */
async function visitAsync(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
            node.contents = null;
    }
    else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
}
// Without the `as symbol` casts, TS declares these in the `visit`
// namespace using `var`, but then complains about that because
// `unique symbol` must be `const`.
/** Terminate visit traversal completely */
visitAsync.BREAK = BREAK;
/** Do not visit the children of the current node */
visitAsync.SKIP = SKIP;
/** Remove the current node */
visitAsync.REMOVE = REMOVE;
async function visitAsync_(key, node, visitor, path) {
    const ctrl = await callVisitor(key, node, visitor, path);
    if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== 'symbol') {
        if (identity.isCollection(node)) {
            path = Object.freeze(path.concat(node));
            for (let i = 0; i < node.items.length; ++i) {
                const ci = await visitAsync_(i, node.items[i], visitor, path);
                if (typeof ci === 'number')
                    i = ci - 1;
                else if (ci === BREAK)
                    return BREAK;
                else if (ci === REMOVE) {
                    node.items.splice(i, 1);
                    i -= 1;
                }
            }
        }
        else if (identity.isPair(node)) {
            path = Object.freeze(path.concat(node));
            const ck = await visitAsync_('key', node.key, visitor, path);
            if (ck === BREAK)
                return BREAK;
            else if (ck === REMOVE)
                node.key = null;
            const cv = await visitAsync_('value', node.value, visitor, path);
            if (cv === BREAK)
                return BREAK;
            else if (cv === REMOVE)
                node.value = null;
        }
    }
    return ctrl;
}
function initVisitor(visitor) {
    if (typeof visitor === 'object' &&
        (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
            Alias: visitor.Node,
            Map: visitor.Node,
            Scalar: visitor.Node,
            Seq: visitor.Node
        }, visitor.Value && {
            Map: visitor.Value,
            Scalar: visitor.Value,
            Seq: visitor.Value
        }, visitor.Collection && {
            Map: visitor.Collection,
            Seq: visitor.Collection
        }, visitor);
    }
    return visitor;
}
function callVisitor(key, node, visitor, path) {
    if (typeof visitor === 'function')
        return visitor(key, node, path);
    if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
    if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
    if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
    if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
    if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
    return undefined;
}
function replaceNode(key, path, node) {
    const parent = path[path.length - 1];
    if (identity.isCollection(parent)) {
        parent.items[key] = node;
    }
    else if (identity.isPair(parent)) {
        if (key === 'key')
            parent.key = node;
        else
            parent.value = node;
    }
    else if (identity.isDocument(parent)) {
        parent.contents = node;
    }
    else {
        const pt = identity.isAlias(parent) ? 'alias' : 'scalar';
        throw new Error(`Cannot replace node with ${pt} parent`);
    }
}

exports.visit = visit;
exports.visitAsync = visitAsync;


/***/ }),

/***/ "./node_modules/@actions/expressions/dist/ast.js":
/*!*******************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/ast.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Binary: () => (/* binding */ Binary),
/* harmony export */   ContextAccess: () => (/* binding */ ContextAccess),
/* harmony export */   Expr: () => (/* binding */ Expr),
/* harmony export */   FunctionCall: () => (/* binding */ FunctionCall),
/* harmony export */   Grouping: () => (/* binding */ Grouping),
/* harmony export */   IndexAccess: () => (/* binding */ IndexAccess),
/* harmony export */   Literal: () => (/* binding */ Literal),
/* harmony export */   Logical: () => (/* binding */ Logical),
/* harmony export */   Star: () => (/* binding */ Star),
/* harmony export */   Unary: () => (/* binding */ Unary)
/* harmony export */ });
class Expr {
}
class Literal extends Expr {
    constructor(literal, token) {
        super();
        this.literal = literal;
        this.token = token;
    }
    accept(v) {
        return v.visitLiteral(this);
    }
}
class Unary extends Expr {
    constructor(operator, expr) {
        super();
        this.operator = operator;
        this.expr = expr;
    }
    accept(v) {
        return v.visitUnary(this);
    }
}
class FunctionCall extends Expr {
    constructor(functionName, args) {
        super();
        this.functionName = functionName;
        this.args = args;
    }
    accept(v) {
        return v.visitFunctionCall(this);
    }
}
class Binary extends Expr {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(v) {
        return v.visitBinary(this);
    }
}
class Logical extends Expr {
    constructor(operator, args) {
        super();
        this.operator = operator;
        this.args = args;
    }
    accept(v) {
        return v.visitLogical(this);
    }
}
class Grouping extends Expr {
    constructor(group) {
        super();
        this.group = group;
    }
    accept(v) {
        return v.visitGrouping(this);
    }
}
class ContextAccess extends Expr {
    constructor(name) {
        super();
        this.name = name;
    }
    accept(v) {
        return v.visitContextAccess(this);
    }
}
class IndexAccess extends Expr {
    constructor(expr, index) {
        super();
        this.expr = expr;
        this.index = index;
    }
    accept(v) {
        return v.visitIndexAccess(this);
    }
}
class Star extends Expr {
    accept() {
        throw new Error("Method not implemented.");
    }
}
//# sourceMappingURL=ast.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/completion.js":
/*!**************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/completion.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   complete: () => (/* binding */ complete),
/* harmony export */   trimTokenVector: () => (/* binding */ trimTokenVector)
/* harmony export */ });
/* harmony import */ var _data_dictionary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data/dictionary */ "./node_modules/@actions/expressions/dist/data/dictionary.js");
/* harmony import */ var _evaluator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./evaluator */ "./node_modules/@actions/expressions/dist/evaluator.js");
/* harmony import */ var _funcs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./funcs */ "./node_modules/@actions/expressions/dist/funcs.js");
/* harmony import */ var _lexer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lexer */ "./node_modules/@actions/expressions/dist/lexer.js");
/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parser */ "./node_modules/@actions/expressions/dist/parser.js");





/**
 * Complete returns a list of completion items for the given expression.
 * The main functionality is auto-completing functions and context access:
 * We can only provide assistance if the input is in one of the following forms (with | denoting the cursor position):
 * - context.path.inp| or context.path['inp| -- auto-complete context access
 * - context.path.| or context.path['| -- auto-complete context access
 * - toJS| -- auto-complete function call or top-level
 * - | -- auto-complete function call or top-level context access
 *
 * @param input Input expression
 * @param context Context available for the expression
 * @param extensionFunctions List of functions available
 * @param functions Optional map of functions to use during evaluation
 * @returns Array of completion items
 */
function complete(input, context, extensionFunctions, functions) {
    // Lex
    const lexer = new _lexer__WEBPACK_IMPORTED_MODULE_3__.Lexer(input);
    const lexResult = lexer.lex();
    // Find interesting part of the tokenVector. For example, for an expression like `github.actor == env.actor.log|`, we are
    // only interested in the `env.actor.log` part for auto-completion
    const tokenInputVector = trimTokenVector(lexResult.tokens);
    // Start by skipping the EOF token
    let tokenIdx = tokenInputVector.length - 2;
    if (tokenIdx >= 0) {
        switch (tokenInputVector[tokenIdx].type) {
            // If there is a (partial) identifier under the cursor, ignore that
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.IDENTIFIER:
                tokenIdx--;
                break;
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.STRING:
                // TODO: Support string for `context.name['test|`
                return [];
        }
    }
    if (tokenIdx < 0) {
        // Vector only contains the EOF token. Suggest functions and root context access
        const result = contextKeys(context);
        // Merge with functions
        result.push(...functionItems(extensionFunctions));
        return result;
    }
    // Determine path that led to the last token
    // Use parser & evaluator to determine context to complete.
    const pathTokenVector = tokenInputVector.slice(0, tokenIdx);
    // Include the original EOF token to make the parser happy
    pathTokenVector.push(tokenInputVector[tokenInputVector.length - 1]);
    const p = new _parser__WEBPACK_IMPORTED_MODULE_4__.Parser(pathTokenVector, context.pairs().map(x => x.key), extensionFunctions);
    const expr = p.parse();
    const ev = new _evaluator__WEBPACK_IMPORTED_MODULE_1__.Evaluator(expr, context, functions);
    const result = ev.evaluate();
    return contextKeys(result);
}
function functionItems(extensionFunctions) {
    const result = [];
    for (const fdef of [...Object.values(_funcs__WEBPACK_IMPORTED_MODULE_2__.wellKnownFunctions), ...extensionFunctions]) {
        result.push({
            label: fdef.name,
            description: fdef.description,
            function: true
        });
    }
    // Sort functions
    result.sort((a, b) => a.label.localeCompare(b.label));
    return result;
}
function contextKeys(context) {
    if ((0,_data_dictionary__WEBPACK_IMPORTED_MODULE_0__.isDictionary)(context)) {
        return (context
            .pairs()
            .map(x => completionItemFromContext(x))
            // Sort contexts
            .sort((a, b) => a.label.localeCompare(b.label)));
    }
    return [];
}
function completionItemFromContext(pair) {
    const context = pair.key.toString();
    const parenIndex = context.indexOf("(");
    const isFunc = parenIndex >= 0 && context.indexOf(")") >= 0;
    return {
        label: isFunc ? context.substring(0, parenIndex) : context,
        description: pair.description,
        function: isFunc
    };
}
function trimTokenVector(tokenVector) {
    let tokenIdx = tokenVector.length;
    let openParen = 0;
    while (tokenIdx > 0) {
        const token = tokenVector[tokenIdx - 1];
        switch (token.type) {
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.LEFT_PAREN:
                if (openParen == 0) {
                    // Encountered an open parenthesis without a closing first, stop here
                    break;
                }
                openParen--;
                tokenIdx--;
                continue;
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.RIGHT_PAREN:
                openParen++;
                tokenIdx--;
                continue;
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.IDENTIFIER:
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.DOT:
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.EOF:
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.LEFT_BRACKET:
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.RIGHT_BRACKET:
            case _lexer__WEBPACK_IMPORTED_MODULE_3__.TokenType.STRING:
                tokenIdx--;
                continue;
        }
        break;
    }
    // Only keep the part of the token vector we're interested in
    return tokenVector.slice(tokenIdx);
}
//# sourceMappingURL=completion.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/completion/descriptionDictionary.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/completion/descriptionDictionary.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DescriptionDictionary: () => (/* binding */ DescriptionDictionary),
/* harmony export */   isDescriptionDictionary: () => (/* binding */ isDescriptionDictionary)
/* harmony export */ });
/* harmony import */ var _data_dictionary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/dictionary */ "./node_modules/@actions/expressions/dist/data/dictionary.js");
/* harmony import */ var _data_expressiondata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/expressiondata */ "./node_modules/@actions/expressions/dist/data/expressiondata.js");


function isDescriptionDictionary(x) {
    return x.kind === _data_expressiondata__WEBPACK_IMPORTED_MODULE_1__.Kind.Dictionary && x instanceof DescriptionDictionary;
}
class DescriptionDictionary extends _data_dictionary__WEBPACK_IMPORTED_MODULE_0__.Dictionary {
    constructor(...pairs) {
        super();
        this.descriptions = new Map();
        this.complete = true;
        for (const p of pairs) {
            this.add(p.key, p.value, p.description);
        }
    }
    add(key, value, description) {
        if (this.get(key) !== undefined) {
            // Key already added, ignore
            return;
        }
        super.add(key, value);
        if (description) {
            this.descriptions.set(key, description);
        }
    }
    pairs() {
        const pairs = super.pairs();
        return pairs.map(p => ({ ...p, description: this.descriptions.get(p.key) }));
    }
    getDescription(key) {
        return this.descriptions.get(key);
    }
}
//# sourceMappingURL=descriptionDictionary.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/array.js":
/*!**************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/array.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Array: () => (/* binding */ Array)
/* harmony export */ });
/* harmony import */ var _expressiondata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expressiondata */ "./node_modules/@actions/expressions/dist/data/expressiondata.js");

class Array {
    constructor(...data) {
        this.v = [];
        this.kind = _expressiondata__WEBPACK_IMPORTED_MODULE_0__.Kind.Array;
        this.primitive = false;
        for (const d of data) {
            this.add(d);
        }
    }
    coerceString() {
        return (0,_expressiondata__WEBPACK_IMPORTED_MODULE_0__.kindStr)(this.kind);
    }
    number() {
        return NaN;
    }
    add(value) {
        this.v.push(value);
    }
    get(index) {
        return this.v[index];
    }
    values() {
        return this.v;
    }
}
//# sourceMappingURL=array.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/boolean.js":
/*!****************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/boolean.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BooleanData: () => (/* binding */ BooleanData)
/* harmony export */ });
/* harmony import */ var _expressiondata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expressiondata */ "./node_modules/@actions/expressions/dist/data/expressiondata.js");

class BooleanData {
    constructor(value) {
        this.value = value;
        this.kind = _expressiondata__WEBPACK_IMPORTED_MODULE_0__.Kind.Boolean;
        this.primitive = true;
    }
    coerceString() {
        if (this.value) {
            return "true";
        }
        return "false";
    }
    number() {
        if (this.value) {
            return 1;
        }
        return 0;
    }
}
//# sourceMappingURL=boolean.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/dictionary.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/dictionary.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Dictionary: () => (/* binding */ Dictionary),
/* harmony export */   isDictionary: () => (/* binding */ isDictionary)
/* harmony export */ });
/* harmony import */ var _expressiondata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expressiondata */ "./node_modules/@actions/expressions/dist/data/expressiondata.js");

class Dictionary {
    constructor(...pairs) {
        this.keys = [];
        this.v = [];
        this.indexMap = {};
        this.kind = _expressiondata__WEBPACK_IMPORTED_MODULE_0__.Kind.Dictionary;
        this.primitive = false;
        for (const p of pairs) {
            this.add(p.key, p.value);
        }
    }
    coerceString() {
        return (0,_expressiondata__WEBPACK_IMPORTED_MODULE_0__.kindStr)(this.kind);
    }
    number() {
        return NaN;
    }
    add(key, value) {
        if (key.toLowerCase() in this.indexMap) {
            return;
        }
        this.keys.push(key);
        this.v.push(value);
        this.indexMap[key.toLowerCase()] = this.v.length - 1;
    }
    get(key) {
        const index = this.indexMap[key.toLowerCase()];
        if (index === undefined) {
            return undefined;
        }
        return this.v[index];
    }
    values() {
        return this.v;
    }
    pairs() {
        const result = [];
        for (const key of this.keys) {
            result.push({ key, value: this.v[this.indexMap[key.toLowerCase()]] });
        }
        return result;
    }
}
function isDictionary(x) {
    return x.kind === _expressiondata__WEBPACK_IMPORTED_MODULE_0__.Kind.Dictionary;
}
//# sourceMappingURL=dictionary.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/expressiondata.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/expressiondata.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Kind: () => (/* binding */ Kind),
/* harmony export */   kindStr: () => (/* binding */ kindStr)
/* harmony export */ });
var Kind;
(function (Kind) {
    Kind[Kind["String"] = 0] = "String";
    Kind[Kind["Array"] = 1] = "Array";
    Kind[Kind["Dictionary"] = 2] = "Dictionary";
    Kind[Kind["Boolean"] = 3] = "Boolean";
    Kind[Kind["Number"] = 4] = "Number";
    Kind[Kind["CaseSensitiveDictionary"] = 5] = "CaseSensitiveDictionary";
    Kind[Kind["Null"] = 6] = "Null";
})(Kind || (Kind = {}));
function kindStr(k) {
    switch (k) {
        case Kind.Array:
            return "Array";
        case Kind.Boolean:
            return "Boolean";
        case Kind.Null:
            return "Null";
        case Kind.Number:
            return "Number";
        case Kind.Dictionary:
            return "Object";
        case Kind.String:
            return "String";
    }
    return "unknown";
}
//# sourceMappingURL=expressiondata.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Array: () => (/* reexport safe */ _array__WEBPACK_IMPORTED_MODULE_0__.Array),
/* harmony export */   BooleanData: () => (/* reexport safe */ _boolean__WEBPACK_IMPORTED_MODULE_1__.BooleanData),
/* harmony export */   Dictionary: () => (/* reexport safe */ _dictionary__WEBPACK_IMPORTED_MODULE_2__.Dictionary),
/* harmony export */   Kind: () => (/* reexport safe */ _expressiondata__WEBPACK_IMPORTED_MODULE_3__.Kind),
/* harmony export */   Null: () => (/* reexport safe */ _null__WEBPACK_IMPORTED_MODULE_4__.Null),
/* harmony export */   NumberData: () => (/* reexport safe */ _number__WEBPACK_IMPORTED_MODULE_5__.NumberData),
/* harmony export */   StringData: () => (/* reexport safe */ _string__WEBPACK_IMPORTED_MODULE_8__.StringData),
/* harmony export */   replacer: () => (/* reexport safe */ _replacer__WEBPACK_IMPORTED_MODULE_6__.replacer),
/* harmony export */   reviver: () => (/* reexport safe */ _reviver__WEBPACK_IMPORTED_MODULE_7__.reviver)
/* harmony export */ });
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./array */ "./node_modules/@actions/expressions/dist/data/array.js");
/* harmony import */ var _boolean__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boolean */ "./node_modules/@actions/expressions/dist/data/boolean.js");
/* harmony import */ var _dictionary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dictionary */ "./node_modules/@actions/expressions/dist/data/dictionary.js");
/* harmony import */ var _expressiondata__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./expressiondata */ "./node_modules/@actions/expressions/dist/data/expressiondata.js");
/* harmony import */ var _null__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./null */ "./node_modules/@actions/expressions/dist/data/null.js");
/* harmony import */ var _number__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./number */ "./node_modules/@actions/expressions/dist/data/number.js");
/* harmony import */ var _replacer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./replacer */ "./node_modules/@actions/expressions/dist/data/replacer.js");
/* harmony import */ var _reviver__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./reviver */ "./node_modules/@actions/expressions/dist/data/reviver.js");
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./string */ "./node_modules/@actions/expressions/dist/data/string.js");









//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/null.js":
/*!*************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/null.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Null: () => (/* binding */ Null)
/* harmony export */ });
/* harmony import */ var _expressiondata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expressiondata */ "./node_modules/@actions/expressions/dist/data/expressiondata.js");

class Null {
    constructor() {
        this.kind = _expressiondata__WEBPACK_IMPORTED_MODULE_0__.Kind.Null;
        this.primitive = true;
    }
    coerceString() {
        return "";
    }
    number() {
        return 0;
    }
}
//# sourceMappingURL=null.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/number.js":
/*!***************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/number.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NumberData: () => (/* binding */ NumberData)
/* harmony export */ });
/* harmony import */ var _expressiondata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expressiondata */ "./node_modules/@actions/expressions/dist/data/expressiondata.js");

class NumberData {
    constructor(value) {
        this.value = value;
        this.kind = _expressiondata__WEBPACK_IMPORTED_MODULE_0__.Kind.Number;
        this.primitive = true;
    }
    coerceString() {
        if (this.value === 0) {
            return "0";
        }
        // Workaround to limit the precision to at most 15 digits. Format the number to a string, then parse
        // it back to a number to remove trailing zeroes to prevent numbers to be converted to 1.200000000...
        return (+this.value.toFixed(15)).toString();
    }
    number() {
        return this.value;
    }
}
//# sourceMappingURL=number.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/replacer.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/replacer.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   replacer: () => (/* binding */ replacer)
/* harmony export */ });
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./array */ "./node_modules/@actions/expressions/dist/data/array.js");
/* harmony import */ var _boolean__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boolean */ "./node_modules/@actions/expressions/dist/data/boolean.js");
/* harmony import */ var _dictionary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dictionary */ "./node_modules/@actions/expressions/dist/data/dictionary.js");
/* harmony import */ var _null__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./null */ "./node_modules/@actions/expressions/dist/data/null.js");
/* harmony import */ var _number__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./number */ "./node_modules/@actions/expressions/dist/data/number.js");
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./string */ "./node_modules/@actions/expressions/dist/data/string.js");






/**
 * Replacer can be passed to JSON.stringify to convert an ExpressionData object into plain JSON
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer
 */
function replacer(_key, value) {
    if (value instanceof _null__WEBPACK_IMPORTED_MODULE_3__.Null) {
        return null;
    }
    if (value instanceof _boolean__WEBPACK_IMPORTED_MODULE_1__.BooleanData) {
        return value.value;
    }
    if (value instanceof _number__WEBPACK_IMPORTED_MODULE_4__.NumberData) {
        return value.number();
    }
    if (value instanceof _string__WEBPACK_IMPORTED_MODULE_5__.StringData) {
        return value.coerceString();
    }
    if (value instanceof _array__WEBPACK_IMPORTED_MODULE_0__.Array) {
        return value.values();
    }
    if (value instanceof _dictionary__WEBPACK_IMPORTED_MODULE_2__.Dictionary) {
        const pairs = value.pairs();
        const r = {};
        for (const p of pairs) {
            r[p.key] = p.value;
        }
        return r;
    }
    return value;
}
//# sourceMappingURL=replacer.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/reviver.js":
/*!****************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/reviver.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reviver: () => (/* binding */ reviver)
/* harmony export */ });
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./array */ "./node_modules/@actions/expressions/dist/data/array.js");
/* harmony import */ var _boolean__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boolean */ "./node_modules/@actions/expressions/dist/data/boolean.js");
/* harmony import */ var _dictionary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dictionary */ "./node_modules/@actions/expressions/dist/data/dictionary.js");
/* harmony import */ var _null__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./null */ "./node_modules/@actions/expressions/dist/data/null.js");
/* harmony import */ var _number__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./number */ "./node_modules/@actions/expressions/dist/data/number.js");
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./string */ "./node_modules/@actions/expressions/dist/data/string.js");






/**
 * Reviver can be passed to `JSON.parse` to convert plain JSON into an `ExpressionData` object.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#reviver
 */
function reviver(_key, val) {
    if (val === null) {
        return new _null__WEBPACK_IMPORTED_MODULE_3__.Null();
    }
    if (typeof val === "string") {
        return new _string__WEBPACK_IMPORTED_MODULE_5__.StringData(val);
    }
    if (typeof val === "number") {
        return new _number__WEBPACK_IMPORTED_MODULE_4__.NumberData(val);
    }
    if (typeof val === "boolean") {
        return new _boolean__WEBPACK_IMPORTED_MODULE_1__.BooleanData(val);
    }
    if (Array.isArray(val)) {
        return new _array__WEBPACK_IMPORTED_MODULE_0__.Array(...val);
    }
    if (typeof val === "object") {
        return new _dictionary__WEBPACK_IMPORTED_MODULE_2__.Dictionary(...Object.keys(val).map(k => ({
            key: k,
            value: val[k]
        })));
    }
    // Pass through value
    return val;
}
//# sourceMappingURL=reviver.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/data/string.js":
/*!***************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/data/string.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StringData: () => (/* binding */ StringData)
/* harmony export */ });
/* harmony import */ var _expressiondata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./expressiondata */ "./node_modules/@actions/expressions/dist/data/expressiondata.js");

class StringData {
    constructor(value) {
        this.value = value;
        this.kind = _expressiondata__WEBPACK_IMPORTED_MODULE_0__.Kind.String;
        this.primitive = true;
    }
    coerceString() {
        return this.value;
    }
    number() {
        return Number(this.value);
    }
}
//# sourceMappingURL=string.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/errors.js":
/*!**********************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/errors.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorType: () => (/* binding */ ErrorType),
/* harmony export */   ExpressionError: () => (/* binding */ ExpressionError),
/* harmony export */   ExpressionEvaluationError: () => (/* binding */ ExpressionEvaluationError),
/* harmony export */   MAX_EXPRESSION_LENGTH: () => (/* binding */ MAX_EXPRESSION_LENGTH),
/* harmony export */   MAX_PARSER_DEPTH: () => (/* binding */ MAX_PARSER_DEPTH)
/* harmony export */ });
/* harmony import */ var _lexer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lexer */ "./node_modules/@actions/expressions/dist/lexer.js");

const MAX_PARSER_DEPTH = 50;
const MAX_EXPRESSION_LENGTH = 21000;
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["ErrorUnexpectedSymbol"] = 0] = "ErrorUnexpectedSymbol";
    ErrorType[ErrorType["ErrorUnrecognizedNamedValue"] = 1] = "ErrorUnrecognizedNamedValue";
    ErrorType[ErrorType["ErrorUnexpectedEndOfExpression"] = 2] = "ErrorUnexpectedEndOfExpression";
    ErrorType[ErrorType["ErrorExceededMaxDepth"] = 3] = "ErrorExceededMaxDepth";
    ErrorType[ErrorType["ErrorExceededMaxLength"] = 4] = "ErrorExceededMaxLength";
    ErrorType[ErrorType["ErrorTooFewParameters"] = 5] = "ErrorTooFewParameters";
    ErrorType[ErrorType["ErrorTooManyParameters"] = 6] = "ErrorTooManyParameters";
    ErrorType[ErrorType["ErrorUnrecognizedContext"] = 7] = "ErrorUnrecognizedContext";
    ErrorType[ErrorType["ErrorUnrecognizedFunction"] = 8] = "ErrorUnrecognizedFunction";
})(ErrorType || (ErrorType = {}));
class ExpressionError extends Error {
    constructor(typ, tok) {
        super(`${errorDescription(typ)}: '${(0,_lexer__WEBPACK_IMPORTED_MODULE_0__.tokenString)(tok)}'`);
        this.typ = typ;
        this.tok = tok;
        this.pos = this.tok.range.start;
    }
}
function errorDescription(typ) {
    switch (typ) {
        case ErrorType.ErrorUnexpectedEndOfExpression:
            return "Unexpected end of expression";
        case ErrorType.ErrorUnexpectedSymbol:
            return "Unexpected symbol";
        case ErrorType.ErrorUnrecognizedNamedValue:
            return "Unrecognized named-value";
        case ErrorType.ErrorExceededMaxDepth:
            return `Exceeded max expression depth ${MAX_PARSER_DEPTH}`;
        case ErrorType.ErrorExceededMaxLength:
            return `Exceeded max expression length ${MAX_EXPRESSION_LENGTH}`;
        case ErrorType.ErrorTooFewParameters:
            return "Too few parameters supplied";
        case ErrorType.ErrorTooManyParameters:
            return "Too many parameters supplied";
        case ErrorType.ErrorUnrecognizedContext:
            return "Unrecognized named-value";
        case ErrorType.ErrorUnrecognizedFunction:
            return "Unrecognized function";
        default: // Should never reach here.
            return "Unknown error";
    }
}
class ExpressionEvaluationError extends Error {
}
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/evaluator.js":
/*!*************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/evaluator.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Evaluator: () => (/* binding */ Evaluator)
/* harmony export */ });
/* harmony import */ var _ast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ast */ "./node_modules/@actions/expressions/dist/ast.js");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data */ "./node_modules/@actions/expressions/dist/data/index.js");
/* harmony import */ var _filtered_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filtered_array */ "./node_modules/@actions/expressions/dist/filtered_array.js");
/* harmony import */ var _funcs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./funcs */ "./node_modules/@actions/expressions/dist/funcs.js");
/* harmony import */ var _idxHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./idxHelper */ "./node_modules/@actions/expressions/dist/idxHelper.js");
/* harmony import */ var _lexer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lexer */ "./node_modules/@actions/expressions/dist/lexer.js");
/* harmony import */ var _result__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./result */ "./node_modules/@actions/expressions/dist/result.js");







class Evaluator {
    /**
     * Creates a new evaluator
     * @param n Parsed expression to evaluate
     * @param context Context data to use
     * @param functions Optional map of function implementations. If given, these will be preferred over the built-in functions.
     */
    constructor(n, context, functions) {
        this.n = n;
        this.context = context;
        this.functions = functions;
    }
    evaluate() {
        return this.eval(this.n);
    }
    eval(n) {
        return n.accept(this);
    }
    visitLiteral(literal) {
        return literal.literal;
    }
    visitUnary(unary) {
        const r = this.eval(unary.expr);
        if (unary.operator.type === _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.BANG) {
            return new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData((0,_result__WEBPACK_IMPORTED_MODULE_6__.falsy)(r));
        }
        throw new Error(`unknown unary operator: ${unary.operator.lexeme}`);
    }
    visitBinary(binary) {
        const left = this.eval(binary.left);
        const right = this.eval(binary.right);
        switch (binary.operator.type) {
            case _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.EQUAL_EQUAL:
                return new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData((0,_result__WEBPACK_IMPORTED_MODULE_6__.equals)(left, right));
            case _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.BANG_EQUAL:
                return new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData(!(0,_result__WEBPACK_IMPORTED_MODULE_6__.equals)(left, right));
            case _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.GREATER:
                return new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData((0,_result__WEBPACK_IMPORTED_MODULE_6__.greaterThan)(left, right));
            case _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.GREATER_EQUAL:
                return new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData((0,_result__WEBPACK_IMPORTED_MODULE_6__.equals)(left, right) || (0,_result__WEBPACK_IMPORTED_MODULE_6__.greaterThan)(left, right));
            case _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.LESS:
                return new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData((0,_result__WEBPACK_IMPORTED_MODULE_6__.lessThan)(left, right));
            case _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.LESS_EQUAL:
                return new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData((0,_result__WEBPACK_IMPORTED_MODULE_6__.equals)(left, right) || (0,_result__WEBPACK_IMPORTED_MODULE_6__.lessThan)(left, right));
        }
        throw new Error(`unknown binary operator: ${binary.operator.lexeme}`);
    }
    visitLogical(logical) {
        let result;
        for (const arg of logical.args) {
            result = this.eval(arg);
            // Break?
            if ((logical.operator.type === _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.AND && (0,_result__WEBPACK_IMPORTED_MODULE_6__.falsy)(result)) ||
                (logical.operator.type === _lexer__WEBPACK_IMPORTED_MODULE_5__.TokenType.OR && (0,_result__WEBPACK_IMPORTED_MODULE_6__.truthy)(result))) {
                break;
            }
        }
        // result is always assigned before we return here
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return result;
    }
    visitGrouping(grouping) {
        return this.eval(grouping.group);
    }
    visitContextAccess(contextAccess) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const r = this.context.get(contextAccess.name.lexeme);
        return r;
    }
    visitIndexAccess(ia) {
        let idx;
        if (ia.index instanceof _ast__WEBPACK_IMPORTED_MODULE_0__.Star) {
            idx = new _idxHelper__WEBPACK_IMPORTED_MODULE_4__.idxHelper(true, undefined);
        }
        else {
            let idxResult;
            try {
                idxResult = this.eval(ia.index);
            }
            catch (e) {
                throw new Error(`could not evaluate index for index access: ${e.message}`, { cause: e });
            }
            idx = new _idxHelper__WEBPACK_IMPORTED_MODULE_4__.idxHelper(false, idxResult);
        }
        const objResult = this.eval(ia.expr);
        let result;
        switch (objResult.kind) {
            case _data__WEBPACK_IMPORTED_MODULE_1__.Kind.Array: {
                const tobjResult = objResult;
                if (tobjResult instanceof _filtered_array__WEBPACK_IMPORTED_MODULE_2__.FilteredArray) {
                    result = filteredArrayAccess(tobjResult, idx);
                }
                else {
                    result = arrayAccess(tobjResult, idx);
                }
                break;
            }
            case _data__WEBPACK_IMPORTED_MODULE_1__.Kind.Dictionary: {
                const tobjResult = objResult;
                result = objectAccess(tobjResult, idx);
                break;
            }
            default:
                if (idx.star) {
                    result = new _filtered_array__WEBPACK_IMPORTED_MODULE_2__.FilteredArray();
                }
                else {
                    result = new _data__WEBPACK_IMPORTED_MODULE_1__.Null();
                }
        }
        return result;
    }
    visitFunctionCall(functionCall) {
        // Evaluate arguments
        const args = functionCall.args.map(arg => this.eval(arg));
        // Get function definitions
        const functionName = functionCall.functionName.lexeme.toLowerCase();
        const f = this.functions?.get(functionName) || _funcs__WEBPACK_IMPORTED_MODULE_3__.wellKnownFunctions[functionName];
        return f.call(...args);
    }
}
function filteredArrayAccess(fa, idx) {
    const result = new _filtered_array__WEBPACK_IMPORTED_MODULE_2__.FilteredArray();
    for (const item of fa.values()) {
        // Check the type of the nested item
        switch (item.kind) {
            case _data__WEBPACK_IMPORTED_MODULE_1__.Kind.Dictionary: {
                const ti = item;
                if (idx.star) {
                    for (const v of ti.values()) {
                        result.add(v);
                    }
                }
                else if (idx.str !== undefined) {
                    const v = ti.get(idx.str);
                    if (v !== undefined) {
                        result.add(v);
                    }
                }
                break;
            }
            case _data__WEBPACK_IMPORTED_MODULE_1__.Kind.Array: {
                const ti = item;
                if (idx.star) {
                    for (const v of ti.values()) {
                        result.add(v);
                    }
                }
                else if (idx.int !== undefined && idx.int < ti.values().length) {
                    result.add(ti.get(idx.int));
                }
                break;
            }
        }
    }
    return result;
}
function arrayAccess(a, idx) {
    if (idx.star) {
        const fa = new _filtered_array__WEBPACK_IMPORTED_MODULE_2__.FilteredArray();
        for (const item of a.values()) {
            fa.add(item);
        }
        return fa;
    }
    if (idx.int !== undefined && idx.int < a.values().length) {
        return a.get(idx.int);
    }
    return new _data__WEBPACK_IMPORTED_MODULE_1__.Null();
}
function objectAccess(obj, idx) {
    if (idx.star) {
        const fa = new _filtered_array__WEBPACK_IMPORTED_MODULE_2__.FilteredArray(...obj.values());
        return fa;
    }
    if (idx.str !== undefined) {
        const r = obj.get(idx.str);
        if (r !== undefined) {
            return r;
        }
    }
    return new _data__WEBPACK_IMPORTED_MODULE_1__.Null();
}
//# sourceMappingURL=evaluator.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/filtered_array.js":
/*!******************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/filtered_array.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FilteredArray: () => (/* binding */ FilteredArray)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./node_modules/@actions/expressions/dist/data/index.js");

class FilteredArray extends _data__WEBPACK_IMPORTED_MODULE_0__.Array {
}
//# sourceMappingURL=filtered_array.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/funcs.js":
/*!*********************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/funcs.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validateFunction: () => (/* binding */ validateFunction),
/* harmony export */   wellKnownFunctions: () => (/* binding */ wellKnownFunctions)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ "./node_modules/@actions/expressions/dist/errors.js");
/* harmony import */ var _funcs_contains__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./funcs/contains */ "./node_modules/@actions/expressions/dist/funcs/contains.js");
/* harmony import */ var _funcs_endswith__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./funcs/endswith */ "./node_modules/@actions/expressions/dist/funcs/endswith.js");
/* harmony import */ var _funcs_format__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./funcs/format */ "./node_modules/@actions/expressions/dist/funcs/format.js");
/* harmony import */ var _funcs_fromjson__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./funcs/fromjson */ "./node_modules/@actions/expressions/dist/funcs/fromjson.js");
/* harmony import */ var _funcs_join__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./funcs/join */ "./node_modules/@actions/expressions/dist/funcs/join.js");
/* harmony import */ var _funcs_startswith__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./funcs/startswith */ "./node_modules/@actions/expressions/dist/funcs/startswith.js");
/* harmony import */ var _funcs_tojson__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./funcs/tojson */ "./node_modules/@actions/expressions/dist/funcs/tojson.js");








const wellKnownFunctions = {
    contains: _funcs_contains__WEBPACK_IMPORTED_MODULE_1__.contains,
    endswith: _funcs_endswith__WEBPACK_IMPORTED_MODULE_2__.endswith,
    format: _funcs_format__WEBPACK_IMPORTED_MODULE_3__.format,
    fromjson: _funcs_fromjson__WEBPACK_IMPORTED_MODULE_4__.fromjson,
    join: _funcs_join__WEBPACK_IMPORTED_MODULE_5__.join,
    startswith: _funcs_startswith__WEBPACK_IMPORTED_MODULE_6__.startswith,
    tojson: _funcs_tojson__WEBPACK_IMPORTED_MODULE_7__.tojson
};
// validateFunction returns the function definition for the given function name.
// If the function does not exist or an incorrect number of arguments is provided,
// an error is returned.
function validateFunction(context, identifier, argCount) {
    // Expression function names are case-insensitive.
    const name = identifier.lexeme.toLowerCase();
    let f;
    f = wellKnownFunctions[name];
    if (!f) {
        f = context.extensionFunctions.get(name);
        if (!f) {
            if (!context.allowUnknownKeywords) {
                throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ExpressionError(_errors__WEBPACK_IMPORTED_MODULE_0__.ErrorType.ErrorUnrecognizedFunction, identifier);
            }
            // Skip argument validation for unknown functions
            return;
        }
    }
    if (argCount < f.minArgs) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ExpressionError(_errors__WEBPACK_IMPORTED_MODULE_0__.ErrorType.ErrorTooFewParameters, identifier);
    }
    if (argCount > f.maxArgs) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_0__.ExpressionError(_errors__WEBPACK_IMPORTED_MODULE_0__.ErrorType.ErrorTooManyParameters, identifier);
    }
}
//# sourceMappingURL=funcs.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/funcs/contains.js":
/*!******************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/funcs/contains.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contains: () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data */ "./node_modules/@actions/expressions/dist/data/index.js");
/* harmony import */ var _result__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../result */ "./node_modules/@actions/expressions/dist/result.js");


const contains = {
    name: "contains",
    description: "`contains( search, item )`\n\nReturns `true` if `search` contains `item`. If `search` is an array, this function returns `true` if the `item` is an element in the array. If `search` is a string, this function returns `true` if the `item` is a substring of `search`. This function is not case sensitive. Casts values to a string.",
    minArgs: 2,
    maxArgs: 2,
    call: (...args) => {
        const left = args[0];
        const right = args[1];
        if (left.primitive) {
            const ls = left.coerceString();
            if (right.primitive) {
                const rs = right.coerceString();
                return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(ls.toLowerCase().includes(rs.toLowerCase()));
            }
        }
        else if (left.kind === _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Array) {
            const la = left;
            if (la.values().length === 0) {
                return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(false);
            }
            for (const v of la.values()) {
                if ((0,_result__WEBPACK_IMPORTED_MODULE_1__.equals)(right, v)) {
                    return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(true);
                }
            }
        }
        return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(false);
    }
};
//# sourceMappingURL=contains.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/funcs/endswith.js":
/*!******************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/funcs/endswith.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   endswith: () => (/* binding */ endswith)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data */ "./node_modules/@actions/expressions/dist/data/index.js");
/* harmony import */ var _result__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../result */ "./node_modules/@actions/expressions/dist/result.js");


const endswith = {
    name: "endsWith",
    description: "`endsWith( searchString, searchValue )`\n\nReturns `true` if `searchString` ends with `searchValue`. This function is not case sensitive. Casts values to a string.",
    minArgs: 2,
    maxArgs: 2,
    call: (...args) => {
        const left = args[0];
        if (!left.primitive) {
            return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(false);
        }
        const right = args[1];
        if (!right.primitive) {
            return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(false);
        }
        const ls = (0,_result__WEBPACK_IMPORTED_MODULE_1__.toUpperSpecial)(left.coerceString());
        const rs = (0,_result__WEBPACK_IMPORTED_MODULE_1__.toUpperSpecial)(right.coerceString());
        return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(ls.endsWith(rs));
    }
};
//# sourceMappingURL=endswith.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/funcs/format.js":
/*!****************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/funcs/format.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   format: () => (/* binding */ format)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data */ "./node_modules/@actions/expressions/dist/data/index.js");

const format = {
    name: "format",
    description: "`format( string, replaceValue0, replaceValue1, ..., replaceValueN)`\n\nReplaces values in the `string`, with the variable `replaceValueN`. Variables in the `string` are specified using the `{N}` syntax, where `N` is an integer. You must specify at least one `replaceValue` and `string`. There is no maximum for the number of variables (`replaceValueN`) you can use. Escape curly braces using double braces.",
    minArgs: 1,
    maxArgs: 255 /*MAX_ARGUMENTS*/,
    call: (...args) => {
        const fs = args[0].coerceString();
        const result = [];
        let index = 0;
        while (index < fs.length) {
            const lbrace = fs.indexOf("{", index);
            const rbrace = fs.indexOf("}", index);
            // Left brace
            if (lbrace >= 0 && (rbrace < 0 || rbrace > lbrace)) {
                // Escaped left brace
                if (safeCharAt(fs, lbrace + 1) === "{") {
                    result.push(fs.substr(index, lbrace - index + 1));
                    index = lbrace + 2;
                    continue;
                }
                // Left brace, number, optional format specifiers, right brace
                if (rbrace > lbrace + 1) {
                    const argIndex = readArgIndex(fs, lbrace + 1);
                    if (argIndex.success) {
                        // Check parameter count
                        if (1 + argIndex.result > args.length - 1) {
                            throw new Error(`The following format string references more arguments than were supplied: ${fs}`);
                        }
                        // Append the portion before the left brace
                        if (lbrace > index) {
                            result.push(fs.substr(index, lbrace - index));
                        }
                        // Append the arg
                        result.push(`${args[1 + argIndex.result].coerceString()}`);
                        index = rbrace + 1;
                        continue;
                    }
                }
                throw new Error(`The following format string is invalid: ${fs}`);
            }
            // Right brace
            else if (rbrace >= 0) {
                // Escaped right brace
                if (safeCharAt(fs, rbrace + 1) === "}") {
                    result.push(fs.substr(index, rbrace - index + 1));
                    index = rbrace + 2;
                }
                else {
                    throw new Error(`The following format string is invalid: ${fs}`);
                }
            }
            // Last segment
            else {
                result.push(fs.substr(index));
                break;
            }
        }
        return new _data__WEBPACK_IMPORTED_MODULE_0__.StringData(result.join(""));
    }
};
function safeCharAt(string, index) {
    if (string.length > index) {
        return string[index];
    }
    return "\0";
}
function readArgIndex(string, startIndex) {
    // Count the number of digits
    let length = 0;
    for (;;) {
        const nextChar = safeCharAt(string, startIndex + length);
        if (nextChar >= "0" && nextChar <= "9") {
            length++;
        }
        else {
            break;
        }
    }
    // Validate at least one digit
    if (length < 1) {
        return {
            success: false
        };
    }
    // Parse the number
    const endIndex = startIndex + length - 1;
    const result = parseInt(string.substr(startIndex, length));
    return {
        success: !isNaN(result),
        result: result,
        endIndex: endIndex
    };
}
//# sourceMappingURL=format.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/funcs/fromjson.js":
/*!******************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/funcs/fromjson.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromjson: () => (/* binding */ fromjson)
/* harmony export */ });
/* harmony import */ var _data_reviver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/reviver */ "./node_modules/@actions/expressions/dist/data/reviver.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../errors */ "./node_modules/@actions/expressions/dist/errors.js");


const fromjson = {
    name: "fromJson",
    description: "`fromJSON(value)`\n\nReturns a JSON object or JSON data type for `value`. You can use this function to provide a JSON object as an evaluated expression or to convert environment variables from a string.",
    minArgs: 1,
    maxArgs: 1,
    call: (...args) => {
        const input = args[0];
        const is = input.coerceString();
        if (is.trim() === "") {
            throw new Error("empty input");
        }
        try {
            return JSON.parse(is, _data_reviver__WEBPACK_IMPORTED_MODULE_0__.reviver);
        }
        catch (e) {
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.ExpressionEvaluationError("Error parsing JSON when evaluating fromJson", { cause: e });
        }
    }
};
//# sourceMappingURL=fromjson.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/funcs/join.js":
/*!**************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/funcs/join.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   join: () => (/* binding */ join)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data */ "./node_modules/@actions/expressions/dist/data/index.js");

const join = {
    name: "join",
    description: "`join( array, optionalSeparator )`\n\nThe value for `array` can be an array or a string. All values in `array` are concatenated into a string. If you provide `optionalSeparator`, it is inserted between the concatenated values. Otherwise, the default separator `,` is used. Casts values to a string.",
    minArgs: 1,
    maxArgs: 2,
    call: (...args) => {
        // Primitive
        if (args[0].primitive) {
            return new _data__WEBPACK_IMPORTED_MODULE_0__.StringData(args[0].coerceString());
        }
        // Array
        if (args[0].kind === _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Array) {
            // Separator
            let separator = ",";
            if (args.length > 1 && args[1].primitive) {
                separator = args[1].coerceString();
            }
            // Convert items to strings
            return new _data__WEBPACK_IMPORTED_MODULE_0__.StringData(args[0]
                .values()
                .map(item => item.coerceString())
                .join(separator));
        }
        return new _data__WEBPACK_IMPORTED_MODULE_0__.StringData("");
    }
};
//# sourceMappingURL=join.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/funcs/startswith.js":
/*!********************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/funcs/startswith.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   startswith: () => (/* binding */ startswith)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data */ "./node_modules/@actions/expressions/dist/data/index.js");
/* harmony import */ var _result__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../result */ "./node_modules/@actions/expressions/dist/result.js");


const startswith = {
    name: "startsWith",
    description: "`startsWith( searchString, searchValue )`\n\nReturns `true` when `searchString` starts with `searchValue`. This function is not case sensitive. Casts values to a string.",
    minArgs: 2,
    maxArgs: 2,
    call: (...args) => {
        const left = args[0];
        if (!left.primitive) {
            return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(false);
        }
        const right = args[1];
        if (!right.primitive) {
            return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(false);
        }
        const ls = (0,_result__WEBPACK_IMPORTED_MODULE_1__.toUpperSpecial)(left.coerceString());
        const rs = (0,_result__WEBPACK_IMPORTED_MODULE_1__.toUpperSpecial)(right.coerceString());
        return new _data__WEBPACK_IMPORTED_MODULE_0__.BooleanData(ls.startsWith(rs));
    }
};
//# sourceMappingURL=startswith.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/funcs/tojson.js":
/*!****************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/funcs/tojson.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tojson: () => (/* binding */ tojson)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data */ "./node_modules/@actions/expressions/dist/data/index.js");
/* harmony import */ var _data_replacer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/replacer */ "./node_modules/@actions/expressions/dist/data/replacer.js");


const tojson = {
    name: "toJson",
    description: "`toJSON(value)`\n\nReturns a pretty-print JSON representation of `value`. You can use this function to debug the information provided in contexts.",
    minArgs: 1,
    maxArgs: 1,
    call: (...args) => {
        return new _data__WEBPACK_IMPORTED_MODULE_0__.StringData(JSON.stringify(args[0], _data_replacer__WEBPACK_IMPORTED_MODULE_1__.replacer, "  "));
    }
};
//# sourceMappingURL=tojson.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/idxHelper.js":
/*!*************************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/idxHelper.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   idxHelper: () => (/* binding */ idxHelper)
/* harmony export */ });
class idxHelper {
    constructor(star, idx) {
        this.star = star;
        if (!idx) {
            return;
        }
        if (!star) {
            if (idx.primitive) {
                this.str = idx.coerceString();
            }
            let f = idx.number();
            if (!isNaN(f) && isFinite(f) && f >= 0) {
                f = Math.floor(f);
                this.int = f;
            }
        }
    }
}
//# sourceMappingURL=idxHelper.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DescriptionDictionary: () => (/* reexport safe */ _completion_descriptionDictionary__WEBPACK_IMPORTED_MODULE_2__.DescriptionDictionary),
/* harmony export */   Evaluator: () => (/* reexport safe */ _evaluator__WEBPACK_IMPORTED_MODULE_5__.Evaluator),
/* harmony export */   Expr: () => (/* reexport safe */ _ast__WEBPACK_IMPORTED_MODULE_0__.Expr),
/* harmony export */   ExpressionError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_4__.ExpressionError),
/* harmony export */   ExpressionEvaluationError: () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_4__.ExpressionEvaluationError),
/* harmony export */   Lexer: () => (/* reexport safe */ _lexer__WEBPACK_IMPORTED_MODULE_7__.Lexer),
/* harmony export */   Parser: () => (/* reexport safe */ _parser__WEBPACK_IMPORTED_MODULE_8__.Parser),
/* harmony export */   complete: () => (/* reexport safe */ _completion__WEBPACK_IMPORTED_MODULE_1__.complete),
/* harmony export */   data: () => (/* reexport module object */ _data__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   isDescriptionDictionary: () => (/* reexport safe */ _completion_descriptionDictionary__WEBPACK_IMPORTED_MODULE_2__.isDescriptionDictionary),
/* harmony export */   wellKnownFunctions: () => (/* reexport safe */ _funcs__WEBPACK_IMPORTED_MODULE_6__.wellKnownFunctions)
/* harmony export */ });
/* harmony import */ var _ast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ast */ "./node_modules/@actions/expressions/dist/ast.js");
/* harmony import */ var _completion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./completion */ "./node_modules/@actions/expressions/dist/completion.js");
/* harmony import */ var _completion_descriptionDictionary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./completion/descriptionDictionary */ "./node_modules/@actions/expressions/dist/completion/descriptionDictionary.js");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./data */ "./node_modules/@actions/expressions/dist/data/index.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./errors */ "./node_modules/@actions/expressions/dist/errors.js");
/* harmony import */ var _evaluator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./evaluator */ "./node_modules/@actions/expressions/dist/evaluator.js");
/* harmony import */ var _funcs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./funcs */ "./node_modules/@actions/expressions/dist/funcs.js");
/* harmony import */ var _lexer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lexer */ "./node_modules/@actions/expressions/dist/lexer.js");
/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parser */ "./node_modules/@actions/expressions/dist/parser.js");









//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/lexer.js":
/*!*********************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/lexer.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lexer: () => (/* binding */ Lexer),
/* harmony export */   TokenType: () => (/* binding */ TokenType),
/* harmony export */   tokenString: () => (/* binding */ tokenString)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./node_modules/@actions/expressions/dist/data/index.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ "./node_modules/@actions/expressions/dist/errors.js");


var TokenType;
(function (TokenType) {
    TokenType[TokenType["UNKNOWN"] = 0] = "UNKNOWN";
    TokenType[TokenType["LEFT_PAREN"] = 1] = "LEFT_PAREN";
    TokenType[TokenType["RIGHT_PAREN"] = 2] = "RIGHT_PAREN";
    TokenType[TokenType["LEFT_BRACKET"] = 3] = "LEFT_BRACKET";
    TokenType[TokenType["RIGHT_BRACKET"] = 4] = "RIGHT_BRACKET";
    TokenType[TokenType["COMMA"] = 5] = "COMMA";
    TokenType[TokenType["DOT"] = 6] = "DOT";
    TokenType[TokenType["BANG"] = 7] = "BANG";
    TokenType[TokenType["BANG_EQUAL"] = 8] = "BANG_EQUAL";
    TokenType[TokenType["EQUAL_EQUAL"] = 9] = "EQUAL_EQUAL";
    TokenType[TokenType["GREATER"] = 10] = "GREATER";
    TokenType[TokenType["GREATER_EQUAL"] = 11] = "GREATER_EQUAL";
    TokenType[TokenType["LESS"] = 12] = "LESS";
    TokenType[TokenType["LESS_EQUAL"] = 13] = "LESS_EQUAL";
    TokenType[TokenType["AND"] = 14] = "AND";
    TokenType[TokenType["OR"] = 15] = "OR";
    TokenType[TokenType["STAR"] = 16] = "STAR";
    TokenType[TokenType["NUMBER"] = 17] = "NUMBER";
    TokenType[TokenType["STRING"] = 18] = "STRING";
    TokenType[TokenType["IDENTIFIER"] = 19] = "IDENTIFIER";
    TokenType[TokenType["TRUE"] = 20] = "TRUE";
    TokenType[TokenType["FALSE"] = 21] = "FALSE";
    TokenType[TokenType["NULL"] = 22] = "NULL";
    TokenType[TokenType["EOF"] = 23] = "EOF";
})(TokenType || (TokenType = {}));
function tokenString(tok) {
    switch (tok.type) {
        case TokenType.EOF:
            return "EOF";
        case TokenType.NUMBER:
            return tok.lexeme;
        case TokenType.STRING:
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return tok.value.toString();
        default:
            return tok.lexeme;
    }
}
class Lexer {
    constructor(input) {
        this.input = input;
        this.start = 0;
        this.offset = 0;
        this.line = 0;
        this.lastLineOffset = 0;
        this.tokens = [];
    }
    lex() {
        if (this.input.length > _errors__WEBPACK_IMPORTED_MODULE_1__.MAX_EXPRESSION_LENGTH) {
            throw new Error("ErrorExceededMaxLength");
        }
        while (!this.atEnd()) {
            this.start = this.offset;
            const c = this.next();
            switch (c) {
                case "(":
                    this.addToken(TokenType.LEFT_PAREN);
                    break;
                case ")":
                    this.addToken(TokenType.RIGHT_PAREN);
                    break;
                case "[":
                    this.addToken(TokenType.LEFT_BRACKET);
                    break;
                case "]":
                    this.addToken(TokenType.RIGHT_BRACKET);
                    break;
                case ",":
                    this.addToken(TokenType.COMMA);
                    break;
                case ".":
                    if (this.previous() != TokenType.IDENTIFIER &&
                        this.previous() != TokenType.RIGHT_BRACKET &&
                        this.previous() != TokenType.RIGHT_PAREN &&
                        this.previous() != TokenType.STAR) {
                        this.consumeNumber();
                    }
                    else {
                        this.addToken(TokenType.DOT);
                    }
                    break;
                case "-":
                case "+":
                    this.consumeNumber();
                    break;
                case "!":
                    this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
                    break;
                case "=":
                    if (!this.match("=")) {
                        // Illegal; continue reading until we hit a boundary character and return an error
                        this.consumeIdentifier();
                        break;
                    }
                    this.addToken(TokenType.EQUAL_EQUAL);
                    break;
                case "<":
                    this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
                    break;
                case ">":
                    this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                    break;
                case "&":
                    if (!this.match("&")) {
                        // Illegal; continue reading until we hit a boundary character and return an error
                        this.consumeIdentifier();
                        break;
                    }
                    this.addToken(TokenType.AND);
                    break;
                case "|":
                    if (!this.match("|")) {
                        // Illegal; continue reading until we hit a boundary character and return an error
                        this.consumeIdentifier();
                        break;
                    }
                    this.addToken(TokenType.OR);
                    break;
                case "*":
                    this.addToken(TokenType.STAR);
                    break;
                // Ignore whitespace.
                case " ":
                case "\r":
                case "\t":
                    break;
                case "\n":
                    ++this.line;
                    this.lastLineOffset = this.offset;
                    break;
                case "'":
                    this.consumeString();
                    break;
                default:
                    switch (true) {
                        case isDigit(c):
                            this.consumeNumber();
                            break;
                        default:
                            this.consumeIdentifier();
                            break;
                    }
            }
        }
        this.tokens.push({
            type: TokenType.EOF,
            lexeme: "",
            range: this.range()
        });
        return {
            tokens: this.tokens
        };
    }
    pos() {
        return {
            line: this.line,
            column: this.start - this.lastLineOffset
        };
    }
    endPos() {
        return {
            line: this.line,
            column: this.offset - this.lastLineOffset
        };
    }
    range() {
        return {
            start: this.pos(),
            end: this.endPos()
        };
    }
    atEnd() {
        return this.offset >= this.input.length;
    }
    peek() {
        if (this.atEnd()) {
            return "\0";
        }
        return this.input[this.offset];
    }
    peekNext() {
        if (this.offset + 1 >= this.input.length) {
            return "\0";
        }
        return this.input[this.offset + 1];
    }
    previous() {
        const l = this.tokens.length;
        if (l == 0) {
            return TokenType.EOF;
        }
        return this.tokens[l - 1].type;
    }
    next() {
        return this.input[this.offset++];
    }
    match(expected) {
        if (this.atEnd()) {
            return false;
        }
        if (this.input[this.offset] !== expected) {
            return false;
        }
        this.offset++;
        return true;
    }
    addToken(type, value) {
        this.tokens.push({
            type,
            lexeme: this.input.substring(this.start, this.offset),
            range: this.range(),
            value
        });
    }
    consumeNumber() {
        while (!this.atEnd() && (!isBoundary(this.peek()) || this.peek() == ".")) {
            this.next();
        }
        const lexeme = this.input.substring(this.start, this.offset);
        const value = new _data__WEBPACK_IMPORTED_MODULE_0__.StringData(lexeme).number();
        if (isNaN(value)) {
            throw new Error(`Unexpected symbol: '${lexeme}'. Located at position ${this.start + 1} within expression: ${this.input}`);
        }
        this.addToken(TokenType.NUMBER, value);
    }
    consumeString() {
        while ((this.peek() !== "'" || this.peekNext() === "'") && !this.atEnd()) {
            if (this.peek() === "\n")
                this.line++;
            if (this.peek() === "'" && this.peekNext() === "'") {
                // Escaped "'", consume
                this.next();
            }
            this.next();
        }
        if (this.atEnd()) {
            // Unterminated string
            throw new Error(`Unexpected symbol: '${this.input.substring(this.start)}'. Located at position ${this.start + 1} within expression: ${this.input}`);
        }
        // Closing '
        this.next();
        // Trim the surrounding quotes.
        let value = this.input.substring(this.start + 1, this.offset - 1);
        value = value.replace("''", "'");
        this.addToken(TokenType.STRING, value);
    }
    consumeIdentifier() {
        while (!this.atEnd() && !isBoundary(this.peek())) {
            this.next();
        }
        let tokenType = TokenType.IDENTIFIER;
        let tokenValue = undefined;
        const lexeme = this.input.substring(this.start, this.offset);
        if (this.previous() != TokenType.DOT) {
            switch (lexeme) {
                case "true":
                    tokenType = TokenType.TRUE;
                    break;
                case "false":
                    tokenType = TokenType.FALSE;
                    break;
                case "null":
                    tokenType = TokenType.NULL;
                    break;
                case "NaN":
                    tokenType = TokenType.NUMBER;
                    tokenValue = NaN;
                    break;
                case "Infinity":
                    tokenType = TokenType.NUMBER;
                    tokenValue = Infinity;
                    break;
            }
        }
        if (!isLegalIdentifier(lexeme)) {
            throw new Error(`Unexpected symbol: '${lexeme}'. Located at position ${this.start + 1} within expression: ${this.input}`);
        }
        this.addToken(tokenType, tokenValue);
    }
}
function isDigit(c) {
    return c >= "0" && c <= "9";
}
function isBoundary(c) {
    switch (c) {
        case "(":
        case "[":
        case ")":
        case "]":
        case ",":
        case ".":
        case "!":
        case ">":
        case "<":
        case "=":
        case "&":
        case "|":
            return true;
    }
    return /\s/.test(c);
}
function isLegalIdentifier(str) {
    if (str == "") {
        return false;
    }
    const first = str[0];
    if ((first >= "a" && first <= "z") || (first >= "A" && first <= "Z") || first == "_") {
        for (const c of str.substring(1).split("")) {
            if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || (c >= "0" && c <= "9") || c == "_" || c == "-") {
                // OK
            }
            else {
                return false;
            }
        }
        return true;
    }
    return false;
}
//# sourceMappingURL=lexer.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/parser.js":
/*!**********************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/parser.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Parser: () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _ast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ast */ "./node_modules/@actions/expressions/dist/ast.js");
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data */ "./node_modules/@actions/expressions/dist/data/index.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors */ "./node_modules/@actions/expressions/dist/errors.js");
/* harmony import */ var _funcs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./funcs */ "./node_modules/@actions/expressions/dist/funcs.js");
/* harmony import */ var _lexer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lexer */ "./node_modules/@actions/expressions/dist/lexer.js");





class Parser {
    /**
     * Constructs a new parser for the given tokens
     *
     * @param tokens Tokens to build a parse tree from
     * @param extensionContexts Available context names
     * @param extensionFunctions Available functions (beyond the built-in ones)
     */
    constructor(tokens, extensionContexts, extensionFunctions) {
        this.tokens = tokens;
        this.offset = 0;
        this.depth = 0;
        this.extContexts = new Map();
        this.extFuncs = new Map();
        for (const contextName of extensionContexts) {
            this.extContexts.set(contextName.toLowerCase(), true);
        }
        for (const { name, func } of extensionFunctions.map(x => ({
            name: x.name,
            func: x
        }))) {
            this.extFuncs.set(name.toLowerCase(), func);
        }
        this.context = {
            allowUnknownKeywords: false,
            extensionContexts: this.extContexts,
            extensionFunctions: this.extFuncs
        };
    }
    parse() {
        // eslint-disable-next-line prefer-const
        let result;
        // No tokens
        if (this.atEnd()) {
            return result;
        }
        result = this.expression();
        if (!this.atEnd()) {
            throw this.buildError(_errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnexpectedSymbol, this.peek());
        }
        return result;
    }
    expression() {
        this.incrDepth();
        try {
            return this.logicalOr();
        }
        finally {
            this.decrDepth();
        }
    }
    logicalOr() {
        // && is higher precedence than ||
        let expr = this.logicalAnd();
        if (this.check(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.OR)) {
            // Track depth
            this.incrDepth();
            try {
                const logical = new _ast__WEBPACK_IMPORTED_MODULE_0__.Logical(this.peek(), [expr]);
                expr = logical;
                while (this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.OR)) {
                    const right = this.logicalAnd();
                    logical.args.push(right);
                }
            }
            finally {
                this.decrDepth();
            }
        }
        return expr;
    }
    logicalAnd() {
        // == and != are higher precedence than &&
        let expr = this.equality();
        if (this.check(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.AND)) {
            // Track depth
            this.incrDepth();
            try {
                const logical = new _ast__WEBPACK_IMPORTED_MODULE_0__.Logical(this.peek(), [expr]);
                expr = logical;
                while (this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.AND)) {
                    const right = this.equality();
                    logical.args.push(right);
                }
            }
            finally {
                this.decrDepth();
            }
        }
        return expr;
    }
    equality() {
        // >, >=, <, <= are higher precedence than == and !=
        let expr = this.comparison();
        while (this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.BANG_EQUAL, _lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new _ast__WEBPACK_IMPORTED_MODULE_0__.Binary(expr, operator, right);
        }
        return expr;
    }
    comparison() {
        // ! is higher precedence than >, >=, <, <=
        let expr = this.unary();
        while (this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.GREATER, _lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.GREATER_EQUAL, _lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.LESS, _lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new _ast__WEBPACK_IMPORTED_MODULE_0__.Binary(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.BANG)) {
            // Track depth
            this.incrDepth();
            const operator = this.previous();
            const unary = this.unary();
            try {
                return new _ast__WEBPACK_IMPORTED_MODULE_0__.Unary(operator, unary);
            }
            finally {
                this.decrDepth();
            }
        }
        return this.index();
    }
    index() {
        let expr = this.call();
        let depthIncreased = 0;
        if (expr instanceof _ast__WEBPACK_IMPORTED_MODULE_0__.Grouping || expr instanceof _ast__WEBPACK_IMPORTED_MODULE_0__.FunctionCall || expr instanceof _ast__WEBPACK_IMPORTED_MODULE_0__.ContextAccess) {
            let cont = true;
            while (cont) {
                switch (true) {
                    case this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.LEFT_BRACKET): {
                        let indexExpr;
                        if (this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.STAR)) {
                            indexExpr = new _ast__WEBPACK_IMPORTED_MODULE_0__.Star();
                        }
                        else {
                            indexExpr = this.expression();
                        }
                        this.consume(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.RIGHT_BRACKET, _errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnexpectedSymbol);
                        // Track depth
                        this.incrDepth();
                        depthIncreased++;
                        expr = new _ast__WEBPACK_IMPORTED_MODULE_0__.IndexAccess(expr, indexExpr);
                        break;
                    }
                    case this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.DOT):
                        // Track depth
                        this.incrDepth();
                        depthIncreased++;
                        if (this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.IDENTIFIER)) {
                            const property = this.previous();
                            expr = new _ast__WEBPACK_IMPORTED_MODULE_0__.IndexAccess(expr, new _ast__WEBPACK_IMPORTED_MODULE_0__.Literal(new _data__WEBPACK_IMPORTED_MODULE_1__.StringData(property.lexeme), property));
                        }
                        else if (this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.STAR)) {
                            expr = new _ast__WEBPACK_IMPORTED_MODULE_0__.IndexAccess(expr, new _ast__WEBPACK_IMPORTED_MODULE_0__.Star());
                        }
                        else {
                            throw this.buildError(_errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnexpectedSymbol, this.peek());
                        }
                        break;
                    default:
                        cont = false;
                }
            }
        }
        for (let i = 0; i < depthIncreased; i++) {
            this.decrDepth();
        }
        return expr;
    }
    call() {
        if (!this.check(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.IDENTIFIER)) {
            return this.primary();
        }
        const identifier = this.next();
        if (!this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.LEFT_PAREN)) {
            if (!this.extContexts.has(identifier.lexeme.toLowerCase())) {
                throw this.buildError(_errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnrecognizedContext, identifier);
            }
            return new _ast__WEBPACK_IMPORTED_MODULE_0__.ContextAccess(identifier);
        }
        // Function call
        const args = [];
        // Arguments
        while (!this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.RIGHT_PAREN)) {
            const aexp = this.expression();
            args.push(aexp);
            if (!this.check(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.RIGHT_PAREN)) {
                this.consume(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.COMMA, _errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnexpectedSymbol);
            }
        }
        (0,_funcs__WEBPACK_IMPORTED_MODULE_3__.validateFunction)(this.context, identifier, args.length);
        return new _ast__WEBPACK_IMPORTED_MODULE_0__.FunctionCall(identifier, args);
    }
    primary() {
        switch (true) {
            case this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.FALSE):
                return new _ast__WEBPACK_IMPORTED_MODULE_0__.Literal(new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData(false), this.previous());
            case this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.TRUE):
                return new _ast__WEBPACK_IMPORTED_MODULE_0__.Literal(new _data__WEBPACK_IMPORTED_MODULE_1__.BooleanData(true), this.previous());
            case this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.NULL):
                return new _ast__WEBPACK_IMPORTED_MODULE_0__.Literal(new _data__WEBPACK_IMPORTED_MODULE_1__.Null(), this.previous());
            case this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.NUMBER):
                return new _ast__WEBPACK_IMPORTED_MODULE_0__.Literal(new _data__WEBPACK_IMPORTED_MODULE_1__.NumberData(this.previous().value), this.previous());
            case this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.STRING):
                return new _ast__WEBPACK_IMPORTED_MODULE_0__.Literal(new _data__WEBPACK_IMPORTED_MODULE_1__.StringData(this.previous().value), this.previous());
            case this.match(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.LEFT_PAREN): {
                const expr = this.expression();
                if (this.atEnd()) {
                    throw this.buildError(_errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnexpectedEndOfExpression, this.previous()); // Back up to get the last token before the EOF
                }
                this.consume(_lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.RIGHT_PAREN, _errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnexpectedSymbol);
                return new _ast__WEBPACK_IMPORTED_MODULE_0__.Grouping(expr);
            }
            case this.atEnd():
                throw this.buildError(_errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnexpectedEndOfExpression, this.previous()); // Back up to get the last token before the EOF
        }
        throw this.buildError(_errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorUnexpectedSymbol, this.peek());
    }
    // match consumes the next token if it matches any of the given types
    match(...tokenTypes) {
        for (const tokenType of tokenTypes) {
            if (this.check(tokenType)) {
                this.next();
                return true;
            }
        }
        return false;
    }
    // check peeks whether the next token is of the given type
    check(tokenType) {
        if (this.atEnd()) {
            return false;
        }
        return this.peek().type == tokenType;
    }
    // atEnd peeks whether the next token is EOF
    atEnd() {
        return this.peek().type == _lexer__WEBPACK_IMPORTED_MODULE_4__.TokenType.EOF;
    }
    next() {
        if (!this.atEnd()) {
            this.offset++;
        }
        return this.previous();
    }
    peek() {
        return this.tokens[this.offset];
    }
    // previous returns the previous token
    previous() {
        return this.tokens[this.offset - 1];
    }
    // consume attempts to consume the next token if it matches the given type. It returns an error of
    // the given ParseErrorKind otherwise.
    consume(tokenType, errorType) {
        if (this.check(tokenType)) {
            this.next();
            return;
        }
        throw this.buildError(errorType, this.peek());
    }
    incrDepth() {
        this.depth++;
        if (this.depth > _errors__WEBPACK_IMPORTED_MODULE_2__.MAX_PARSER_DEPTH) {
            throw this.buildError(_errors__WEBPACK_IMPORTED_MODULE_2__.ErrorType.ErrorExceededMaxDepth, this.peek());
        }
    }
    decrDepth() {
        this.depth--;
    }
    buildError(errType, token) {
        return new _errors__WEBPACK_IMPORTED_MODULE_2__.ExpressionError(errType, token);
    }
}
//# sourceMappingURL=parser.js.map

/***/ }),

/***/ "./node_modules/@actions/expressions/dist/result.js":
/*!**********************************************************!*\
  !*** ./node_modules/@actions/expressions/dist/result.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   coerceTypes: () => (/* binding */ coerceTypes),
/* harmony export */   equals: () => (/* binding */ equals),
/* harmony export */   falsy: () => (/* binding */ falsy),
/* harmony export */   greaterThan: () => (/* binding */ greaterThan),
/* harmony export */   lessThan: () => (/* binding */ lessThan),
/* harmony export */   toUpperSpecial: () => (/* binding */ toUpperSpecial),
/* harmony export */   truthy: () => (/* binding */ truthy)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./node_modules/@actions/expressions/dist/data/index.js");

function falsy(d) {
    switch (d.kind) {
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Null:
            return true;
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Boolean:
            return !d.value;
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Number: {
            const dv = d.value;
            return dv === 0 || isNaN(dv);
        }
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.String:
            return d.value.length === 0;
    }
    return false;
}
function truthy(d) {
    return !falsy(d);
}
// Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
// Except objects are not coerced to primitives.
function coerceTypes(li, ri) {
    let lv = li;
    let rv = ri;
    // Do nothing, same kind
    if (li.kind === ri.kind) {
        return [lv, rv];
    }
    switch (li.kind) {
        // Number, String
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Number:
            if (ri.kind === _data__WEBPACK_IMPORTED_MODULE_0__.Kind.String) {
                rv = new _data__WEBPACK_IMPORTED_MODULE_0__.NumberData(ri.number());
                return [lv, rv];
            }
            break;
        // String, Number
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.String:
            if (ri.kind === _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Number) {
                lv = new _data__WEBPACK_IMPORTED_MODULE_0__.NumberData(li.number());
                return [lv, rv];
            }
            break;
        // Boolean|Null, Any
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Null:
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Boolean:
            lv = new _data__WEBPACK_IMPORTED_MODULE_0__.NumberData(li.number());
            return coerceTypes(lv, rv);
    }
    // Any, Boolean|Null
    switch (ri.kind) {
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Null:
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Boolean:
            rv = new _data__WEBPACK_IMPORTED_MODULE_0__.NumberData(ri.number());
            return coerceTypes(lv, rv);
    }
    return [lv, rv];
}
// Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
// Except string comparison is OrdinalIgnoreCase, and objects are not coerced to primitives.
function equals(lhs, rhs) {
    const [lv, rv] = coerceTypes(lhs, rhs);
    if (lv.kind != rv.kind) {
        return false;
    }
    switch (lv.kind) {
        // Null, Null
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Null:
            return true;
        // Number, Number
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Number: {
            const ld = lv.value;
            const rd = rv.value;
            if (isNaN(ld) || isNaN(rd)) {
                return false;
            }
            return ld == rd;
        }
        // String, String
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.String: {
            const ls = lv.value;
            const rs = rv.value;
            return toUpperSpecial(ls) === toUpperSpecial(rs);
        }
        // Boolean, Boolean
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Boolean: {
            const lb = lv.value;
            const rb = rv.value;
            return lb == rb;
        }
        // Object, Object
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Dictionary:
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Array:
            // Check reference equality
            return lv === rv;
    }
    return false;
}
// Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
// Except string comparison is OrdinalIgnoreCase, and objects are not coerced to primitives.
function greaterThan(lhs, rhs) {
    const [lv, rv] = coerceTypes(lhs, rhs);
    if (lv.kind != rv.kind) {
        return false;
    }
    switch (lv.kind) {
        // Number, Number
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Number: {
            const lf = lv.value;
            const rf = rv.value;
            if (isNaN(lf) || isNaN(rf)) {
                return false;
            }
            return lf > rf;
        }
        // String, String
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.String: {
            let ls = lv.value;
            let rs = rv.value;
            ls = toUpperSpecial(ls);
            rs = toUpperSpecial(rs);
            return ls > rs;
        }
        // Boolean, Boolean
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Boolean: {
            const lb = lv.value;
            const rb = rv.value;
            return lb && !rb;
        }
    }
    return false;
}
// Similar to the Javascript abstract equality comparison algorithm http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3.
// Except string comparison is OrdinalIgnoreCase, and objects are not coerced to primitives.
function lessThan(lhs, rhs) {
    const [lv, rv] = coerceTypes(lhs, rhs);
    if (lv.kind != rv.kind) {
        return false;
    }
    switch (lv.kind) {
        // Number, Number
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Number: {
            const lf = lv.value;
            const rf = rv.value;
            if (isNaN(lf) || isNaN(rf)) {
                return false;
            }
            return lf < rf;
        }
        // String, String
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.String: {
            let ls = lv.value;
            let rs = rv.value;
            ls = toUpperSpecial(ls);
            rs = toUpperSpecial(rs);
            return ls < rs;
        }
        // Boolean, Boolean
        case _data__WEBPACK_IMPORTED_MODULE_0__.Kind.Boolean: {
            const lb = lv.value;
            const rb = rv.value;
            return !lb && rb;
        }
    }
    return false;
}
// Do not toUpper the small-dotless-ı
function toUpperSpecial(s) {
    const sb = [];
    let i = 0;
    const len = s.length;
    let found = s.indexOf("ı");
    while (i < len) {
        if (i < found) {
            sb.push(s.substring(i, found).toUpperCase()); // Append upper segment
            i = found;
        }
        else if (i == found) {
            sb.push(s.substring(i, i + 1));
            i += 1;
            found = s.indexOf("ı", i);
        }
        else {
            sb.push(s.substring(i).toUpperCase()); // Append upper remaining
            break;
        }
    }
    return sb.join("");
}
//# sourceMappingURL=result.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NoOperationTraceWriter: () => (/* reexport safe */ _templates_trace_writer__WEBPACK_IMPORTED_MODULE_2__.NoOperationTraceWriter),
/* harmony export */   convertWorkflowTemplate: () => (/* reexport safe */ _model_convert__WEBPACK_IMPORTED_MODULE_0__.convertWorkflowTemplate),
/* harmony export */   isBasicExpression: () => (/* reexport safe */ _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isBasicExpression),
/* harmony export */   isBoolean: () => (/* reexport safe */ _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isBoolean),
/* harmony export */   isLiteral: () => (/* reexport safe */ _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isLiteral),
/* harmony export */   isMapping: () => (/* reexport safe */ _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isMapping),
/* harmony export */   isNumber: () => (/* reexport safe */ _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isNumber),
/* harmony export */   isScalar: () => (/* reexport safe */ _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isScalar),
/* harmony export */   isSequence: () => (/* reexport safe */ _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isSequence),
/* harmony export */   isString: () => (/* reexport safe */ _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isString),
/* harmony export */   parseWorkflow: () => (/* reexport safe */ _workflows_workflow_parser__WEBPACK_IMPORTED_MODULE_3__.parseWorkflow)
/* harmony export */ });
/* harmony import */ var _model_convert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model/convert */ "./node_modules/@actions/workflow-parser/dist/model/convert.js");
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");
/* harmony import */ var _templates_trace_writer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./templates/trace-writer */ "./node_modules/@actions/workflow-parser/dist/templates/trace-writer.js");
/* harmony import */ var _workflows_workflow_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./workflows/workflow-parser */ "./node_modules/@actions/workflow-parser/dist/workflows/workflow-parser.js");




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/convert.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/convert.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorPolicy: () => (/* binding */ ErrorPolicy),
/* harmony export */   convertWorkflowTemplate: () => (/* binding */ convertWorkflowTemplate)
/* harmony export */ });
/* harmony import */ var _templates_tokens_template_token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../templates/tokens/template-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/template-token.js");
/* harmony import */ var _workflows_file_reference__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../workflows/file-reference */ "./node_modules/@actions/workflow-parser/dist/workflows/file-reference.js");
/* harmony import */ var _workflows_workflow_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../workflows/workflow-parser */ "./node_modules/@actions/workflow-parser/dist/workflows/workflow-parser.js");
/* harmony import */ var _converter_concurrency__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./converter/concurrency */ "./node_modules/@actions/workflow-parser/dist/model/converter/concurrency.js");
/* harmony import */ var _converter_events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./converter/events */ "./node_modules/@actions/workflow-parser/dist/model/converter/events.js");
/* harmony import */ var _converter_handle_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./converter/handle-errors */ "./node_modules/@actions/workflow-parser/dist/model/converter/handle-errors.js");
/* harmony import */ var _converter_jobs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./converter/jobs */ "./node_modules/@actions/workflow-parser/dist/model/converter/jobs.js");
/* harmony import */ var _converter_referencedWorkflow__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./converter/referencedWorkflow */ "./node_modules/@actions/workflow-parser/dist/model/converter/referencedWorkflow.js");
/* harmony import */ var _type_guards__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./type-guards */ "./node_modules/@actions/workflow-parser/dist/model/type-guards.js");









var ErrorPolicy;
(function (ErrorPolicy) {
    ErrorPolicy[ErrorPolicy["ReturnErrorsOnly"] = 0] = "ReturnErrorsOnly";
    ErrorPolicy[ErrorPolicy["TryConversion"] = 1] = "TryConversion";
})(ErrorPolicy || (ErrorPolicy = {}));
const defaultOptions = {
    maxReusableWorkflowDepth: 4,
    fetchReusableWorkflowDepth: 0,
    errorPolicy: ErrorPolicy.ReturnErrorsOnly
};
async function convertWorkflowTemplate(context, root, fileProvider, options = defaultOptions) {
    const result = {};
    const opts = getOptionsWithDefaults(options);
    if (context.errors.getErrors().length > 0 && opts.errorPolicy === ErrorPolicy.ReturnErrorsOnly) {
        result.errors = context.errors.getErrors().map(x => ({
            Message: x.message
        }));
        return result;
    }
    if (fileProvider === undefined && opts.fetchReusableWorkflowDepth > 0) {
        context.error(root, new Error("A file provider is required to fetch reusable workflows"));
    }
    try {
        const rootMapping = root.assertMapping("root");
        for (const item of rootMapping) {
            const key = item.key.assertString("root key");
            switch (key.value) {
                case "on":
                    result.events = (0,_converter_handle_errors__WEBPACK_IMPORTED_MODULE_5__.handleTemplateTokenErrors)(root, context, {}, () => (0,_converter_events__WEBPACK_IMPORTED_MODULE_4__.convertOn)(context, item.value));
                    break;
                case "jobs":
                    result.jobs = (0,_converter_handle_errors__WEBPACK_IMPORTED_MODULE_5__.handleTemplateTokenErrors)(root, context, [], () => (0,_converter_jobs__WEBPACK_IMPORTED_MODULE_6__.convertJobs)(context, item.value));
                    break;
                case "concurrency":
                    (0,_converter_handle_errors__WEBPACK_IMPORTED_MODULE_5__.handleTemplateTokenErrors)(root, context, {}, () => (0,_converter_concurrency__WEBPACK_IMPORTED_MODULE_3__.convertConcurrency)(context, item.value));
                    result.concurrency = item.value;
                    break;
                case "env":
                    result.env = item.value;
                    break;
            }
        }
        // Load referenced workflows
        for (const job of result.jobs || []) {
            if ((0,_type_guards__WEBPACK_IMPORTED_MODULE_8__.isReusableWorkflowJob)(job)) {
                if (opts.maxReusableWorkflowDepth === 0) {
                    context.error(job.ref, new Error("Reusable workflows are not allowed"));
                    continue;
                }
                if (opts.fetchReusableWorkflowDepth === 0 || fileProvider === undefined) {
                    continue;
                }
                try {
                    const file = await fileProvider.getFileContent((0,_workflows_file_reference__WEBPACK_IMPORTED_MODULE_1__.parseFileReference)(job.ref.value));
                    const workflow = (0,_workflows_workflow_parser__WEBPACK_IMPORTED_MODULE_2__.parseWorkflow)(file, context);
                    if (!workflow.value) {
                        continue;
                    }
                    (0,_converter_referencedWorkflow__WEBPACK_IMPORTED_MODULE_7__.convertReferencedWorkflow)(context, workflow.value, job);
                }
                catch {
                    context.error(job.ref, new Error("Unable to find reusable workflow"));
                }
            }
        }
    }
    catch (err) {
        if (err instanceof _templates_tokens_template_token__WEBPACK_IMPORTED_MODULE_0__.TemplateTokenError) {
            context.error(err.token, err);
        }
        else {
            // Report error for the root node
            context.error(root, err);
        }
    }
    finally {
        if (context.errors.getErrors().length > 0) {
            result.errors = context.errors.getErrors().map(x => ({
                Message: x.message
            }));
        }
    }
    return result;
}
function getOptionsWithDefaults(options) {
    return {
        maxReusableWorkflowDepth: options.maxReusableWorkflowDepth !== undefined
            ? options.maxReusableWorkflowDepth
            : defaultOptions.maxReusableWorkflowDepth,
        fetchReusableWorkflowDepth: options.fetchReusableWorkflowDepth !== undefined
            ? options.fetchReusableWorkflowDepth
            : defaultOptions.fetchReusableWorkflowDepth,
        errorPolicy: options.errorPolicy !== undefined ? options.errorPolicy : defaultOptions.errorPolicy
    };
}
//# sourceMappingURL=convert.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/concurrency.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/concurrency.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertConcurrency: () => (/* binding */ convertConcurrency)
/* harmony export */ });
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");

function convertConcurrency(context, token) {
    const result = {};
    if (token.isExpression) {
        return result;
    }
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isString)(token)) {
        result.group = token;
        return result;
    }
    const concurrencyProperty = token.assertMapping("concurrency group");
    for (const property of concurrencyProperty) {
        const propertyName = property.key.assertString("concurrency group key");
        if (property.key.isExpression || property.value.isExpression) {
            continue;
        }
        switch (propertyName.value) {
            case "group":
                result.group = property.value.assertString("concurrency group");
                break;
            case "cancel-in-progress":
                result.cancelInProgress = property.value.assertBoolean("cancel-in-progress").value;
                break;
            default:
                context.error(propertyName, `Invalid property name: ${propertyName.value}`);
        }
    }
    return result;
}
//# sourceMappingURL=concurrency.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/container.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/container.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertToJobContainer: () => (/* binding */ convertToJobContainer),
/* harmony export */   convertToJobServices: () => (/* binding */ convertToJobServices)
/* harmony export */ });
/* harmony import */ var _templates_tokens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");


function convertToJobContainer(context, container) {
    let image;
    let env;
    let ports;
    let volumes;
    let options;
    // Skip validation for expressions for now to match
    // behavior of the other parsers
    for (const [, token] of _templates_tokens__WEBPACK_IMPORTED_MODULE_0__.TemplateToken.traverse(container)) {
        if (token.isExpression) {
            return;
        }
    }
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isString)(container)) {
        // Workflow uses shorthand syntax `container: image-name`
        image = container.assertString("container item");
        return { image: image };
    }
    const mapping = container.assertMapping("container item");
    if (mapping)
        for (const item of mapping) {
            const key = item.key.assertString("container item key");
            const value = item.value;
            switch (key.value) {
                case "image":
                    image = value.assertString("container image");
                    break;
                case "credentials":
                    convertToJobCredentials(context, value);
                    break;
                case "env":
                    env = value.assertMapping("container env");
                    for (const envItem of env) {
                        envItem.key.assertString("container env value");
                    }
                    break;
                case "ports":
                    ports = value.assertSequence("container ports");
                    for (const port of ports) {
                        port.assertString("container port");
                    }
                    break;
                case "volumes":
                    volumes = value.assertSequence("container volumes");
                    for (const volume of volumes) {
                        volume.assertString("container volume");
                    }
                    break;
                case "options":
                    options = value.assertString("container options");
                    break;
                default:
                    context.error(key, `Unexpected container item key: ${key.value}`);
            }
        }
    if (!image) {
        context.error(container, "Container image cannot be empty");
    }
    else {
        return { image, env, ports, volumes, options };
    }
}
function convertToJobServices(context, services) {
    const serviceList = [];
    const mapping = services.assertMapping("services");
    for (const service of mapping) {
        service.key.assertString("service key");
        const container = convertToJobContainer(context, service.value);
        if (container) {
            serviceList.push(container);
        }
    }
    return serviceList;
}
function convertToJobCredentials(context, value) {
    const mapping = value.assertMapping("credentials");
    let username;
    let password;
    for (const item of mapping) {
        const key = item.key.assertString("credentials item");
        const value = item.value;
        switch (key.value) {
            case "username":
                username = value.assertString("credentials username");
                break;
            case "password":
                password = value.assertString("credentials password");
                break;
            default:
                context.error(key, `credentials key ${key.value}`);
        }
    }
    return { username, password };
}
//# sourceMappingURL=container.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/cron-constants.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/cron-constants.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DOM_RANGE: () => (/* binding */ DOM_RANGE),
/* harmony export */   DOW_RANGE: () => (/* binding */ DOW_RANGE),
/* harmony export */   HOUR_RANGE: () => (/* binding */ HOUR_RANGE),
/* harmony export */   MINUTE_RANGE: () => (/* binding */ MINUTE_RANGE),
/* harmony export */   MONTH_RANGE: () => (/* binding */ MONTH_RANGE)
/* harmony export */ });
// Constants for parsing and validating cron expressions
const MONTHS = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12
};
const DAYS = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
};
const MINUTE_RANGE = { min: 0, max: 59 };
const HOUR_RANGE = { min: 0, max: 23 };
const DOM_RANGE = { min: 1, max: 31 };
const MONTH_RANGE = { min: 1, max: 12, names: MONTHS };
const DOW_RANGE = { min: 0, max: 6, names: DAYS };
//# sourceMappingURL=cron-constants.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/cron.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/cron.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCronDescription: () => (/* binding */ getCronDescription),
/* harmony export */   isValidCron: () => (/* binding */ isValidCron)
/* harmony export */ });
/* harmony import */ var cronstrue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cronstrue */ "./node_modules/cronstrue/dist/cronstrue.js");
/* harmony import */ var _cron_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cron-constants */ "./node_modules/@actions/workflow-parser/dist/model/converter/cron-constants.js");


function isValidCron(cron) {
    // https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule
    const parts = cron.split(/ +/);
    if (parts.length != 5) {
        return false;
    }
    const [minutes, hours, dom, months, dow] = parts;
    return (validateCronPart(minutes, _cron_constants__WEBPACK_IMPORTED_MODULE_1__.MINUTE_RANGE) &&
        validateCronPart(hours, _cron_constants__WEBPACK_IMPORTED_MODULE_1__.HOUR_RANGE) &&
        validateCronPart(dom, _cron_constants__WEBPACK_IMPORTED_MODULE_1__.DOM_RANGE) &&
        validateCronPart(months, _cron_constants__WEBPACK_IMPORTED_MODULE_1__.MONTH_RANGE) &&
        validateCronPart(dow, _cron_constants__WEBPACK_IMPORTED_MODULE_1__.DOW_RANGE));
}
function getCronDescription(cronspec) {
    if (!isValidCron(cronspec)) {
        return;
    }
    let desc = "";
    try {
        desc = cronstrue__WEBPACK_IMPORTED_MODULE_0__.toString(cronspec, {
            dayOfWeekStartIndexZero: true,
            monthStartIndexZero: false,
            use24HourTimeFormat: true,
            // cronstrue sets the description as the error if throwExceptionOnParseError is false
            // so we need to distinguish between an error and a valid description
            throwExceptionOnParseError: true
        });
    }
    catch (err) {
        return;
    }
    // Make first character lowercase
    let result = "Runs " + desc.charAt(0).toLowerCase() + desc.slice(1);
    result +=
        "\n\nActions schedules run at most every 5 minutes." +
            " [Learn more](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#onschedule)";
    return result;
}
function validateCronPart(value, range, allowSeparators = true) {
    if (range.names && range.names[value.toLowerCase()] !== undefined) {
        return true;
    }
    if (value === "*") {
        return true;
    }
    // Operator precedence: , > / > -
    if (value.includes(",")) {
        if (!allowSeparators) {
            return false;
        }
        return value.split(",").every(v => v && validateCronPart(v, range));
    }
    if (value.includes("/")) {
        if (!allowSeparators) {
            return false;
        }
        const [start, step, ...rest] = value.split("/");
        const stepNumber = +step;
        if (rest.length > 0 || isNaN(stepNumber) || stepNumber <= 0 || !start || !step) {
            return false;
        }
        // Separators are only allowed in the part before the `/`, e.g. `1-5/2`
        return validateCronPart(start, range) && validateCronPart(step, range, false);
    }
    if (value.includes("-")) {
        if (!allowSeparators) {
            return false;
        }
        const [start, end, ...rest] = value.split("-");
        if (rest.length > 0 || !start || !end) {
            return false;
        }
        // Convert name to integers so we can make sure end >= start
        const startNumber = convertToNumber(start, range.names);
        const endNumber = convertToNumber(end, range.names);
        return validateCronPart(start, range, false) && validateCronPart(end, range, false) && endNumber >= startNumber;
    }
    const number = +value;
    return !isNaN(number) && number >= range.min && number <= range.max;
}
// Converts a string integer or a short name to a number
function convertToNumber(value, names) {
    if (names && names[value.toLowerCase()] !== undefined) {
        return +names[value.toLowerCase()];
    }
    else {
        return +value;
    }
}
//# sourceMappingURL=cron.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/events.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/events.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertOn: () => (/* binding */ convertOn)
/* harmony export */ });
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");
/* harmony import */ var _templates_tokens_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../templates/tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");
/* harmony import */ var _cron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cron */ "./node_modules/@actions/workflow-parser/dist/model/converter/cron.js");
/* harmony import */ var _string_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./string-list */ "./node_modules/@actions/workflow-parser/dist/model/converter/string-list.js");
/* harmony import */ var _workflow_call__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./workflow-call */ "./node_modules/@actions/workflow-parser/dist/model/converter/workflow-call.js");
/* harmony import */ var _workflow_dispatch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./workflow-dispatch */ "./node_modules/@actions/workflow-parser/dist/model/converter/workflow-dispatch.js");






function convertOn(context, token) {
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isLiteral)(token)) {
        const event = token.assertString("on");
        return {
            [event.value]: {}
        };
    }
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isSequence)(token)) {
        const result = {};
        for (const item of token) {
            const event = item.assertString("on");
            result[event.value] = {};
        }
        return result;
    }
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isMapping)(token)) {
        const result = {};
        for (const item of token) {
            const eventKey = item.key.assertString("event name");
            const eventName = eventKey.value;
            if (item.value.templateTokenType === _templates_tokens_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Null) {
                result[eventName] = {};
                continue;
            }
            // Schedule is the only event that can be a sequence, handle that separately
            if (eventName === "schedule") {
                const scheduleToken = item.value.assertSequence(`event ${eventName}`);
                result.schedule = convertSchedule(context, scheduleToken);
                continue;
            }
            // All other events are defined as mappings. During schema validation we already ensure that events
            // receive only known keys, so here we can focus on the values and whether they are valid.
            const eventToken = item.value.assertMapping(`event ${eventName}`);
            if (eventName === "workflow_call") {
                result.workflow_call = (0,_workflow_call__WEBPACK_IMPORTED_MODULE_4__.convertEventWorkflowCall)(context, eventToken);
                continue;
            }
            if (eventName === "workflow_dispatch") {
                result.workflow_dispatch = (0,_workflow_dispatch__WEBPACK_IMPORTED_MODULE_5__.convertEventWorkflowDispatchInputs)(context, eventToken);
                continue;
            }
            result[eventName] = {
                ...convertPatternFilter("branches", eventToken),
                ...convertPatternFilter("tags", eventToken),
                ...convertPatternFilter("paths", eventToken),
                ...convertFilter("types", eventToken),
                ...convertFilter("workflows", eventToken)
            };
        }
        return result;
    }
    context.error(token, "Invalid format for 'on'");
    return {};
}
function convertPatternFilter(name, token) {
    const result = {};
    for (const item of token) {
        const key = item.key.assertString(`${name} filter key`);
        switch (key.value) {
            case name:
                if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isString)(item.value)) {
                    result[name] = [item.value.value];
                }
                else {
                    result[name] = (0,_string_list__WEBPACK_IMPORTED_MODULE_3__.convertStringList)(name, item.value.assertSequence(`${name} list`));
                }
                break;
            case `${name}-ignore`:
                if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isString)(item.value)) {
                    result[`${name}-ignore`] = [item.value.value];
                }
                else {
                    result[`${name}-ignore`] = (0,_string_list__WEBPACK_IMPORTED_MODULE_3__.convertStringList)(`${name}-ignore`, item.value.assertSequence(`${name}-ignore list`));
                }
                break;
        }
    }
    return result;
}
function convertFilter(name, token) {
    const result = {};
    for (const item of token) {
        const key = item.key.assertString(`${name} filter key`);
        switch (key.value) {
            case name:
                if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isString)(item.value)) {
                    result[name] = [item.value.value];
                }
                else {
                    result[name] = (0,_string_list__WEBPACK_IMPORTED_MODULE_3__.convertStringList)(name, item.value.assertSequence(`${name} list`));
                }
                break;
        }
    }
    return result;
}
function convertSchedule(context, token) {
    const result = [];
    for (const item of token) {
        const mappingToken = item.assertMapping(`event schedule`);
        if (mappingToken.count == 1) {
            const schedule = mappingToken.get(0);
            const scheduleKey = schedule.key.assertString(`schedule key`);
            if (scheduleKey.value == "cron") {
                const cron = schedule.value.assertString(`schedule cron`);
                // Validate the cron string
                if (!(0,_cron__WEBPACK_IMPORTED_MODULE_2__.isValidCron)(cron.value)) {
                    context.error(cron, "Invalid cron string");
                }
                result.push({ cron: cron.value });
            }
            else {
                context.error(scheduleKey, `Invalid schedule key`);
            }
        }
        else {
            context.error(mappingToken, "Invalid format for 'schedule'");
        }
    }
    return result;
}
//# sourceMappingURL=events.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/handle-errors.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/handle-errors.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleTemplateTokenErrors: () => (/* binding */ handleTemplateTokenErrors)
/* harmony export */ });
/* harmony import */ var _templates_tokens_template_token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens/template-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/template-token.js");

function handleTemplateTokenErrors(root, context, defaultValue, f) {
    let r = defaultValue;
    try {
        r = f();
    }
    catch (err) {
        if (err instanceof _templates_tokens_template_token__WEBPACK_IMPORTED_MODULE_0__.TemplateTokenError) {
            context.error(err.token, err);
        }
        else {
            // Report error for the root node
            context.error(root, err);
        }
    }
    return r;
}
//# sourceMappingURL=handle-errors.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/id-builder.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/id-builder.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IdBuilder: () => (/* binding */ IdBuilder)
/* harmony export */ });
const SEPARATOR = "_";
const MAX_ATTEMPTS = 1000;
const MAX_LENGTH = 100;
class IdBuilder {
    constructor() {
        this.name = [];
        this.distinctNames = new Set();
    }
    appendSegment(value) {
        if (value.length === 0) {
            return;
        }
        if (this.name.length == 0) {
            const first = value[0];
            if (this.isAlpha(first) || first == "_") {
                // Legal first char
            }
            else if (this.isNumeric(first) || first == "-") {
                // Illegal first char, but legal char.
                // Prepend "_".
                this.name.push("_");
            }
            else {
                // Illegal char
            }
        }
        else {
            // Separator
            this.name.push(SEPARATOR);
        }
        for (const c of value) {
            {
                if (this.isAlphaNumeric(c) || c == "_" || c == "-") {
                    // Legal
                    this.name.push(c);
                }
                else {
                    // Illegal
                    this.name.push(SEPARATOR);
                }
            }
        }
    }
    build() {
        const original = this.name.length > 0 ? this.name.join("") : "job";
        let suffix = "";
        for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
            if (attempt === 1) {
                suffix = "";
            }
            else {
                suffix = `_${attempt}`;
            }
            const candidate = original.substring(0, Math.min(original.length, MAX_LENGTH - suffix.length)) + suffix;
            if (!this.distinctNames.has(candidate)) {
                this.distinctNames.add(candidate);
                this.name = [];
                return candidate;
            }
        }
        throw new Error("Unable to create a unique name");
    }
    /**
     * Adds a known identifier to the set of distinct ids.
     * @param value The value to add
     * @returns An error if the value is invalid, otherwise undefined
     */
    tryAddKnownId(value) {
        if (!value || !this.isValid(value) || value.length >= MAX_LENGTH) {
            return `The identifier '${value}' is invalid. IDs may only contain alphanumeric characters, '_', and '-'. IDs must start with a letter or '_' and and must be less than ${MAX_LENGTH} characters.`;
        }
        if (value.startsWith(SEPARATOR + SEPARATOR)) {
            return `The identifier '${value}' is invalid. IDs starting with '__' are reserved.`;
        }
        if (this.distinctNames.has(value)) {
            return `The identifier '${value}' may not be used more than once within the same scope.`;
        }
        this.distinctNames.add(value);
        return;
    }
    /**
     * A name is valid if it starts with a letter or underscore, and contains only
     * letters, numbers, underscores, and hyphens.
     * @param name The string name to validate
     * @returns Whether the name is valid
     */
    isValid(name) {
        let first = true;
        for (const c of name) {
            if (first) {
                first = false;
                if (!this.isAlpha(c) && c != "_") {
                    return false;
                }
                continue;
            }
            if (!this.isAlphaNumeric(c) && c != "_" && c != "-") {
                return false;
            }
        }
        return true;
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isNumeric(c);
    }
    isNumeric(c) {
        return c >= "0" && c <= "9";
    }
    isAlpha(c) {
        return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
    }
}
//# sourceMappingURL=id-builder.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/job.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/job.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertJob: () => (/* binding */ convertJob)
/* harmony export */ });
/* harmony import */ var _templates_tokens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");
/* harmony import */ var _concurrency__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./concurrency */ "./node_modules/@actions/workflow-parser/dist/model/converter/concurrency.js");
/* harmony import */ var _container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./container */ "./node_modules/@actions/workflow-parser/dist/model/converter/container.js");
/* harmony import */ var _handle_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./handle-errors */ "./node_modules/@actions/workflow-parser/dist/model/converter/handle-errors.js");
/* harmony import */ var _id_builder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./id-builder */ "./node_modules/@actions/workflow-parser/dist/model/converter/id-builder.js");
/* harmony import */ var _job_environment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./job/environment */ "./node_modules/@actions/workflow-parser/dist/model/converter/job/environment.js");
/* harmony import */ var _job_runs_on__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./job/runs-on */ "./node_modules/@actions/workflow-parser/dist/model/converter/job/runs-on.js");
/* harmony import */ var _steps__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./steps */ "./node_modules/@actions/workflow-parser/dist/model/converter/steps.js");









function convertJob(context, jobKey, token) {
    const error = new _id_builder__WEBPACK_IMPORTED_MODULE_5__.IdBuilder().tryAddKnownId(jobKey.value);
    if (error) {
        context.error(jobKey, error);
    }
    let concurrency, container, env, environment, name, outputs, runsOn, services, strategy;
    let needs = undefined;
    let steps = [];
    let workflowJobRef;
    let workflowJobInputs;
    let inheritSecrets = false;
    let workflowJobSecrets;
    for (const item of token) {
        const propertyName = item.key.assertString("job property name");
        switch (propertyName.value) {
            case "concurrency":
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_4__.handleTemplateTokenErrors)(item.value, context, undefined, () => (0,_concurrency__WEBPACK_IMPORTED_MODULE_2__.convertConcurrency)(context, item.value));
                concurrency = item.value;
                break;
            case "container":
                (0,_container__WEBPACK_IMPORTED_MODULE_3__.convertToJobContainer)(context, item.value);
                container = item.value;
                break;
            case "env":
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_4__.handleTemplateTokenErrors)(item.value, context, undefined, () => {
                    env = item.value.assertMapping("job env");
                });
                break;
            case "environment":
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_4__.handleTemplateTokenErrors)(item.value, context, undefined, () => (0,_job_environment__WEBPACK_IMPORTED_MODULE_6__.convertToActionsEnvironmentRef)(context, item.value));
                environment = item.value;
                break;
            case "name":
                name = item.value.assertScalar("job name");
                break;
            case "needs": {
                needs = [];
                if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isString)(item.value)) {
                    const jobNeeds = item.value.assertString("job needs id");
                    needs.push(jobNeeds);
                }
                if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isSequence)(item.value)) {
                    for (const seqItem of item.value) {
                        const jobNeeds = seqItem.assertString("job needs id");
                        needs.push(jobNeeds);
                    }
                }
                break;
            }
            case "outputs":
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_4__.handleTemplateTokenErrors)(item.value, context, undefined, () => {
                    outputs = item.value.assertMapping("job outputs");
                });
                break;
            case "runs-on":
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_4__.handleTemplateTokenErrors)(item.value, context, undefined, () => (0,_job_runs_on__WEBPACK_IMPORTED_MODULE_7__.convertRunsOn)(context, item.value));
                runsOn = item.value;
                break;
            case "services":
                (0,_container__WEBPACK_IMPORTED_MODULE_3__.convertToJobServices)(context, item.value);
                services = item.value;
                break;
            case "steps":
                steps = (0,_steps__WEBPACK_IMPORTED_MODULE_8__.convertSteps)(context, item.value);
                break;
            case "strategy":
                strategy = item.value;
                break;
            case "uses":
                workflowJobRef = item.value.assertString("job uses value");
                break;
            case "with":
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_4__.handleTemplateTokenErrors)(item.value, context, undefined, () => {
                    workflowJobInputs = item.value.assertMapping("uses-with value");
                });
                break;
            case "secrets":
                if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isString)(item.value) && item.value.value === "inherit") {
                    inheritSecrets = true;
                }
                else {
                    (0,_handle_errors__WEBPACK_IMPORTED_MODULE_4__.handleTemplateTokenErrors)(item.value, context, undefined, () => {
                        workflowJobSecrets = item.value.assertMapping("uses-secrets value");
                    });
                }
                break;
        }
    }
    if (workflowJobRef !== undefined) {
        return {
            type: "reusableWorkflowJob",
            id: jobKey,
            name: jobName(name, jobKey),
            needs: needs || [],
            if: new _templates_tokens__WEBPACK_IMPORTED_MODULE_0__.BasicExpressionToken(undefined, undefined, "success()", undefined, undefined, undefined),
            ref: workflowJobRef,
            "input-definitions": undefined,
            "input-values": workflowJobInputs,
            "secret-definitions": undefined,
            "secret-values": workflowJobSecrets,
            "inherit-secrets": inheritSecrets || undefined,
            outputs: undefined,
            concurrency,
            strategy
        };
    }
    else {
        return {
            type: "job",
            id: jobKey,
            name: jobName(name, jobKey),
            needs,
            if: new _templates_tokens__WEBPACK_IMPORTED_MODULE_0__.BasicExpressionToken(undefined, undefined, "success()", undefined, undefined, undefined),
            env,
            concurrency,
            environment,
            strategy,
            "runs-on": runsOn,
            container,
            services,
            outputs,
            steps
        };
    }
}
function jobName(name, jobKey) {
    if (name === undefined) {
        return jobKey;
    }
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isString)(name) && name.value === "") {
        return jobKey;
    }
    return name;
}
//# sourceMappingURL=job.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/job/environment.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/job/environment.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertToActionsEnvironmentRef: () => (/* binding */ convertToActionsEnvironmentRef)
/* harmony export */ });
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");

function convertToActionsEnvironmentRef(context, token) {
    const result = {};
    if (token.isExpression) {
        return result;
    }
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isScalar)(token)) {
        result.name = token;
        return result;
    }
    const environmentMapping = token.assertMapping("job environment");
    for (const property of environmentMapping) {
        const propertyName = property.key.assertString("job environment key");
        if (property.key.isExpression || property.value.isExpression) {
            continue;
        }
        switch (propertyName.value) {
            case "name":
                result.name = property.value.assertScalar("job environment name key");
                break;
            case "url":
                result.url = property.value;
                break;
        }
    }
    return result;
}
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/job/inputs.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/job/inputs.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertWorkflowJobInputs: () => (/* binding */ convertWorkflowJobInputs),
/* harmony export */   createTokenMap: () => (/* binding */ createTokenMap)
/* harmony export */ });
function convertWorkflowJobInputs(context, job) {
    const inputDefinitions = createTokenMap(job["input-definitions"]?.assertMapping("workflow job input definitions"), "inputs");
    const inputValues = createTokenMap(job["input-values"]?.assertMapping("workflow job input values"), "with");
    if (inputDefinitions !== undefined) {
        for (const [, [name, value]] of inputDefinitions) {
            const inputSpec = createTokenMap(value.assertMapping(`input ${name}`), `input ${name} key`);
            const inputTypeToken = inputSpec?.get("type")?.[1];
            if (!inputTypeToken) {
                // This should be validated by the template reader per the schema
                continue;
            }
            const inputSet = inputValues !== undefined && inputValues.has(name.toLowerCase());
            const required = inputSpec.get("required")?.[1].assertBoolean(`input ${name} required`).value;
            if (required && !inputSet) {
                context.error(job.ref, `Input ${name} is required, but not provided while calling.`);
            }
        }
    }
    if (inputValues !== undefined) {
        for (const [, [name, value]] of inputValues) {
            if (!inputDefinitions?.has(name.toLowerCase())) {
                context.error(value, `Invalid input, ${name} is not defined in the referenced workflow.`);
            }
        }
    }
}
function createTokenMap(mapping, description) {
    if (!mapping) {
        return undefined;
    }
    const result = new Map();
    for (const item of mapping) {
        const name = item.key.assertString(`${description} key`);
        result.set(name.value.toLowerCase(), [name.value, item.value]);
    }
    return result;
}
//# sourceMappingURL=inputs.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/job/runs-on.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/job/runs-on.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertRunsOn: () => (/* binding */ convertRunsOn)
/* harmony export */ });
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");

function convertRunsOn(context, token) {
    const labels = convertRunsOnLabels(token);
    if (!(0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isMapping)(token)) {
        return {
            labels,
            group: ""
        };
    }
    let group = "";
    for (const item of token) {
        const key = item.key.assertString("job runs-on property name");
        switch (key.value) {
            case "group": {
                if (item.value.isExpression) {
                    continue;
                }
                const groupName = item.value.assertString("job runs-on group name").value;
                const names = groupName.split("/");
                switch (names.length) {
                    case 1: {
                        group = groupName;
                        break;
                    }
                    case 2: {
                        if (!["org", "organization", "ent", "enterprise"].includes(names[0])) {
                            context.error(item.value, `Invalid runs-on group name '${groupName}. Please use 'organization/' or 'enterprise/' prefix to target a single runner group.'`);
                            continue;
                        }
                        if (!names[1]) {
                            context.error(item.value, `Invalid runs-on group name '${groupName}'.`);
                            continue;
                        }
                        group = groupName;
                        break;
                    }
                    default: {
                        context.error(item.value, `Invalid runs-on group name '${groupName}. Please use 'organization/' or 'enterprise/' prefix to target a single runner group.'`);
                        break;
                    }
                }
                break;
            }
            case "labels": {
                const mapLabels = convertRunsOnLabels(item.value);
                for (const label of mapLabels) {
                    labels.add(label);
                }
                break;
            }
        }
    }
    return {
        labels,
        group
    };
}
function convertRunsOnLabels(token) {
    const labels = new Set();
    if (token.isExpression) {
        return labels;
    }
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isString)(token)) {
        labels.add(token.value);
        return labels;
    }
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isSequence)(token)) {
        for (const item of token) {
            if (item.isExpression) {
                continue;
            }
            const label = item.assertString("job runs-on label sequence item");
            labels.add(label.value);
        }
    }
    return labels;
}
//# sourceMappingURL=runs-on.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/job/secrets.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/job/secrets.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertWorkflowJobSecrets: () => (/* binding */ convertWorkflowJobSecrets)
/* harmony export */ });
/* harmony import */ var _templates_tokens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../templates/tokens */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _inputs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inputs */ "./node_modules/@actions/workflow-parser/dist/model/converter/job/inputs.js");


function convertWorkflowJobSecrets(context, job) {
    // No validation if job passes all secrets
    if (job["inherit-secrets"]) {
        return;
    }
    const secretDefinitions = (0,_inputs__WEBPACK_IMPORTED_MODULE_1__.createTokenMap)(job["secret-definitions"]?.assertMapping("workflow job secret definitions"), "secrets");
    const secretValues = (0,_inputs__WEBPACK_IMPORTED_MODULE_1__.createTokenMap)(job["secret-values"]?.assertMapping("workflow job secret values"), "secrets");
    if (secretDefinitions !== undefined) {
        for (const [, [name, value]] of secretDefinitions) {
            if (value instanceof _templates_tokens__WEBPACK_IMPORTED_MODULE_0__.NullToken) {
                continue;
            }
            const secretSpec = (0,_inputs__WEBPACK_IMPORTED_MODULE_1__.createTokenMap)(value.assertMapping(`secret ${name}`), `secret ${name} key`);
            const required = secretSpec?.get("required")?.[1].assertBoolean(`secret ${name} required`).value;
            if (required) {
                if (secretValues == undefined || !secretValues.has(name.toLowerCase())) {
                    context.error(job.ref, `Secret ${name} is required, but not provided while calling.`);
                }
            }
        }
    }
    if (secretValues !== undefined) {
        for (const [, [name, value]] of secretValues) {
            if (!secretDefinitions?.has(name.toLowerCase())) {
                context.error(value, `Invalid secret, ${name} is not defined in the referenced workflow.`);
            }
        }
    }
}
//# sourceMappingURL=secrets.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/jobs.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/jobs.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertJobs: () => (/* binding */ convertJobs)
/* harmony export */ });
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");
/* harmony import */ var _handle_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handle-errors */ "./node_modules/@actions/workflow-parser/dist/model/converter/handle-errors.js");
/* harmony import */ var _job__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./job */ "./node_modules/@actions/workflow-parser/dist/model/converter/job.js");



function convertJobs(context, token) {
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isMapping)(token)) {
        const result = [];
        const jobsWithSatisfiedNeeds = [];
        const alljobsWithUnsatisfiedNeeds = [];
        for (const item of token) {
            const jobKey = item.key.assertString("job name");
            const jobDef = item.value.assertMapping(`job ${jobKey.value}`);
            const job = (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(token, context, undefined, () => (0,_job__WEBPACK_IMPORTED_MODULE_2__.convertJob)(context, jobKey, jobDef));
            if (job) {
                result.push(job);
                const node = {
                    name: job.id.value,
                    needs: Object.assign([], job.needs)
                };
                if (node.needs.length > 0) {
                    alljobsWithUnsatisfiedNeeds.push(node);
                }
                else {
                    jobsWithSatisfiedNeeds.push(node);
                }
            }
        }
        //validate job needs
        validateNeeds(token, context, result, jobsWithSatisfiedNeeds, alljobsWithUnsatisfiedNeeds);
        return result;
    }
    context.error(token, "Invalid format for jobs");
    return [];
}
function validateNeeds(token, context, result, jobsWithSatisfiedNeeds, alljobsWithUnsatisfiedNeeds) {
    if (jobsWithSatisfiedNeeds.length == 0) {
        context.error(token, "The workflow must contain at least one job with no dependencies.");
        return;
    }
    // Figure out which nodes would start after current completes
    while (jobsWithSatisfiedNeeds.length > 0) {
        const currentJob = jobsWithSatisfiedNeeds.shift();
        if (currentJob == undefined) {
            break;
        }
        for (let i = alljobsWithUnsatisfiedNeeds.length - 1; i >= 0; i--) {
            const unsatisfiedJob = alljobsWithUnsatisfiedNeeds[i];
            for (let j = unsatisfiedJob.needs.length - 1; j >= 0; j--) {
                const need = unsatisfiedJob.needs[j];
                if (need.value == currentJob.name) {
                    unsatisfiedJob.needs.splice(j, 1);
                    if (unsatisfiedJob.needs.length == 0) {
                        jobsWithSatisfiedNeeds.push(unsatisfiedJob);
                        alljobsWithUnsatisfiedNeeds.splice(i, 1);
                    }
                }
            }
        }
    }
    // Check whether some jobs will never execute
    if (alljobsWithUnsatisfiedNeeds.length > 0) {
        const jobNames = result.map(x => x.id.value);
        for (const unsatisfiedJob of alljobsWithUnsatisfiedNeeds) {
            for (const need of unsatisfiedJob.needs) {
                if (jobNames.includes(need.value)) {
                    context.error(need, `Job '${unsatisfiedJob.name}' depends on job '${need.value}' which creates a cycle in the dependency graph.`);
                }
                else {
                    context.error(need, `Job '${unsatisfiedJob.name}' depends on unknown job '${need.value}'.`);
                }
            }
        }
    }
}
//# sourceMappingURL=jobs.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/referencedWorkflow.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/referencedWorkflow.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertReferencedWorkflow: () => (/* binding */ convertReferencedWorkflow)
/* harmony export */ });
/* harmony import */ var _templates_tokens_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");
/* harmony import */ var _handle_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handle-errors */ "./node_modules/@actions/workflow-parser/dist/model/converter/handle-errors.js");
/* harmony import */ var _job_inputs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./job/inputs */ "./node_modules/@actions/workflow-parser/dist/model/converter/job/inputs.js");
/* harmony import */ var _job_secrets__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./job/secrets */ "./node_modules/@actions/workflow-parser/dist/model/converter/job/secrets.js");
/* harmony import */ var _jobs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./jobs */ "./node_modules/@actions/workflow-parser/dist/model/converter/jobs.js");





function convertReferencedWorkflow(context, referencedWorkflow, job) {
    const mapping = referencedWorkflow.assertMapping("root");
    // The language service doesn't currently handles on other documents,
    // So use the ref in the original workflow as the error location
    const tokenForErrors = job.ref;
    for (const pair of mapping) {
        const key = pair.key.assertString("root key");
        switch (key.value) {
            case "on": {
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => convertReferencedWorkflowOn(context, pair.value, job));
                break;
            }
            case "jobs": {
                job.jobs = (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, [], () => (0,_jobs__WEBPACK_IMPORTED_MODULE_4__.convertJobs)(context, pair.value));
                break;
            }
        }
    }
}
function convertReferencedWorkflowOn(context, on, job) {
    const tokenForErrors = job.ref;
    switch (on.templateTokenType) {
        case _templates_tokens_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.String: {
            const event = on.assertString("Reference workflow on value").value;
            if (event === "workflow_call") {
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => (0,_job_inputs__WEBPACK_IMPORTED_MODULE_2__.convertWorkflowJobInputs)(context, job));
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => (0,_job_secrets__WEBPACK_IMPORTED_MODULE_3__.convertWorkflowJobSecrets)(context, job));
                return;
            }
            break;
        }
        case _templates_tokens_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.Sequence: {
            const events = on.assertSequence("Reference workflow on value");
            for (const eventToken of events) {
                const event = eventToken.assertString(`Reference workflow on value ${eventToken}`).value;
                if (event === "workflow_call") {
                    (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => (0,_job_inputs__WEBPACK_IMPORTED_MODULE_2__.convertWorkflowJobInputs)(context, job));
                    (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => (0,_job_secrets__WEBPACK_IMPORTED_MODULE_3__.convertWorkflowJobSecrets)(context, job));
                    return;
                }
            }
            break;
        }
        case _templates_tokens_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.Mapping: {
            const eventMapping = on.assertMapping("Reference workflow on value");
            for (const pair of eventMapping) {
                const event = pair.key.assertString(`Reference workflow on value ${pair.key}`).value;
                if (event !== "workflow_call") {
                    continue;
                }
                if (pair.value.templateTokenType === _templates_tokens_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.Null) {
                    (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => (0,_job_inputs__WEBPACK_IMPORTED_MODULE_2__.convertWorkflowJobInputs)(context, job));
                    (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => (0,_job_secrets__WEBPACK_IMPORTED_MODULE_3__.convertWorkflowJobSecrets)(context, job));
                    return;
                }
                const definitions = pair.value.assertMapping(`Reference workflow on value ${pair.key}`);
                for (const definition of definitions) {
                    const definitionKey = definition.key.assertString(`on-workflow_call-${definition.key}`).value;
                    switch (definitionKey) {
                        case "inputs":
                            job["input-definitions"] = definition.value.assertMapping(`on-workflow_call-${definition.key}`);
                            break;
                        case "outputs":
                            job.outputs = definition.value.assertMapping(`on-workflow_call-${definition.key}`);
                            break;
                        case "secrets":
                            job["secret-definitions"] = definition.value.assertMapping(`on-workflow_call-${definition.key}`);
                            break;
                    }
                }
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => (0,_job_inputs__WEBPACK_IMPORTED_MODULE_2__.convertWorkflowJobInputs)(context, job));
                (0,_handle_errors__WEBPACK_IMPORTED_MODULE_1__.handleTemplateTokenErrors)(tokenForErrors, context, undefined, () => (0,_job_secrets__WEBPACK_IMPORTED_MODULE_3__.convertWorkflowJobSecrets)(context, job));
                return;
            }
            break;
        }
    }
    context.error(tokenForErrors, "workflow_call key is not defined in the referenced workflow.");
}
//# sourceMappingURL=referencedWorkflow.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/steps.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/steps.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertSteps: () => (/* binding */ convertSteps)
/* harmony export */ });
/* harmony import */ var _templates_tokens__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");
/* harmony import */ var _type_guards__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../type-guards */ "./node_modules/@actions/workflow-parser/dist/model/type-guards.js");
/* harmony import */ var _handle_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./handle-errors */ "./node_modules/@actions/workflow-parser/dist/model/converter/handle-errors.js");
/* harmony import */ var _id_builder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./id-builder */ "./node_modules/@actions/workflow-parser/dist/model/converter/id-builder.js");





function convertSteps(context, steps) {
    if (!(0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_1__.isSequence)(steps)) {
        context.error(steps, "Invalid format for steps");
        return [];
    }
    const idBuilder = new _id_builder__WEBPACK_IMPORTED_MODULE_4__.IdBuilder();
    const result = [];
    for (const item of steps) {
        const step = (0,_handle_errors__WEBPACK_IMPORTED_MODULE_3__.handleTemplateTokenErrors)(steps, context, undefined, () => convertStep(context, idBuilder, item));
        if (step) {
            result.push(step);
        }
    }
    for (const step of result) {
        if (step.id) {
            continue;
        }
        let id = "";
        if ((0,_type_guards__WEBPACK_IMPORTED_MODULE_2__.isActionStep)(step)) {
            id = createActionStepId(step);
        }
        if (!id) {
            id = "run";
        }
        idBuilder.appendSegment(`__${id}`);
        step.id = idBuilder.build();
    }
    return result;
}
function convertStep(context, idBuilder, step) {
    const mapping = step.assertMapping("steps item");
    let run;
    let id;
    let name;
    let uses;
    let continueOnError;
    let env;
    const ifCondition = new _templates_tokens__WEBPACK_IMPORTED_MODULE_0__.BasicExpressionToken(undefined, undefined, "success()", undefined, undefined, undefined);
    for (const item of mapping) {
        const key = item.key.assertString("steps item key");
        switch (key.value) {
            case "id":
                id = item.value.assertString("steps item id");
                if (id) {
                    const error = idBuilder.tryAddKnownId(id.value);
                    if (error) {
                        context.error(id, error);
                    }
                }
                break;
            case "name":
                name = item.value.assertScalar("steps item name");
                break;
            case "run":
                run = item.value.assertScalar("steps item run");
                break;
            case "uses":
                uses = item.value.assertString("steps item uses");
                break;
            case "env":
                env = item.value.assertMapping("step env");
                break;
            case "continue-on-error":
                if (!item.value.isExpression) {
                    continueOnError = item.value.assertBoolean("steps item continue-on-error").value;
                }
                else {
                    continueOnError = item.value.assertScalar("steps item continue-on-error");
                }
        }
    }
    if (run) {
        return {
            id: id?.value || "",
            name,
            if: ifCondition,
            "continue-on-error": continueOnError,
            env,
            run
        };
    }
    if (uses) {
        return {
            id: id?.value || "",
            name,
            if: ifCondition,
            "continue-on-error": continueOnError,
            env,
            uses
        };
    }
    context.error(step, "Expected uses or run to be defined");
}
function createActionStepId(step) {
    const uses = step.uses.value;
    if (uses.startsWith("docker://")) {
        return uses.substring("docker://".length);
    }
    if (uses.startsWith("./") || uses.startsWith(".\\")) {
        return "self";
    }
    const segments = uses.split("@");
    if (segments.length != 2) {
        return "";
    }
    const pathSegments = segments[0].split(/[\\/]/).filter(s => s.length > 0);
    const gitRef = segments[1];
    if (pathSegments.length >= 2 && pathSegments[0] && pathSegments[1] && gitRef) {
        return `${pathSegments[0]}/${pathSegments[1]}`;
    }
    return "";
}
//# sourceMappingURL=steps.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/string-list.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/string-list.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertStringList: () => (/* binding */ convertStringList)
/* harmony export */ });
function convertStringList(name, token) {
    const result = [];
    for (const item of token) {
        result.push(item.assertString(`${name} item`).value);
    }
    return result;
}
//# sourceMappingURL=string-list.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/workflow-call.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/workflow-call.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertEventWorkflowCall: () => (/* binding */ convertEventWorkflowCall),
/* harmony export */   convertWorkflowInput: () => (/* binding */ convertWorkflowInput),
/* harmony export */   convertWorkflowInputs: () => (/* binding */ convertWorkflowInputs)
/* harmony export */ });
/* harmony import */ var _templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");
/* harmony import */ var _workflow_template__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../workflow-template */ "./node_modules/@actions/workflow-parser/dist/model/workflow-template.js");
/* harmony import */ var _string_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./string-list */ "./node_modules/@actions/workflow-parser/dist/model/converter/string-list.js");



function convertEventWorkflowCall(context, token) {
    const result = {};
    for (const item of token) {
        const key = item.key.assertString("workflow dispatch input key");
        switch (key.value) {
            case "inputs":
                result.inputs = convertWorkflowInputs(context, item.value.assertMapping("workflow dispatch inputs"));
                break;
            case "secrets":
                result.secrets = convertWorkflowCallSecrets(context, item.value.assertMapping("workflow dispatch inputs"));
                break;
            case "outputs":
                // TODO - outputs
                break;
        }
    }
    return result;
}
function convertWorkflowInputs(context, token) {
    const result = {};
    for (const item of token) {
        const inputName = item.key.assertString("input name");
        const inputMapping = item.value.assertMapping("input configuration");
        result[inputName.value] = convertWorkflowInput(context, inputMapping);
    }
    return result;
}
function convertWorkflowInput(context, token) {
    const result = {
        type: _workflow_template__WEBPACK_IMPORTED_MODULE_1__.InputType.string // Default to string
    };
    let defaultValue;
    for (const item of token) {
        const key = item.key.assertString("workflow dispatch input key");
        switch (key.value) {
            case "description":
                result.description = item.value.assertString("input description").value;
                break;
            case "required":
                result.required = item.value.assertBoolean("input required").value;
                break;
            case "default":
                defaultValue = item.value.assertScalar("input default");
                break;
            case "type":
                result.type = _workflow_template__WEBPACK_IMPORTED_MODULE_1__.InputType[item.value.assertString("input type").value];
                break;
            case "options":
                result.options = (0,_string_list__WEBPACK_IMPORTED_MODULE_2__.convertStringList)("input options", item.value.assertSequence("input options"));
                break;
            default:
                context.error(item.key, `Invalid key '${key.value}'`);
        }
    }
    // Validate default value
    if (defaultValue !== undefined && !defaultValue.isExpression) {
        try {
            switch (result.type) {
                case _workflow_template__WEBPACK_IMPORTED_MODULE_1__.InputType.boolean:
                    result.default = defaultValue.assertBoolean("input default").value;
                    break;
                case _workflow_template__WEBPACK_IMPORTED_MODULE_1__.InputType.string:
                case _workflow_template__WEBPACK_IMPORTED_MODULE_1__.InputType.choice:
                case _workflow_template__WEBPACK_IMPORTED_MODULE_1__.InputType.environment:
                    result.default = defaultValue.assertString("input default").value;
                    break;
            }
        }
        catch (e) {
            context.error(defaultValue, e);
        }
    }
    // Validate `options` for `choice` type
    if (result.type === _workflow_template__WEBPACK_IMPORTED_MODULE_1__.InputType.choice) {
        if (result.options === undefined || result.options.length === 0) {
            context.error(token, "Missing 'options' for choice input");
        }
    }
    else {
        if (result.options !== undefined) {
            context.error(token, "Input type is not 'choice', but 'options' is defined");
        }
    }
    return result;
}
function convertWorkflowCallSecrets(context, token) {
    const result = {};
    for (const item of token) {
        const secretName = item.key.assertString("secret name");
        result[secretName.value] = convertWorkflowCallSecret(context, item.value);
    }
    return result;
}
function convertWorkflowCallSecret(context, token) {
    const result = {};
    if ((0,_templates_tokens_type_guards__WEBPACK_IMPORTED_MODULE_0__.isMapping)(token)) {
        for (const item of token) {
            const key = item.key.assertString("workflow call secret key");
            switch (key.value) {
                case "description":
                    result.description = item.value.assertString("secret description").value;
                    break;
                case "required":
                    result.required = item.value.assertBoolean("secret required").value;
                    break;
            }
        }
    }
    return result;
}
//# sourceMappingURL=workflow-call.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/converter/workflow-dispatch.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/converter/workflow-dispatch.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   convertEventWorkflowDispatchInputs: () => (/* binding */ convertEventWorkflowDispatchInputs),
/* harmony export */   convertWorkflowDispatchInput: () => (/* binding */ convertWorkflowDispatchInput),
/* harmony export */   convertWorkflowDispatchInputs: () => (/* binding */ convertWorkflowDispatchInputs)
/* harmony export */ });
/* harmony import */ var _workflow_template__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../workflow-template */ "./node_modules/@actions/workflow-parser/dist/model/workflow-template.js");
/* harmony import */ var _string_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./string-list */ "./node_modules/@actions/workflow-parser/dist/model/converter/string-list.js");


function convertEventWorkflowDispatchInputs(context, token) {
    const result = {};
    for (const item of token) {
        const key = item.key.assertString("workflow dispatch input key");
        switch (key.value) {
            case "inputs":
                result.inputs = convertWorkflowDispatchInputs(context, item.value.assertMapping("workflow dispatch inputs"));
                break;
        }
    }
    return result;
}
function convertWorkflowDispatchInputs(context, token) {
    const result = {};
    for (const item of token) {
        const inputName = item.key.assertString("input name");
        const inputMapping = item.value.assertMapping("input configuration");
        result[inputName.value] = convertWorkflowDispatchInput(context, inputMapping);
    }
    return result;
}
function convertWorkflowDispatchInput(context, token) {
    const result = {
        type: _workflow_template__WEBPACK_IMPORTED_MODULE_0__.InputType.string // Default to string
    };
    let defaultValue;
    for (const item of token) {
        const key = item.key.assertString("workflow dispatch input key");
        switch (key.value) {
            case "description":
                result.description = item.value.assertString("input description").value;
                break;
            case "required":
                result.required = item.value.assertBoolean("input required").value;
                break;
            case "default":
                defaultValue = item.value.assertScalar("input default");
                break;
            case "type":
                result.type = _workflow_template__WEBPACK_IMPORTED_MODULE_0__.InputType[item.value.assertString("input type").value];
                break;
            case "options":
                result.options = (0,_string_list__WEBPACK_IMPORTED_MODULE_1__.convertStringList)("input options", item.value.assertSequence("input options"));
                break;
            default:
                context.error(item.key, `Invalid key '${key.value}'`);
        }
    }
    // Validate default value
    if (defaultValue !== undefined) {
        try {
            switch (result.type) {
                case _workflow_template__WEBPACK_IMPORTED_MODULE_0__.InputType.boolean:
                    result.default = defaultValue.assertBoolean("input default").value;
                    break;
                case _workflow_template__WEBPACK_IMPORTED_MODULE_0__.InputType.string:
                case _workflow_template__WEBPACK_IMPORTED_MODULE_0__.InputType.choice:
                case _workflow_template__WEBPACK_IMPORTED_MODULE_0__.InputType.environment:
                    result.default = defaultValue.assertString("input default").value;
                    break;
            }
        }
        catch (e) {
            context.error(defaultValue, e);
        }
    }
    // Validate `options` for `choice` type
    if (result.type === _workflow_template__WEBPACK_IMPORTED_MODULE_0__.InputType.choice) {
        if (result.options === undefined || result.options.length === 0) {
            context.error(token, "Missing 'options' for choice input");
        }
    }
    else {
        if (result.options !== undefined) {
            context.error(token, "Input type is not 'choice', but 'options' is defined");
        }
    }
    return result;
}
//# sourceMappingURL=workflow-dispatch.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/type-guards.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/type-guards.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isActionStep: () => (/* binding */ isActionStep),
/* harmony export */   isJob: () => (/* binding */ isJob),
/* harmony export */   isReusableWorkflowJob: () => (/* binding */ isReusableWorkflowJob),
/* harmony export */   isRunStep: () => (/* binding */ isRunStep)
/* harmony export */ });
function isRunStep(step) {
    return step.run !== undefined;
}
function isActionStep(step) {
    return step.uses !== undefined;
}
function isJob(job) {
    return job.type === "job";
}
function isReusableWorkflowJob(job) {
    return job.type === "reusableWorkflowJob";
}
//# sourceMappingURL=type-guards.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/model/workflow-template.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/model/workflow-template.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InputType: () => (/* binding */ InputType)
/* harmony export */ });
var InputType;
(function (InputType) {
    InputType["string"] = "string";
    InputType["choice"] = "choice";
    InputType["boolean"] = "boolean";
    InputType["environment"] = "environment";
})(InputType || (InputType = {}));
//# sourceMappingURL=workflow-template.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/allowed-context.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/allowed-context.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   splitAllowedContext: () => (/* binding */ splitAllowedContext)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");

function splitAllowedContext(allowedContext) {
    const FUNCTION_REGEXP = /^([a-zA-Z0-9_]+)\(([0-9]+),([0-9]+|MAX)\)$/;
    const namedContexts = [];
    const functions = [];
    if (allowedContext.length > 0) {
        for (const contextItem of allowedContext) {
            const match = contextItem.match(FUNCTION_REGEXP);
            if (match) {
                const functionName = match[1];
                const minParameters = Number.parseInt(match[2]);
                const maxParametersRaw = match[3];
                const maxParameters = maxParametersRaw === _template_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_CONSTANT ? Number.MAX_SAFE_INTEGER : Number.parseInt(maxParametersRaw);
                functions.push({
                    name: functionName,
                    minArgs: minParameters,
                    maxArgs: maxParameters
                });
            }
            else {
                namedContexts.push(contextItem);
            }
        }
    }
    return {
        namedContexts: namedContexts,
        functions: functions
    };
}
//# sourceMappingURL=allowed-context.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/json-object-reader.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/json-object-reader.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JSONObjectReader: () => (/* binding */ JSONObjectReader)
/* harmony export */ });
/* harmony import */ var _parse_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse-event */ "./node_modules/@actions/workflow-parser/dist/templates/parse-event.js");
/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tokens */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");


class JSONObjectReader {
    constructor(fileId, input) {
        this._fileId = fileId;
        const value = JSON.parse(input);
        this._generator = this.getParseEvents(value, true);
        this._current = this._generator.next();
    }
    allowLiteral() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.Literal) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.SequenceStart) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.SequenceEnd) {
                this._current = this._generator.next();
                return true;
            }
        }
        return false;
    }
    allowMappingStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.MappingStart) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowMappingEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.MappingEnd) {
                this._current = this._generator.next();
                return true;
            }
        }
        return false;
    }
    validateEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.DocumentEnd) {
                this._current = this._generator.next();
                return;
            }
        }
        throw new Error("Expected end of reader");
    }
    validateStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.DocumentStart) {
                this._current = this._generator.next();
                return;
            }
        }
        throw new Error("Expected start of reader");
    }
    /**
     * Returns all tokens (depth first)
     */
    *getParseEvents(value, root) {
        if (root) {
            yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.DocumentStart, undefined);
        }
        switch (typeof value) {
            case "undefined":
                yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.Literal, new _tokens__WEBPACK_IMPORTED_MODULE_1__.NullToken(this._fileId, undefined, undefined));
                break;
            case "boolean":
                yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.Literal, new _tokens__WEBPACK_IMPORTED_MODULE_1__.BooleanToken(this._fileId, undefined, value, undefined));
                break;
            case "number":
                yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.Literal, new _tokens__WEBPACK_IMPORTED_MODULE_1__.NumberToken(this._fileId, undefined, value, undefined));
                break;
            case "string":
                yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.Literal, new _tokens__WEBPACK_IMPORTED_MODULE_1__.StringToken(this._fileId, undefined, value, undefined));
                break;
            case "object":
                // null
                if (value === null) {
                    yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.Literal, new _tokens__WEBPACK_IMPORTED_MODULE_1__.NullToken(this._fileId, undefined, undefined));
                }
                // array
                else if (Array.isArray(value)) {
                    yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.SequenceStart, new _tokens__WEBPACK_IMPORTED_MODULE_1__.SequenceToken(this._fileId, undefined, undefined));
                    for (const item of value) {
                        for (const e of this.getParseEvents(item)) {
                            yield e;
                        }
                    }
                    yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.SequenceEnd, undefined);
                }
                // object
                else {
                    yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.MappingStart, new _tokens__WEBPACK_IMPORTED_MODULE_1__.MappingToken(this._fileId, undefined, undefined));
                    for (const key of Object.keys(value)) {
                        yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.Literal, new _tokens__WEBPACK_IMPORTED_MODULE_1__.StringToken(this._fileId, undefined, key, undefined));
                        for (const e of this.getParseEvents(value[key])) {
                            yield e;
                        }
                    }
                    yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.MappingEnd, undefined);
                }
                break;
            default:
                throw new Error(`Unexpected value type '${typeof value}' when reading object`);
        }
        if (root) {
            yield new _parse_event__WEBPACK_IMPORTED_MODULE_0__.ParseEvent(_parse_event__WEBPACK_IMPORTED_MODULE_0__.EventType.DocumentEnd, undefined);
        }
    }
}
//# sourceMappingURL=json-object-reader.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/parse-event.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/parse-event.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventType: () => (/* binding */ EventType),
/* harmony export */   ParseEvent: () => (/* binding */ ParseEvent)
/* harmony export */ });
class ParseEvent {
    constructor(type, token) {
        this.type = type;
        this.token = token;
    }
}
var EventType;
(function (EventType) {
    EventType[EventType["Literal"] = 0] = "Literal";
    EventType[EventType["SequenceStart"] = 1] = "SequenceStart";
    EventType[EventType["SequenceEnd"] = 2] = "SequenceEnd";
    EventType[EventType["MappingStart"] = 3] = "MappingStart";
    EventType[EventType["MappingEnd"] = 4] = "MappingEnd";
    EventType[EventType["DocumentStart"] = 5] = "DocumentStart";
    EventType[EventType["DocumentEnd"] = 6] = "DocumentEnd";
})(EventType || (EventType = {}));
//# sourceMappingURL=parse-event.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/boolean-definition.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/boolean-definition.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BooleanDefinition: () => (/* binding */ BooleanDefinition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _tokens_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");
/* harmony import */ var _definition_type__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");
/* harmony import */ var _scalar_definition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scalar-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/scalar-definition.js");




class BooleanDefinition extends _scalar_definition__WEBPACK_IMPORTED_MODULE_3__.ScalarDefinition {
    constructor(key, definition) {
        super(key, definition);
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                switch (definitionKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.BOOLEAN: {
                        const mapping = definitionPair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.BOOLEAN}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.BOOLEAN} key`);
                            switch (mappingKey.value) {
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.BOOLEAN} key`);
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.Boolean;
    }
    isMatch(literal) {
        return literal.templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Boolean;
    }
    validate() {
        // no-op
    }
}
//# sourceMappingURL=boolean-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-info.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/definition-info.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefinitionInfo: () => (/* binding */ DefinitionInfo)
/* harmony export */ });
class DefinitionInfo {
    constructor(schemaOrParent, nameOrDefinition) {
        this.isDefinitionInfo = true;
        const parent = schemaOrParent?.isDefinitionInfo === true
            ? schemaOrParent
            : undefined;
        this._schema = parent === undefined ? schemaOrParent : parent._schema;
        // Lookup the definition if a key was passed in
        this.definition =
            typeof nameOrDefinition === "string" ? this._schema.getDefinition(nameOrDefinition) : nameOrDefinition;
        // Record allowed context
        if (this.definition.readerContext.length > 0) {
            this.allowedContext = [];
            // Copy parent allowed context
            const upperSeen = {};
            for (const context of parent?.allowedContext ?? []) {
                this.allowedContext.push(context);
                upperSeen[context.toUpperCase()] = true;
            }
            // Append context if unseen
            for (const context of this.definition.readerContext) {
                const upper = context.toUpperCase();
                if (!upperSeen[upper]) {
                    this.allowedContext.push(context);
                    upperSeen[upper] = true;
                }
            }
        }
        else {
            this.allowedContext = parent?.allowedContext ?? [];
        }
    }
    getScalarDefinitions() {
        return this._schema.getScalarDefinitions(this.definition);
    }
    getDefinitionsOfType(type) {
        return this._schema.getDefinitionsOfType(this.definition, type);
    }
}
//# sourceMappingURL=definition-info.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefinitionType: () => (/* binding */ DefinitionType)
/* harmony export */ });
var DefinitionType;
(function (DefinitionType) {
    DefinitionType[DefinitionType["Null"] = 0] = "Null";
    DefinitionType[DefinitionType["Boolean"] = 1] = "Boolean";
    DefinitionType[DefinitionType["Number"] = 2] = "Number";
    DefinitionType[DefinitionType["String"] = 3] = "String";
    DefinitionType[DefinitionType["Sequence"] = 4] = "Sequence";
    DefinitionType[DefinitionType["Mapping"] = 5] = "Mapping";
    DefinitionType[DefinitionType["OneOf"] = 6] = "OneOf";
    DefinitionType[DefinitionType["AllowedValues"] = 7] = "AllowedValues";
})(DefinitionType || (DefinitionType = {}));
//# sourceMappingURL=definition-type.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/definition.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Definition: () => (/* binding */ Definition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");

/**
 * Defines the allowable schema for a user defined type
 */
class Definition {
    constructor(key, definition) {
        /**
         * Used by the template reader to determine allowed expression values and functions.
         * Also used by the template reader to validate function min/max parameters.
         */
        this.readerContext = [];
        /**
         * Used by the template evaluator to determine allowed expression values and functions.
         * The min/max parameter info is omitted.
         */
        this.evaluatorContext = [];
        this.key = key;
        if (definition) {
            for (let i = 0; i < definition.count;) {
                const definitionKey = definition.get(i).key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                switch (definitionKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.CONTEXT: {
                        const context = definition.get(i).value.assertSequence(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.CONTEXT}`);
                        definition.remove(i);
                        const seenReaderContext = {};
                        const seenEvaluatorContext = {};
                        for (const item of context) {
                            const itemStr = item.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.CONTEXT} item`).value;
                            const upperItemStr = itemStr.toUpperCase();
                            if (seenReaderContext[upperItemStr]) {
                                throw new Error(`Duplicate context item '${itemStr}'`);
                            }
                            seenReaderContext[upperItemStr] = true;
                            this.readerContext.push(itemStr);
                            // Remove min/max parameter info
                            const paramIndex = itemStr.indexOf("(");
                            const modifiedItemStr = paramIndex > 0 ? itemStr.substr(0, paramIndex + 1) + ")" : itemStr;
                            const upperModifiedItemStr = modifiedItemStr.toUpperCase();
                            if (seenEvaluatorContext[upperModifiedItemStr]) {
                                throw new Error(`Duplicate context item '${modifiedItemStr}'`);
                            }
                            seenEvaluatorContext[upperModifiedItemStr] = true;
                            this.evaluatorContext.push(modifiedItemStr);
                        }
                        break;
                    }
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.DESCRIPTION: {
                        const value = definition.get(i).value;
                        this.description = value.assertString(_template_constants__WEBPACK_IMPORTED_MODULE_0__.DESCRIPTION).value;
                        definition.remove(i);
                        break;
                    }
                    default: {
                        i++;
                        break;
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateSchema: () => (/* reexport safe */ _template_schema__WEBPACK_IMPORTED_MODULE_0__.TemplateSchema)
/* harmony export */ });
/* harmony import */ var _template_schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-schema */ "./node_modules/@actions/workflow-parser/dist/templates/schema/template-schema.js");

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/mapping-definition.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/mapping-definition.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MappingDefinition: () => (/* binding */ MappingDefinition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _definition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition.js");
/* harmony import */ var _definition_type__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");
/* harmony import */ var _property_definition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./property-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/property-definition.js");




class MappingDefinition extends _definition__WEBPACK_IMPORTED_MODULE_1__.Definition {
    constructor(key, definition) {
        super(key, definition);
        this.properties = {};
        this.looseKeyType = "";
        this.looseValueType = "";
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                switch (definitionKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING: {
                        const mapping = definitionPair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING} key`);
                            switch (mappingKey.value) {
                                case _template_constants__WEBPACK_IMPORTED_MODULE_0__.PROPERTIES: {
                                    const properties = mappingPair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.PROPERTIES}`);
                                    for (const propertiesPair of properties) {
                                        const propertyName = propertiesPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.PROPERTIES} key`);
                                        this.properties[propertyName.value] = new _property_definition__WEBPACK_IMPORTED_MODULE_3__.PropertyDefinition(propertiesPair.value);
                                    }
                                    break;
                                }
                                case _template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_KEY_TYPE: {
                                    const looseKeyType = mappingPair.value.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_KEY_TYPE}`);
                                    this.looseKeyType = looseKeyType.value;
                                    break;
                                }
                                case _template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_VALUE_TYPE: {
                                    const looseValueType = mappingPair.value.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_VALUE_TYPE}`);
                                    this.looseValueType = looseValueType.value;
                                    break;
                                }
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING} key`);
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.Mapping;
    }
    validate(schema, name) {
        // Lookup loose key type
        if (this.looseKeyType) {
            schema.getDefinition(this.looseKeyType);
            // Lookup loose value type
            if (this.looseValueType) {
                schema.getDefinition(this.looseValueType);
            }
            else {
                throw new Error(`Property '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_KEY_TYPE}' is defined but '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_VALUE_TYPE}' is not defined on '${name}'`);
            }
        }
        // Otherwise validate loose value type not be defined
        else if (this.looseValueType) {
            throw new Error(`Property '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_VALUE_TYPE}' is defined but '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_KEY_TYPE}' is not defined on '${name}'`);
        }
        // Lookup each property
        for (const propertyName of Object.keys(this.properties)) {
            const propertyDef = this.properties[propertyName];
            if (!propertyDef.type) {
                throw new Error(`Type not specified for the property '${propertyName}' on '${name}'`);
            }
            schema.getDefinition(propertyDef.type);
        }
    }
}
//# sourceMappingURL=mapping-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/null-definition.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/null-definition.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NullDefinition: () => (/* binding */ NullDefinition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _definition_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");
/* harmony import */ var _scalar_definition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scalar-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/scalar-definition.js");
/* harmony import */ var _tokens_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");




class NullDefinition extends _scalar_definition__WEBPACK_IMPORTED_MODULE_2__.ScalarDefinition {
    constructor(key, definition) {
        super(key, definition);
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                switch (definitionKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.NULL: {
                        const mapping = definitionPair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.NULL}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.NULL} key`);
                            switch (mappingKey.value) {
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.NULL} key`);
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return _definition_type__WEBPACK_IMPORTED_MODULE_1__.DefinitionType.Null;
    }
    isMatch(literal) {
        return literal.templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_3__.TokenType.Null;
    }
    validate() {
        // no-op
    }
}
//# sourceMappingURL=null-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/number-definition.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/number-definition.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NumberDefinition: () => (/* binding */ NumberDefinition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _definition_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");
/* harmony import */ var _scalar_definition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scalar-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/scalar-definition.js");
/* harmony import */ var _tokens_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");




class NumberDefinition extends _scalar_definition__WEBPACK_IMPORTED_MODULE_2__.ScalarDefinition {
    constructor(key, definition) {
        super(key, definition);
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                switch (definitionKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.NUMBER: {
                        const mapping = definitionPair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.NUMBER}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.NUMBER} key`);
                            switch (mappingKey.value) {
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.NUMBER} key`);
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return _definition_type__WEBPACK_IMPORTED_MODULE_1__.DefinitionType.Number;
    }
    isMatch(literal) {
        return literal.templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_3__.TokenType.Number;
    }
    validate() {
        // no-op
    }
}
//# sourceMappingURL=number-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/one-of-definition.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/one-of-definition.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OneOfDefinition: () => (/* binding */ OneOfDefinition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _definition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition.js");
/* harmony import */ var _definition_type__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");



/**
 * Must resolve to exactly one of the referenced definitions
 */
class OneOfDefinition extends _definition__WEBPACK_IMPORTED_MODULE_1__.Definition {
    constructor(key, definition) {
        super(key, definition);
        this.oneOf = [];
        this.oneOfPrefix = [];
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                switch (definitionKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.ONE_OF: {
                        const oneOf = definitionPair.value.assertSequence(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.ONE_OF}`);
                        for (const item of oneOf) {
                            const oneOfItem = item.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.ONE_OF} item`);
                            this.oneOf.push(oneOfItem.value);
                        }
                        break;
                    }
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.ALLOWED_VALUES: {
                        const oneOf = definitionPair.value.assertSequence(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.ALLOWED_VALUES}`);
                        for (const item of oneOf) {
                            const oneOfItem = item.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.ONE_OF} item`);
                            this.oneOf.push(this.key + "-" + oneOfItem.value);
                        }
                        break;
                    }
                    default:
                        // throws
                        definitionKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                        break;
                }
            }
        }
    }
    get definitionType() {
        return _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.OneOf;
    }
    validate(schema, name) {
        if (this.oneOf.length === 0) {
            throw new Error(`'${name}' does not contain any references`);
        }
        let foundLooseKeyType = false;
        const mappingDefinitions = [];
        let allowedValuesDefinition;
        let sequenceDefinition;
        let nullDefinition;
        let booleanDefinition;
        let numberDefinition;
        const stringDefinitions = [];
        const seenNestedTypes = {};
        for (const nestedType of this.oneOf) {
            if (seenNestedTypes[nestedType]) {
                throw new Error(`'${name}' contains duplicate nested type '${nestedType}'`);
            }
            seenNestedTypes[nestedType] = true;
            const nestedDefinition = schema.getDefinition(nestedType);
            if (nestedDefinition.readerContext.length > 0) {
                throw new Error(`'${name}' is a one-of definition and references another definition that defines context. This is currently not supported.`);
            }
            switch (nestedDefinition.definitionType) {
                case _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.Mapping: {
                    const mappingDefinition = nestedDefinition;
                    mappingDefinitions.push(mappingDefinition);
                    if (mappingDefinition.looseKeyType) {
                        foundLooseKeyType = true;
                    }
                    break;
                }
                case _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.Sequence: {
                    // Multiple sequence definitions not allowed
                    if (sequenceDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.SEQUENCE}'`);
                    }
                    sequenceDefinition = nestedDefinition;
                    break;
                }
                case _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.Null: {
                    // Multiple null definitions not allowed
                    if (nullDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.NULL}'`);
                    }
                    nullDefinition = nestedDefinition;
                    break;
                }
                case _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.Boolean: {
                    // Multiple boolean definitions not allowed
                    if (booleanDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.BOOLEAN}'`);
                    }
                    booleanDefinition = nestedDefinition;
                    break;
                }
                case _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.Number: {
                    // Multiple number definitions not allowed
                    if (numberDefinition) {
                        throw new Error(`'${name}' refers to more than one definition of type '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.NUMBER}'`);
                    }
                    numberDefinition = nestedDefinition;
                    break;
                }
                case _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.String: {
                    const stringDefinition = nestedDefinition;
                    // Multiple string definitions
                    if (stringDefinitions.length > 0 && (!stringDefinitions[0].constant || !stringDefinition.constant)) {
                        throw new Error(`'${name}' refers to more than one '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.SCALAR}', but some do not set '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.CONSTANT}'`);
                    }
                    stringDefinitions.push(stringDefinition);
                    break;
                }
                case _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.OneOf: {
                    // Multiple allowed-values definitions not allowed
                    if (allowedValuesDefinition) {
                        throw new Error(`'${name}' contains multiple allowed-values definitions`);
                    }
                    allowedValuesDefinition = nestedDefinition;
                    break;
                }
                default:
                    throw new Error(`'${name}' refers to a definition with type '${nestedDefinition.definitionType}'`);
            }
        }
        if (mappingDefinitions.length > 1) {
            if (foundLooseKeyType) {
                throw new Error(`'${name}' refers to two mappings and at least one sets '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.LOOSE_KEY_TYPE}'. This is not currently supported.`);
            }
            const seenProperties = {};
            for (const mappingDefinition of mappingDefinitions) {
                for (const propertyName of Object.keys(mappingDefinition.properties)) {
                    const newPropertyDef = mappingDefinition.properties[propertyName];
                    // Already seen
                    const existingPropertyDef = seenProperties[propertyName];
                    if (existingPropertyDef) {
                        // Types match
                        if (existingPropertyDef.type === newPropertyDef.type) {
                            continue;
                        }
                        // Collision
                        throw new Error(`'${name}' contains two mappings with the same property, but each refers to a different type. All matching properties must refer to the same type.`);
                    }
                    // New
                    else {
                        seenProperties[propertyName] = newPropertyDef;
                    }
                }
            }
        }
    }
}
//# sourceMappingURL=one-of-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/property-definition.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/property-definition.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PropertyDefinition: () => (/* binding */ PropertyDefinition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _tokens_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");


class PropertyDefinition {
    constructor(token) {
        this.type = "";
        this.required = false;
        if (token.templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.String) {
            this.type = token.value;
        }
        else {
            const mapping = token.assertMapping(_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING_PROPERTY_VALUE);
            for (const mappingPair of mapping) {
                const mappingKey = mappingPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING_PROPERTY_VALUE} key`);
                switch (mappingKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.TYPE:
                        this.type = mappingPair.value.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING_PROPERTY_VALUE} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.TYPE}`).value;
                        break;
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.REQUIRED:
                        this.required = mappingPair.value.assertBoolean(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING_PROPERTY_VALUE} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.REQUIRED}`).value;
                        break;
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.DESCRIPTION:
                        this.description = mappingPair.value.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING_PROPERTY_VALUE} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DESCRIPTION}`).value;
                        break;
                    default:
                        mappingKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.MAPPING_PROPERTY_VALUE} key`); // throws
                }
            }
        }
    }
}
//# sourceMappingURL=property-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/scalar-definition.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/scalar-definition.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScalarDefinition: () => (/* binding */ ScalarDefinition)
/* harmony export */ });
/* harmony import */ var _definition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition.js");

class ScalarDefinition extends _definition__WEBPACK_IMPORTED_MODULE_0__.Definition {
    constructor(key, definition) {
        super(key, definition);
    }
}
//# sourceMappingURL=scalar-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/sequence-definition.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/sequence-definition.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SequenceDefinition: () => (/* binding */ SequenceDefinition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _definition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition.js");
/* harmony import */ var _definition_type__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");



class SequenceDefinition extends _definition__WEBPACK_IMPORTED_MODULE_1__.Definition {
    constructor(key, definition) {
        super(key, definition);
        this.itemType = "";
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                switch (definitionKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.SEQUENCE: {
                        const mapping = definitionPair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.SEQUENCE}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.SEQUENCE} key`);
                            switch (mappingKey.value) {
                                case _template_constants__WEBPACK_IMPORTED_MODULE_0__.ITEM_TYPE: {
                                    const itemType = mappingPair.value.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.SEQUENCE} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.ITEM_TYPE}`);
                                    this.itemType = itemType.value;
                                    break;
                                }
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.SEQUENCE} key`);
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.Sequence;
    }
    validate(schema, name) {
        if (!this.itemType) {
            throw new Error(`'${name}' does not defined '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.ITEM_TYPE}'`);
        }
        // Lookup item type
        schema.getDefinition(this.itemType);
    }
}
//# sourceMappingURL=sequence-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/string-definition.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/string-definition.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StringDefinition: () => (/* binding */ StringDefinition)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _tokens_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");
/* harmony import */ var _definition_type__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");
/* harmony import */ var _scalar_definition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scalar-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/scalar-definition.js");




class StringDefinition extends _scalar_definition__WEBPACK_IMPORTED_MODULE_3__.ScalarDefinition {
    constructor(key, definition) {
        super(key, definition);
        this.constant = "";
        this.ignoreCase = false;
        this.requireNonEmpty = false;
        this.isExpression = false;
        if (definition) {
            for (const definitionPair of definition) {
                const definitionKey = definitionPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`);
                switch (definitionKey.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_0__.STRING: {
                        const mapping = definitionPair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.STRING}`);
                        for (const mappingPair of mapping) {
                            const mappingKey = mappingPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.STRING} key`);
                            switch (mappingKey.value) {
                                case _template_constants__WEBPACK_IMPORTED_MODULE_0__.CONSTANT: {
                                    const constantStringToken = mappingPair.value.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.STRING} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.CONSTANT}`);
                                    this.constant = constantStringToken.value;
                                    break;
                                }
                                case _template_constants__WEBPACK_IMPORTED_MODULE_0__.IGNORE_CASE: {
                                    const ignoreCaseBooleanToken = mappingPair.value.assertBoolean(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.STRING} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.IGNORE_CASE}`);
                                    this.ignoreCase = ignoreCaseBooleanToken.value;
                                    break;
                                }
                                case _template_constants__WEBPACK_IMPORTED_MODULE_0__.REQUIRE_NON_EMPTY: {
                                    const requireNonEmptyBooleanToken = mappingPair.value.assertBoolean(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.STRING} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.REQUIRE_NON_EMPTY}`);
                                    this.requireNonEmpty = requireNonEmptyBooleanToken.value;
                                    break;
                                }
                                case _template_constants__WEBPACK_IMPORTED_MODULE_0__.IS_EXPRESSION: {
                                    const isExpressionToken = mappingPair.value.assertBoolean(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.STRING} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.IS_EXPRESSION}`);
                                    this.isExpression = isExpressionToken.value;
                                    break;
                                }
                                default:
                                    // throws
                                    mappingKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.STRING} key`);
                                    break;
                            }
                        }
                        break;
                    }
                    default:
                        definitionKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_0__.DEFINITION} key`); // throws
                }
            }
        }
    }
    get definitionType() {
        return _definition_type__WEBPACK_IMPORTED_MODULE_2__.DefinitionType.String;
    }
    isMatch(literal) {
        if (literal.templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.String) {
            const value = literal.value;
            if (this.constant) {
                return this.ignoreCase ? this.constant.toUpperCase() === value.toUpperCase() : this.constant === value;
            }
            else if (this.requireNonEmpty) {
                return !!value;
            }
            else {
                return true;
            }
        }
        return false;
    }
    validate() {
        if (this.constant && this.requireNonEmpty) {
            throw new Error(`Properties '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.CONSTANT}' and '${_template_constants__WEBPACK_IMPORTED_MODULE_0__.REQUIRE_NON_EMPTY}' cannot both be set`);
        }
    }
}
//# sourceMappingURL=string-definition.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/schema/template-schema.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/schema/template-schema.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateSchema: () => (/* binding */ TemplateSchema)
/* harmony export */ });
/* harmony import */ var _templates_tokens_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../templates/tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _template_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../template-context */ "./node_modules/@actions/workflow-parser/dist/templates/template-context.js");
/* harmony import */ var _template_reader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../template-reader */ "./node_modules/@actions/workflow-parser/dist/templates/template-reader.js");
/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tokens */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _trace_writer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../trace-writer */ "./node_modules/@actions/workflow-parser/dist/templates/trace-writer.js");
/* harmony import */ var _boolean_definition__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./boolean-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/boolean-definition.js");
/* harmony import */ var _definition_type__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");
/* harmony import */ var _mapping_definition__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./mapping-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/mapping-definition.js");
/* harmony import */ var _null_definition__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./null-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/null-definition.js");
/* harmony import */ var _number_definition__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./number-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/number-definition.js");
/* harmony import */ var _one_of_definition__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./one-of-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/one-of-definition.js");
/* harmony import */ var _property_definition__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./property-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/property-definition.js");
/* harmony import */ var _sequence_definition__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./sequence-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/sequence-definition.js");
/* harmony import */ var _string_definition__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./string-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/string-definition.js");















/**
 * This models the root schema object and contains definitions
 */
class TemplateSchema {
    constructor(mapping) {
        this.definitions = {};
        this.version = "";
        // Add built-in type: null
        this.definitions[_template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL] = new _null_definition__WEBPACK_IMPORTED_MODULE_9__.NullDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL);
        // Add built-in type: boolean
        this.definitions[_template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN] = new _boolean_definition__WEBPACK_IMPORTED_MODULE_6__.BooleanDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN);
        // Add built-in type: number
        this.definitions[_template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER] = new _number_definition__WEBPACK_IMPORTED_MODULE_10__.NumberDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER);
        // Add built-in type: string
        this.definitions[_template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING] = new _string_definition__WEBPACK_IMPORTED_MODULE_14__.StringDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING);
        // Add built-in type: sequence
        const sequenceDefinition = new _sequence_definition__WEBPACK_IMPORTED_MODULE_13__.SequenceDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE);
        sequenceDefinition.itemType = _template_constants__WEBPACK_IMPORTED_MODULE_1__.ANY;
        this.definitions[sequenceDefinition.key] = sequenceDefinition;
        // Add built-in type: mapping
        const mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING);
        mappingDefinition.looseKeyType = _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING;
        mappingDefinition.looseValueType = _template_constants__WEBPACK_IMPORTED_MODULE_1__.ANY;
        this.definitions[mappingDefinition.key] = mappingDefinition;
        // Add built-in type: any
        const anyDefinition = new _one_of_definition__WEBPACK_IMPORTED_MODULE_11__.OneOfDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.ANY);
        anyDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL);
        anyDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN);
        anyDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER);
        anyDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING);
        anyDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE);
        anyDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING);
        this.definitions[anyDefinition.key] = anyDefinition;
        if (mapping) {
            for (const pair of mapping) {
                const key = pair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA} key`);
                switch (key.value) {
                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.VERSION: {
                        this.version = pair.value.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA} ${_template_constants__WEBPACK_IMPORTED_MODULE_1__.VERSION}`).value;
                        break;
                    }
                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITIONS: {
                        const definitions = pair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA} ${_template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITIONS}`);
                        for (const definitionsPair of definitions) {
                            const definitionsKey = definitionsPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA} ${_template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITIONS} key`);
                            const definitionsValue = definitionsPair.value.assertMapping(`${_template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA} ${_template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITIONS} value`);
                            let definition;
                            for (const definitionPair of definitionsValue) {
                                const definitionKey = definitionPair.key.assertString(`${_template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITION} key`);
                                const mappingToken = definitionsPair.value;
                                switch (definitionKey.value) {
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL:
                                        definition = new _null_definition__WEBPACK_IMPORTED_MODULE_9__.NullDefinition(definitionsKey.value, definitionsValue);
                                        break;
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN:
                                        definition = new _boolean_definition__WEBPACK_IMPORTED_MODULE_6__.BooleanDefinition(definitionsKey.value, definitionsValue);
                                        break;
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER:
                                        definition = new _number_definition__WEBPACK_IMPORTED_MODULE_10__.NumberDefinition(definitionsKey.value, definitionsValue);
                                        break;
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING:
                                        definition = new _string_definition__WEBPACK_IMPORTED_MODULE_14__.StringDefinition(definitionsKey.value, definitionsValue);
                                        break;
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE:
                                        definition = new _sequence_definition__WEBPACK_IMPORTED_MODULE_13__.SequenceDefinition(definitionsKey.value, definitionsValue);
                                        break;
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING:
                                        definition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(definitionsKey.value, definitionsValue);
                                        break;
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.ONE_OF:
                                        definition = new _one_of_definition__WEBPACK_IMPORTED_MODULE_11__.OneOfDefinition(definitionsKey.value, definitionsValue);
                                        break;
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.ALLOWED_VALUES:
                                        // Change the allowed-values definition into a one-of definition and its corresponding string definitions
                                        for (const item of mappingToken) {
                                            if (item.value.templateTokenType === _templates_tokens_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.Sequence) {
                                                // Create a new string definition for each StringToken in the sequence
                                                const sequenceToken = item.value;
                                                for (const activity of sequenceToken) {
                                                    if (activity.templateTokenType === _templates_tokens_types__WEBPACK_IMPORTED_MODULE_0__.TokenType.String) {
                                                        const stringToken = activity;
                                                        const allowedValuesKey = definitionsKey.value + "-" + stringToken.value;
                                                        const allowedValuesDef = new _string_definition__WEBPACK_IMPORTED_MODULE_14__.StringDefinition(allowedValuesKey);
                                                        allowedValuesDef.constant = stringToken.toDisplayString();
                                                        this.definitions[allowedValuesKey] = allowedValuesDef;
                                                    }
                                                }
                                            }
                                        }
                                        definition = new _one_of_definition__WEBPACK_IMPORTED_MODULE_11__.OneOfDefinition(definitionsKey.value, definitionsValue);
                                        break;
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.CONTEXT:
                                    case _template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION:
                                        continue;
                                    default:
                                        // throws
                                        definitionKey.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITION} mapping key`);
                                        break;
                                }
                                break;
                            }
                            if (!definition) {
                                throw new Error(`Not enough information to construct definition '${definitionsKey.value}'`);
                            }
                            this.definitions[definitionsKey.value] = definition;
                        }
                        break;
                    }
                    default:
                        // throws
                        key.assertUnexpectedValue(`${_template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA} key`);
                        break;
                }
            }
        }
    }
    /**
     * Looks up a definition by name
     */
    getDefinition(name) {
        const result = this.definitions[name];
        if (result) {
            return result;
        }
        throw new Error(`Schema definition '${name}' not found`);
    }
    /**
     * Expands one-of definitions and returns all scalar definitions
     */
    getScalarDefinitions(definition) {
        const result = [];
        switch (definition.definitionType) {
            case _definition_type__WEBPACK_IMPORTED_MODULE_7__.DefinitionType.Null:
            case _definition_type__WEBPACK_IMPORTED_MODULE_7__.DefinitionType.Boolean:
            case _definition_type__WEBPACK_IMPORTED_MODULE_7__.DefinitionType.Number:
            case _definition_type__WEBPACK_IMPORTED_MODULE_7__.DefinitionType.String:
                result.push(definition);
                break;
            case _definition_type__WEBPACK_IMPORTED_MODULE_7__.DefinitionType.OneOf: {
                const oneOf = definition;
                // Expand nested one-of definitions
                for (const nestedName of oneOf.oneOf) {
                    const nestedDefinition = this.getDefinition(nestedName);
                    result.push(...this.getScalarDefinitions(nestedDefinition));
                }
                break;
            }
        }
        return result;
    }
    /**
     * Expands one-of definitions and returns all matching definitions by type
     */
    getDefinitionsOfType(definition, type) {
        const result = [];
        if (definition.definitionType === type) {
            result.push(definition);
        }
        else if (definition.definitionType === _definition_type__WEBPACK_IMPORTED_MODULE_7__.DefinitionType.OneOf) {
            const oneOf = definition;
            for (const nestedName of oneOf.oneOf) {
                const nestedDefinition = this.getDefinition(nestedName);
                if (nestedDefinition.definitionType === type) {
                    result.push(nestedDefinition);
                }
            }
        }
        return result;
    }
    /**
     * Attempts match the property name to a property defined by any of the specified definitions.
     * If matched, any unmatching definitions are filtered from the definitions array.
     * Returns the type information for the matched property.
     */
    matchPropertyAndFilter(definitions, propertyName) {
        let result;
        // Check for a matching well-known property
        let notFoundInSome = false;
        for (const definition of definitions) {
            const propertyDef = definition.properties[propertyName];
            if (propertyDef) {
                result = propertyDef;
            }
            else {
                notFoundInSome = true;
            }
        }
        // Filter the matched definitions if needed
        if (result && notFoundInSome) {
            for (let i = 0; i < definitions.length;) {
                if (definitions[i].properties[propertyName]) {
                    i++;
                }
                else {
                    definitions.splice(i, 1);
                }
            }
        }
        return result;
    }
    validate() {
        const oneOfDefinitions = {};
        for (const name of Object.keys(this.definitions)) {
            if (!name.match(TemplateSchema._definitionNamePattern)) {
                throw new Error(`Invalid definition name '${name}'`);
            }
            const definition = this.definitions[name];
            // Delay validation for 'one-of' definitions
            if (definition.definitionType === _definition_type__WEBPACK_IMPORTED_MODULE_7__.DefinitionType.OneOf) {
                oneOfDefinitions[name] = definition;
            }
            // Otherwise validate now
            else {
                definition.validate(this, name);
            }
        }
        // Validate 'one-of' definitions
        for (const name of Object.keys(oneOfDefinitions)) {
            const oneOf = oneOfDefinitions[name];
            oneOf.validate(this, name);
        }
    }
    /**
     * Loads a user-defined schema file
     */
    static load(objectReader) {
        const context = new _template_context__WEBPACK_IMPORTED_MODULE_2__.TemplateContext(new _template_context__WEBPACK_IMPORTED_MODULE_2__.TemplateValidationErrors(10, 500), TemplateSchema.getInternalSchema(), new _trace_writer__WEBPACK_IMPORTED_MODULE_5__.NoOperationTraceWriter());
        const template = (0,_template_reader__WEBPACK_IMPORTED_MODULE_3__.readTemplate)(context, _template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA, objectReader, undefined);
        context.errors.check();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const mapping = template.assertMapping(_template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA);
        const schema = new TemplateSchema(mapping);
        schema.validate();
        return schema;
    }
    /**
     * Gets the internal schema used for reading user-defined schema files
     */
    static getInternalSchema() {
        if (TemplateSchema._internalSchema === undefined) {
            const schema = new TemplateSchema();
            // template-schema
            let mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPLATE_SCHEMA);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.VERSION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITIONS] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITIONS, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // definitions
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITIONS);
            mappingDefinition.looseKeyType = _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING;
            mappingDefinition.looseValueType = _template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITION;
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // definition
            let oneOfDefinition = new _one_of_definition__WEBPACK_IMPORTED_MODULE_11__.OneOfDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.DEFINITION);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL_DEFINITION);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN_DEFINITION);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER_DEFINITION);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING_DEFINITION);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_DEFINITION);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING_DEFINITION);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.ONE_OF_DEFINITION);
            schema.definitions[oneOfDefinition.key] = oneOfDefinition;
            // null-definition
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL_DEFINITION);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.CONTEXT] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL_DEFINITION_PROPERTIES, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // null-definition-properties
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NULL_DEFINITION_PROPERTIES);
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // boolean-definition
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN_DEFINITION);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.CONTEXT] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN_DEFINITION_PROPERTIES, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // boolean-definition-properties
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN_DEFINITION_PROPERTIES);
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // number-definition
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER_DEFINITION);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.CONTEXT] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER_DEFINITION_PROPERTIES, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // number-definition-properties
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NUMBER_DEFINITION_PROPERTIES);
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // string-definition
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING_DEFINITION);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.CONTEXT] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING_DEFINITION_PROPERTIES, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // string-definition-properties
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING_DEFINITION_PROPERTIES);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.CONSTANT] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.IGNORE_CASE] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.REQUIRE_NON_EMPTY] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.IS_EXPRESSION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // sequence-definition
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_DEFINITION);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.CONTEXT] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_DEFINITION_PROPERTIES, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // sequence-definition-properties
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_DEFINITION_PROPERTIES);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.ITEM_TYPE] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // mapping-definition
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING_DEFINITION);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.CONTEXT] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING_DEFINITION_PROPERTIES, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // mapping-definition-properties
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING_DEFINITION_PROPERTIES);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.PROPERTIES] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.PROPERTIES, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.LOOSE_KEY_TYPE] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.LOOSE_VALUE_TYPE] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // properties
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.PROPERTIES);
            mappingDefinition.looseKeyType = _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING;
            mappingDefinition.looseValueType = _template_constants__WEBPACK_IMPORTED_MODULE_1__.PROPERTY_VALUE;
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // property-value
            oneOfDefinition = new _one_of_definition__WEBPACK_IMPORTED_MODULE_11__.OneOfDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.PROPERTY_VALUE);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING);
            oneOfDefinition.oneOf.push(_template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING_PROPERTY_VALUE);
            schema.definitions[oneOfDefinition.key] = oneOfDefinition;
            // mapping-property-value
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.MAPPING_PROPERTY_VALUE);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.TYPE] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.REQUIRED] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.BOOLEAN, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // one-of-definition
            mappingDefinition = new _mapping_definition__WEBPACK_IMPORTED_MODULE_8__.MappingDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.ONE_OF_DEFINITION);
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.DESCRIPTION] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.CONTEXT] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.ONE_OF] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            mappingDefinition.properties[_template_constants__WEBPACK_IMPORTED_MODULE_1__.ALLOWED_VALUES] = new _property_definition__WEBPACK_IMPORTED_MODULE_12__.PropertyDefinition(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(undefined, undefined, _template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING, undefined));
            schema.definitions[mappingDefinition.key] = mappingDefinition;
            // non-empty-string
            const stringDefinition = new _string_definition__WEBPACK_IMPORTED_MODULE_14__.StringDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING);
            stringDefinition.requireNonEmpty = true;
            schema.definitions[stringDefinition.key] = stringDefinition;
            // sequence-of-non-empty-string
            const sequenceDefinition = new _sequence_definition__WEBPACK_IMPORTED_MODULE_13__.SequenceDefinition(_template_constants__WEBPACK_IMPORTED_MODULE_1__.SEQUENCE_OF_NON_EMPTY_STRING);
            sequenceDefinition.itemType = _template_constants__WEBPACK_IMPORTED_MODULE_1__.NON_EMPTY_STRING;
            schema.definitions[sequenceDefinition.key] = sequenceDefinition;
            schema.validate();
            TemplateSchema._internalSchema = schema;
        }
        return TemplateSchema._internalSchema;
    }
}
TemplateSchema._definitionNamePattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
//# sourceMappingURL=template-schema.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/template-constants.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALLOWED_VALUES: () => (/* binding */ ALLOWED_VALUES),
/* harmony export */   ANY: () => (/* binding */ ANY),
/* harmony export */   BOOLEAN: () => (/* binding */ BOOLEAN),
/* harmony export */   BOOLEAN_DEFINITION: () => (/* binding */ BOOLEAN_DEFINITION),
/* harmony export */   BOOLEAN_DEFINITION_PROPERTIES: () => (/* binding */ BOOLEAN_DEFINITION_PROPERTIES),
/* harmony export */   CLOSE_EXPRESSION: () => (/* binding */ CLOSE_EXPRESSION),
/* harmony export */   CONSTANT: () => (/* binding */ CONSTANT),
/* harmony export */   CONTEXT: () => (/* binding */ CONTEXT),
/* harmony export */   DEFINITION: () => (/* binding */ DEFINITION),
/* harmony export */   DEFINITIONS: () => (/* binding */ DEFINITIONS),
/* harmony export */   DESCRIPTION: () => (/* binding */ DESCRIPTION),
/* harmony export */   IGNORE_CASE: () => (/* binding */ IGNORE_CASE),
/* harmony export */   INSERT_DIRECTIVE: () => (/* binding */ INSERT_DIRECTIVE),
/* harmony export */   IS_EXPRESSION: () => (/* binding */ IS_EXPRESSION),
/* harmony export */   ITEM_TYPE: () => (/* binding */ ITEM_TYPE),
/* harmony export */   LOOSE_KEY_TYPE: () => (/* binding */ LOOSE_KEY_TYPE),
/* harmony export */   LOOSE_VALUE_TYPE: () => (/* binding */ LOOSE_VALUE_TYPE),
/* harmony export */   MAPPING: () => (/* binding */ MAPPING),
/* harmony export */   MAPPING_DEFINITION: () => (/* binding */ MAPPING_DEFINITION),
/* harmony export */   MAPPING_DEFINITION_PROPERTIES: () => (/* binding */ MAPPING_DEFINITION_PROPERTIES),
/* harmony export */   MAPPING_PROPERTY_VALUE: () => (/* binding */ MAPPING_PROPERTY_VALUE),
/* harmony export */   MAX_CONSTANT: () => (/* binding */ MAX_CONSTANT),
/* harmony export */   NON_EMPTY_STRING: () => (/* binding */ NON_EMPTY_STRING),
/* harmony export */   NULL: () => (/* binding */ NULL),
/* harmony export */   NULL_DEFINITION: () => (/* binding */ NULL_DEFINITION),
/* harmony export */   NULL_DEFINITION_PROPERTIES: () => (/* binding */ NULL_DEFINITION_PROPERTIES),
/* harmony export */   NUMBER: () => (/* binding */ NUMBER),
/* harmony export */   NUMBER_DEFINITION: () => (/* binding */ NUMBER_DEFINITION),
/* harmony export */   NUMBER_DEFINITION_PROPERTIES: () => (/* binding */ NUMBER_DEFINITION_PROPERTIES),
/* harmony export */   ONE_OF: () => (/* binding */ ONE_OF),
/* harmony export */   ONE_OF_DEFINITION: () => (/* binding */ ONE_OF_DEFINITION),
/* harmony export */   OPEN_EXPRESSION: () => (/* binding */ OPEN_EXPRESSION),
/* harmony export */   PROPERTIES: () => (/* binding */ PROPERTIES),
/* harmony export */   PROPERTY_VALUE: () => (/* binding */ PROPERTY_VALUE),
/* harmony export */   REQUIRED: () => (/* binding */ REQUIRED),
/* harmony export */   REQUIRE_NON_EMPTY: () => (/* binding */ REQUIRE_NON_EMPTY),
/* harmony export */   SCALAR: () => (/* binding */ SCALAR),
/* harmony export */   SEQUENCE: () => (/* binding */ SEQUENCE),
/* harmony export */   SEQUENCE_DEFINITION: () => (/* binding */ SEQUENCE_DEFINITION),
/* harmony export */   SEQUENCE_DEFINITION_PROPERTIES: () => (/* binding */ SEQUENCE_DEFINITION_PROPERTIES),
/* harmony export */   SEQUENCE_OF_NON_EMPTY_STRING: () => (/* binding */ SEQUENCE_OF_NON_EMPTY_STRING),
/* harmony export */   STRING: () => (/* binding */ STRING),
/* harmony export */   STRING_DEFINITION: () => (/* binding */ STRING_DEFINITION),
/* harmony export */   STRING_DEFINITION_PROPERTIES: () => (/* binding */ STRING_DEFINITION_PROPERTIES),
/* harmony export */   STRUCTURE: () => (/* binding */ STRUCTURE),
/* harmony export */   TEMPLATE_SCHEMA: () => (/* binding */ TEMPLATE_SCHEMA),
/* harmony export */   TYPE: () => (/* binding */ TYPE),
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const ALLOWED_VALUES = "allowed-values";
const ANY = "any";
const BOOLEAN = "boolean";
const BOOLEAN_DEFINITION = "boolean-definition";
const BOOLEAN_DEFINITION_PROPERTIES = "boolean-definition-properties";
const CLOSE_EXPRESSION = "}}";
const CONSTANT = "constant";
const CONTEXT = "context";
const DEFINITION = "definition";
const DEFINITIONS = "definitions";
const DESCRIPTION = "description";
const IGNORE_CASE = "ignore-case";
const INSERT_DIRECTIVE = "insert";
const IS_EXPRESSION = "is-expression";
const ITEM_TYPE = "item-type";
const LOOSE_KEY_TYPE = "loose-key-type";
const LOOSE_VALUE_TYPE = "loose-value-type";
const MAX_CONSTANT = "MAX";
const MAPPING = "mapping";
const MAPPING_DEFINITION = "mapping-definition";
const MAPPING_DEFINITION_PROPERTIES = "mapping-definition-properties";
const MAPPING_PROPERTY_VALUE = "mapping-property-value";
const NON_EMPTY_STRING = "non-empty-string";
const NULL = "null";
const NULL_DEFINITION = "null-definition";
const NULL_DEFINITION_PROPERTIES = "null-definition-properties";
const NUMBER = "number";
const NUMBER_DEFINITION = "number-definition";
const NUMBER_DEFINITION_PROPERTIES = "number-definition-properties";
const ONE_OF = "one-of";
const ONE_OF_DEFINITION = "one-of-definition";
const OPEN_EXPRESSION = "${{";
const PROPERTY_VALUE = "property-value";
const PROPERTIES = "properties";
const REQUIRED = "required";
const REQUIRE_NON_EMPTY = "require-non-empty";
const SCALAR = "scalar";
const SEQUENCE = "sequence";
const SEQUENCE_DEFINITION = "sequence-definition";
const SEQUENCE_DEFINITION_PROPERTIES = "sequence-definition-properties";
const TYPE = "type";
const SEQUENCE_OF_NON_EMPTY_STRING = "sequence-of-non-empty-string";
const STRING = "string";
const STRING_DEFINITION = "string-definition";
const STRING_DEFINITION_PROPERTIES = "string-definition-properties";
const STRUCTURE = "structure";
const TEMPLATE_SCHEMA = "template-schema";
const VERSION = "version";
//# sourceMappingURL=template-constants.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/template-context.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/template-context.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateContext: () => (/* binding */ TemplateContext),
/* harmony export */   TemplateValidationErrors: () => (/* binding */ TemplateValidationErrors)
/* harmony export */ });
/* harmony import */ var _template_validation_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-validation-error */ "./node_modules/@actions/workflow-parser/dist/templates/template-validation-error.js");

/**
 * Context object that is flowed through while loading and evaluating object templates
 */
class TemplateContext {
    constructor(errors, schema, trace) {
        this._fileIds = {};
        this._fileNames = [];
        /**
         * Available functions within expression contexts
         */
        this.expressionFunctions = [];
        /**
         * Available values within expression contexts
         */
        this.expressionNamedContexts = [];
        this.state = {};
        this.errors = errors;
        this.schema = schema;
        this.trace = trace;
    }
    error(tokenOrFileId, err, tokenRange) {
        const token = tokenOrFileId;
        const range = tokenRange || token?.range;
        const prefix = this.getErrorPrefix(token?.file ?? tokenOrFileId, token?.line, token?.col);
        const message = err?.message ?? String(err);
        const e = new _template_validation_error__WEBPACK_IMPORTED_MODULE_0__.TemplateValidationError(message, prefix, undefined, range);
        this.errors.add(e);
        this.trace.error(e.message);
    }
    /**
     * Gets or adds the file ID
     */
    getFileId(file) {
        const key = file.toUpperCase();
        let id = this._fileIds[key];
        if (id === undefined) {
            id = this._fileNames.length + 1;
            this._fileIds[key] = id;
            this._fileNames.push(file);
        }
        return id;
    }
    /**
     * Looks up a file name by ID. Returns undefined if not found.
     */
    getFileName(fileId) {
        return this._fileNames.length >= fileId ? this._fileNames[fileId - 1] : undefined;
    }
    /**
     * Gets a copy of the file table
     */
    getFileTable() {
        return this._fileNames.slice();
    }
    getErrorPrefix(fileId, line, column) {
        const fileName = fileId !== undefined ? this.getFileName(fileId) : undefined;
        if (fileName) {
            if (line !== undefined && column !== undefined) {
                return `${fileName} (Line: ${line}, Col: ${column})`;
            }
            else {
                return fileName;
            }
        }
        else if (line !== undefined && column !== undefined) {
            return `(Line: ${line}, Col: ${column})`;
        }
        else {
            return "";
        }
    }
}
/**
 * Provides information about errors which occurred during validation
 */
class TemplateValidationErrors {
    constructor(maxErrors, maxMessageLength) {
        this._errors = [];
        this._maxErrors = maxErrors ?? 0;
        this._maxMessageLength = maxMessageLength ?? 0;
    }
    get count() {
        return this._errors.length;
    }
    add(err) {
        for (let e of Array.isArray(err) ? err : [err]) {
            // Check max errors
            if (this._maxErrors <= 0 || this._errors.length < this._maxErrors) {
                // Check max message length
                if (this._maxMessageLength > 0 && e.message.length > this._maxMessageLength) {
                    e = new _template_validation_error__WEBPACK_IMPORTED_MODULE_0__.TemplateValidationError(e.message.substring(0, this._maxMessageLength) + "[...]", e.prefix, e.code, e.range);
                }
                this._errors.push(e);
            }
        }
    }
    /**
     * Throws if any errors
     * @param prefix The error message prefix
     */
    check(prefix) {
        if (this._errors.length <= 0) {
            return;
        }
        if (!prefix) {
            prefix = "The template is not valid.";
        }
        throw new Error(`${prefix} ${this._errors.map(x => x.message).join(",")}`);
    }
    clear() {
        this._errors = [];
    }
    getErrors() {
        return this._errors.slice();
    }
}
//# sourceMappingURL=template-context.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/template-reader.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/template-reader.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   readTemplate: () => (/* binding */ readTemplate)
/* harmony export */ });
/* harmony import */ var _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schema/definition-info */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-info.js");
/* harmony import */ var _schema_definition_type__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./schema/definition-type */ "./node_modules/@actions/workflow-parser/dist/templates/schema/definition-type.js");
/* harmony import */ var _schema_string_definition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./schema/string-definition */ "./node_modules/@actions/workflow-parser/dist/templates/schema/string-definition.js");
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tokens */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _tokens_type_guards__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tokens/type-guards */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js");
/* harmony import */ var _tokens_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tokens/types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");
// template-reader *just* does schema validation
/* eslint-disable @typescript-eslint/no-non-null-assertion */







const WHITESPACE_PATTERN = /\s/;
function readTemplate(context, type, objectReader, fileId) {
    const reader = new TemplateReader(context, objectReader, fileId);
    let value;
    try {
        objectReader.validateStart();
        const definition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(context.schema, type);
        value = reader.readValue(definition);
        objectReader.validateEnd();
    }
    catch (err) {
        context.error(fileId, err);
    }
    return value;
}
class TemplateReader {
    constructor(context, objectReader, fileId) {
        this._context = context;
        this._schema = context.schema;
        this._objectReader = objectReader;
        this._fileId = fileId;
    }
    readValue(definition) {
        // Scalar
        const literal = this._objectReader.allowLiteral();
        if (literal) {
            let scalar = this.parseScalar(literal, definition);
            scalar = this.validate(scalar, definition);
            return scalar;
        }
        // Sequence
        const sequence = this._objectReader.allowSequenceStart();
        if (sequence) {
            const sequenceDefinition = definition.getDefinitionsOfType(_schema_definition_type__WEBPACK_IMPORTED_MODULE_1__.DefinitionType.Sequence)[0];
            // Legal
            if (sequenceDefinition) {
                const itemDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, sequenceDefinition.itemType);
                // Add each item
                while (!this._objectReader.allowSequenceEnd()) {
                    const item = this.readValue(itemDefinition);
                    sequence.add(item);
                }
            }
            // Illegal
            else {
                // Error
                this._context.error(sequence, "A sequence was not expected");
                // Skip each item
                while (!this._objectReader.allowSequenceEnd()) {
                    this.skipValue();
                }
            }
            sequence.definitionInfo = definition;
            return sequence;
        }
        // Mapping
        const mapping = this._objectReader.allowMappingStart();
        if (mapping) {
            const mappingDefinitions = definition.getDefinitionsOfType(_schema_definition_type__WEBPACK_IMPORTED_MODULE_1__.DefinitionType.Mapping);
            // Legal
            if (mappingDefinitions.length > 0) {
                if (mappingDefinitions.length > 1 ||
                    Object.keys(mappingDefinitions[0].properties).length > 0 ||
                    !mappingDefinitions[0].looseKeyType) {
                    this.handleMappingWithWellKnownProperties(definition, mappingDefinitions, mapping);
                }
                else {
                    const keyDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, mappingDefinitions[0].looseKeyType);
                    const valueDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, mappingDefinitions[0].looseValueType);
                    this.handleMappingWithAllLooseProperties(definition, keyDefinition, valueDefinition, mappingDefinitions[0], mapping);
                }
            }
            // Illegal
            else {
                this._context.error(mapping, "A mapping was not expected");
                while (!this._objectReader.allowMappingEnd()) {
                    this.skipValue();
                    this.skipValue();
                }
            }
            // handleMappingWithWellKnownProperties will only set a definition
            // if it can identify a single matching definition
            if (!mapping.definitionInfo) {
                mapping.definitionInfo = definition;
            }
            return mapping;
        }
        throw new Error("Expected a scalar value, a sequence, or a mapping");
    }
    handleMappingWithWellKnownProperties(definition, mappingDefinitions, mapping) {
        // Check if loose properties are allowed
        let looseKeyType;
        let looseValueType;
        let looseKeyDefinition;
        let looseValueDefinition;
        if (mappingDefinitions[0].looseKeyType) {
            looseKeyType = mappingDefinitions[0].looseKeyType;
            looseValueType = mappingDefinitions[0].looseValueType;
        }
        const upperKeys = {};
        let hasExpressionKey = false;
        let rawLiteral;
        while ((rawLiteral = this._objectReader.allowLiteral())) {
            const nextKeyScalar = this.parseScalar(rawLiteral, definition);
            // Expression
            if (nextKeyScalar.isExpression) {
                hasExpressionKey = true;
                // Legal
                if (definition.allowedContext.length > 0) {
                    const anyDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, _template_constants__WEBPACK_IMPORTED_MODULE_3__.ANY);
                    mapping.add(nextKeyScalar, this.readValue(anyDefinition));
                }
                // Illegal
                else {
                    this._context.error(nextKeyScalar, "A template expression is not allowed in this context");
                    this.skipValue();
                }
                continue;
            }
            // Convert to StringToken if required
            const nextKey = nextKeyScalar.templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.String
                ? nextKeyScalar
                : new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(nextKeyScalar.file, nextKeyScalar.range, nextKeyScalar.toString(), nextKeyScalar.definitionInfo);
            // Duplicate
            if (nextKey.value) {
                const upperKey = nextKey.value.toUpperCase();
                if (upperKeys[upperKey]) {
                    this._context.error(nextKey, `'${nextKey.value}' is already defined`);
                    this.skipValue();
                    continue;
                }
                upperKeys[upperKey] = true;
            }
            // Well known
            const nextPropertyDef = this._schema.matchPropertyAndFilter(mappingDefinitions, nextKey.value);
            if (nextPropertyDef) {
                const nextDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, nextPropertyDef.type);
                // Store the definition on the key, the value may have its own definition
                nextKey.definitionInfo = nextDefinition;
                // If the property has a description, it's a parameter that uses a shared type
                // and we need to make sure its description is set if there is one
                if (nextPropertyDef.description) {
                    nextKey.description = nextPropertyDef.description;
                }
                const nextValue = this.readValue(nextDefinition);
                mapping.add(nextKey, nextValue);
                continue;
            }
            // Loose
            if (looseKeyType) {
                if (!looseKeyDefinition) {
                    looseKeyDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, looseKeyType);
                    looseValueDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, looseValueType);
                }
                this.validate(nextKey, looseKeyDefinition);
                // Store the definition on the key, the value may have its own definition
                const nextDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, mappingDefinitions[0].looseValueType);
                nextKey.definitionInfo = nextDefinition;
                const nextValue = this.readValue(looseValueDefinition);
                mapping.add(nextKey, nextValue);
                continue;
            }
            // Error
            this._context.error(nextKey, `Unexpected value '${nextKey.value}'`);
            this.skipValue();
        }
        // If we matched a single definition from multiple,
        // update the token's definition to enable more specific editor
        // completion and validation
        if (mappingDefinitions.length === 1) {
            mapping.definitionInfo = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, mappingDefinitions[0]);
        }
        // Unable to filter to one definition
        if (mappingDefinitions.length > 1) {
            const hitCount = {};
            for (const mappingDefinition of mappingDefinitions) {
                for (const key of Object.keys(mappingDefinition.properties)) {
                    hitCount[key] = (hitCount[key] ?? 0) + 1;
                }
            }
            const nonDuplicates = [];
            for (const key of Object.keys(hitCount)) {
                if (hitCount[key] === 1) {
                    nonDuplicates.push(key);
                }
            }
            this._context.error(mapping, `There's not enough info to determine what you meant. Add one of these properties: ${nonDuplicates
                .sort()
                .join(", ")}`);
        }
        // Check required properties
        else if (mappingDefinitions.length === 1 && !hasExpressionKey) {
            for (const propertyName of Object.keys(mappingDefinitions[0].properties)) {
                const propertyDef = mappingDefinitions[0].properties[propertyName];
                if (propertyDef.required && !upperKeys[propertyName.toUpperCase()]) {
                    this._context.error(mapping, `Required property is missing: ${propertyName}`);
                }
            }
        }
        this.expectMappingEnd();
    }
    handleMappingWithAllLooseProperties(definition, keyDefinition, valueDefinition, mappingDefinition, mapping) {
        let nextValue;
        const upperKeys = {};
        let rawLiteral;
        while ((rawLiteral = this._objectReader.allowLiteral())) {
            const nextKeyScalar = this.parseScalar(rawLiteral, definition);
            nextKeyScalar.definitionInfo = keyDefinition;
            // Expression
            if (nextKeyScalar.isExpression) {
                // Legal
                if (definition.allowedContext.length > 0) {
                    nextValue = this.readValue(valueDefinition);
                    mapping.add(nextKeyScalar, nextValue);
                }
                // Illegal
                else {
                    this._context.error(nextKeyScalar, "A template expression is not allowed in this context");
                    this.skipValue();
                }
                continue;
            }
            // Convert to StringToken if required
            const nextKey = nextKeyScalar.templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.String
                ? nextKeyScalar
                : new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(nextKeyScalar.file, nextKeyScalar.range, nextKeyScalar.toString(), nextKeyScalar.definitionInfo);
            // Duplicate
            if (nextKey.value) {
                const upperKey = nextKey.value.toUpperCase();
                if (upperKeys[upperKey]) {
                    this._context.error(nextKey, `'${nextKey.value}' is already defined`);
                    this.skipValue();
                    continue;
                }
                upperKeys[upperKey] = true;
            }
            // Validate
            this.validate(nextKey, keyDefinition);
            // Store the definition on the key, the value may have its own definition
            const nextDefinition = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, mappingDefinition.looseValueType);
            nextKey.definitionInfo = nextDefinition;
            // Add the pair
            nextValue = this.readValue(valueDefinition);
            mapping.add(nextKey, nextValue);
        }
        this.expectMappingEnd();
    }
    expectMappingEnd() {
        if (!this._objectReader.allowMappingEnd()) {
            throw new Error("Expected mapping end"); // Should never happen
        }
    }
    skipValue() {
        // Scalar
        if (this._objectReader.allowLiteral()) {
            // Intentionally empty
        }
        // Sequence
        else if (this._objectReader.allowSequenceStart()) {
            while (!this._objectReader.allowSequenceEnd()) {
                this.skipValue();
            }
        }
        // Mapping
        else if (this._objectReader.allowMappingStart()) {
            while (!this._objectReader.allowMappingEnd()) {
                this.skipValue();
                this.skipValue();
            }
        }
        // Unexpected
        else {
            throw new Error("Expected a scalar value, a sequence, or a mapping");
        }
    }
    validate(scalar, definition) {
        switch (scalar.templateTokenType) {
            case _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.Null:
            case _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.Boolean:
            case _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.Number:
            case _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.String: {
                const literal = scalar;
                // Legal
                const scalarDefinitions = definition.getScalarDefinitions();
                let relevantDefinition;
                if ((relevantDefinition = scalarDefinitions.find(x => x.isMatch(literal)))) {
                    scalar.definitionInfo = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, relevantDefinition);
                    return scalar;
                }
                // Not a string, convert
                if (literal.templateTokenType !== _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.String) {
                    const stringLiteral = new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(literal.file, literal.range, literal.toString(), literal.definitionInfo);
                    // Legal
                    if ((relevantDefinition = scalarDefinitions.find(x => x.isMatch(stringLiteral)))) {
                        stringLiteral.definitionInfo = new _schema_definition_info__WEBPACK_IMPORTED_MODULE_0__.DefinitionInfo(definition, relevantDefinition);
                        return stringLiteral;
                    }
                }
                // Illegal
                this._context.error(literal, `Unexpected value '${literal.toString()}'`);
                return scalar;
            }
            case _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.BasicExpression:
                // Illegal
                if (definition.allowedContext.length === 0) {
                    this._context.error(scalar, "A template expression is not allowed in this context");
                }
                return scalar;
            default:
                this._context.error(scalar, `Unexpected value '${scalar.toString()}'`);
                return scalar;
        }
    }
    parseScalar(token, definitionInfo) {
        // Not a string
        if (!(0,_tokens_type_guards__WEBPACK_IMPORTED_MODULE_5__.isString)(token) || !token.value) {
            return token;
        }
        const allowedContext = definitionInfo.allowedContext;
        const raw = token.source || token.value;
        let startExpression = raw.indexOf(_template_constants__WEBPACK_IMPORTED_MODULE_3__.OPEN_EXPRESSION);
        if (startExpression < 0) {
            // Doesn't contain "${{"
            // Check if value should still be evaluated as an expression
            if (definitionInfo.definition instanceof _schema_string_definition__WEBPACK_IMPORTED_MODULE_2__.StringDefinition && definitionInfo.definition.isExpression) {
                const expression = this.parseIntoExpressionToken(token.range, raw, allowedContext, token, definitionInfo);
                if (expression) {
                    return expression;
                }
            }
            return token;
        }
        // Break the value into segments of LiteralToken and ExpressionToken
        let encounteredError = false;
        const segments = [];
        let i = 0;
        while (i < raw.length) {
            // An expression starts here
            if (i === startExpression) {
                // Find the end of the expression - i.e. "}}"
                startExpression = i;
                let endExpression = -1;
                let inString = false;
                for (i += _template_constants__WEBPACK_IMPORTED_MODULE_3__.OPEN_EXPRESSION.length; i < raw.length; i++) {
                    if (raw[i] === "'") {
                        inString = !inString; // Note, this handles escaped single quotes gracefully. E.x. 'foo''bar'
                    }
                    else if (!inString && raw[i] === "}" && raw[i - 1] === "}") {
                        endExpression = i;
                        i++;
                        break;
                    }
                }
                // Check if not closed
                if (endExpression < startExpression) {
                    this._context.error(token, "The expression is not closed. An unescaped ${{ sequence was found, but the closing }} sequence was not found.");
                    return token;
                }
                // Parse the expression
                const rawExpression = raw.substr(startExpression + _template_constants__WEBPACK_IMPORTED_MODULE_3__.OPEN_EXPRESSION.length, endExpression - startExpression + 1 - _template_constants__WEBPACK_IMPORTED_MODULE_3__.OPEN_EXPRESSION.length - _template_constants__WEBPACK_IMPORTED_MODULE_3__.CLOSE_EXPRESSION.length);
                let tr = token.range;
                if (tr.start.line === tr.end.line) {
                    // If it's a single line expression, adjust the range to only cover the sub-expression
                    tr = {
                        start: { line: tr.start.line, column: tr.start.column + startExpression },
                        end: { line: tr.end.line, column: tr.start.column + endExpression + 1 }
                    };
                }
                else {
                    // Adjust the range to only cover the expression for multi-line strings
                    const startRaw = raw.substring(0, startExpression);
                    const adjustedStartLine = startRaw.split("\n").length;
                    const beginningOfLine = startRaw.lastIndexOf("\n");
                    const adjustedStart = startExpression - beginningOfLine;
                    const adjustedEnd = endExpression - beginningOfLine + 1;
                    tr = {
                        start: { line: tr.start.line + adjustedStartLine, column: adjustedStart },
                        end: { line: tr.start.line + adjustedStartLine, column: adjustedEnd }
                    };
                }
                const expression = this.parseIntoExpressionToken(tr, rawExpression, allowedContext, token, definitionInfo);
                if (!expression) {
                    // Record that we've hit an error but continue to validate any other expressions
                    // that might be in the string
                    encounteredError = true;
                }
                else {
                    // Check if a directive was used when not allowed
                    if (expression.directive && (startExpression !== 0 || i < raw.length)) {
                        this._context.error(token, `The directive '${expression.directive}' is not allowed in this context. Directives are not supported for expressions that are embedded within a string. Directives are only supported when the entire value is an expression.`);
                        return token;
                    }
                    // Add the segment
                    segments.push(expression);
                }
                // Look for the next expression
                startExpression = raw.indexOf(_template_constants__WEBPACK_IMPORTED_MODULE_3__.OPEN_EXPRESSION, i);
            }
            // The next expression is further ahead
            else if (i < startExpression) {
                // Append the segment
                this.addString(segments, token.range, raw.substr(i, startExpression - i), token.definitionInfo);
                // Adjust the position
                i = startExpression;
            }
            // No remaining expressions
            else {
                this.addString(segments, token.range, raw.substr(i), token.definitionInfo);
                break;
            }
        }
        // If we've hit any error during parsing, return the original token
        if (encounteredError) {
            return token;
        }
        // Check if can convert to a literal
        // For example, the escaped expression: ${{ '{{ this is a literal }}' }}
        if (segments.length === 1 && segments[0].templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.BasicExpression) {
            const basicExpression = segments[0];
            const str = this.getExpressionString(basicExpression.expression);
            if (str !== undefined) {
                return new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(this._fileId, token.range, str, token.definitionInfo);
            }
        }
        // Check if only one segment
        if (segments.length === 1) {
            return segments[0];
        }
        // Build the new expression, using the format function
        const format = [];
        const args = [];
        const expressionTokens = [];
        let argIndex = 0;
        for (const segment of segments) {
            if ((0,_tokens_type_guards__WEBPACK_IMPORTED_MODULE_5__.isString)(segment)) {
                const text = segment.value
                    .replace(/'/g, "''") // Escape quotes
                    .replace(/\{/g, "{{") // Escape braces
                    .replace(/\}/g, "}}");
                format.push(text);
            }
            else {
                format.push(`{${argIndex}}`); // Append format arg
                argIndex++;
                const expression = segment;
                args.push(", ");
                args.push(expression.expression);
                expressionTokens.push(expression);
            }
        }
        return new _tokens__WEBPACK_IMPORTED_MODULE_4__.BasicExpressionToken(this._fileId, token.range, `format('${format.join("")}'${args.join("")})`, definitionInfo, expressionTokens, raw);
    }
    parseIntoExpressionToken(tr, rawExpression, allowedContext, token, definitionInfo) {
        const parseExpressionResult = this.parseExpression(tr, token, rawExpression, allowedContext, definitionInfo);
        // Check for error
        if (parseExpressionResult.error) {
            this._context.error(token, parseExpressionResult.error, tr);
            return undefined;
        }
        return parseExpressionResult.expression;
    }
    parseExpression(range, token, value, allowedContext, definitionInfo) {
        const trimmed = value.trim();
        // Check if the value is empty
        if (!trimmed) {
            return {
                error: new Error("An expression was expected")
            };
        }
        // Try to find a matching directive
        const matchDirectiveResult = this.matchDirective(trimmed, _template_constants__WEBPACK_IMPORTED_MODULE_3__.INSERT_DIRECTIVE, 0);
        if (matchDirectiveResult.isMatch) {
            return {
                expression: new _tokens__WEBPACK_IMPORTED_MODULE_4__.InsertExpressionToken(this._fileId, range, definitionInfo)
            };
        }
        else if (matchDirectiveResult.error) {
            return {
                error: matchDirectiveResult.error
            };
        }
        // Check if valid expression
        try {
            _tokens__WEBPACK_IMPORTED_MODULE_4__.ExpressionToken.validateExpression(trimmed, allowedContext);
        }
        catch (err) {
            return {
                error: err
            };
        }
        const startTrim = value.length - value.trimStart().length;
        const endTrim = value.length - value.trimEnd().length;
        const expressionRange = {
            start: {
                ...range.start,
                column: range.start.column + _template_constants__WEBPACK_IMPORTED_MODULE_3__.OPEN_EXPRESSION.length + startTrim
            },
            end: {
                ...range.end,
                column: range.end.column - _template_constants__WEBPACK_IMPORTED_MODULE_3__.CLOSE_EXPRESSION.length - endTrim
            }
        };
        // Return the expression
        return {
            expression: new _tokens__WEBPACK_IMPORTED_MODULE_4__.BasicExpressionToken(this._fileId, range, trimmed, definitionInfo, undefined, token.source, expressionRange),
            error: undefined
        };
    }
    addString(segments, range, value, definition) {
        // If the last segment was a LiteralToken, then append to the last segment
        if (segments.length > 0 && segments[segments.length - 1].templateTokenType === _tokens_types__WEBPACK_IMPORTED_MODULE_6__.TokenType.String) {
            const lastSegment = segments[segments.length - 1];
            segments[segments.length - 1] = new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(this._fileId, range, `${lastSegment.value}${value}`, definition);
        }
        // Otherwise add a new LiteralToken
        else {
            segments.push(new _tokens__WEBPACK_IMPORTED_MODULE_4__.StringToken(this._fileId, range, value, definition));
        }
    }
    matchDirective(trimmed, directive, expectedParameters) {
        const parameters = [];
        if (trimmed.startsWith(directive) &&
            (trimmed.length === directive.length || WHITESPACE_PATTERN.test(trimmed[directive.length]))) {
            let startIndex = directive.length;
            let inString = false;
            let parens = 0;
            for (let i = startIndex; i < trimmed.length; i++) {
                const c = trimmed[i];
                if (WHITESPACE_PATTERN.test(c) && !inString && parens == 0) {
                    if (startIndex < 1) {
                        parameters.push(trimmed.substr(startIndex, i - startIndex));
                    }
                    startIndex = i + 1;
                }
                else if (c === "'") {
                    inString = !inString;
                }
                else if (c === "(" && !inString) {
                    parens++;
                }
                else if (c === ")" && !inString) {
                    parens--;
                }
            }
            if (startIndex < trimmed.length) {
                parameters.push(trimmed.substr(startIndex));
            }
            if (expectedParameters != parameters.length) {
                return {
                    isMatch: false,
                    parameters: [],
                    error: new Error(`Exactly ${expectedParameters} parameter(s) were expected following the directive '${directive}'. Actual parameter count: ${parameters.length}`)
                };
            }
            return {
                isMatch: true,
                parameters: parameters
            };
        }
        return {
            isMatch: false,
            parameters: parameters
        };
    }
    getExpressionString(trimmed) {
        const result = [];
        let inString = false;
        for (let i = 0; i < trimmed.length; i++) {
            const c = trimmed[i];
            if (c === "'") {
                inString = !inString;
                if (inString && i !== 0) {
                    result.push(c);
                }
            }
            else if (!inString) {
                return undefined;
            }
            else {
                result.push(c);
            }
        }
        return result.join("");
    }
}
//# sourceMappingURL=template-reader.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/template-validation-error.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/template-validation-error.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateValidationError: () => (/* binding */ TemplateValidationError)
/* harmony export */ });
/**
 * Provides information about an error which occurred during validation
 */
class TemplateValidationError {
    constructor(rawMessage, prefix, code, range) {
        this.rawMessage = rawMessage;
        this.prefix = prefix;
        this.code = code;
        this.range = range;
    }
    get message() {
        if (this.prefix) {
            return `${this.prefix}: ${this.rawMessage}`;
        }
        return this.rawMessage;
    }
    toString() {
        return this.message;
    }
}
//# sourceMappingURL=template-validation-error.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/basic-expression-token.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/basic-expression-token.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BasicExpressionToken: () => (/* binding */ BasicExpressionToken)
/* harmony export */ });
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _expression_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./expression-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/expression-token.js");
/* harmony import */ var _scalar_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scalar-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/scalar-token.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");




class BasicExpressionToken extends _expression_token__WEBPACK_IMPORTED_MODULE_1__.ExpressionToken {
    /**
     * @param originalExpressions If the basic expression was transformed from individual expressions, these will be the original ones
     */
    constructor(file, range, expression, definitionInfo, originalExpressions, source, expressionRange) {
        super(_types__WEBPACK_IMPORTED_MODULE_3__.TokenType.BasicExpression, file, range, undefined, definitionInfo);
        this.expr = expression;
        this.source = source;
        this.originalExpressions = originalExpressions;
        this.expressionRange = expressionRange;
    }
    get expression() {
        return this.expr;
    }
    clone(omitSource) {
        return omitSource
            ? new BasicExpressionToken(undefined, undefined, this.expr, this.definitionInfo, this.originalExpressions, this.source, this.expressionRange)
            : new BasicExpressionToken(this.file, this.range, this.expr, this.definitionInfo, this.originalExpressions, this.source, this.expressionRange);
    }
    toString() {
        return `${_template_constants__WEBPACK_IMPORTED_MODULE_0__.OPEN_EXPRESSION} ${this.expr} ${_template_constants__WEBPACK_IMPORTED_MODULE_0__.CLOSE_EXPRESSION}`;
    }
    toDisplayString() {
        // TODO: Implement expression display string to match `BasicExpressionToken#ToDisplayString()` in the C# parser
        return _scalar_token__WEBPACK_IMPORTED_MODULE_2__.ScalarToken.trimDisplayString(this.toString());
    }
    toJSON() {
        return {
            type: _types__WEBPACK_IMPORTED_MODULE_3__.TokenType.BasicExpression,
            expr: this.expr
        };
    }
}
//# sourceMappingURL=basic-expression-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/boolean-token.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/boolean-token.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BooleanToken: () => (/* binding */ BooleanToken)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");


class BooleanToken extends ___WEBPACK_IMPORTED_MODULE_0__.LiteralToken {
    constructor(file, range, value, definitionInfo) {
        super(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Boolean, file, range, definitionInfo);
        this.bool = value;
    }
    get value() {
        return this.bool;
    }
    clone(omitSource) {
        return omitSource
            ? new BooleanToken(undefined, undefined, this.bool, this.definitionInfo)
            : new BooleanToken(this.file, this.range, this.bool, this.definitionInfo);
    }
    toString() {
        return this.bool ? "true" : "false";
    }
    toJSON() {
        return this.bool;
    }
}
//# sourceMappingURL=boolean-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/expression-token.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/expression-token.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExpressionToken: () => (/* binding */ ExpressionToken)
/* harmony export */ });
/* harmony import */ var _actions_expressions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @actions/expressions */ "./node_modules/@actions/expressions/dist/index.js");
/* harmony import */ var _allowed_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../allowed-context */ "./node_modules/@actions/workflow-parser/dist/templates/allowed-context.js");
/* harmony import */ var _scalar_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scalar-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/scalar-token.js");



class ExpressionToken extends _scalar_token__WEBPACK_IMPORTED_MODULE_2__.ScalarToken {
    constructor(type, file, range, directive, definitionInfo) {
        super(type, file, range, definitionInfo);
        this.directive = directive;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return true;
    }
    static validateExpression(expression, allowedContext) {
        const { namedContexts, functions } = (0,_allowed_context__WEBPACK_IMPORTED_MODULE_1__.splitAllowedContext)(allowedContext);
        // Parse
        const lexer = new _actions_expressions__WEBPACK_IMPORTED_MODULE_0__.Lexer(expression);
        const result = lexer.lex();
        const p = new _actions_expressions__WEBPACK_IMPORTED_MODULE_0__.Parser(result.tokens, namedContexts, functions);
        p.parse();
    }
}
//# sourceMappingURL=expression-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BasicExpressionToken: () => (/* reexport safe */ _basic_expression_token__WEBPACK_IMPORTED_MODULE_11__.BasicExpressionToken),
/* harmony export */   BooleanToken: () => (/* reexport safe */ _boolean_token__WEBPACK_IMPORTED_MODULE_5__.BooleanToken),
/* harmony export */   ExpressionToken: () => (/* reexport safe */ _expression_token__WEBPACK_IMPORTED_MODULE_10__.ExpressionToken),
/* harmony export */   InsertExpressionToken: () => (/* reexport safe */ _insert_expression_token__WEBPACK_IMPORTED_MODULE_12__.InsertExpressionToken),
/* harmony export */   KeyValuePair: () => (/* reexport safe */ _key_value_pair__WEBPACK_IMPORTED_MODULE_7__.KeyValuePair),
/* harmony export */   LiteralToken: () => (/* reexport safe */ _literal_token__WEBPACK_IMPORTED_MODULE_2__.LiteralToken),
/* harmony export */   MappingToken: () => (/* reexport safe */ _mapping_token__WEBPACK_IMPORTED_MODULE_9__.MappingToken),
/* harmony export */   NullToken: () => (/* reexport safe */ _null_token__WEBPACK_IMPORTED_MODULE_6__.NullToken),
/* harmony export */   NumberToken: () => (/* reexport safe */ _number_token__WEBPACK_IMPORTED_MODULE_4__.NumberToken),
/* harmony export */   ScalarToken: () => (/* reexport safe */ _scalar_token__WEBPACK_IMPORTED_MODULE_1__.ScalarToken),
/* harmony export */   SequenceToken: () => (/* reexport safe */ _sequence_token__WEBPACK_IMPORTED_MODULE_8__.SequenceToken),
/* harmony export */   StringToken: () => (/* reexport safe */ _string_token__WEBPACK_IMPORTED_MODULE_3__.StringToken),
/* harmony export */   TemplateToken: () => (/* reexport safe */ _template_token__WEBPACK_IMPORTED_MODULE_0__.TemplateToken)
/* harmony export */ });
/* harmony import */ var _template_token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/template-token.js");
/* harmony import */ var _scalar_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scalar-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/scalar-token.js");
/* harmony import */ var _literal_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./literal-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/literal-token.js");
/* harmony import */ var _string_token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./string-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/string-token.js");
/* harmony import */ var _number_token__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./number-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/number-token.js");
/* harmony import */ var _boolean_token__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./boolean-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/boolean-token.js");
/* harmony import */ var _null_token__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./null-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/null-token.js");
/* harmony import */ var _key_value_pair__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./key-value-pair */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/key-value-pair.js");
/* harmony import */ var _sequence_token__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./sequence-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/sequence-token.js");
/* harmony import */ var _mapping_token__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mapping-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/mapping-token.js");
/* harmony import */ var _expression_token__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./expression-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/expression-token.js");
/* harmony import */ var _basic_expression_token__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./basic-expression-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/basic-expression-token.js");
/* harmony import */ var _insert_expression_token__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./insert-expression-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/insert-expression-token.js");













//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/insert-expression-token.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/insert-expression-token.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InsertExpressionToken: () => (/* binding */ InsertExpressionToken)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _template_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../template-constants */ "./node_modules/@actions/workflow-parser/dist/templates/template-constants.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");



class InsertExpressionToken extends ___WEBPACK_IMPORTED_MODULE_0__.ExpressionToken {
    constructor(file, range, definitionInfo) {
        super(_types__WEBPACK_IMPORTED_MODULE_2__.TokenType.InsertExpression, file, range, _template_constants__WEBPACK_IMPORTED_MODULE_1__.INSERT_DIRECTIVE, definitionInfo);
    }
    clone(omitSource) {
        return omitSource
            ? new InsertExpressionToken(undefined, undefined, this.definitionInfo)
            : new InsertExpressionToken(this.file, this.range, this.definitionInfo);
    }
    toString() {
        return `${_template_constants__WEBPACK_IMPORTED_MODULE_1__.OPEN_EXPRESSION} ${_template_constants__WEBPACK_IMPORTED_MODULE_1__.INSERT_DIRECTIVE} ${_template_constants__WEBPACK_IMPORTED_MODULE_1__.CLOSE_EXPRESSION}`;
    }
    toDisplayString() {
        return ___WEBPACK_IMPORTED_MODULE_0__.ScalarToken.trimDisplayString(this.toString());
    }
    toJSON() {
        return {
            type: _types__WEBPACK_IMPORTED_MODULE_2__.TokenType.InsertExpression,
            expr: "insert"
        };
    }
}
//# sourceMappingURL=insert-expression-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/key-value-pair.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/key-value-pair.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KeyValuePair: () => (/* binding */ KeyValuePair)
/* harmony export */ });
class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
//# sourceMappingURL=key-value-pair.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/literal-token.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/literal-token.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LiteralToken: () => (/* binding */ LiteralToken)
/* harmony export */ });
/* harmony import */ var _scalar_token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scalar-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/scalar-token.js");

class LiteralToken extends _scalar_token__WEBPACK_IMPORTED_MODULE_0__.ScalarToken {
    constructor(type, file, range, definitionInfo) {
        super(type, file, range, definitionInfo);
    }
    get isLiteral() {
        return true;
    }
    get isExpression() {
        return false;
    }
    toDisplayString() {
        return _scalar_token__WEBPACK_IMPORTED_MODULE_0__.ScalarToken.trimDisplayString(this.toString());
    }
    /**
     * Throws a good debug message when an unexpected literal value is encountered
     */
    assertUnexpectedValue(objectDescription) {
        throw new Error(`Error while reading '${objectDescription}'. Unexpected value '${this.toString()}'`);
    }
}
//# sourceMappingURL=literal-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/mapping-token.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/mapping-token.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MappingToken: () => (/* binding */ MappingToken)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");


class MappingToken extends ___WEBPACK_IMPORTED_MODULE_0__.TemplateToken {
    constructor(file, range, definitionInfo) {
        super(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Mapping, file, range, definitionInfo);
        this.map = [];
    }
    get count() {
        return this.map.length;
    }
    get isScalar() {
        return false;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return false;
    }
    add(key, value) {
        this.map.push(new ___WEBPACK_IMPORTED_MODULE_0__.KeyValuePair(key, value));
    }
    get(index) {
        return this.map[index];
    }
    find(key) {
        const pair = this.map.find(pair => pair.key.toString() === key);
        return pair?.value;
    }
    remove(index) {
        this.map.splice(index, 1);
    }
    clone(omitSource) {
        const result = omitSource
            ? new MappingToken(undefined, undefined, this.definitionInfo)
            : new MappingToken(this.file, this.range, this.definitionInfo);
        for (const item of this.map) {
            result.add(item.key.clone(omitSource), item.value.clone(omitSource));
        }
        return result;
    }
    toJSON() {
        const items = [];
        for (const item of this.map) {
            items.push({ Key: item.key, Value: item.value });
        }
        return {
            type: _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Mapping,
            map: items
        };
    }
    *[Symbol.iterator]() {
        for (const item of this.map) {
            yield item;
        }
    }
}
//# sourceMappingURL=mapping-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/null-token.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/null-token.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NullToken: () => (/* binding */ NullToken)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");


class NullToken extends ___WEBPACK_IMPORTED_MODULE_0__.LiteralToken {
    constructor(file, range, definitionInfo) {
        super(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Null, file, range, definitionInfo);
    }
    clone(omitSource) {
        return omitSource
            ? new NullToken(undefined, undefined, this.definitionInfo)
            : new NullToken(this.file, this.range, this.definitionInfo);
    }
    toString() {
        return "";
    }
    toJSON() {
        return null;
    }
}
//# sourceMappingURL=null-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/number-token.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/number-token.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NumberToken: () => (/* binding */ NumberToken)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");


class NumberToken extends ___WEBPACK_IMPORTED_MODULE_0__.LiteralToken {
    constructor(file, range, value, definitionInfo) {
        super(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Number, file, range, definitionInfo);
        this.num = value;
    }
    get value() {
        return this.num;
    }
    clone(omitSource) {
        return omitSource
            ? new NumberToken(undefined, undefined, this.num, this.definitionInfo)
            : new NumberToken(this.file, this.range, this.num, this.definitionInfo);
    }
    toString() {
        return `${this.num}`;
    }
    toJSON() {
        return this.num;
    }
}
//# sourceMappingURL=number-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/scalar-token.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/scalar-token.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScalarToken: () => (/* binding */ ScalarToken)
/* harmony export */ });
/* harmony import */ var _template_token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/template-token.js");

/**
 * Base class for everything that is not a mapping or sequence
 */
class ScalarToken extends _template_token__WEBPACK_IMPORTED_MODULE_0__.TemplateToken {
    constructor(type, file, range, definitionInfo) {
        super(type, file, range, definitionInfo);
    }
    get isScalar() {
        return true;
    }
    static trimDisplayString(displayString) {
        let firstLine = displayString.trimStart();
        const firstNewLine = firstLine.indexOf("\n");
        const firstCarriageReturn = firstLine.indexOf("\r");
        if (firstNewLine >= 0 || firstCarriageReturn >= 0) {
            firstLine = firstLine.substr(0, Math.min(firstNewLine >= 0 ? firstNewLine : Number.MAX_VALUE, firstCarriageReturn >= 0 ? firstCarriageReturn : Number.MAX_VALUE));
        }
        return firstLine;
    }
}
//# sourceMappingURL=scalar-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/sequence-token.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/sequence-token.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SequenceToken: () => (/* binding */ SequenceToken)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");


class SequenceToken extends ___WEBPACK_IMPORTED_MODULE_0__.TemplateToken {
    constructor(file, range, definitionInfo) {
        super(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Sequence, file, range, definitionInfo);
        this.seq = [];
    }
    get count() {
        return this.seq.length;
    }
    get isScalar() {
        return false;
    }
    get isLiteral() {
        return false;
    }
    get isExpression() {
        return false;
    }
    add(value) {
        this.seq.push(value);
    }
    get(index) {
        return this.seq[index];
    }
    clone(omitSource) {
        const result = omitSource
            ? new SequenceToken(undefined, undefined, this.definitionInfo)
            : new SequenceToken(this.file, this.range, this.definitionInfo);
        for (const item of this.seq) {
            result.add(item.clone(omitSource));
        }
        return result;
    }
    toJSON() {
        return {
            type: _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Sequence,
            seq: this.seq
        };
    }
    *[Symbol.iterator]() {
        for (const item of this.seq) {
            yield item;
        }
    }
}
//# sourceMappingURL=sequence-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/string-token.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/string-token.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StringToken: () => (/* binding */ StringToken)
/* harmony export */ });
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! . */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");


class StringToken extends ___WEBPACK_IMPORTED_MODULE_0__.LiteralToken {
    constructor(file, range, value, definitionInfo, source) {
        super(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.String, file, range, definitionInfo);
        this.value = value;
        this.source = source;
    }
    clone(omitSource) {
        return omitSource
            ? new StringToken(undefined, undefined, this.value, this.definitionInfo, this.source)
            : new StringToken(this.file, this.range, this.value, this.definitionInfo, this.source);
    }
    toString() {
        return this.value;
    }
    toJSON() {
        return this.value;
    }
}
//# sourceMappingURL=string-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/template-token.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/template-token.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateToken: () => (/* binding */ TemplateToken),
/* harmony export */   TemplateTokenError: () => (/* binding */ TemplateTokenError)
/* harmony export */ });
/* harmony import */ var _traversal_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./traversal-state */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/traversal-state.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");


class TemplateTokenError extends Error {
    constructor(message, token) {
        super(message);
        this.token = token;
    }
}
class TemplateToken {
    /**
     * Base class for all template tokens
     */
    constructor(type, file, range, definitionInfo) {
        this.type = type;
        this.file = file;
        this.range = range;
        this.definitionInfo = definitionInfo;
    }
    get templateTokenType() {
        return this.type;
    }
    get line() {
        return this.range?.start.line;
    }
    get col() {
        return this.range?.start.column;
    }
    get definition() {
        return this.definitionInfo?.definition;
    }
    get description() {
        return this._description || this.propertyDefinition?.description || this.definition?.description;
    }
    set description(description) {
        this._description = description;
    }
    typeName() {
        return (0,_types__WEBPACK_IMPORTED_MODULE_1__.tokenTypeName)(this.type);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNull(objectDescription) {
        if (this.type === _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Null) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${(0,_types__WEBPACK_IMPORTED_MODULE_1__.tokenTypeName)(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Null)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertBoolean(objectDescription) {
        if (this.type === _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Boolean) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${(0,_types__WEBPACK_IMPORTED_MODULE_1__.tokenTypeName)(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Boolean)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertNumber(objectDescription) {
        if (this.type === _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Number) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${(0,_types__WEBPACK_IMPORTED_MODULE_1__.tokenTypeName)(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Number)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertString(objectDescription) {
        if (this.type === _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.String) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${(0,_types__WEBPACK_IMPORTED_MODULE_1__.tokenTypeName)(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.String)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertScalar(objectDescription) {
        if (this?.isScalar === true) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type 'ScalarToken' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertSequence(objectDescription) {
        if (this.type === _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Sequence) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${(0,_types__WEBPACK_IMPORTED_MODULE_1__.tokenTypeName)(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Sequence)}' was expected.`, this);
    }
    /**
     * Asserts expected type and throws a good debug message if unexpected
     */
    assertMapping(objectDescription) {
        if (this.type === _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Mapping) {
            return this;
        }
        throw new TemplateTokenError(`Unexpected type '${this.typeName()}' encountered while reading '${objectDescription}'. The type '${(0,_types__WEBPACK_IMPORTED_MODULE_1__.tokenTypeName)(_types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Mapping)}' was expected.`, this);
    }
    /**
     * Returns all tokens (depth first)
     * @param value The object to travese
     * @param omitKeys Whether to omit mapping keys
     */
    static *traverse(value, omitKeys) {
        yield [undefined, value, undefined];
        switch (value.templateTokenType) {
            case _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Sequence:
            case _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Mapping: {
                let state = new _traversal_state__WEBPACK_IMPORTED_MODULE_0__.TraversalState(undefined, value);
                state = new _traversal_state__WEBPACK_IMPORTED_MODULE_0__.TraversalState(state, value);
                while (state.parent) {
                    if (state.moveNext(omitKeys ?? false)) {
                        value = state.current;
                        yield [state.parent?.current, value, state.currentKey];
                        switch (value.type) {
                            case _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Sequence:
                            case _types__WEBPACK_IMPORTED_MODULE_1__.TokenType.Mapping:
                                state = new _traversal_state__WEBPACK_IMPORTED_MODULE_0__.TraversalState(state, value);
                                break;
                        }
                    }
                    else {
                        state = state.parent;
                    }
                }
                break;
            }
        }
    }
    toJSON() {
        return undefined;
    }
}
//# sourceMappingURL=template-token.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/traversal-state.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/traversal-state.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TraversalState: () => (/* binding */ TraversalState)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");

class TraversalState {
    constructor(parent, token) {
        this.index = -1;
        this.isKey = false;
        this.parent = parent;
        this._token = token;
        this.current = token;
    }
    moveNext(omitKeys) {
        switch (this._token.templateTokenType) {
            case _types__WEBPACK_IMPORTED_MODULE_0__.TokenType.Sequence: {
                const sequence = this._token;
                if (++this.index < sequence.count) {
                    this.current = sequence.get(this.index);
                    return true;
                }
                this.current = undefined;
                return false;
            }
            case _types__WEBPACK_IMPORTED_MODULE_0__.TokenType.Mapping: {
                const mapping = this._token;
                // Already returned the key, now return the value
                if (this.isKey) {
                    this.isKey = false;
                    this.currentKey = this.current;
                    this.current = mapping.get(this.index).value;
                    return true;
                }
                // Move next
                if (++this.index < mapping.count) {
                    // Skip the key, return the value
                    if (omitKeys) {
                        this.isKey = false;
                        this.currentKey = mapping.get(this.index).key;
                        this.current = mapping.get(this.index).value;
                        return true;
                    }
                    // Return the key
                    this.isKey = true;
                    this.currentKey = undefined;
                    this.current = mapping.get(this.index).key;
                    return true;
                }
                this.currentKey = undefined;
                this.current = undefined;
                return false;
            }
            default:
                throw new Error(`Unexpected token type '${this._token.templateTokenType}' when traversing state`);
        }
    }
}
//# sourceMappingURL=traversal-state.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/type-guards.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBasicExpression: () => (/* binding */ isBasicExpression),
/* harmony export */   isBoolean: () => (/* binding */ isBoolean),
/* harmony export */   isLiteral: () => (/* binding */ isLiteral),
/* harmony export */   isMapping: () => (/* binding */ isMapping),
/* harmony export */   isNumber: () => (/* binding */ isNumber),
/* harmony export */   isScalar: () => (/* binding */ isScalar),
/* harmony export */   isSequence: () => (/* binding */ isSequence),
/* harmony export */   isString: () => (/* binding */ isString)
/* harmony export */ });
/* harmony import */ var _mapping_token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mapping-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/mapping-token.js");
/* harmony import */ var _sequence_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sequence-token */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/sequence-token.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js");



function isLiteral(t) {
    return t.isLiteral;
}
function isScalar(t) {
    return t.isScalar;
}
function isString(t) {
    return isLiteral(t) && t.templateTokenType === _types__WEBPACK_IMPORTED_MODULE_2__.TokenType.String;
}
function isNumber(t) {
    return isLiteral(t) && t.templateTokenType === _types__WEBPACK_IMPORTED_MODULE_2__.TokenType.Number;
}
function isBoolean(t) {
    return isLiteral(t) && t.templateTokenType === _types__WEBPACK_IMPORTED_MODULE_2__.TokenType.Boolean;
}
function isBasicExpression(t) {
    return isScalar(t) && t.templateTokenType === _types__WEBPACK_IMPORTED_MODULE_2__.TokenType.BasicExpression;
}
function isSequence(t) {
    return t instanceof _sequence_token__WEBPACK_IMPORTED_MODULE_1__.SequenceToken;
}
function isMapping(t) {
    return t instanceof _mapping_token__WEBPACK_IMPORTED_MODULE_0__.MappingToken;
}
//# sourceMappingURL=type-guards.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/tokens/types.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TokenType: () => (/* binding */ TokenType),
/* harmony export */   tokenTypeName: () => (/* binding */ tokenTypeName)
/* harmony export */ });
var TokenType;
(function (TokenType) {
    TokenType[TokenType["String"] = 0] = "String";
    TokenType[TokenType["Sequence"] = 1] = "Sequence";
    TokenType[TokenType["Mapping"] = 2] = "Mapping";
    TokenType[TokenType["BasicExpression"] = 3] = "BasicExpression";
    TokenType[TokenType["InsertExpression"] = 4] = "InsertExpression";
    TokenType[TokenType["Boolean"] = 5] = "Boolean";
    TokenType[TokenType["Number"] = 6] = "Number";
    TokenType[TokenType["Null"] = 7] = "Null";
})(TokenType || (TokenType = {}));
function tokenTypeName(type) {
    switch (type) {
        case TokenType.String:
            return "StringToken";
        case TokenType.Sequence:
            return "SequenceToken";
        case TokenType.Mapping:
            return "MappingToken";
        case TokenType.BasicExpression:
            return "BasicExpressionToken";
        case TokenType.InsertExpression:
            return "InsertExpressionToken";
        case TokenType.Boolean:
            return "BooleanToken";
        case TokenType.Number:
            return "NumberToken";
        case TokenType.Null:
            return "NullToken";
        default: {
            // Use never to ensure exhaustiveness
            const exhaustiveCheck = type;
            throw new Error(`Unhandled token type: ${type} ${exhaustiveCheck}}`);
        }
    }
}
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/templates/trace-writer.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/templates/trace-writer.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NoOperationTraceWriter: () => (/* binding */ NoOperationTraceWriter)
/* harmony export */ });
class NoOperationTraceWriter {
    error() {
        // do nothing
    }
    info() {
        // do nothing
    }
    verbose() {
        // do nothing
    }
}
//# sourceMappingURL=trace-writer.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/workflows/file-reference.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/workflows/file-reference.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fileIdentifier: () => (/* binding */ fileIdentifier),
/* harmony export */   parseFileReference: () => (/* binding */ parseFileReference)
/* harmony export */ });
function parseFileReference(ref) {
    if (ref.startsWith("./")) {
        return {
            path: ref.substring(2)
        };
    }
    const [remotePath, version] = ref.split("@");
    const [owner, repository, ...pathSegments] = remotePath.split("/").filter(s => s.length > 0);
    if (!owner || !repository || !version) {
        throw new Error(`Invalid file reference: ${ref}`);
    }
    return {
        repository,
        owner,
        path: pathSegments.join("/"),
        version
    };
}
function fileIdentifier(ref) {
    if (!("repository" in ref)) {
        return "./" + ref.path;
    }
    return `${ref.owner}/${ref.repository}/${ref.path}@${ref.version}`;
}
//# sourceMappingURL=file-reference.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/workflows/workflow-constants.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/workflows/workflow-constants.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WORKFLOW_ROOT: () => (/* binding */ WORKFLOW_ROOT)
/* harmony export */ });
const WORKFLOW_ROOT = "workflow-root-strict";
//# sourceMappingURL=workflow-constants.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/workflows/workflow-parser.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/workflows/workflow-parser.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseWorkflow: () => (/* binding */ parseWorkflow)
/* harmony export */ });
/* harmony import */ var _templates_template_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../templates/template-context */ "./node_modules/@actions/workflow-parser/dist/templates/template-context.js");
/* harmony import */ var _templates_template_reader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templates/template-reader */ "./node_modules/@actions/workflow-parser/dist/templates/template-reader.js");
/* harmony import */ var _workflow_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./workflow-constants */ "./node_modules/@actions/workflow-parser/dist/workflows/workflow-constants.js");
/* harmony import */ var _workflow_schema__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./workflow-schema */ "./node_modules/@actions/workflow-parser/dist/workflows/workflow-schema.js");
/* harmony import */ var _yaml_object_reader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./yaml-object-reader */ "./node_modules/@actions/workflow-parser/dist/workflows/yaml-object-reader.js");





function parseWorkflow(entryFile, contextOrTrace) {
    const context = contextOrTrace instanceof _templates_template_context__WEBPACK_IMPORTED_MODULE_0__.TemplateContext
        ? contextOrTrace
        : new _templates_template_context__WEBPACK_IMPORTED_MODULE_0__.TemplateContext(new _templates_template_context__WEBPACK_IMPORTED_MODULE_0__.TemplateValidationErrors(), (0,_workflow_schema__WEBPACK_IMPORTED_MODULE_3__.getWorkflowSchema)(), contextOrTrace);
    const fileId = context.getFileId(entryFile.name);
    const reader = new _yaml_object_reader__WEBPACK_IMPORTED_MODULE_4__.YamlObjectReader(fileId, entryFile.content);
    if (reader.errors.length > 0) {
        // The file is not valid YAML, template errors could be misleading
        for (const err of reader.errors) {
            context.error(fileId, err.message, err.range);
        }
        return {
            context,
            value: undefined
        };
    }
    const result = _templates_template_reader__WEBPACK_IMPORTED_MODULE_1__.readTemplate(context, _workflow_constants__WEBPACK_IMPORTED_MODULE_2__.WORKFLOW_ROOT, reader, fileId);
    return {
        context,
        value: result
    };
}
//# sourceMappingURL=workflow-parser.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/workflows/workflow-schema.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/workflows/workflow-schema.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getWorkflowSchema: () => (/* binding */ getWorkflowSchema)
/* harmony export */ });
/* harmony import */ var _templates_json_object_reader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../templates/json-object-reader */ "./node_modules/@actions/workflow-parser/dist/templates/json-object-reader.js");
/* harmony import */ var _templates_schema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templates/schema */ "./node_modules/@actions/workflow-parser/dist/templates/schema/index.js");
/* harmony import */ var _workflow_v1_0_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../workflow-v1.0.json */ "./node_modules/@actions/workflow-parser/dist/workflow-v1.0.json");



let schema;
function getWorkflowSchema() {
    if (schema === undefined) {
        const json = JSON.stringify(_workflow_v1_0_json__WEBPACK_IMPORTED_MODULE_2__);
        schema = _templates_schema__WEBPACK_IMPORTED_MODULE_1__.TemplateSchema.load(new _templates_json_object_reader__WEBPACK_IMPORTED_MODULE_0__.JSONObjectReader(undefined, json));
    }
    return schema;
}
//# sourceMappingURL=workflow-schema.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/workflows/yaml-object-reader.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/workflows/yaml-object-reader.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   YamlObjectReader: () => (/* binding */ YamlObjectReader)
/* harmony export */ });
/* harmony import */ var yaml__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! yaml */ "./node_modules/yaml/dist/index.js");
/* harmony import */ var _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../templates/parse-event */ "./node_modules/@actions/workflow-parser/dist/templates/parse-event.js");
/* harmony import */ var _templates_tokens_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../templates/tokens/index */ "./node_modules/@actions/workflow-parser/dist/templates/tokens/index.js");



class YamlObjectReader {
    constructor(fileId, content) {
        this.lineCounter = new yaml__WEBPACK_IMPORTED_MODULE_0__.LineCounter();
        this.errors = [];
        const doc = (0,yaml__WEBPACK_IMPORTED_MODULE_0__.parseDocument)(content, {
            lineCounter: this.lineCounter,
            keepSourceTokens: true,
            uniqueKeys: false // Uniqueness is validated by the template reader
        });
        for (const err of doc.errors) {
            this.errors.push({ message: err.message, range: rangeFromLinePos(err.linePos) });
        }
        this._generator = this.getNodes(doc);
        this.fileId = fileId;
    }
    *getNodes(node) {
        let range = this.getRange(node);
        if ((0,yaml__WEBPACK_IMPORTED_MODULE_0__.isDocument)(node)) {
            yield new _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.ParseEvent(_templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.DocumentStart);
            for (const item of this.getNodes(node.contents)) {
                yield item;
            }
            yield new _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.ParseEvent(_templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.DocumentEnd);
        }
        if ((0,yaml__WEBPACK_IMPORTED_MODULE_0__.isCollection)(node)) {
            if ((0,yaml__WEBPACK_IMPORTED_MODULE_0__.isSeq)(node)) {
                yield new _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.ParseEvent(_templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.SequenceStart, new _templates_tokens_index__WEBPACK_IMPORTED_MODULE_2__.SequenceToken(this.fileId, range, undefined));
            }
            else if ((0,yaml__WEBPACK_IMPORTED_MODULE_0__.isMap)(node)) {
                yield new _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.ParseEvent(_templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.MappingStart, new _templates_tokens_index__WEBPACK_IMPORTED_MODULE_2__.MappingToken(this.fileId, range, undefined));
            }
            for (const item of node.items) {
                for (const child of this.getNodes(item)) {
                    yield child;
                }
            }
            if ((0,yaml__WEBPACK_IMPORTED_MODULE_0__.isSeq)(node)) {
                yield new _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.ParseEvent(_templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.SequenceEnd);
            }
            else if ((0,yaml__WEBPACK_IMPORTED_MODULE_0__.isMap)(node)) {
                yield new _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.ParseEvent(_templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.MappingEnd);
            }
        }
        if ((0,yaml__WEBPACK_IMPORTED_MODULE_0__.isScalar)(node)) {
            yield new _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.ParseEvent(_templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.Literal, YamlObjectReader.getLiteralToken(this.fileId, range, node));
        }
        if ((0,yaml__WEBPACK_IMPORTED_MODULE_0__.isPair)(node)) {
            const scalarKey = node.key;
            range = this.getRange(scalarKey);
            const key = scalarKey.value;
            yield new _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.ParseEvent(_templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.Literal, new _templates_tokens_index__WEBPACK_IMPORTED_MODULE_2__.StringToken(this.fileId, range, key, undefined));
            for (const child of this.getNodes(node.value)) {
                yield child;
            }
        }
    }
    getRange(node) {
        const range = node?.range ?? [];
        const startPos = range[0];
        const endPos = range[1];
        if (startPos !== undefined && endPos !== undefined) {
            const slp = this.lineCounter.linePos(startPos);
            const elp = this.lineCounter.linePos(endPos);
            return {
                start: { line: slp.line, column: slp.col },
                end: { line: elp.line, column: elp.col }
            };
        }
        return undefined;
    }
    static getLiteralToken(fileId, range, token) {
        const value = token.value;
        if (value === null || value === undefined) {
            return new _templates_tokens_index__WEBPACK_IMPORTED_MODULE_2__.NullToken(fileId, range, undefined);
        }
        switch (typeof value) {
            case "number":
                return new _templates_tokens_index__WEBPACK_IMPORTED_MODULE_2__.NumberToken(fileId, range, value, undefined);
            case "boolean":
                return new _templates_tokens_index__WEBPACK_IMPORTED_MODULE_2__.BooleanToken(fileId, range, value, undefined);
            case "string": {
                let source;
                if (token.srcToken && "source" in token.srcToken) {
                    source = token.srcToken.source;
                }
                return new _templates_tokens_index__WEBPACK_IMPORTED_MODULE_2__.StringToken(fileId, range, value, undefined, source);
            }
            default:
                throw new Error(`Unexpected value type '${typeof value}' when reading object`);
        }
    }
    allowLiteral() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.Literal) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.SequenceStart) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowSequenceEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.SequenceEnd) {
                this._current = this._generator.next();
                return true;
            }
        }
        return false;
    }
    allowMappingStart() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.MappingStart) {
                this._current = this._generator.next();
                return parseEvent.token;
            }
        }
        return undefined;
    }
    allowMappingEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.MappingEnd) {
                this._current = this._generator.next();
                return true;
            }
        }
        return false;
    }
    validateEnd() {
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.DocumentEnd) {
                this._current = this._generator.next();
                return;
            }
        }
        throw new Error("Expected end of reader");
    }
    validateStart() {
        if (!this._current) {
            this._current = this._generator.next();
        }
        if (!this._current.done) {
            const parseEvent = this._current.value;
            if (parseEvent.type === _templates_parse_event__WEBPACK_IMPORTED_MODULE_1__.EventType.DocumentStart) {
                this._current = this._generator.next();
                return;
            }
        }
        throw new Error("Expected start of reader");
    }
}
function rangeFromLinePos(linePos) {
    if (linePos === undefined) {
        return;
    }
    // TokenRange and linePos are both 1-based
    const start = { line: linePos[0].line, column: linePos[0].col };
    const end = linePos.length == 2 ? { line: linePos[1].line, column: linePos[1].col } : start;
    return { start, end };
}
//# sourceMappingURL=yaml-object-reader.js.map

/***/ }),

/***/ "./node_modules/@actions/workflow-parser/dist/workflow-v1.0.json":
/*!***********************************************************************!*\
  !*** ./node_modules/@actions/workflow-parser/dist/workflow-v1.0.json ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"version":"workflow-v1.0","definitions":{"workflow-root":{"description":"A workflow file.","mapping":{"properties":{"on":"on","name":"workflow-name","run-name":"run-name","defaults":"workflow-defaults","env":"workflow-env","permissions":"permissions","concurrency":"workflow-concurrency","jobs":{"type":"jobs","required":true}}}},"workflow-root-strict":{"description":"Workflow file with strict validation","mapping":{"properties":{"on":{"type":"on-strict","required":true},"name":"workflow-name","run-name":"run-name","defaults":"workflow-defaults","env":"workflow-env","permissions":"permissions","concurrency":"workflow-concurrency","jobs":{"type":"jobs","required":true}}}},"workflow-name":{"description":"The name of the workflow that GitHub displays on your repository\'s \'Actions\' tab.\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#name)","string":{}},"run-name":{"context":["github","inputs","vars"],"string":{},"description":"The name for workflow runs generated from the workflow. GitHub displays the workflow run name in the list of workflow runs on your repository\'s \'Actions\' tab.\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#run-name)"},"on":{"description":"The GitHub event that triggers the workflow. Events can be a single string, array of events, array of event types, or an event configuration map that schedules a workflow or restricts the execution of a workflow to specific files, tags, or branch changes. View a full list of [events that trigger workflows](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows).\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#on)","one-of":["string","sequence","on-mapping"]},"on-mapping":{"mapping":{"properties":{"workflow_call":"workflow-call"},"loose-key-type":"non-empty-string","loose-value-type":"any"}},"on-strict":{"description":"The GitHub event that triggers the workflow.  Events can be a single string, array of events, array of event types, or an event configuration map that schedules a workflow or restricts the execution of a workflow to specific files, tags, or branch changes. View a full list of [events that trigger workflows](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows).\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#on)","one-of":["on-string-strict","on-sequence-strict","on-mapping-strict"]},"on-mapping-strict":{"description":"The GitHub event that triggers the workflow.  Events can be a single string, array of events, array of event types, or an event configuration map that schedules a workflow or restricts the execution of a workflow to specific files, tags, or branch changes. View a full list of [events that trigger workflows](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows).\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#on)","mapping":{"properties":{"branch_protection_rule":"branch-protection-rule","check_run":"check-run","check_suite":"check-suite","create":"create","delete":"delete","deployment":"deployment","deployment_status":"deployment-status","discussion":"discussion","discussion_comment":"discussion-comment","fork":"fork","gollum":"gollum","issue_comment":"issue-comment","issues":"issues","label":"label","merge_group":"merge-group","milestone":"milestone","page_build":"page-build","project":"project","project_card":"project-card","project_column":"project-column","public":"public","pull_request":"pull-request","pull_request_comment":"pull-request-comment","pull_request_review":"pull-request-review","pull_request_review_comment":"pull-request-review-comment","pull_request_target":"pull-request-target","push":"push","registry_package":"registry-package","release":"release","repository_dispatch":"repository-dispatch","schedule":"schedule","status":"status","watch":"watch","workflow_call":"workflow-call","workflow_dispatch":"workflow-dispatch","workflow_run":"workflow-run"}}},"on-string-strict":{"one-of":["branch-protection-rule-string","check-run-string","check-suite-string","create-string","delete-string","deployment-string","deployment-status-string","discussion-string","discussion-comment-string","fork-string","gollum-string","issue-comment-string","issues-string","label-string","merge-group-string","milestone-string","page-build-string","project-string","project-card-string","project-column-string","public-string","pull-request-string","pull-request-comment-string","pull-request-review-string","pull-request-review-comment-string","pull-request-target-string","push-string","registry-package-string","release-string","repository-dispatch-string","schedule-string","status-string","watch-string","workflow-call-string","workflow-dispatch-string","workflow-run-string"]},"on-sequence-strict":{"sequence":{"item-type":"on-string-strict"}},"branch-protection-rule-string":{"description":"Runs your workflow when branch protection rules in the workflow repository are changed.","string":{"constant":"branch_protection_rule"}},"branch-protection-rule":{"description":"Runs your workflow when branch protection rules in the workflow repository are changed.","one-of":["null","branch-protection-rule-mapping"]},"branch-protection-rule-mapping":{"mapping":{"properties":{"types":"branch-protection-rule-activity"}}},"branch-protection-rule-activity":{"description":"The types of branch protection rule activity that trigger the workflow. Supported activity types: `created`, `edited`, `deleted`.","one-of":["branch-protection-rule-activity-type","branch-protection-rule-activity-types"]},"branch-protection-rule-activity-types":{"sequence":{"item-type":"branch-protection-rule-activity-type"}},"branch-protection-rule-activity-type":{"allowed-values":["created","edited","deleted"]},"check-run-string":{"description":"Runs your workflow when activity related to a check run occurs. A check run is an individual test that is part of a check suite.","string":{"constant":"check_run"}},"check-run":{"description":"Runs your workflow when activity related to a check run occurs. A check run is an individual test that is part of a check suite.","one-of":["null","check-run-mapping"]},"check-run-mapping":{"mapping":{"properties":{"types":"check-run-activity"}}},"check-run-activity":{"description":"The types of check run activity that trigger the workflow. Supported activity types: `created`, `rerequested`, `completed`, `requested_action`.","one-of":["check-run-activity-type","check-run-activity-types"]},"check-run-activity-types":{"sequence":{"item-type":"check-run-activity-type"}},"check-run-activity-type":{"allowed-values":["completed","created","rerequested","requested_action"]},"check-suite-string":{"description":"Runs your workflow when check suite activity occurs. A check suite is a collection of the check runs created for a specific commit. Check suites summarize the status and conclusion of the check runs that are in the suite.","string":{"constant":"check_suite"}},"check-suite":{"description":"Runs your workflow when check suite activity occurs. A check suite is a collection of the check runs created for a specific commit. Check suites summarize the status and conclusion of the check runs that are in the suite.","one-of":["null","check-suite-mapping"]},"check-suite-mapping":{"mapping":{"properties":{"types":"check-suite-activity"}}},"check-suite-activity":{"description":"The types of check suite activity that trigger the workflow. Supported activity types: `completed`.","one-of":["check-suite-activity-type","check-suite-activity-types"]},"check-suite-activity-types":{"sequence":{"item-type":"check-suite-activity-type"}},"check-suite-activity-type":{"allowed-values":["completed"]},"create-string":{"description":"Runs your workflow when someone creates a Git reference (Git branch or tag) in the workflow\'s repository.","string":{"constant":"create"}},"create":{"description":"Runs your workflow when someone creates a Git reference (Git branch or tag) in the workflow\'s repository.","null":{}},"delete-string":{"description":"Runs your workflow when someone deletes a Git reference (Git branch or tag) in the workflow\'s repository.","string":{"constant":"delete"}},"delete":{"description":"Runs your workflow when someone deletes a Git reference (Git branch or tag) in the workflow\'s repository.","null":{}},"deployment-string":{"description":"Runs your workflow when someone creates a deployment in the workflow\'s repository. Deployments created with a commit SHA may not have a Git ref.","string":{"constant":"deployment"}},"deployment":{"description":"Runs your workflow when someone creates a deployment in the workflow\'s repository. Deployments created with a commit SHA may not have a Git ref.","null":{}},"deployment-status-string":{"description":"Runs your workflow when a third party provides a deployment status. Deployments created with a commit SHA may not have a Git ref.","string":{"constant":"deployment_status"}},"deployment-status":{"description":"Runs your workflow when a third party provides a deployment status. Deployments created with a commit SHA may not have a Git ref.","null":{}},"discussion-string":{"description":"Runs your workflow when a discussion in the workflow\'s repository is created or modified. For activity related to comments on a discussion, use the `discussion_comment` event.","string":{"constant":"discussion"}},"discussion":{"description":"Runs your workflow when a discussion in the workflow\'s repository is created or modified. For activity related to comments on a discussion, use the `discussion_comment` event.","one-of":["null","discussion-mapping"]},"discussion-mapping":{"mapping":{"properties":{"types":"discussion-activity"}}},"discussion-activity":{"description":"The types of discussion activity that trigger the workflow. Supported activity types: `created`, `edited`, `deleted`, `transferred`, `pinned`, `unpinned`, `labeled`, `unlabeled`, `locked`, `unlocked`, `category_changed`, `answered`, `unanswered`.","one-of":["discussion-activity-type","discussion-activity-types"]},"discussion-activity-types":{"sequence":{"item-type":"discussion-activity-type"}},"discussion-activity-type":{"allowed-values":["created","edited","deleted","transferred","pinned","unpinned","labeled","unlabeled","locked","unlocked","category_changed","answered","unanswered"]},"discussion-comment-string":{"description":"Runs your workflow when a comment on a discussion in the workflow\'s repository is created or modified. For activity related to a discussion as opposed to comments on the discussion, use the `discussion` event.","string":{"constant":"discussion_comment"}},"discussion-comment":{"description":"Runs your workflow when a comment on a discussion in the workflow\'s repository is created or modified. For activity related to a discussion as opposed to comments on the discussion, use the `discussion` event.","one-of":["null","discussion-comment-mapping"]},"discussion-comment-mapping":{"mapping":{"properties":{"types":"discussion-comment-activity"}}},"discussion-comment-activity":{"description":"The types of discussion comment activity that trigger the workflow. Supported activity types: `created`, `edited`, `deleted`.","one-of":["discussion-comment-activity-type","discussion-comment-activity-types"]},"discussion-comment-activity-types":{"sequence":{"item-type":"discussion-comment-activity-type"}},"discussion-comment-activity-type":{"allowed-values":["created","edited","deleted"]},"fork-string":{"description":"Runs your workflow when someone forks a repository.","string":{"constant":"fork"}},"fork":{"description":"Runs your workflow when someone forks a repository.","null":{}},"gollum-string":{"description":"Runs your workflow when someone creates or updates a Wiki page.","string":{"constant":"gollum"}},"gollum":{"description":"Runs your workflow when someone creates or updates a Wiki page.","null":{}},"issue-comment-string":{"description":"Runs your workflow when an issue or pull request comment is created, edited, or deleted.","string":{"constant":"issue_comment"}},"issue-comment":{"description":"Runs your workflow when an issue or pull request comment is created, edited, or deleted.","one-of":["null","issue-comment-mapping"]},"issue-comment-mapping":{"mapping":{"properties":{"types":"issue-comment-activity"}}},"issue-comment-activity":{"description":"The types of issue comment activity that trigger the workflow. Supported activity types: `created`, `edited`, `deleted`.","one-of":["issue-comment-activity-type","issue-comment-activity-types"]},"issue-comment-activity-types":{"sequence":{"item-type":"issue-comment-activity-type"}},"issue-comment-activity-type":{"allowed-values":["created","edited","deleted"]},"issues-string":{"description":"Runs your workflow when an issue in the workflow\'s repository is created or modified. For activity related to comments in an issue, use the `issue_comment` event.","string":{"constant":"issues"}},"issues":{"description":"Runs your workflow when an issue in the workflow\'s repository is created or modified. For activity related to comments in an issue, use the `issue_comment` event.","one-of":["null","issues-mapping"]},"issues-mapping":{"mapping":{"properties":{"types":"issues-activity"}}},"issues-activity":{"description":"The types of issue activity that trigger the workflow. Supported activity types: `opened`, `edited`, `deleted`, `transferred`, `pinned`, `unpinned`, `closed`, `reopened`, `assigned`, `unassigned`, `labeled`, `unlabeled`, `locked`, `unlocked`, `milestoned`, `demilestoned`.","one-of":["issues-activity-type","issues-activity-types"]},"issues-activity-types":{"sequence":{"item-type":"issues-activity-type"}},"issues-activity-type":{"allowed-values":["opened","edited","deleted","transferred","pinned","unpinned","closed","reopened","assigned","unassigned","labeled","unlabeled","locked","unlocked","milestoned","demilestoned"]},"label-string":{"description":"Runs your workflow when a label in your workflow\'s repository is created or modified.","string":{"constant":"label"}},"label":{"description":"Runs your workflow when a label in your workflow\'s repository is created or modified.","one-of":["null","label-mapping"]},"label-mapping":{"mapping":{"properties":{"types":"label-activity"}}},"label-activity":{"description":"The types of label activity that trigger the workflow. Supported activity types: `created`, `edited`, `deleted`.","one-of":["label-activity-type","label-activity-types"]},"label-activity-types":{"sequence":{"item-type":"label-activity-type"}},"label-activity-type":{"allowed-values":["created","edited","deleted"]},"merge-group-string":{"description":"Runs your workflow when a pull request is added to a merge queue, which adds the pull request to a merge group.","string":{"constant":"merge_group"}},"merge-group":{"description":"Runs your workflow when a pull request is added to a merge queue, which adds the pull request to a merge group.","one-of":["null","merge-group-mapping"]},"merge-group-mapping":{"mapping":{"properties":{"types":"merge-group-activity","branches":"event-branches","branches-ignore":"event-branches-ignore"}}},"merge-group-activity":{"description":"The types of merge group activity that trigger the workflow. Supported activity types: `checks_requested`.","one-of":["merge-group-activity-type","merge-group-activity-types"]},"merge-group-activity-types":{"sequence":{"item-type":"merge-group-activity-type"}},"merge-group-activity-type":{"allowed-values":["checks_requested"]},"milestone-string":{"description":"Runs your workflow when a milestone in the workflow\'s repository is created or modified.","string":{"constant":"milestone"}},"milestone":{"description":"Runs your workflow when a milestone in the workflow\'s repository is created or modified.","one-of":["null","milestone-mapping"]},"milestone-mapping":{"mapping":{"properties":{"types":"milestone-activity"}}},"milestone-activity":{"description":"The types of milestone activity that trigger the workflow. Supported activity types: `created`, `closed`, `opened`, `edited`, `deleted`.","one-of":["milestone-activity-type","milestone-activity-types"]},"milestone-activity-types":{"sequence":{"item-type":"milestone-activity-type"}},"milestone-activity-type":{"allowed-values":["created","closed","opened","edited","deleted"]},"page-build-string":{"description":"Runs your workflow when someone pushes to a branch that is the publishing source for GitHub Pages, if GitHub Pages is enabled for the repository.","string":{"constant":"page_build"}},"page-build":{"description":"Runs your workflow when someone pushes to a branch that is the publishing source for GitHub Pages, if GitHub Pages is enabled for the repository.","null":{}},"project-string":{"description":"Runs your workflow when a project board is created or modified. For activity related to cards or columns in a project board, use the `project_card` or `project_column` events instead.","string":{"constant":"project"}},"project":{"description":"Runs your workflow when a project board is created or modified. For activity related to cards or columns in a project board, use the `project_card` or `project_column` events instead.","one-of":["null","project-mapping"]},"project-mapping":{"mapping":{"properties":{"types":"project-activity"}}},"project-activity":{"description":"The types of project activity that trigger the workflow. Supported activity types: `created`, `closed`, `reopened`, `edited`, `deleted`.","one-of":["project-activity-type","project-activity-types"]},"project-activity-types":{"sequence":{"item-type":"project-activity-type"}},"project-activity-type":{"allowed-values":["created","closed","reopened","edited","deleted"]},"project-card-string":{"description":"Runs your workflow when a card on a project board is created or modified. For activity related to project boards or columns in a project board, use the `project` or `project_column` event instead.","string":{"constant":"project_card"}},"project-card":{"description":"Runs your workflow when a card on a project board is created or modified. For activity related to project boards or columns in a project board, use the `project` or `project_column` event instead.","one-of":["null","project-card-mapping"]},"project-card-mapping":{"mapping":{"properties":{"types":"project-card-activity"}}},"project-card-activity":{"description":"The types of project card activity that trigger the workflow. Supported activity types: `created`, `moved`, `converted`, `edited`, `deleted`.","one-of":["project-card-activity-type","project-card-activity-types"]},"project-card-activity-types":{"sequence":{"item-type":"project-card-activity-type"}},"project-card-activity-type":{"allowed-values":["created","moved","converted","edited","deleted"]},"project-column-string":{"description":"Runs your workflow when a column on a project board is created or modified. For activity related to project boards or cards in a project board, use the `project` or `project_card` event instead.","string":{"constant":"project_column"}},"project-column":{"description":"Runs your workflow when a column on a project board is created or modified. For activity related to project boards or cards in a project board, use the `project` or `project_card` event instead.","one-of":["null","project-column-mapping"]},"project-column-mapping":{"mapping":{"properties":{"types":"project-column-activity"}}},"project-column-activity":{"description":"The types of project column activity that trigger the workflow. Supported activity types: `created`, `updated`, `moved`, `deleted`.","one-of":["project-column-activity-type","project-column-activity-types"]},"project-column-activity-types":{"sequence":{"item-type":"project-column-activity-type"}},"project-column-activity-type":{"allowed-values":["created","updated","moved","deleted"]},"public-string":{"description":"Runs your workflow when your workflow\'s repository changes from private to public.","string":{"constant":"public"}},"public":{"description":"Runs your workflow when your workflow\'s repository changes from private to public.","null":{}},"pull-request-string":{"description":"Runs your workflow when activity on a pull request in the workflow\'s repository occurs. If no activity types are specified, the workflow runs when a pull request is opened, reopened, or when the head branch of the pull request is updated.","string":{"constant":"pull_request"}},"pull-request":{"description":"Runs your workflow when activity on a pull request in the workflow\'s repository occurs. If no activity types are specified, the workflow runs when a pull request is opened, reopened, or when the head branch of the pull request is updated.","one-of":["null","pull-request-mapping"]},"pull-request-mapping":{"mapping":{"properties":{"types":"pull-request-activity","branches":"event-branches","branches-ignore":"event-branches-ignore","paths":"event-paths","paths-ignore":"event-paths-ignore"}}},"pull-request-activity":{"description":"The types of pull request activity that trigger the workflow. Supported activity types: `assigned`, `unassigned`, `labeled`, `unlabeled`, `opened`, `edited`, `closed`, `reopened`, `synchronize`, `converted_to_draft`, `ready_for_review`, `locked`, `unlocked`, `review_requested`, `review_request_removed`, `auto_merge_enabled`, `auto_merge_disabled`.","one-of":["pull-request-activity-type","pull-request-activity-types"]},"pull-request-activity-types":{"sequence":{"item-type":"pull-request-activity-type"}},"pull-request-activity-type":{"allowed-values":["assigned","unassigned","labeled","unlabeled","opened","edited","closed","reopened","synchronize","converted_to_draft","ready_for_review","locked","unlocked","review_requested","review_request_removed","auto_merge_enabled","auto_merge_disabled"]},"pull-request-comment-string":{"description":"Please use the `issue_comment` event instead.","string":{"constant":"pull_request_comment"}},"pull-request-comment":{"description":"Please use the `issue_comment` event instead.","one-of":["null","issue-comment-mapping"]},"pull-request-review-string":{"description":"Runs your workflow when a pull request review is submitted, edited, or dismissed. A pull request review is a group of pull request review comments in addition to a body comment and a state. For activity related to pull request review comments or pull request comments, use the `pull_request_review_comment` or `issue_comment` events instead.","string":{"constant":"pull_request_review"}},"pull-request-review":{"description":"Runs your workflow when a pull request review is submitted, edited, or dismissed. A pull request review is a group of pull request review comments in addition to a body comment and a state. For activity related to pull request review comments or pull request comments, use the `pull_request_review_comment` or `issue_comment` events instead.","one-of":["null","pull-request-review-mapping"]},"pull-request-review-mapping":{"mapping":{"properties":{"types":"pull-request-review-activity"}}},"pull-request-review-activity":{"description":"The types of pull request review activity that trigger the workflow. Supported activity types: `submitted`, `edited`, `dismissed`.","one-of":["pull-request-review-activity-type","pull-request-review-activity-types"]},"pull-request-review-activity-types":{"sequence":{"item-type":"pull-request-review-activity-type"}},"pull-request-review-activity-type":{"allowed-values":["submitted","edited","dismissed"]},"pull-request-review-comment-string":{"description":"","string":{"constant":"pull_request_review_comment"}},"pull-request-review-comment":{"description":"","one-of":["null","pull-request-review-comment-mapping"]},"pull-request-review-comment-mapping":{"mapping":{"properties":{"types":"pull-request-review-comment-activity"}}},"pull-request-review-comment-activity":{"description":"The types of pull request review comment activity that trigger the workflow. Supported activity types: `created`, `edited`, `deleted`.","one-of":["pull-request-review-comment-activity-type","pull-request-review-comment-activity-types"]},"pull-request-review-comment-activity-types":{"sequence":{"item-type":"pull-request-review-comment-activity-type"}},"pull-request-review-comment-activity-type":{"allowed-values":["created","edited","deleted"]},"pull-request-target-string":{"description":"Runs your workflow when activity on a pull request in the workflow\'s repository occurs. If no activity types are specified, the workflow runs when a pull request is opened, reopened, or when the head branch of the pull request is updated.\\n\\nThis event runs in the context of the base of the pull request, rather than in the context of the merge commit, as the `pull_request` event does. This prevents execution of unsafe code from the head of the pull request that could alter your repository or steal any secrets you use in your workflow. This event allows your workflow to do things like label or comment on pull requests from forks. Avoid using this event if you need to build or run code from the pull request.","string":{"constant":"pull_request_target"}},"pull-request-target":{"description":"Runs your workflow when activity on a pull request in the workflow\'s repository occurs. If no activity types are specified, the workflow runs when a pull request is opened, reopened, or when the head branch of the pull request is updated.\\n\\nThis event runs in the context of the base of the pull request, rather than in the context of the merge commit, as the `pull_request` event does. This prevents execution of unsafe code from the head of the pull request that could alter your repository or steal any secrets you use in your workflow. This event allows your workflow to do things like label or comment on pull requests from forks. Avoid using this event if you need to build or run code from the pull request.","one-of":["null","pull-request-target-mapping"]},"pull-request-target-mapping":{"mapping":{"properties":{"types":"pull-request-target-activity","branches":"event-branches","branches-ignore":"event-branches-ignore","paths":"event-paths","paths-ignore":"event-paths-ignore"}}},"pull-request-target-activity":{"description":"The types of pull request activity that trigger the workflow. Supported activity types: `assigned`, `unassigned`, `labeled`, `unlabeled`, `opened`, `edited`, `closed`, `reopened`, `synchronize`, `converted_to_draft`, `ready_for_review`, `locked`, `unlocked`, `review_requested`, `review_request_removed`, `auto_merge_enabled`, `auto_merge_disabled`.","one-of":["pull-request-target-activity-type","pull-request-target-activity-types"]},"pull-request-target-activity-types":{"sequence":{"item-type":"pull-request-target-activity-type"}},"pull-request-target-activity-type":{"allowed-values":["assigned","unassigned","labeled","unlabeled","opened","edited","closed","reopened","synchronize","converted_to_draft","ready_for_review","locked","unlocked","review_requested","review_request_removed","auto_merge_enabled","auto_merge_disabled"]},"push-string":{"description":"Runs your workflow when you push a commit or tag.","string":{"constant":"push"}},"push":{"description":"Runs your workflow when you push a commit or tag.","one-of":["null","push-mapping"]},"push-mapping":{"mapping":{"properties":{"branches":"event-branches","branches-ignore":"event-branches-ignore","tags":"event-tags","tags-ignore":"event-tags-ignore","paths":"event-paths","paths-ignore":"event-paths-ignore"}}},"registry-package-string":{"description":"Runs your workflow when activity related to GitHub Packages occurs in your repository.","string":{"constant":"registry_package"}},"registry-package":{"description":"Runs your workflow when activity related to GitHub Packages occurs in your repository.","one-of":["null","registry-package-mapping"]},"registry-package-mapping":{"mapping":{"properties":{"types":"registry-package-activity"}}},"registry-package-activity":{"description":"The types of registry package activity that trigger the workflow. Supported activity types: `published`, `updated`.","one-of":["registry-package-activity-type","registry-package-activity-types"]},"registry-package-activity-types":{"sequence":{"item-type":"registry-package-activity-type"}},"registry-package-activity-type":{"allowed-values":["published","updated"]},"release-string":{"description":"Runs your workflow when release activity in your repository occurs.","string":{"constant":"release"}},"release":{"description":"Runs your workflow when release activity in your repository occurs.","one-of":["null","release-mapping"]},"release-mapping":{"mapping":{"properties":{"types":"release-activity"}}},"release-activity":{"description":"The types of release activity that trigger the workflow. Supported activity types: `published`, `unpublished`, `created`, `edited`, `deleted`, `prereleased`, `released`.","one-of":["release-activity-type","release-activity-types"]},"release-activity-types":{"sequence":{"item-type":"release-activity-type"}},"release-activity-type":{"allowed-values":["published","unpublished","created","edited","deleted","prereleased","released"]},"schedule-string":{"description":"The `schedule` event allows you to trigger a workflow at a scheduled time.\\n\\nYou can schedule a workflow to run at specific UTC times using POSIX cron syntax. Scheduled workflows run on the latest commit on the default or base branch. The shortest interval you can run scheduled workflows is once every 5 minutes. GitHub Actions does not support the non-standard syntax `@yearly`, `@monthly`, `@weekly`, `@daily`, `@hourly`, and `@reboot`.","string":{"constant":"schedule"}},"schedule":{"description":"The `schedule` event allows you to trigger a workflow at a scheduled time.\\n\\nYou can schedule a workflow to run at specific UTC times using POSIX cron syntax. Scheduled workflows run on the latest commit on the default or base branch. The shortest interval you can run scheduled workflows is once every 5 minutes. GitHub Actions does not support the non-standard syntax `@yearly`, `@monthly`, `@weekly`, `@daily`, `@hourly`, and `@reboot`.","sequence":{"item-type":"cron-mapping"}},"status-string":{"description":"Runs your workflow when the status of a Git commit changes. For example, commits can be marked as `error`, `failure`, `pending`, or `success`. If you want to provide more details about the status change, you may want to use the `check_run` event.","string":{"constant":"status"}},"status":{"description":"Runs your workflow when the status of a Git commit changes. For example, commits can be marked as `error`, `failure`, `pending`, or `success`. If you want to provide more details about the status change, you may want to use the `check_run` event.","null":{}},"watch-string":{"description":"Runs your workflow when the workflow\'s repository is starred.","string":{"constant":"watch"}},"watch":{"description":"Runs your workflow when the workflow\'s repository is starred.","one-of":["null","watch-mapping"]},"watch-mapping":{"mapping":{"properties":{"types":"watch-activity"}}},"watch-activity":{"description":"The types of watch activity that trigger the workflow. Supported activity types: `started`.","one-of":["watch-activity-type","watch-activity-types"]},"watch-activity-types":{"sequence":{"item-type":"watch-activity-type"}},"watch-activity-type":{"allowed-values":["started"]},"workflow-run-string":{"description":"This event occurs when a workflow run is requested or completed. It allows you to execute a workflow based on execution or completion of another workflow. The workflow started by the `workflow_run` event is able to access secrets and write tokens, even if the previous workflow was not. This is useful in cases where the previous workflow is intentionally not privileged, but you need to take a privileged action in a later workflow.","string":{"constant":"workflow_run"}},"workflow-run":{"description":"This event occurs when a workflow run is requested or completed. It allows you to execute a workflow based on execution or completion of another workflow. The workflow started by the `workflow_run` event is able to access secrets and write tokens, even if the previous workflow was not. This is useful in cases where the previous workflow is intentionally not privileged, but you need to take a privileged action in a later workflow.","one-of":["null","workflow-run-mapping"]},"workflow-run-mapping":{"mapping":{"properties":{"types":"workflow-run-activity","workflows":"workflow-run-workflows","branches":"event-branches","branches-ignore":"event-branches-ignore"}}},"workflow-run-workflows":{"description":"The name of the workflow that triggers the `workflow_run` event. The workflow must be in the same repository as the workflow that uses the `workflow_run` event.","one-of":["non-empty-string","sequence-of-non-empty-string"]},"workflow-run-activity":{"description":"The types of workflow run activity that trigger the workflow. Supported activity types: `completed`, `requested`, `in_progress`.","one-of":["workflow-run-activity-type","workflow-run-activity-types"]},"workflow-run-activity-types":{"sequence":{"item-type":"workflow-run-activity-type"}},"workflow-run-activity-type":{"allowed-values":["requested","completed","in_progress"]},"event-branches":{"description":"Use the `branches` filter when you want to include branch name patterns or when you want to both include and exclude branch name patterns. You cannot use both the `branches` and `branches-ignore` filters for the same event in a workflow.","one-of":["non-empty-string","sequence-of-non-empty-string"]},"event-branches-ignore":{"description":"Use the `branches-ignore` filter when you only want to exclude branch name patterns. You cannot use both the `branches` and `branches-ignore` filters for the same event in a workflow.","one-of":["non-empty-string","sequence-of-non-empty-string"]},"event-tags":{"description":"Use the `tags` filter when you want to include tag name patterns or when you want to both include and exclude tag names patterns. You cannot use both the `tags` and `tags-ignore` filters for the same event in a workflow.","one-of":["non-empty-string","sequence-of-non-empty-string"]},"event-tags-ignore":{"description":"Use the `tags-ignore` filter when you only want to exclude tag name patterns. You cannot use both the `tags` and `tags-ignore` filters for the same event in a workflow.","one-of":["non-empty-string","sequence-of-non-empty-string"]},"event-paths":{"description":"Use the `paths` filter when you want to include file path patterns or when you want to both include and exclude file path patterns. You cannot use both the `paths` and `paths-ignore` filters for the same event in a workflow.","one-of":["non-empty-string","sequence-of-non-empty-string"]},"event-paths-ignore":{"description":"Use the `paths-ignore` filter when you only want to exclude file path patterns. You cannot use both the `paths` and `paths-ignore` filters for the same event in a workflow.","one-of":["non-empty-string","sequence-of-non-empty-string"]},"repository-dispatch-string":{"description":"You can use the GitHub API to trigger a webhook event called `repository_dispatch` when you want to trigger a workflow for activity that happens outside of GitHub.","string":{"constant":"branch_protection_rule"}},"repository-dispatch":{"description":"You can use the GitHub API to trigger a webhook event called `repository_dispatch` when you want to trigger a workflow for activity that happens outside of GitHub.","one-of":["null","repository-dispatch-mapping"]},"repository-dispatch-mapping":{"mapping":{"properties":{"types":"sequence-of-non-empty-string"}}},"workflow-call-string":{"description":"The `workflow_call` event is used to indicate that a workflow can be called by another workflow. When a workflow is triggered with the `workflow_call` event, the event payload in the called workflow is the same event payload from the calling workflow.","string":{"constant":"workflow_call"}},"workflow-call":{"description":"The `workflow_call` event is used to indicate that a workflow can be called by another workflow. When a workflow is triggered with the `workflow_call` event, the event payload in the called workflow is the same event payload from the calling workflow.","one-of":["null","workflow-call-mapping"]},"workflow-call-mapping":{"mapping":{"properties":{"inputs":"workflow-call-inputs","secrets":"workflow-call-secrets","outputs":"workflow-call-outputs"}}},"workflow-call-inputs":{"description":"Inputs that are passed to the called workflow from the caller workflow.","mapping":{"loose-key-type":"non-empty-string","loose-value-type":"workflow-call-input-definition"}},"workflow-call-input-definition":{"mapping":{"properties":{"description":{"type":"string","description":"A string description of the input parameter."},"type":{"type":"workflow-call-input-type","required":true},"required":{"type":"boolean","description":"A boolean to indicate whether the action requires the input parameter. Set to `true` when the parameter is required."},"default":"workflow-call-input-default"}}},"workflow-call-input-type":{"description":"Required if input is defined for the `on.workflow_call` keyword. The value of this parameter is a string specifying the data type of the input. This must be one of: `boolean`, `number`, or `string`.","one-of":["input-type-string","input-type-boolean","input-type-number"]},"input-type-string":{"string":{"constant":"string"}},"input-type-boolean":{"string":{"constant":"boolean"}},"input-type-number":{"string":{"constant":"number"}},"input-type-choice":{"string":{"constant":"choice"}},"input-type-environment":{"string":{"constant":"environment"}},"workflow-call-input-default":{"description":"If a `default` parameter is not set, the default value of the input is `false` for boolean, `0` for a number, and `\\"\\"` for a string.","context":["github","inputs","vars"],"one-of":["string","boolean","number"]},"workflow-call-secrets":{"description":"A map of the secrets that can be used in the called workflow. Within the called workflow, you can use the `secrets` context to refer to a secret.","mapping":{"loose-key-type":"workflow-call-secret-name","loose-value-type":"workflow-call-secret-definition"}},"workflow-call-secret-name":{"string":{"require-non-empty":true},"description":"A string identifier to associate with the secret."},"workflow-call-secret-definition":{"one-of":["null","workflow-call-secret-mapping-definition"]},"workflow-call-secret-mapping-definition":{"mapping":{"properties":{"description":{"type":"string","description":"A string description of the secret parameter."},"required":{"type":"boolean","description":"A boolean specifying whether the secret must be supplied."}}}},"workflow-call-outputs":{"description":"A reusable workflow may generate data that you want to use in the caller workflow. To use these outputs, you must specify them as the outputs of the reusable workflow.","mapping":{"loose-key-type":"workflow-call-output-name","loose-value-type":"workflow-call-output-definition"}},"workflow-call-output-name":{"string":{"require-non-empty":true},"description":"A string identifier to associate with the output. The value of `<output_id>` is a map of the input\'s metadata. The `<output_id>` must be a unique identifier within the outputs object and must start with a letter or _ and contain only alphanumeric characters, -, or _."},"workflow-call-output-definition":{"mapping":{"properties":{"description":{"type":"string","description":"A string description of the output parameter."},"value":{"type":"workflow-output-context","required":true}}}},"workflow-output-context":{"description":"The value to assign to the output parameter.","context":["github","inputs","vars","jobs"],"string":{}},"workflow-dispatch-string":{"description":"The `workflow_dispatch` event allows you to manually trigger a workflow run. A workflow can be manually triggered using the GitHub API, GitHub CLI, or GitHub browser interface.","string":{"constant":"workflow_dispatch"}},"workflow-dispatch":{"description":"The `workflow_dispatch` event allows you to manually trigger a workflow run. A workflow can be manually triggered using the GitHub API, GitHub CLI, or GitHub browser interface.","one-of":["null","workflow-dispatch-mapping"]},"workflow-dispatch-mapping":{"mapping":{"properties":{"inputs":"workflow-dispatch-inputs"}}},"workflow-dispatch-inputs":{"description":"You can configure custom-defined input properties, default input values, and required inputs for the event directly in your workflow. When you trigger the event, you can provide the `ref` and any `inputs`. When the workflow runs, you can access the input values in the `inputs` context.","mapping":{"loose-key-type":"workflow-dispatch-input-name","loose-value-type":"workflow-dispatch-input"}},"workflow-dispatch-input-name":{"string":{"require-non-empty":true},"description":"A string identifier to associate with the input. The value of <input_id> is a map of the input\'s metadata. The <input_id> must be a unique identifier within the inputs object. The <input_id> must start with a letter or _ and contain only alphanumeric characters, -, or _."},"workflow-dispatch-input":{"mapping":{"properties":{"description":{"type":"string","description":"A string description of the input parameter."},"type":{"type":"workflow-dispatch-input-type"},"required":{"type":"boolean","description":"A boolean to indicate whether the workflow requires the input parameter. Set to true when the parameter is required."},"default":"workflow-dispatch-input-default","options":{"type":"sequence-of-non-empty-string","description":"The options of the dropdown list, if the type is a choice."}}}},"workflow-dispatch-input-type":{"description":"A string representing the type of the input. This must be one of: `boolean`, `number`, `string`, `choice`, or `environment`.","one-of":["input-type-string","input-type-boolean","input-type-number","input-type-environment","input-type-choice"]},"workflow-dispatch-input-default":{"description":"The default value is used when an input parameter isn\'t specified in a workflow file.","one-of":["string","boolean","number"]},"permissions":{"description":"You can use `permissions` to modify the default permissions granted to the `GITHUB_TOKEN`, adding or removing access as required, so that you only allow the minimum required access.\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#permissions)","one-of":["permissions-mapping","permission-level-shorthand-read-all","permission-level-shorthand-write-all"]},"permissions-mapping":{"mapping":{"properties":{"actions":{"type":"permission-level-any","description":"Actions workflows, workflow runs, and artifacts."},"checks":{"type":"permission-level-any","description":"Check runs and check suites."},"contents":{"type":"permission-level-any","description":"Repository contents, commits, branches, downloads, releases, and merges."},"deployments":{"type":"permission-level-any","description":"Deployments and deployment statuses."},"discussions":{"type":"permission-level-any","description":"Discussions and related comments and labels."},"id-token":{"type":"permission-level-write-or-no-access","description":"Token to request an OpenID Connect token."},"issues":{"type":"permission-level-any","description":"Issues and related comments, assignees, labels, and milestones."},"packages":{"type":"permission-level-any","description":"Packages published to the GitHub Package Platform."},"pages":{"type":"permission-level-any","description":"Retrieve Pages statuses, configuration, and builds, as well as create new builds."},"pull-requests":{"type":"permission-level-any","description":"Pull requests and related comments, assignees, labels, milestones, and merges."},"repository-projects":{"type":"permission-level-any","description":"Classic projects within a repository."},"security-events":{"type":"permission-level-any","description":"Code scanning and Dependabot alerts."},"statuses":{"type":"permission-level-any","description":"Commit statuses."}}}},"permission-level-any":{"description":"The permission level for the `GITHUB_TOKEN`.","one-of":["permission-level-read","permission-level-write","permission-level-no-access"]},"permission-level-read-or-no-access":{"one-of":["permission-level-read","permission-level-no-access"]},"permission-level-write-or-no-access":{"one-of":["permission-level-write","permission-level-no-access"]},"permission-level-read":{"description":"The permission level for the `GITHUB_TOKEN`. Grants `read` permission for the specified scope.","string":{"constant":"read"}},"permission-level-write":{"description":"The permission level for the `GITHUB_TOKEN`. Grants `write` permission for the specified scope.","string":{"constant":"write"}},"permission-level-no-access":{"description":"The permission level for the `GITHUB_TOKEN`. Restricts all access for the specified scope.","string":{"constant":"none"}},"permission-level-shorthand-read-all":{"description":"The permission level for the `GITHUB_TOKEN`. Grants `read` access for all scopes.","string":{"constant":"read-all"}},"permission-level-shorthand-write-all":{"description":"The permission level for the `GITHUB_TOKEN`. Grants `write` access for all scopes.","string":{"constant":"write-all"}},"workflow-defaults":{"description":"Use `defaults` to create a map of default settings that will apply to all jobs in the workflow. You can also set default settings that are only available to a job.\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#defaults)","mapping":{"properties":{"run":"workflow-defaults-run"}}},"workflow-defaults-run":{"mapping":{"properties":{"shell":"shell","working-directory":"working-directory"}}},"workflow-env":{"description":"A map of environment variables that are available to the steps of all jobs in the workflow. You can also set environment variables that are only available to the steps of a single job or to a single step.\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#env)","context":["github","inputs","vars","secrets"],"mapping":{"loose-key-type":"non-empty-string","loose-value-type":"string"}},"jobs":{"description":"A workflow run is made up of one or more `jobs`, which run in parallel by default. To run jobs sequentially, you can define dependencies on other jobs using the `jobs.<job_id>.needs` keyword. Each job runs in a runner environment specified by `runs-on`.\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#jobs)","mapping":{"loose-key-type":"job-id","loose-value-type":"job"}},"job-id":{"string":{"require-non-empty":true},"description":"A unique identifier for the job. The identifier must start with a letter or _ and contain only alphanumeric characters, -, or _."},"job":{"description":"Each job must have an id to associate with the job. The key `job_id` is a string and its value is a map of the job\'s configuration data. You must replace `<job_id>` with a string that is unique to the jobs object. The `<job_id>` must start with a letter or _ and contain only alphanumeric characters, -, or _.","one-of":["job-factory","workflow-job"]},"job-factory":{"mapping":{"properties":{"needs":"needs","if":"job-if","strategy":"strategy","name":{"type":"string-strategy-context","description":"The name of the job displayed on GitHub."},"runs-on":{"type":"runs-on","required":true},"timeout-minutes":{"type":"number-strategy-context","description":"The maximum number of minutes to let a workflow run before GitHub automatically cancels it. Default: 360"},"cancel-timeout-minutes":"number-strategy-context","continue-on-error":{"type":"boolean-strategy-context","description":"Prevents a workflow run from failing when a job fails. Set to true to allow a workflow run to pass when this job fails."},"container":"container","services":"services","env":"job-env","environment":"job-environment","permissions":"permissions","concurrency":"job-concurrency","outputs":"job-outputs","defaults":"job-defaults","steps":"steps"}}},"workflow-job":{"mapping":{"properties":{"name":{"type":"string-strategy-context","description":"The name of the job displayed on GitHub."},"uses":{"description":"The location and version of a reusable workflow file to run as a job. Use one of the following formats:\\n\\n* `{owner}/{repo}/.github/workflows/{filename}@{ref}` for reusable workflows in public and private repositories.\\n* `./.github/workflows/{filename}` for reusable workflows in the same repository.\\n\\n{ref} can be a SHA, a release tag, or a branch name. Using the commit SHA is the safest for stability and security.","type":"non-empty-string","required":true},"with":"workflow-job-with","secrets":"workflow-job-secrets","needs":"needs","if":"job-if","permissions":"permissions","concurrency":"job-concurrency","strategy":"strategy"}}},"workflow-job-with":{"description":"When a job is used to call a reusable workflow, you can use `with` to provide a map of inputs that are passed to the called workflow.\\n\\nAny inputs that you pass must match the input specifications defined in the called workflow.","mapping":{"loose-key-type":"non-empty-string","loose-value-type":"scalar-needs-context"}},"workflow-job-secrets":{"description":"When a job is used to call a reusable workflow, you can use `secrets` to provide a map of secrets that are passed to the called workflow.\\n\\nAny secrets that you pass must match the names defined in the called workflow.","one-of":["workflow-job-secrets-mapping","workflow-job-secrets-inherit"]},"workflow-job-secrets-mapping":{"mapping":{"loose-key-type":"non-empty-string","loose-value-type":"scalar-needs-context-with-secrets"}},"workflow-job-secrets-inherit":{"string":{"constant":"inherit"}},"needs":{"description":"Use `needs` to identify any jobs that must complete successfully before this job will run. It can be a string or array of strings. If a job fails, all jobs that need it are skipped unless the jobs use a conditional expression that causes the job to continue. If a run contains a series of jobs that need each other, a failure applies to all jobs in the dependency chain from the point of failure onwards.","one-of":["sequence-of-non-empty-string","non-empty-string"]},"job-if":{"description":"You can use the `if` conditional to prevent a job from running unless a condition is met. You can use any supported context and expression to create a conditional.","context":["github","inputs","vars","needs","always(0,0)","failure(0,MAX)","cancelled(0,0)","success(0,MAX)"],"string":{"is-expression":true}},"job-if-result":{"context":["github","inputs","vars","needs","always(0,0)","failure(0,MAX)","cancelled(0,0)","success(0,MAX)"],"one-of":["null","boolean","number","string","sequence","mapping"]},"strategy":{"description":"Use `strategy` to use a matrix strategy for your jobs. A matrix strategy lets you use variables in a single job definition to automatically create multiple job runs that are based on the combinations of the variables. ","context":["github","inputs","vars","needs"],"mapping":{"properties":{"fail-fast":{"type":"boolean","description":"Setting `fail-fast` to `false` prevents GitHub from canceling all in-progress jobs if any matrix job fails. Default: `true`"},"max-parallel":{"type":"number","description":"The maximum number of jobs that can run simultaneously when using a matrix job strategy. By default, GitHub will maximize the number of jobs run in parallel depending on runner availability."},"matrix":"matrix"}}},"matrix":{"description":"Use `matrix` to define a matrix of different job configurations. Within your matrix, define one or more variables followed by an array of values.","mapping":{"properties":{"include":{"type":"matrix-filter","description":"Use `include` to expand existing matrix configurations or to add new configurations. The value of `include` is a list of objects.\\n\\nFor each object in the `include` list, the key:value pairs in the object will be added to each of the matrix combinations if none of the key:value pairs overwrite any of the original matrix values. If the object cannot be added to any of the matrix combinations, a new matrix combination will be created instead. Note that the original matrix values will not be overwritten, but added matrix values can be overwritten."},"exclude":{"type":"matrix-filter","description":"To remove specific configurations defined in the matrix, use `exclude`. An excluded configuration only has to be a partial match for it to be excluded."}},"loose-key-type":"non-empty-string","loose-value-type":"sequence"}},"matrix-filter":{"sequence":{"item-type":"matrix-filter-item"}},"matrix-filter-item":{"mapping":{"loose-key-type":"non-empty-string","loose-value-type":"any"}},"runs-on":{"description":"Use `runs-on` to define the type of machine to run the job on.\\n* The destination machine can be either a GitHub-hosted runner, larger runner, or a self-hosted runner.\\n* You can target runners based on the labels assigned to them, or their group membership, or a combination of these.\\n* You can provide `runs-on` as a single string or as an array of strings.\\n* If you specify an array of strings, your workflow will execute on any runner that matches all of the specified `runs-on` values.\\n* If you would like to run your workflow on multiple machines, use `jobs.<job_id>.strategy`.","context":["github","inputs","vars","needs","strategy","matrix"],"one-of":["non-empty-string","sequence-of-non-empty-string","runs-on-mapping"]},"runs-on-mapping":{"mapping":{"properties":{"group":{"description":"The group from which to select a runner.","type":"non-empty-string"},"labels":"runs-on-labels"}}},"runs-on-labels":{"description":"The label by which to filter for available runners.","one-of":["non-empty-string","sequence-of-non-empty-string"]},"job-env":{"description":"A map of variables that are available to all steps in the job.","context":["github","inputs","vars","needs","strategy","matrix","secrets"],"mapping":{"loose-key-type":"non-empty-string","loose-value-type":"string"}},"workflow-concurrency":{"description":"Concurrency ensures that only a single job or workflow using the same concurrency group will run at a time. A concurrency group can be any string or expression.\\n\\nYou can also specify `concurrency` at the job level.\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#concurrency)","context":["github","inputs","vars"],"one-of":["string","concurrency-mapping"]},"job-concurrency":{"description":"Concurrency ensures that only a single job using the same concurrency group will run at a time. A concurrency group can be any string or expression. The expression can use any context except for the `secrets` context.\\n\\nYou can also specify `concurrency` at the workflow level.","context":["github","inputs","vars","needs","strategy","matrix"],"one-of":["non-empty-string","concurrency-mapping"]},"concurrency-mapping":{"description":"Concurrency ensures that only a single job or workflow using the same concurrency group will run at a time. A concurrency group can be any string or expression.\\n\\nYou can also specify `concurrency` at the job level.\\n\\n[Documentation](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions#concurrency)","mapping":{"properties":{"group":{"type":"non-empty-string","required":true,"description":"When a concurrent job or workflow is queued, if another job or workflow using the same concurrency group in the repository is in progress, the queued job or workflow will be `pending`. Any previously pending job or workflow in the concurrency group will be canceled. To also cancel any currently running job or workflow in the same concurrency group, specify `cancel-in-progress: true`."},"cancel-in-progress":{"type":"boolean","description":"To cancel any currently running job or workflow in the same concurrency group, specify cancel-in-progress: true."}}}},"job-environment":{"description":"The environment that the job references. All environment protection rules must pass before a job referencing the environment is sent to a runner.","context":["github","inputs","vars","needs","strategy","matrix"],"one-of":["string","job-environment-mapping"]},"job-environment-mapping":{"mapping":{"properties":{"name":{"type":"job-environment-name","required":true},"url":{"type":"string-runner-context-no-secrets","description":"The environment URL, which maps to `environment_url` in the deployments API."}}}},"job-environment-name":{"description":"The name of the environment used by the job.","context":["github","inputs","vars","needs","strategy","matrix"],"string":{}},"job-defaults":{"description":"A map of default settings that will apply to all steps in the job. You can also set default settings for the entire workflow.","mapping":{"properties":{"run":"job-defaults-run"}}},"job-defaults-run":{"context":["github","inputs","vars","strategy","matrix","needs","env"],"mapping":{"properties":{"shell":"shell","working-directory":"working-directory"}}},"job-outputs":{"description":"A map of outputs for a called workflow. Called workflow outputs are available to all downstream jobs in the caller workflow. Each output has an identifier, an optional `description,` and a `value`. The `value` must be set to the value of an output from a job within the called workflow.","mapping":{"loose-key-type":"non-empty-string","loose-value-type":"string-runner-context"}},"steps":{"description":"A job contains a sequence of tasks called `steps`. Steps can run commands, run setup tasks, or run an action in your repository, a public repository, or an action published in a Docker registry. Not all steps run actions, but all actions run as a step. Each step runs in its own process in the runner environment and has access to the workspace and filesystem. Because steps run in their own process, changes to environment variables are not preserved between steps. GitHub provides built-in steps to set up and complete a job. Must contain either `uses` or `run`.","sequence":{"item-type":"steps-item"}},"steps-item":{"one-of":["run-step","regular-step"]},"run-step":{"mapping":{"properties":{"name":"step-name","id":"step-id","if":"step-if","timeout-minutes":"step-timeout-minutes","run":{"type":"string-steps-context","description":"Runs command-line programs using the operating system\'s shell. If you do not provide a `name`, the step name will default to the text specified in the `run` command. Commands run using non-login shells by default. You can choose a different shell and customize the shell used to run commands. Each `run` keyword represents a new process and shell in the virtual environment. When you provide multi-line commands, each line runs in the same shell.","required":true},"continue-on-error":"step-continue-on-error","env":"step-env","working-directory":"string-steps-context","shell":"shell"}}},"regular-step":{"mapping":{"properties":{"name":"step-name","id":"step-id","if":"step-if","continue-on-error":"step-continue-on-error","timeout-minutes":"step-timeout-minutes","uses":{"type":"step-uses","required":true},"with":"step-with","env":"step-env"}}},"step-uses":{"description":"Selects an action to run as part of a step in your job. An action is a reusable unit of code. You can use an action defined in the same repository as the workflow, a public repository, or in a published Docker container image.","string":{"require-non-empty":true}},"step-continue-on-error":{"context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env","hashFiles(1,255)"],"boolean":{},"description":"Prevents a job from failing when a step fails. Set to `true` to allow a job to pass when this step fails."},"step-id":{"string":{"require-non-empty":true},"description":"A unique identifier for the step. You can use the `id` to reference the step in contexts."},"step-if":{"context":["github","inputs","vars","needs","strategy","matrix","steps","job","runner","env","always(0,0)","failure(0,0)","cancelled(0,0)","success(0,0)","hashFiles(1,255)"],"description":"Use the `if` conditional to prevent a step from running unless a condition is met. Any supported context and expression can be used to create a conditional. Expressions in an `if` conditional do not require the bracketed expression syntax. When you use expressions in an `if` conditional, you may omit the expression syntax because GitHub automatically evaluates the `if` conditional as an expression.","string":{"is-expression":true}},"step-if-result":{"context":["github","inputs","vars","strategy","matrix","steps","job","runner","env","always(0,0)","failure(0,0)","cancelled(0,0)","success(0,0)","hashFiles(1,255)"],"one-of":["null","boolean","number","string","sequence","mapping"]},"step-env":{"description":"Sets variables for steps to use in the runner environment. You can also set variables for the entire workflow or a job.","context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env","hashFiles(1,255)"],"mapping":{"loose-key-type":"non-empty-string","loose-value-type":"string"}},"step-name":{"context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env","hashFiles(1,255)"],"string":{},"description":"A name for your step to display on GitHub."},"step-timeout-minutes":{"context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env","hashFiles(1,255)"],"number":{},"description":"The maximum number of minutes to run the step before killing the process."},"step-with":{"description":"A map of the input parameters defined by the action. Each input parameter is a key/value pair. Input parameters are set as variables. When you specify an input in a workflow file or use a default input value, GitHub creates a variable for the input with the name `INPUT_<VARIABLE_NAME>`. The variable created converts input names to uppercase letters and replaces spaces with `_`.","context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env","hashFiles(1,255)"],"mapping":{"loose-key-type":"non-empty-string","loose-value-type":"string"}},"container":{"description":"A container to run any steps in a job that don\'t already specify a container. If you have steps that use both script and container actions, the container actions will run as sibling containers on the same network with the same volume mounts.\\n\\nIf you do not set a container, all steps will run directly on the host specified by runs-on unless a step refers to an action configured to run in a container.","context":["github","inputs","vars","needs","strategy","matrix"],"one-of":["string","container-mapping"]},"container-mapping":{"mapping":{"properties":{"image":{"type":"non-empty-string","description":"Use `jobs.<job_id>.container.image` to define the Docker image to use as the container to run the action. The value can be the Docker Hub image or a registry name."},"options":{"type":"non-empty-string","description":"Use `jobs.<job_id>.container.options` to configure additional Docker container resource options."},"env":"container-env","ports":{"type":"sequence-of-non-empty-string","description":"Use `jobs.<job_id>.container.ports` to set an array of ports to expose on the container."},"volumes":{"type":"sequence-of-non-empty-string","description":"Use `jobs.<job_id>.container.volumes` to set an array of volumes for the container to use. You can use volumes to share data between services or other steps in a job. You can specify named Docker volumes, anonymous Docker volumes, or bind mounts on the host."},"credentials":"container-registry-credentials"}}},"services":{"description":"Additional containers to host services for a job in a workflow. These are useful for creating databases or cache services like redis. The runner on the virtual machine will automatically create a network and manage the life cycle of the service containers. When you use a service container for a job or your step uses container actions, you don\'t need to set port information to access the service. Docker automatically exposes all ports between containers on the same network. When both the job and the action run in a container, you can directly reference the container by its hostname. The hostname is automatically mapped to the service name. When a step does not use a container action, you must access the service using localhost and bind the ports.","context":["github","inputs","vars","needs","strategy","matrix"],"mapping":{"loose-key-type":"non-empty-string","loose-value-type":"services-container"}},"services-container":{"context":["github","inputs","vars","needs","strategy","matrix"],"one-of":["non-empty-string","container-mapping"]},"container-registry-credentials":{"description":"If the image\'s container registry requires authentication to pull the image, you can use `jobs.<job_id>.container.credentials` to set a map of the username and password. The credentials are the same values that you would provide to the `docker login` command.","context":["github","inputs","vars","secrets","env"],"mapping":{"properties":{"username":"non-empty-string","password":"non-empty-string"}}},"container-env":{"description":"Use `jobs.<job_id>.container.env` to set a map of variables in the container.","mapping":{"loose-key-type":"non-empty-string","loose-value-type":"string-runner-context"}},"non-empty-string":{"string":{"require-non-empty":true}},"sequence-of-non-empty-string":{"sequence":{"item-type":"non-empty-string"}},"boolean-needs-context":{"context":["github","inputs","vars","needs"],"boolean":{}},"number-needs-context":{"context":["github","inputs","vars","needs"],"number":{}},"string-needs-context":{"context":["github","inputs","vars","needs"],"string":{}},"scalar-needs-context":{"context":["github","inputs","vars","needs","strategy","matrix"],"one-of":["string","boolean","number"]},"scalar-needs-context-with-secrets":{"context":["github","inputs","vars","needs","secrets","strategy","matrix"],"one-of":["string","boolean","number"]},"boolean-strategy-context":{"context":["github","inputs","vars","needs","strategy","matrix"],"boolean":{}},"number-strategy-context":{"context":["github","inputs","vars","needs","strategy","matrix"],"number":{}},"string-strategy-context":{"context":["github","inputs","vars","needs","strategy","matrix"],"string":{}},"boolean-steps-context":{"context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env","hashFiles(1,255)"],"boolean":{}},"number-steps-context":{"context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env","hashFiles(1,255)"],"number":{}},"string-runner-context":{"context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env"],"string":{}},"string-runner-context-no-secrets":{"context":["github","inputs","vars","needs","strategy","matrix","steps","job","runner","env"],"string":{}},"string-steps-context":{"context":["github","inputs","vars","needs","strategy","matrix","secrets","steps","job","runner","env","hashFiles(1,255)"],"string":{}},"shell":{"string":{"require-non-empty":true},"description":"Use `shell` to override the default shell settings in the runner\'s operating system. You can use built-in shell keywords, or you can define a custom set of shell options. The shell command that is run internally executes a temporary file that contains the commands specified in `run`."},"working-directory":{"string":{"require-non-empty":true},"description":"The `working-directory` keyword specifies the working directory where the command is run."},"cron-mapping":{"mapping":{"properties":{"cron":"cron-pattern"}}},"cron-pattern":{"string":{"require-non-empty":true}}}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getInputs: () => (/* binding */ getInputs)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @actions/core */ "./node_modules/@actions/core/lib/core.js");
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_workflow_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @actions/workflow-parser */ "./node_modules/@actions/workflow-parser/dist/index.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);




const WORKFLOW_DIR = '.github/workflows';
function getInputs() {
    const result = {};
    result.token = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('github-token');
    result.owner = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('owner');
    result.repo = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('repo');
    result.files = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('files');
    return result;
}
const run = async () => {
    const inputs = getInputs();
    const workflowFiles = inputs.files ?
        inputs.files.split(', ')
        :
            (0,fs__WEBPACK_IMPORTED_MODULE_2__.readdirSync)(WORKFLOW_DIR)
                .filter(name => name.endsWith('.yml') || name.endsWith('.yaml'))
                .map(name => (0,path__WEBPACK_IMPORTED_MODULE_3__.join)(WORKFLOW_DIR, name));
    let results = [];
    workflowFiles.forEach(fileName => {
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.group)(`Linting ${fileName}`, async () => {
            try {
                const result = (0,_actions_workflow_parser__WEBPACK_IMPORTED_MODULE_1__.parseWorkflow)({
                    name: fileName,
                    content: (0,fs__WEBPACK_IMPORTED_MODULE_2__.readFileSync)(fileName, 'utf8')
                }, new _actions_workflow_parser__WEBPACK_IMPORTED_MODULE_1__.NoOperationTraceWriter());
                result.context.errors.getErrors()?.forEach(err => (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.error)(err.message, {
                    endColumn: err.range?.end.column,
                    startColumn: err.range?.start.column,
                    endLine: err.range?.end.line,
                    startLine: err.range?.start.line,
                    file: result.context.getFileTable()[0],
                    title: err.message.split('at')[0].trim(),
                }));
                results.push(result);
            }
            catch (err) {
                (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed)(`Workflow ${fileName} failed to parse: ${(err instanceof Error) ? err.message : err}`);
                return;
            }
        });
    });
    (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput)('results', JSON.stringify(results));
};
run();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.js.map