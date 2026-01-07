import { dataService } from '../../services/dataService.js';
import { authService } from '../../services/authService.js';
import { escapeHTML } from '../../utils.js';

export const Dashboard = () => {
    // Unique ID for this render to attach listeners
    const containerId = 'dashboard-container-' + Date.now();

    // ... existing timeouts and fetch logic ...

    setTimeout(async () => {
        // ... (existing container check) ...
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const businesses = await dataService.getAll();

            // ... (render header) ...
            container.innerHTML = `
            <div class="animate-fade-in-up">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-3xl font-bold font-headings text-stone-900">Panel de Control</h2>
                    <div class="flex gap-4">
                    <a href="#admin/categories" class="bg-stone-100 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors font-medium flex items-center border border-stone-200">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Categorías
                    </a>
                        <a href="#admin/new" class="bg-spa-600 text-white px-4 py-2 rounded-lg hover:bg-spa-500 transition-colors font-medium flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Nuevo Local
                        </a>
                        <button id="logout-btn" class="bg-stone-200 text-stone-600 px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors font-medium">
                            Salir
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-stone-600">
                            <thead class="bg-stone-50 text-stone-900 font-bold border-b border-stone-200">
                                <tr>
                                    <th class="px-6 py-4">ID</th>
                                    <th class="px-6 py-4">Nombre</th>
                                    <th class="px-6 py-4">Categoría</th>
                                    <th class="px-6 py-4">Membresía</th>
                                    <th class="px-6 py-4">Estado</th>
                                    <th class="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-stone-100">
                                ${businesses.map(b => {
                // Membership Logic
                const now = new Date();
                const exp = b.expirationDate ? new Date(b.expirationDate) : null;
                const isExpired = exp && exp < now;
                let userStatus = '';
                let userStatusClass = '';

                if (!b.isPaid) {
                    userStatus = 'Pendiente';
                    userStatusClass = 'bg-red-100 text-red-700';
                } else if (isExpired) {
                    userStatus = 'Vencido';
                    userStatusClass = 'bg-stone-200 text-stone-600';
                } else {
                    userStatus = 'Activo';
                    userStatusClass = 'bg-green-100 text-green-700';
                }

                return `
                                <tr class="hover:bg-stone-50">
                                    <td class="px-6 py-4 font-mono text-xs">${b.id}</td>
                                    <td class="px-6 py-4 font-semibold text-stone-800">${escapeHTML(b.name)}</td>
                                    <td class="px-6 py-4">
                                        <span class="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs border border-stone-200">${escapeHTML(b.category)}</span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex flex-col items-start">
                                            <span class="px-2 py-0.5 rounded text-xs font-bold mb-1 ${userStatusClass}">${userStatus}</span>
                                            ${b.expirationDate ? `<span class="text-[10px] text-stone-400">Vence: ${escapeHTML(b.expirationDate)}</span>` : ''}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 rounded-full text-xs font-bold ${b.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                            ${b.isOpen ? 'Abierto' : 'Cerrado'}
                                        </span>
                                        ${b.isFeatured ? '<span class="ml-2 px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Destacado</span>' : ''}
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-2">
                                        <a href="#admin/edit/${b.id}" class="text-spa-600 hover:text-spa-800 font-medium">Editar</a>
                                        <button data-id="${b.id}" class="delete-btn text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                                    </td>
                                </tr>
                                `;
            }).join('')}
                            </tbody>
                        </table>
                         ${businesses.length === 0 ? '<div class="p-8 text-center text-stone-400">No hay locales registrados.</div>' : ''}
                    </div>
                </div>
            </div>
            `;

            // Attach Listeners
            container.querySelector('#logout-btn').addEventListener('click', async () => {
                await authService.logout();
            });

            container.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    if (confirm('¿Estás seguro de eliminar este local?')) {
                        const id = e.target.dataset.id;
                        try {
                            await dataService.delete(id);
                            // Reload current view
                            window.location.reload();
                        } catch (err) {
                            alert('Error al eliminar');
                            console.error(err);
                        }
                    }
                });
            });

        } catch (err) {
            container.innerHTML = `<div class="p-10 text-center text-red-500">Error cargando panel: ${err.message}</div>`;
        }
    }, 0);

    return `
    <div id="${containerId}" class="min-h-[50vh]">
        <div class="flex items-center justify-center h-64">
             <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-spa-600"></div>
        </div>
    </div>
    `;
};
