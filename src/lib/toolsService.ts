import { Tool, tools as staticTools } from '@/data/tools';

const STORAGE_KEY = 'customTools';

export interface CustomTool extends Tool {
    isCustom: boolean;
}

/**
 * Get all tools from localStorage
 */
export function getCustomTools(): CustomTool[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error loading custom tools:', error);
        return [];
    }
}

/**
 * Save custom tools to localStorage
 */
function saveCustomTools(tools: CustomTool[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    } catch (error) {
        console.error('Error saving custom tools:', error);
    }
}

/**
 * Get all tools (static + custom)
 */
export function getAllTools(): CustomTool[] {
    const customTools = getCustomTools();
    const staticWithFlag: CustomTool[] = staticTools.map(tool => ({
        ...tool,
        isCustom: false,
    }));

    return [...staticWithFlag, ...customTools];
}

/**
 * Get a single tool by ID
 */
export function getToolById(id: string): CustomTool | undefined {
    const allTools = getAllTools();
    return allTools.find(tool => tool.id === id);
}

/**
 * Generate a unique ID for new tools
 */
function generateId(): string {
    const allTools = getAllTools();
    const maxId = allTools.reduce((max, tool) => {
        const numId = parseInt(tool.id);
        return !isNaN(numId) && numId > max ? numId : max;
    }, 0);

    return (maxId + 1).toString();
}

/**
 * Add a new custom tool
 */
export function addTool(toolData: Omit<Tool, 'id'>): CustomTool {
    const customTools = getCustomTools();

    const newTool: CustomTool = {
        ...toolData,
        id: generateId(),
        isCustom: true,
    };

    customTools.push(newTool);
    saveCustomTools(customTools);

    return newTool;
}

/**
 * Update an existing tool
 */
export function updateTool(id: string, toolData: Omit<Tool, 'id'>): CustomTool | null {
    const tool = getToolById(id);

    // Only allow updating custom tools
    if (!tool || !tool.isCustom) {
        console.error('Cannot update static tool or tool not found');
        return null;
    }

    const customTools = getCustomTools();
    const index = customTools.findIndex(t => t.id === id);

    if (index === -1) return null;

    const updatedTool: CustomTool = {
        ...toolData,
        id,
        isCustom: true,
    };

    customTools[index] = updatedTool;
    saveCustomTools(customTools);

    return updatedTool;
}

/**
 * Delete a custom tool
 */
export function deleteTool(id: string): boolean {
    const tool = getToolById(id);

    // Only allow deleting custom tools
    if (!tool || !tool.isCustom) {
        console.error('Cannot delete static tool or tool not found');
        return false;
    }

    const customTools = getCustomTools();
    const filtered = customTools.filter(t => t.id !== id);

    saveCustomTools(filtered);
    return true;
}

/**
 * Validate tool data
 */
export function validateTool(tool: Partial<Tool>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tool.title || tool.title.trim().length === 0) {
        errors.push('Title is required');
    }

    if (!tool.description || tool.description.trim().length === 0) {
        errors.push('Description is required');
    }

    // if (!tool.image || tool.image.trim().length === 0) {
    //     errors.push('Image URL is required');
    // } else {
    //     try {
    //         new URL(tool.image);
    //     } catch {
    //         errors.push('Image must be a valid URL');
    //     }
    // }

    if (!tool.link || tool.link.trim().length === 0) {
        errors.push('Link is required');
    } else {
        try {
            new URL(tool.link);
        } catch {
            errors.push('Link must be a valid URL');
        }
    }

    if (!tool.category) {
        errors.push('Category is required');
    } else {
        const validCategories = ['Development', 'Design', 'Productivity', 'AI', 'Other'];
        if (!validCategories.includes(tool.category)) {
            errors.push('Invalid category');
        }
    }

    if (tool.initialLikes !== undefined) {
        if (typeof tool.initialLikes !== 'number' || tool.initialLikes < 0) {
            errors.push('Initial likes must be a positive number');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
