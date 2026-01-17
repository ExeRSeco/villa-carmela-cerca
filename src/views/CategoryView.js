import { dataService } from '../services/dataService.js';
import { Card } from '../components/Card.js';
import { escapeHTML } from '../utils.js';

export const CategoryView = async (categorySlug) => {
    // Show Loading
    const loadingHtml = `
    <div class="flex items-center justify-center min-h-[50vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-spa-600"></div>
    </div>`;

    // We can't return a promise resolving to string easily if we want to handle async inside main logic linearly.
    // simpler: return a container or HTML string after await. 
    // Since our router expects: mainContent.innerHTML = ... 
    // We should make this an async function that returns the HTML string.

    try {
        const [businesses, categories] = await Promise.all([
            dataService.getAll(),
            dataService.getCategories()
        ]);

        // Find the full category name from the slug? or just use exact match if slug is simple?
        // We need a way to match "farmacia-y-perfumeria" to "Farmacia y Perfumería".
        // Let's create a helper or just normalize both sides.

        const normalize = (str) => str.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').replace(/[^a-z0-9]/g, '-');

        // Find category name match
        const categoryName = categories.find(c => normalize(c) === categorySlug);

        if (!categoryName) {
            return `
            <div class="text-center py-20 px-4">
                <div class="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-stone-800 mb-2">Categoría no encontrada</h2>
                <p class="text-stone-500 mb-8">Lo sentimos, no pudimos encontrar la categoría que buscas.</p>
                <a href="/" data-link class="inline-flex items-center gap-2 text-spa-600 font-bold hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al inicio
                </a>
            </div>
            `;
        }

        // Filter businesses
        const filtered = businesses.filter(b => b.category === categoryName);

        // Render
        const cardsHtml = filtered.length > 0
            ? filtered.map(b => Card(b)).join('')
            : `<div class="col-span-full text-center text-stone-500 py-10 w-full">No hay negocios registrados en esta categoría aún.</div>`;

        return `
        <div class="animate-fade-in-up">
             <!-- Header -->
             <div class="flex items-center gap-4 mb-8">
                <a href="/" data-link class="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </a>
                <div>
                     <span class="text-sm font-bold text-spa-600 uppercase tracking-widest">Categoría</span>
                     <h1 class="text-3xl font-headings font-bold text-stone-900 mb-2">${escapeHTML(categoryName)}</h1>
                     <p class="text-stone-500 max-w-2xl">Explorá todas las opciones de <span class="font-bold text-stone-700">${escapeHTML(categoryName)}</span> en Villa Carmela. Información actualizada, horarios y comercios destacados.</p>
                </div>
             </div>

             <!-- Grid -->
             <section aria-label="Listado de comercios" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                ${cardsHtml}
             </section>
             
             <!-- Banner Bottom -->
             <div class="bg-gradient-to-r from-spa-600 to-spa-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-lg">
                <div class="relative z-10 max-w-2xl mx-auto">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">¿Tu negocio es de este rubro?</h2>
                    <p class="text-spa-100 mb-8 text-lg">Sumate a la guía más completa de Villa Carmela y llegá a más clientes.</p>
                    <a href="/contact" data-link class="inline-block bg-white text-spa-600 font-bold px-8 py-3 rounded-full hover:bg-stone-50 transition-colors shadow-lg">
                        Registrar mi negocio
                    </a>
                </div>
                 <div class="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mt-16"></div>
                 <div class="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mb-16"></div>
             </div>

        </div>
        `;

    } catch (e) {
        console.error(e);
        return `<div class="text-center text-red-500 p-10">Error cargando la categoría.</div>`;
    }
};
