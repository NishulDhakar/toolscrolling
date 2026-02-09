const AUTH_KEY = 'adminAuthenticated';

/**
 * Get admin password from environment variable
 * In production, set NEXT_PUBLIC_ADMIN_PASSWORD environment variable
 */
export function getAdminPassword(): string {
    return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''; // Default password for development
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(AUTH_KEY) === 'true';
}

/**
 * Authenticate with password
 */
export function authenticate(password: string): boolean {
    if (typeof window === 'undefined') return false;

    const envPassword = getAdminPassword();

    if (password === envPassword) {
        localStorage.setItem(AUTH_KEY, 'true');
        return true;
    }

    return false;
}

/**
 * Logout
 */
export function logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
}
