"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCategory = isValidCategory;
const codeGenerator_1 = require("./codeGenerator");
function isValidCategory(category) {
    // Normalize the category by converting to lowercase
    const normalizedCategory = category.toLowerCase();
    // Check if the normalized category exists in the categoryMap
    return normalizedCategory in codeGenerator_1.categoryMap;
}
//# sourceMappingURL=isValidCategory.js.map