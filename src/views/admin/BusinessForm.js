import { dataService } from '../../services/dataService.js';
import { escapeHTML, generateSlug } from '../../utils.js';
import Swal from 'sweetalert2';

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

            // Parse Hours (Support v3 and migration from v2)
            let hoursData = {
                is24Hours: false,
                weekdays: { s1s: '', s1e: '', s2s: '', s2e: '' },
                saturday: { s1s: '', s1e: '', s2s: '', s2e: '' },
                sunday: { s1s: '', s1e: '', s2s: '', s2e: '' }
            };

            if (business.hours) {
                if (business.hours.is24Hours) {
                    hoursData.is24Hours = true;
                }

                if (business.hours.format === 'v3') {
                    const mapShifts = (shifts) => ({
                        s1s: shifts[0]?.start || '', s1e: shifts[0]?.end || '',
                        s2s: shifts[1]?.start || '', s2e: shifts[1]?.end || ''
                    });
                    hoursData.weekdays = mapShifts(business.hours.weekdays?.shifts || []);
                    hoursData.saturday = mapShifts(business.hours.saturday?.shifts || []);
                    hoursData.sunday = mapShifts(business.hours.sunday?.shifts || []);
                } else if (business.hours.format === 'v2' || Array.isArray(business.hours.shifts)) {
                    // Migrate v2 -> v3 (Apply same schedule to all)
                    const mapShifts = (shifts) => ({
                        s1s: shifts[0]?.start || '', s1e: shifts[0]?.end || '',
                        s2s: shifts[1]?.start || '', s2e: shifts[1]?.end || ''
                    });
                    const common = mapShifts(business.hours.shifts || []);
                    hoursData.weekdays = { ...common };
                    hoursData.saturday = { ...common };
                    hoursData.sunday = { ...common };
                }
            }

            // Render Form
            container.innerHTML = `
            <div class="max-w-3xl mx-auto animate-fade-in-up mb-10">
                <div class="flex items-center mb-6">
                    <a href="/admin/dashboard" data-link class="text-stone-500 hover:text-stone-800 mr-4">
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
                                <div class="flex gap-2">
                                    <select name="category" id="category-select" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                                        ${categories.map(cat => `<option value="${escapeHTML(cat)}" ${business.category === cat ? 'selected' : ''}>${escapeHTML(cat)}</option>`).join('')}
                                    </select>
                                    <button type="button" id="add-category-btn" class="bg-stone-100 text-stone-600 px-3 rounded-lg border border-stone-200 hover:bg-stone-200 transition-colors" title="Nueva Categoría">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
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
                                <label class="block text-sm font-medium text-stone-700 mb-1">WhatsApp (Solo números)</label>
                                <input type="text" name="whatsapp" value="${escapeHTML(business.whatsapp || '')}" placeholder="381..." class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                            </div>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="space-y-6">
                        <div class="flex justify-between items-center border-b border-stone-100 pb-2">
                             <h3 class="text-lg font-bold text-stone-800">Horarios y Atención</h3>
                             <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" name="is24Hours" id="is24Hours-check" ${hoursData.is24Hours ? 'checked' : ''} class="w-4 h-4 text-spa-600 rounded focus:ring-spa-500">
                                <span class="text-stone-700 font-bold text-sm">Abierto 24 Horas</span>
                            </label>
                        </div>
                        
                        <div id="hours-inputs" class="space-y-6 transition-opacity duration-300 ${hoursData.is24Hours ? 'opacity-50 pointer-events-none' : ''}">
                             
                             <!-- Lunes a Viernes -->
                             <div class="bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <h4 class="font-bold text-stone-800 mb-3 border-b border-stone-200 pb-1">Lunes a Viernes</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-stone-600 mb-1">Turno 1</label>
                                        <div class="flex gap-2 items-center">
                                            <input type="time" name="wd_s1s" value="${hoursData.weekdays.s1s}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                            <span class="text-stone-400">-</span>
                                            <input type="time" name="wd_s1e" value="${hoursData.weekdays.s1e}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-stone-600 mb-1">Turno 2 (Opcional)</label>
                                        <div class="flex gap-2 items-center">
                                            <input type="time" name="wd_s2s" value="${hoursData.weekdays.s2s}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                            <span class="text-stone-400">-</span>
                                            <input type="time" name="wd_s2e" value="${hoursData.weekdays.s2e}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                        </div>
                                    </div>
                                </div>
                             </div>

                             <!-- Sabados -->
                             <div class="bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <h4 class="font-bold text-stone-800 mb-3 border-b border-stone-200 pb-1">Sábados</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-stone-600 mb-1">Turno 1</label>
                                        <div class="flex gap-2 items-center">
                                            <input type="time" name="sat_s1s" value="${hoursData.saturday.s1s}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                            <span class="text-stone-400">-</span>
                                            <input type="time" name="sat_s1e" value="${hoursData.saturday.s1e}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-stone-600 mb-1">Turno 2 (Opcional)</label>
                                        <div class="flex gap-2 items-center">
                                            <input type="time" name="sat_s2s" value="${hoursData.saturday.s2s}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                            <span class="text-stone-400">-</span>
                                            <input type="time" name="sat_s2e" value="${hoursData.saturday.s2e}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                        </div>
                                    </div>
                                </div>
                             </div>

                             <!-- Domingos -->
                             <div class="bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <div class="flex justify-between items-center mb-3 border-b border-stone-200 pb-1">
                                    <h4 class="font-bold text-stone-800">Domingos y Feriados</h4>
                                    <label class="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" id="openSundays-check" ${hoursData.sunday.s1s || hoursData.sunday.s2s ? 'checked' : ''} class="w-4 h-4 text-spa-600 rounded focus:ring-spa-500">
                                        <span class="text-xs font-bold text-stone-600">Abrir Domingos</span>
                                    </label>
                                </div>
                                <div id="sunday-inputs" class="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${hoursData.sunday.s1s || hoursData.sunday.s2s ? '' : 'opacity-50 pointer-events-none grayscale'}">
                                    <div>
                                        <label class="block text-xs font-bold text-stone-600 mb-1">Turno 1</label>
                                        <div class="flex gap-2 items-center">
                                            <input type="time" name="sun_s1s" value="${hoursData.sunday.s1s}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                            <span class="text-stone-400">-</span>
                                            <input type="time" name="sun_s1e" value="${hoursData.sunday.s1e}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-stone-600 mb-1">Turno 2 (Opcional)</label>
                                        <div class="flex gap-2 items-center">
                                            <input type="time" name="sun_s2s" value="${hoursData.sunday.s2s}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                            <span class="text-stone-400">-</span>
                                            <input type="time" name="sun_s2e" value="${hoursData.sunday.s2e}" class="w-full px-2 py-1.5 rounded border border-stone-300 focus:ring-1 focus:ring-spa-400">
                                        </div>
                                    </div>
                                </div>
                             </div>

                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-stone-700 mb-1">Medios de Pago (separados por coma)</label>
                            <input type="text" name="paymentMethods" value="${escapeHTML(business.paymentMethods ? business.paymentMethods.join(', ') : '')}" placeholder="Efectivo, Tarjeta..." class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-stone-700 mb-1">Promoción (Texto o vacio)</label>
                            <input type="text" name="promotions" value="${escapeHTML(business.promotions || '')}" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-stone-700 mb-1">Breve Descripción (Aparece en la tarjeta - Máx 160 caracteres)</label>
                            <textarea name="description" maxlength="160" rows="2" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none resize-none" placeholder="Ej: Venta de accesorios, ropa y complementos...">${escapeHTML(business.description || '')}</textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-stone-700 mb-1">Aclaraciones (Opcional - Máx 150 caracteres)</label>
                            <textarea name="clarification" maxlength="150" rows="2" class="w-full px-4 py-2 rounded-lg border border-stone-200 focus:ring-2 focus:ring-spa-400 focus:outline-none resize-none" placeholder="Ej: Solo con reservas, No aceptamos mascotas...">${escapeHTML(business.clarification || '')}</textarea>
                        </div>

                        <div class="flex gap-6 pt-2">
                             <label class="flex items-center space-x-2 cursor-pointer" title="Marcar para forzar estado Abierto si es feriado o fuera de hora">
                                <input type="checkbox" name="isOpen" ${business.isOpen ? 'checked' : ''} class="w-4 h-4 text-green-600 rounded focus:ring-green-500">
                                <span class="text-stone-700">Forzar "Abierto"</span>
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
                        <a href="/admin/dashboard" data-link class="px-6 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold">Cancelar</a>
                        <button type="submit" class="px-6 py-2 rounded-lg bg-stone-900 text-white hover:bg-stone-800 font-bold shadow-lg">Guardar Local</button>
                    </div>

                </form>
            </div>
            `;

            const form = document.getElementById('business-form');

            // 24H Toggle
            const is24HoursCheck = form.querySelector('#is24Hours-check');
            const hoursInputs = form.querySelector('#hours-inputs');

            is24HoursCheck.addEventListener('change', (e) => {
                if (e.target.checked) {
                    hoursInputs.classList.add('opacity-50', 'pointer-events-none');
                } else {
                    hoursInputs.classList.remove('opacity-50', 'pointer-events-none');
                }
            });

            // Sunday Toggle
            const openSundaysCheck = form.querySelector('#openSundays-check');
            const sundayInputs = form.querySelector('#sunday-inputs');

            openSundaysCheck.addEventListener('change', (e) => {
                if (!e.target.checked) {
                    sundayInputs.classList.add('opacity-50', 'pointer-events-none', 'grayscale');
                    // Optional: Clear values instantly or just on save? 
                    // Let's clear on save so user can toggle back without losing data immediately
                } else {
                    sundayInputs.classList.remove('opacity-50', 'pointer-events-none', 'grayscale');
                }
            });

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

                // Construct V3 Hours Object
                const getShifts = (p1, p2, p3, p4) => {
                    const shifts = [];
                    const s1s = formData.get(p1);
                    const s1e = formData.get(p2);
                    const s2s = formData.get(p3);
                    const s2e = formData.get(p4);

                    if (s1s && s1e) shifts.push({ start: s1s, end: s1e });
                    if (s2s && s2e) shifts.push({ start: s2s, end: s2e });
                    return shifts;
                };

                const wdShifts = getShifts('wd_s1s', 'wd_s1e', 'wd_s2s', 'wd_s2e');
                const satShifts = getShifts('sat_s1s', 'sat_s1e', 'sat_s2s', 'sat_s2e');
                // Only save Sunday shifts if checkbox is checked
                const sunShifts = openSundaysCheck.checked ? getShifts('sun_s1s', 'sun_s1e', 'sun_s2s', 'sun_s2e') : [];

                // Generate compact display string (e.g. "L-V: 9-13 | Sab: 9-13")
                // Only simple generation here, component does smart rendering
                const formatShifts = (shifts) => shifts.map(s => `${s.start}-${s.end}`).join('/');
                const parts = [];
                if (wdShifts.length) parts.push(`L-V: ${formatShifts(wdShifts)}`);
                if (satShifts.length) parts.push(`Sab: ${formatShifts(satShifts)}`);
                if (sunShifts.length) parts.push(`Dom: ${formatShifts(sunShifts)}`);

                let hoursV3;
                if (is24HoursCheck.checked) {
                    hoursV3 = {
                        format: 'v3',
                        is24Hours: true,
                        display: 'Abierto las 24hs'
                    };
                } else {
                    hoursV3 = {
                        format: 'v3',
                        is24Hours: false,
                        weekdays: { shifts: wdShifts },
                        saturday: { shifts: satShifts },
                        sunday: { shifts: sunShifts },
                        display: parts.length > 0 ? parts.join(' | ') : 'Consultar'
                    };
                }

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
                        // Phone removed
                        whatsapp: formData.get('whatsapp'),
                        address: formData.get('address'),
                        image: imageUrl,
                        isOpen: formData.get('isOpen') === 'on',
                        isFeatured: formData.get('isFeatured') === 'on',
                        delivery: formData.get('delivery') === 'on',
                        isPaid: formData.get('isPaid') === 'on',
                        startDate: formData.get('startDate'),
                        expirationDate: formData.get('expirationDate'),
                        description: formData.get('description') || null,
                        promotions: formData.get('promotions') || null,
                        clarification: formData.get('clarification') || null,
                        hours: hoursV3,
                        hours: hoursV3,
                        paymentMethods,
                        // Generate slug if new or name changed (simplified: always regenerate on save from name)
                        // Ideally we check if name changed, but unique constraint might fail if we don't handle collisions.
                        // For simplicity, we trust the user won't create duplicates or the DB error will catch it.
                        // In a real app we'd check availability.
                        slug: business.slug && business.name === formData.get('name') ? business.slug : generateSlug(formData.get('name'))
                    };

                    btn.textContent = 'Guardando...';
                    await dataService.save(newItem);
                    window.navigateTo('/admin/dashboard');
                } catch (err) {
                    alert('Error: ' + err.message);
                    btn.disabled = false;
                    btn.textContent = 'Guardar Local';
                    console.error(err);
                }
            });

            // Add Category Logic
            const addCategoryBtn = container.querySelector('#add-category-btn');
            const categorySelect = container.querySelector('#category-select');

            addCategoryBtn.addEventListener('click', async () => {
                const { value: newCategory } = await Swal.fire({
                    title: 'Nueva Categoría',
                    input: 'text',
                    inputLabel: 'Nombre de la categoría',
                    inputPlaceholder: 'Ej: Farmacias',
                    showCancelButton: true,
                    confirmButtonText: 'Crear',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#10b981', // green-500
                    cancelButtonColor: '#78716c',  // stone-500
                    inputValidator: (value) => {
                        if (!value) {
                            return '¡Debes escribir un nombre!';
                        }
                    }
                });

                if (newCategory) {
                    try {
                        await dataService.addCategory(newCategory.trim());

                        // Refresh categories
                        const updatedCategories = await dataService.getCategories();

                        // Re-render options
                        categorySelect.innerHTML = updatedCategories.map(cat =>
                            `<option value="${escapeHTML(cat)}" ${cat === newCategory.trim() ? 'selected' : ''}>${escapeHTML(cat)}</option>`
                        ).join('');

                        Swal.fire({
                            icon: 'success',
                            title: '¡Categoría creada!',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000
                        });

                    } catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: err.message
                        });
                    }
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
