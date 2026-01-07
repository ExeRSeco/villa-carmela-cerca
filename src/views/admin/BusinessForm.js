import { dataService } from '../../services/dataService.js';
import { escapeHTML } from '../../utils.js';

export const BusinessForm = (id = null) => {
    const containerId = 'business-form-' + Date.now();

    setTimeout(async () => {
        const container = document.getElementById(containerId);
        if (!container) return;

        let business = {
            name: '',
            category: '',
            phone: '',
            whatsapp: '',
            address: '',
            image: '',
            isOpen: true,
            isFeatured: false,
            delivery: false,
            isPaid: false,
            startDate: '',
            expirationDate: '',
            hours: [],
            tags: [],
            paymentMethods: [],
            promotions: ''
        };

        let categories = [];

        try {
            // Fetch Data
            const promises = [dataService.getCategories()];
            if (id) promises.push(dataService.getById(id));

            const results = await Promise.all(promises);
            categories = results[0];
            if (id && results[1]) {
                business = { ...business, ...results[1] };
            }

            // Default category
            if (!business.category && categories.length > 0) business.category = categories[0];

            // Render Form
            container.innerHTML = `
            <div class="max-w-3xl mx-auto animate-fade-in-up mb-10">
                <div class="flex items-center mb-6">
                    <a href="#admin/dashboard" class="text-stone-500 hover:text-stone-800 mr-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </a>
                    <h2 class="text-2xl font-bold font-headings text-stone-900">${id ? 'Editar Local' : 'Nuevo Local'}</h2>
                </div>

                <form id="business-form" class="bg-white p-8 rounded-xl shadow-lg border border-stone-100 space-y-8">
                    
                    <!-- Basic Info -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Información Básica</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                                <input type="text" name="name" value="${escapeHTML(business.name)}" required class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Categoría</label>
                                <select name="category" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                                    ${categories.map(cat => `<option value="${escapeHTML(cat)}" ${business.category === cat ? 'selected' : ''}>${escapeHTML(cat)}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-stone-700 mb-1">Imagen del Local</label>
                            <div class="flex items-center gap-4">
                                ${business.image ? `<img src="${business.image}" alt="Preview" class="h-16 w-16 object-cover rounded-lg border border-stone-200">` : ''}
                                <div class="flex-1">
                                    <input type="file" name="imageFile" accept="image/*" class="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-spa-50 file:text-spa-700 hover:file:bg-spa-100 transition-colors">
                                    <input type="hidden" name="existingImage" value="${business.image || ''}">
                                    <p class="text-xs text-stone-400 mt-1">Sube una nueva imagen para reemplazar la actual.</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Dirección</label>
                                <input type="text" name="address" value="${escapeHTML(business.address || '')}" required class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Teléfono</label>
                                <input type="text" name="phone" value="${escapeHTML(business.phone || '')}" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">WhatsApp (Número limpio)</label>
                                <input type="text" name="whatsapp" value="${escapeHTML(business.whatsapp || '')}" placeholder="54911..." class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Etiquetas (separadas por coma)</label>
                                <input type="text" name="tags" value="${escapeHTML(business.tags ? business.tags.join(', ') : '')}" placeholder="Pizza, Empanadas..." class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                            </div>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="space-y-6">
                        <h3 class="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">Detalles y Estado</h3>
                        <div>
                            <label class="block text-sm font-medium text-stone-700 mb-1">Horarios (Una línea por ítem)</label>
                            <textarea name="hours" rows="3" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">${escapeHTML(Array.isArray(business.hours) ? business.hours.join('\n') : (business.hours || ''))}</textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-stone-700 mb-1">Medios de Pago (separados por coma)</label>
                            <input type="text" name="paymentMethods" value="${escapeHTML(business.paymentMethods ? business.paymentMethods.join(', ') : '')}" placeholder="Efectivo, Tarjeta..." class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-stone-700 mb-1">Promoción (Texto o vacio)</label>
                            <input type="text" name="promotions" value="${escapeHTML(business.promotions || '')}" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                        </div>

                        <div class="flex gap-6 pt-2">
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" name="isOpen" ${business.isOpen ? 'checked' : ''} class="w-4 h-4 text-spa-600 rounded focus:ring-spa-500">
                                <span class="text-stone-700">Abierto Ahora</span>
                            </label>
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" name="delivery" ${business.delivery ? 'checked' : ''} class="w-4 h-4 text-spa-600 rounded focus:ring-spa-500">
                                <span class="text-stone-700">Tiene Delivery</span>
                            </label>
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" name="isFeatured" ${business.isFeatured ? 'checked' : ''} class="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500">
                                <span class="text-stone-700 font-bold">Destacado</span>
                            </label>
                        </div>
                    </div>

                    <!-- Membership -->
                    <div class="space-y-6 bg-stone-50 p-6 rounded-lg border border-stone-200">
                        <h3 class="text-lg font-bold text-stone-800 pb-2">Membresía</h3>
                        
                        <div class="flex gap-6 mb-4">
                            <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" name="isPaid" ${business.isPaid ? 'checked' : ''} class="w-5 h-5 text-green-600 rounded focus:ring-green-500">
                                <span class="text-stone-900 font-bold">Membresía Pagada</span>
                            </label>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Fecha Inicio (Alta)</label>
                                <input type="date" name="startDate" value="${business.startDate || ''}" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Fecha Vencimiento</label>
                                <input type="date" name="expirationDate" value="${business.expirationDate || ''}" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                            </div>
                        </div>
                    </div>

                    <div class="pt-6 border-t border-stone-100 flex justify-end gap-3">
                        <a href="#admin/dashboard" class="px-6 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold">Cancelar</a>
                        <button type="submit" class="px-6 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 font-bold shadow-lg">Guardar Local</button>
                    </div>

                </form>
            </div>
            `;

            const form = document.getElementById('business-form');

            // Auto-calculate expiration logic
            const startDateInput = form.querySelector('[name="startDate"]');
            const expirationDateInput = form.querySelector('[name="expirationDate"]');

            startDateInput.addEventListener('change', (e) => {
                if (e.target.value && !expirationDateInput.value) {
                    const start = new Date(e.target.value);
                    const end = new Date(start);
                    end.setDate(start.getDate() + 30); // Add 30 days
                    expirationDateInput.value = end.toISOString().split('T')[0];
                }
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const btn = form.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.textContent = 'Guardando...';

                const tags = formData.get('tags').split(',').map(s => s.trim()).filter(s => s);
                const hours = formData.get('hours').split('\n').map(s => s.trim()).filter(s => s);
                const paymentMethods = formData.get('paymentMethods').split(',').map(s => s.trim()).filter(s => s);

                // Handle Image Upload
                let imageUrl = formData.get('existingImage');
                const imageFile = formData.get('imageFile');

                try {
                    if (imageFile && imageFile.size > 0) {
                        btn.textContent = 'Subiendo imagen...';
                        imageUrl = await dataService.uploadImage(imageFile);
                    }

                    const newItem = {
                        id: id ? Number(id) : null,
                        name: formData.get('name'),
                        category: formData.get('category'),
                        phone: formData.get('phone'),
                        whatsapp: formData.get('whatsapp'),
                        address: formData.get('address'),
                        image: imageUrl,
                        isOpen: formData.get('isOpen') === 'on',
                        isFeatured: formData.get('isFeatured') === 'on',
                        delivery: formData.get('delivery') === 'on',
                        isPaid: formData.get('isPaid') === 'on',
                        startDate: formData.get('startDate'),
                        expirationDate: formData.get('expirationDate'),
                        promotions: formData.get('promotions') || null,
                        tags,
                        hours,
                        paymentMethods
                    };

                    btn.textContent = 'Guardando...';
                    await dataService.save(newItem);
                    window.location.hash = '#admin/dashboard';
                } catch (err) {
                    alert('Error: ' + err.message);
                    btn.disabled = false;
                    btn.textContent = 'Guardar Local';
                    console.error(err);
                }
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
