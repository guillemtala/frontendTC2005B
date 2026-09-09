const USERS_DB_KEY = 'eslabon_users_db';
const SESSION_KEY = 'eslabon_active_session';

// Usuarios de prueba iniciales
const defaultUsers = [{
    id: 'EP-4091',
    name: 'Juan Pérez G.',
    email: 'juan.perez@eslabon.com',
    password: 'password123',
    role: 'Colaborador'
}];

// Función interna de inicialización segura
function initializeDatabase() {
    if (!localStorage.getItem(USERS_DB_KEY)) {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUsers));
    }
}

// Inicializar de inmediato al cargar el módulo
initializeDatabase();

export const AuthModel = {
    // Comprobación de sesión activa (síncrona)
    getCurrentUser() {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    // Cierre de sesión (síncrono)
    logout() {
        localStorage.removeItem(SESSION_KEY);
    },

    // Inicio de sesión
    async login(email, password) {
        initializeDatabase();

        // Simula una breve latencia de red
        await new Promise(resolve => setTimeout(resolve, 200));

        const users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
        const user = users.find(
            u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );

        if (!user) {
            throw new Error('Correo electrónico o contraseña incorrectos.');
        }

        const sessionData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: `fake-jwt-token-${Date.now()}`
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        return sessionData;
    }
};