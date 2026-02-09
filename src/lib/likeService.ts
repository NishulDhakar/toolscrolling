/**
 * Service to manage like counts for tools
 * Stores total like counts in localStorage
 */

const LIKES_KEY = 'toolLikeCounts';

/**
 * Get like count for a specific tool
 */
export function getLikeCount(toolId: string): number {
    if (typeof window === 'undefined') return 0;

    const counts = getAllLikeCounts();
    return counts[toolId] || 0;
}

/**
 * Get all like counts
 */
export function getAllLikeCounts(): Record<string, number> {
    if (typeof window === 'undefined') return {};

    const stored = localStorage.getItem(LIKES_KEY);
    return stored ? JSON.parse(stored) : {};
}

/**
 * Increment like count for a tool
 */
export function incrementLike(toolId: string): number {
    const counts = getAllLikeCounts();
    counts[toolId] = (counts[toolId] || 0) + 1;
    localStorage.setItem(LIKES_KEY, JSON.stringify(counts));
    return counts[toolId];
}

/**
 * Decrement like count for a tool
 */
export function decrementLike(toolId: string): number {
    const counts = getAllLikeCounts();
    counts[toolId] = Math.max((counts[toolId] || 0) - 1, 0); // Don't go below 0
    localStorage.setItem(LIKES_KEY, JSON.stringify(counts));
    return counts[toolId];
}

/**
 * Toggle like for a tool and return new count
 */
export function toggleLikeCount(toolId: string, isCurrentlyLiked: boolean): number {
    if (isCurrentlyLiked) {
        return decrementLike(toolId);
    } else {
        return incrementLike(toolId);
    }
}
