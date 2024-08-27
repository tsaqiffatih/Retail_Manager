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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStrongPassword = void 0;
const isStrongPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(resolve, 100));
    const errors = [];
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number.");
    }
    // Uncomment the following lines if you want to enforce special character requirement
    // if (!/[!@#\$%\^&\*]/.test(password)) {
    //   errors.push("Password must contain at least one special character (!@#$%^&*)");
    // }
    if (errors.length > 0) {
        const error = new Error(errors.join(' '));
        error.name = 'WeakPasswordError';
        throw error;
    }
});
exports.isStrongPassword = isStrongPassword;
//# sourceMappingURL=isStrongPassword.js.map