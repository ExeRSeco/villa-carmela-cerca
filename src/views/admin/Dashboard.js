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
                    <a href="/admin/categories" data-link class="bg-stone-100 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors font-medium flex items-center border border-stone-200">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Categorías
                    </a>
                        <a href="/admin/new" data-link class="bg-spa-600 text-white px-4 py-2 rounded-lg hover:bg-spa-500 transition-colors font-medium flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Nuevo Local
                        </a>
                        <button id="logout-btn" class="bg-stone-200 text-stone-600 px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors font-medium">
                            Salir
                        </button>
                    </div>
                </div>
                
                <!-- Search Bar -->
                <div class="mb-6 relative">
                    <input type="text" id="admin-search" placeholder="Buscar por nombre o categoría..." class="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none transition-shadow">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <!-- Desktop Table View -->
                <div class="hidden md:block bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
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
                                        <a href="/admin/edit/${b.id}" data-link class="text-spa-600 hover:text-spa-800 font-medium">Editar</a>
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

                <!-- Mobile Card View -->
                <div class="md:hidden space-y-4">
                    ${businesses.map(b => {
                // Reuse Logic
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
                        <div class="bg-white p-5 rounded-xl shadow-sm border border-stone-100 relative">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <span class="text-xs font-mono text-stone-400">ID: ${b.id}</span>
                                    <h3 class="text-lg font-bold text-stone-800">${escapeHTML(b.name)}</h3>
                                    <span class="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200 mt-1 inline-block">${escapeHTML(b.category)}</span>
                                </div>
                                <div class="flex flex-col items-end gap-1">
                                     <span class="px-2 py-1 rounded-full text-[10px] font-bold ${b.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                        ${b.isOpen ? 'Abierto' : 'Cerrado'}
                                    </span>
                                    ${b.isFeatured ? '<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Destacado</span>' : ''}
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-2 mb-4 text-xs">
                                <div class="bg-stone-50 p-2 rounded-lg">
                                    <p class="text-stone-400 uppercase tracking-wider text-[10px]">Membresía</p>
                                    <div class="flex items-center gap-2 mt-1">
                                         <span class="w-2 h-2 rounded-full ${userStatus === 'Activo' ? 'bg-green-500' : userStatus === 'Vencido' ? 'bg-stone-400' : 'bg-red-500'}"></span>
                                         <span class="font-bold text-stone-700">${userStatus}</span>
                                    </div>
                                    ${b.expirationDate ? `<p class="text-[10px] text-stone-400 mt-0.5">Vence: ${escapeHTML(b.expirationDate)}</p>` : ''}
                                </div>
                                <div class="bg-stone-50 p-2 rounded-lg">
                                    <p class="text-stone-400 uppercase tracking-wider text-[10px]">Contacto</p>
                                    <p class="text-stone-700 mt-1 font-medium truncate">${b.phone || '-'}</p>
                                </div>
                            </div>
                            
                            <div class="flex gap-2 pt-3 border-t border-stone-100">
                                <a href="/admin/edit/${b.id}" data-link class="flex-1 text-center bg-stone-100 text-spa-600 hover:bg-spa-50 py-2 rounded-lg text-sm font-bold transition-colors">Editar</a>
                                <button data-id="${b.id}" class="delete-btn flex-1 text-center bg-stone-100 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-bold transition-colors">Eliminar</button>
                            </div>
                        </div>
                        `;
            }).join('')}
                    ${businesses.length === 0 ? '<div class="p-8 text-center text-stone-400 bg-white rounded-xl shadow-sm border border-stone-100">No hay locales registrados.</div>' : ''}
                </div>
            </div>
            `;

            // Search Logic
            const searchInput = container.querySelector('#admin-search');
            const tableBox = container.querySelector('.hidden.md\\:block'); // Desktop container
            const tableBody = container.querySelector('tbody');
            const mobileContainer = container.querySelector('.md\\:hidden'); // Mobile container

            // Render Helper (Desktop)
            const renderTableRows = (data) => {
                if (data.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-stone-400">No se encontraron resultados.</td></tr>';
                    return;
                }
                tableBody.innerHTML = data.map(b => {
                    // Reuse Logic
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
                                <a href="/admin/edit/${b.id}" data-link class="text-spa-600 hover:text-spa-800 font-medium">Editar</a>
                                <button data-id="${b.id}" class="delete-btn text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                            </td>
                        </tr>
                        `;
                }).join('');
            };

            // Render Helper (Mobile)
            const renderMobileCards = (data) => {
                if (data.length === 0) {
                    mobileContainer.innerHTML = '<div class="p-8 text-center text-stone-400 bg-white rounded-xl shadow-sm border border-stone-100">No se encontraron resultados.</div>';
                    return;
                }
                mobileContainer.innerHTML = data.map(b => {
                    // Reuse Logic
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
                        <div class="bg-white p-5 rounded-xl shadow-sm border border-stone-100 relative">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <span class="text-xs font-mono text-stone-400">ID: ${b.id}</span>
                                    <h3 class="text-lg font-bold text-stone-800">${escapeHTML(b.name)}</h3>
                                    <span class="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200 mt-1 inline-block">${escapeHTML(b.category)}</span>
                                </div>
                                <div class="flex flex-col items-end gap-1">
                                     <span class="px-2 py-1 rounded-full text-[10px] font-bold ${b.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                        ${b.isOpen ? 'Abierto' : 'Cerrado'}
                                    </span>
                                    ${b.isFeatured ? '<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Destacado</span>' : ''}
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-2 mb-4 text-xs">
                                <div class="bg-stone-50 p-2 rounded-lg">
                                    <p class="text-stone-400 uppercase tracking-wider text-[10px]">Membresía</p>
                                    <div class="flex items-center gap-2 mt-1">
                                         <span class="w-2 h-2 rounded-full ${userStatus === 'Activo' ? 'bg-green-500' : userStatus === 'Vencido' ? 'bg-stone-400' : 'bg-red-500'}"></span>
                                         <span class="font-bold text-stone-700">${userStatus}</span>
                                    </div>
                                    ${b.expirationDate ? `<p class="text-[10px] text-stone-400 mt-0.5">Vence: ${escapeHTML(b.expirationDate)}</p>` : ''}
                                </div>
                                <div class="bg-stone-50 p-2 rounded-lg">
                                    <p class="text-stone-400 uppercase tracking-wider text-[10px]">Contacto</p>
                                    <p class="text-stone-700 mt-1 font-medium truncate">${b.phone || '-'}</p>
                                </div>
                            </div>
                            
                            <div class="flex gap-2 pt-3 border-t border-stone-100">
                                <a href="/admin/edit/${b.id}" data-link class="flex-1 text-center bg-stone-100 text-spa-600 hover:bg-spa-50 py-2 rounded-lg text-sm font-bold transition-colors">Editar</a>
                                <button data-id="${b.id}" class="delete-btn flex-1 text-center bg-stone-100 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-bold transition-colors">Eliminar</button>
                            </div>
                        </div>
                        `;
                }).join('');
            };

            const filterData = (term) => {
                const lowerTerm = term.toLowerCase();
                const filtered = businesses.filter(b =>
                    b.name.toLowerCase().includes(lowerTerm) ||
                    b.category.toLowerCase().includes(lowerTerm)
                );
                renderTableRows(filtered);
                renderMobileCards(filtered);
                attachDeleteListeners(); // Re-attach listeners after re-render
            };

            // Debounce simple
            let timeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => filterData(e.target.value.trim()), 300);
            });

            function attachDeleteListeners() {
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
            }

            // Initial attachment
            attachDeleteListeners();


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
