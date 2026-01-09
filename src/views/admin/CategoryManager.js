import { dataService } from '../../services/dataService.js';

export const CategoryManager = () => {
    const containerId = 'category-manager-' + Date.now();

    setTimeout(async () => {
        const container = document.getElementById(containerId);
        if (!container) return;

        let categories = [];
        try {
            categories = await dataService.getCategories();

            // Render
            container.innerHTML = `
            <div class="max-w-4xl mx-auto animate-fade-in-up">
                <div class="flex items-center mb-8">
                    <a href="/admin/dashboard" data-link class="text-stone-500 hover:text-stone-800 mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </a>
                    <h2 class="text-3xl font-bold font-headings text-stone-900">Gestionar Categorías</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- List -->
                    <div class="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
                        <div class="p-4 bg-stone-50 border-b border-stone-200 font-bold text-stone-700">
                            Categorías Existentes
                        </div>
                        <ul class="divide-y divide-stone-100">
                            ${categories.map(cat => `
                            <li class="flex justify-between items-center p-4 hover:bg-stone-50">
                                <span class="text-stone-700">${cat}</span>
                                <button data-name="${cat}" class="delete-cat-btn text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors">
                                    Eliminar
                                </button>
                            </li>
                            `).join('')}
                        </ul>
                        ${categories.length === 0 ? '<div class="p-4 text-stone-400 text-center text-sm">No hay categorías.</div>' : ''}
                    </div>

                    <!-- Add Form -->
                    <div class="h-fit">
                        <div class="bg-white p-6 rounded-xl shadow-lg border border-stone-100 relative overflow-hidden">
                             <h3 class="text-xl font-bold font-headings text-stone-800 mb-4">Nueva Categoría</h3>
                             <form id="add-category-form" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                                    <input type="text" name="categoryName" placeholder="Ej: Gimnasios" required class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                                </div>
                                <button type="submit" class="w-full bg-stone-900 text-white font-bold py-3 rounded-lg hover:bg-stone-800 transition-colors shadow-md">
                                    Agregar
                                </button>
                             </form>
                             
                             <div class="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-800">
                                <p class="font-bold mb-1">Nota:</p>
                                <p>Eliminar una categoría no elimina los negocios asociados, pero estos podrían dejar de aparecer en los filtros hasta que se les asigne una nueva categoría válida.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            // Logic
            const form = document.getElementById('add-category-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = form.categoryName.value.trim();
                if (name) {
                    try {
                        await dataService.addCategory(name);
                        window.location.reload();
                    } catch (err) {
                        alert('Error agregando categoría');
                    }
                }
            });

            // Delete Category
            document.querySelectorAll('.delete-cat-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const name = e.target.dataset.name;
                    if (confirm(`¿Eliminar categoría "${name}"?`)) {
                        try {
                            await dataService.deleteCategory(name);
                            window.location.reload();
                        } catch (err) {
                            alert('Error eliminando categoría');
                        }
                    }
                });
            });

        } catch (err) {
            container.innerHTML = `<div class="p-10 text-center text-red-500">Error: ${err.message}</div>`;
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
