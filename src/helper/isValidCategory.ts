import { categoryMap } from "./codeGenerator";

export function isValidCategory(category: string): boolean {
    // Normalize the category by converting to lowercase
    const normalizedCategory = category.toLowerCase();
    
    // Check if the normalized category exists in the categoryMap
    return normalizedCategory in categoryMap;
  }