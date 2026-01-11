import { LocationIcon, PhoneIcon, getSmartStatus } from './Card.js';
import { escapeHTML } from '../utils.js';

export const Modal = (data) => {
    const safeName = escapeHTML(data.name);
    const safeCategory = escapeHTML(data.category);
    const safeAddress = escapeHTML(data.address);
    const safePhone = escapeHTML(data.phone);
    const safeWhatsapp = escapeHTML(data.whatsapp);
    const safePromotions = escapeHTML(data.promotions);

    const smartStatus = getSmartStatus(data.hours, data.isOpen);

    let hoursHtml = '';
    if (data.hours?.format === 'v3') {
        const renderShift = (shifts) => shifts && shifts.length ? shifts.map(s => `${s.start} - ${s.end}`).join(' / ') : 'Cerrado';
        hoursHtml = `
        <div class="grid grid-cols-[min-content_1fr] gap-x-3 gap-y-1 text-sm text-stone-600 mt-1">
            <span class="font-medium text-stone-700 whitespace-nowrap">Lun-Vie:</span>
            <span>${renderShift(data.hours.weekdays?.shifts)}</span>
            
            <span class="font-medium text-stone-700 whitespace-nowrap">Sábado:</span>
            <span>${renderShift(data.hours.saturday?.shifts)}</span>
            
            <span class="font-medium text-stone-700 whitespace-nowrap">Domingo:</span>
            <span>${renderShift(data.hours.sunday?.shifts)}</span>
        </div>`;
    } else {
        hoursHtml = `
         <div class="text-sm text-stone-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-spa-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${data.hours && data.hours.display ? escapeHTML(data.hours.display) : 'Consultar'}
        </div>`;
    }

    return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" id="business-modal">
        <div class="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity opacity-0" id="modal-backdrop"></div>
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 scale-95 opacity-0 transition-all duration-300">
            
            <!-- Close Button -->
            <button class="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow-sm" id="modal-close">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <!-- Hero Image -->
            <div class="h-64 relative">
                <img src="${data.image}" alt="${safeName}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-6 left-6 text-white">
                    <span class="bg-spa-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                        ${safeCategory}
                    </span>
                    <h2 class="text-3xl md:text-4xl font-headings font-bold">${safeName}</h2>
                </div>
            </div>

            <!-- Content -->
            <div class="p-6 md:p-8 space-y-8">
                
                <!-- Info Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <!-- Basic Info -->
                    <div class="space-y-4">
                        
                         <div class="flex items-start gap-3 text-stone-600">
                            <span class="text-spa-400 mt-1">${LocationIcon()}</span>
                            <span>${safeAddress}</span>
                        </div>

                         <div class="flex items-center gap-3 text-stone-600">
                            <span class="text-spa-400 mt-1">${PhoneIcon()}</span>
                            <span>${safeWhatsapp || safePhone}</span>
                        </div>
                        
                        <div class="flex items-center gap-2">
                             <div class="w-2 h-2 rounded-full ${smartStatus.text === 'Abierto' ? 'bg-green-500' : smartStatus.text === 'Cerrado' ? 'bg-stone-400' : 'bg-yellow-500'}"></div>
                             <span class="text-sm font-medium ${smartStatus.class}">
                                ${smartStatus.text}
                             </span>
                        </div>

                         <!-- Clarification Section -->
                         ${data.clarification ? `
                         <div class="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-2 text-sm text-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                            </svg>
                            <p>${escapeHTML(data.clarification)}</p>
                         </div>
                         ` : ''}
                    </div>

                    <!-- Hours & Tags -->
                    <div class="bg-stone-50 rounded-xl p-5 border border-stone-100">
                        <h4 class="font-bold text-stone-800 mb-3">Horarios</h4>
                        <div class="space-y-1">
                             ${hoursHtml}
                        </div>
                        <div class="mt-4 flex flex-wrap gap-2">
                            ${(data.tags && Array.isArray(data.tags)) ? data.tags.map(tag => `<span class="text-xs bg-white border border-stone-200 px-2 py-1 rounded-md text-stone-500">${escapeHTML(tag)}</span>`).join('') : ''}
                        </div>
                    </div>
                </div>

                <!-- Promotions Section -->
                ${data.promotions ? `
                <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-5 flex items-start gap-4">
                     <div class="bg-yellow-100 p-2 rounded-full text-yellow-600 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                     </div>
                     <div>
                        <h4 class="font-bold text-stone-800 mb-1">Promoción Disponible</h4>
                        <p class="text-stone-600">${safePromotions}</p>
                     </div>
                </div>
                ` : ''}

                <!-- Payment Methods -->
                <div>
                     <h4 class="font-bold text-stone-800 mb-3 border-b border-stone-100 pb-2">Medios de Pago</h4>
                     <div class="flex flex-wrap gap-3">
                        ${data.paymentMethods ? data.paymentMethods.map(method => `
                            <span class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 text-sm font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                ${escapeHTML(method)}
                            </span>
                        `).join('') : '<span class="text-stone-400 italic">Consultar en el local</span>'}
                     </div>
                </div>

                <div class="pt-6 border-t border-stone-100 flex justify-end">
                    <button class="px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg transition-colors" id="modal-close-btn">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
    `
}
