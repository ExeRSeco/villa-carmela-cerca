import { authService } from '../../services/authService.js';

export const Login = () => {
    const containerId = 'login-container-' + Date.now();

    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const form = container.querySelector('#login-form');
        const errorMsg = container.querySelector('#login-error');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.email.value;
            const password = form.password.value;
            const btn = form.querySelector('button');

            try {
                btn.disabled = true;
                btn.textContent = 'Ingresando...';
                errorMsg.classList.add('hidden');

                await authService.login(email, password);
                // Hash change handled by authService logic or manual here if needed, 
                // but usually authService just does logic. 
                // Let's redirect here to be explicit
                window.navigateTo('/admin/dashboard');
            } catch (err) {
                console.error(err);
                errorMsg.textContent = 'Credenciales inválidas. Intente nuevamente.';
                errorMsg.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Ingresar';
            }
        });
    }, 0);

    return `
    <div id="${containerId}" class="min-h-[70vh] flex items-center justify-center animate-fade-in-up">
        <div class="bg-white p-8 rounded-xl shadow-lg border border-stone-100 w-full max-w-md">
            <div class="text-center mb-8">
                <div class="w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 font-headings">A</div>
                <h2 class="text-2xl font-bold font-headings text-stone-900">Acceso Administrativo</h2>
                <p class="text-stone-500 text-sm mt-2">Ingrese sus credenciales para continuar</p>
            </div>

            <form id="login-form" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1">Email</label>
                    <input type="email" name="email" required class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-stone-700 mb-1">Contraseña</label>
                    <input type="password" name="password" required class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                </div>
                
                <div id="login-error" class="hidden text-red-500 text-sm text-center bg-red-50 p-2 rounded"></div>

                <button type="submit" class="w-full bg-stone-900 text-white font-bold py-3 rounded-lg hover:bg-stone-800 transition-colors shadow-md">
                    Ingresar
                </button>
            </form>
            
            <div class="mt-6 text-center">
                 <a href="#" class="text-sm text-stone-400 hover:text-stone-600">Volver al inicio</a>
            </div>
        </div>
    </div>
    `;
};
