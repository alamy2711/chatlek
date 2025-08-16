/**
 * Converts a string with underscores into a more readable format by replacing
 * underscores with spaces and capitalizing the first letter of each word.
 *
 * @param {string} str - The input string to beautify.
 * @returns {string} - The beautified string with spaces and capitalized words.
 */
export function beautifyString(str) {
    return str
        .replace(/_/g, " ") // Replace underscores with spaces
        .split(" ") // Split into words
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        ) // Capitalize first letter of each word
        .join(" "); // Join words back into a sentence
}
