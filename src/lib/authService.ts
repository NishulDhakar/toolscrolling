const AUTH_KEY = 'nishulAuthenticated';

/**
 * Get nishul password from environment variable
 * In production, set NEXT_PUBLIC_nishul_PASSWORD environment variable
 */
export function getnishulPassword(): string {
    return process.env.NEXT_PUBLIC_nishul_PASSWORD || ''; // Default password for development
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

    const envPassword = getnishulPassword();

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
