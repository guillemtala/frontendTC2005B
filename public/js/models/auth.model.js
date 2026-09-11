import { API_BASE_URL, setSession, clearSession, getStoredUser, getToken } from '../config.js';

export function resolveLocalAvatar(avatarStr, identifier) {
    if (avatarStr && typeof avatarStr === 'string') {
        if (avatarStr.includes('default-user')) {
            return '/assets/default-user.png';
        }
        if (avatarStr.includes('user-profile')) {
            return '/assets/user-profile.jpg';
        }
    }
    const str = String(identifier || '').toLowerCase();
    if (str.includes('4092') || str.includes('maria') || str.includes('maría')) {
        return '/assets/default-user.png';
    }
    if (str.includes('4091') || str.includes('juan')) {
        return '/assets/user-profile.jpg';
    }
    return '/assets/default-user.png';
}

export const AuthModel = {
    getCurrentUser() {
        return getStoredUser();
    },

    getAuthToken() {
        return getToken();
    },

    logout() {
        clearSession();
        localStorage.removeItem('eslabon_2fa_verified');
    },

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email.trim(), password })
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data && data.message ? data.message : 'Correo electrónico o contraseña incorrectos.';
                throw new Error(errorMessage);
            }

            const token = data.token || data.accessToken || `token-${Date.now()}`;
            const rawUser = data.user || data.usuario || data;
            const userId = rawUser.id || rawUser.no_empleado || 'EP-4091';

            const user = {
                id: userId,
                name: rawUser.nombre || rawUser.name || 'Juan Pérez',
                email: rawUser.email || email,
                role: rawUser.rol || rawUser.role || 'Colaborador',
                avatar: resolveLocalAvatar(rawUser.avatar || rawUser.foto, userId || email)
            };

            setSession(token, user);
            return { token, user };
        } catch (error) {
            console.error('Error en autenticación:', error);
            throw error;
        }
    }
};