/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Format a date string to readable format
 */
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });

/**
 * Truncate long text
 */
export const truncate = (str = "", max = 80) =>
  str.length > max ? str.slice(0, max) + "…" : str;

/**
 * Extract error message from Axios error
 */
export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

/**
 * Clamp a number between min and max
 */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);