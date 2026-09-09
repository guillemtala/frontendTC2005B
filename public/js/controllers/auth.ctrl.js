import { AuthModel } from '../models/auth.model.js';

document.addEventListener('DOMContentLoaded', () => {
    // Si hay sesión activa, salta al dashboard. Si no hay (tras logout), se queda aquí.
    const activeUser = AuthModel.getCurrentUser();
    if (activeUser) {
        window.location.replace('/pages/main.html');
        return;
    }

    const loginForm = document.getElementById('login-form');
    const errorAlert = document.getElementById('login-error');
    const submitBtn = document.getElementById('btn-submit-login');

    if (loginForm) {
        loginForm.addEventListener('submit', async(e) => {
            e.preventDefault();

            const email = document.getElementById('input-email').value;
            const password = document.getElementById('input-password').value;

            // Ocultar errores previos y bloquear botón durante el proceso
            if (errorAlert) errorAlert.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Iniciando sesión...';

            try {
                await AuthModel.login(email, password);
                window.location.href = '/pages/main.html';
            } catch (err) {
                if (errorAlert) {
                    errorAlert.textContent = err.message;
                    errorAlert.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Iniciar Sesión';
            }
        });
    }
});