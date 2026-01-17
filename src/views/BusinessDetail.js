
import { LocationIcon, PhoneIcon, getSmartStatus } from '../components/Card.js';
import { escapeHTML, formatDaysRange } from '../utils.js';

export const BusinessDetail = (data) => {
    const safeName = escapeHTML(data.name);
    const safeCategory = escapeHTML(data.category);
    const safeAddress = escapeHTML(data.address);
    const safePhone = escapeHTML(data.phone);
    const safeWhatsapp = escapeHTML(data.whatsapp);
    const safePromotions = escapeHTML(data.promotions);

    const smartStatus = getSmartStatus(data.hours, data.isOpen);

    let hoursHtml = '';
    if (data.hours?.is24Hours) {
        hoursHtml = `
        <div class="text-green-600 font-bold flex items-center gap-2 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Abierto las 24 horas
        </div>`;
    } else if (data.hours?.format === 'v4') {

        const renderSchedule = (sch) => {
            if (!sch.days || sch.days.length === 0) return '';
            const dStr = formatDaysRange(sch.days);
            const tStr = sch.shifts.map(s => `${s.start} - ${s.end}`).join(' / ');
            return `
             <div class="flex flex-col items-center border-b border-stone-100 last:border-0 py-2">
                <div class="font-bold text-stone-800 mb-1 capitalize">${dStr}</div>
                <div class="text-sm text-stone-600 font-medium whitespace-nowrap">${tStr}</div>
             </div>
             `;
        };

        hoursHtml = `
        <div class="mt-2 text-stone-600 text-center">
            ${data.hours.schedules.map(renderSchedule).join('')}
        </div>`;

    } else if (data.hours?.format === 'v3') {
        const renderShift = (shifts) => shifts && shifts.length ? shifts.map(s => `${s.start} - ${s.end}`).join(' / ') : 'Cerrado';
        hoursHtml = `
        <div class="grid grid-cols-[min-content_1fr] gap-x-6 gap-y-2 text-stone-600 mt-2">
            <span class="font-medium text-stone-800 whitespace-nowrap">Lun-Vie:</span>
            <span>${renderShift(data.hours.weekdays?.shifts)}</span>
            
            <span class="font-medium text-stone-800 whitespace-nowrap">Sábado:</span>
            <span>${renderShift(data.hours.saturday?.shifts)}</span>
            
            <span class="font-medium text-stone-800 whitespace-nowrap">Domingo:</span>
            <span>${renderShift(data.hours.sunday?.shifts)}</span>
        </div>`;
    } else {
        hoursHtml = `
         <div class="text-stone-600 flex items-center gap-2 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-spa-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${data.hours && data.hours.display ? escapeHTML(data.hours.display) : 'Consultar'}
        </div>`;
    }

    return `
    <div class="animate-fade-in-up max-w-6xl mx-auto">
        <!-- Back Button -->
        <a href="/" data-link class="inline-flex items-center gap-2 text-stone-500 hover:text-spa-600 font-medium mb-6 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
        </a>

        <div class="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            <!-- Hero Image -->
            <div class="h-64 md:h-80 relative">
                <img src="${data.image}" alt="${safeName}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div class="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
                    <span class="bg-spa-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-sm">
                        ${safeCategory}
                    </span>
                    <h1 class="text-3xl md:text-5xl font-headings font-bold mb-2 shadow-sm">${safeName}</h1>
                    <div class="flex items-center gap-3">
                         <div class="w-2.5 h-2.5 rounded-full ${smartStatus.text === 'Abierto' ? 'bg-green-500' : smartStatus.text === 'Cerrado' ? 'bg-stone-400' : 'bg-yellow-500'} shadow-sm"></div>
                         <span class="text-sm md:text-base font-medium ${smartStatus.text === 'Abierto' ? 'text-green-100' : 'text-stone-200'}">
                            ${smartStatus.text}
                         </span>
                    </div>
                </div>
            </div>

            <div class="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-10">
                    
                     <!-- Hidden AdSense Placeholder (Top) -->
                    <div class="hidden w-full bg-stone-50 border border-stone-100 rounded-lg h-24 flex items-center justify-center relative overflow-hidden">
                        <span class="text-xs text-stone-400">Publicidad</span>
                    </div>

                    <!-- Description -->
                    <section>
                        <h2 class="text-xl font-bold text-stone-800 mb-4 border-b border-stone-100 pb-2">Sobre ${safeName}</h2>
                        <p class="text-stone-600 leading-relaxed font-light text-lg">
                            ${escapeHTML(data.description || 'Sin descripción disponible.')}
                        </p>
                    </section>

                    <!-- Clarification -->
                     ${data.clarification ? `
                     <div class="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>${escapeHTML(data.clarification)}</p>
                     </div>
                     ` : ''}

                    <!-- Payment Methods -->
                    <section>
                         <h2 class="text-lg font-bold text-stone-800 mb-4">Medios de Pago</h2>
                         <div class="flex flex-wrap gap-3">
                            ${data.paymentMethods && data.paymentMethods.length > 0 ? data.paymentMethods.map(method => `
                                <span class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 text-sm font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    ${escapeHTML(method)}
                                </span>
                            `).join('') : '<span class="text-stone-400 italic">Consultar en el local</span>'}
                         </div>
                    </section>
                </div>

                <!-- Sidebar Info -->
                <div class="space-y-8">
                
                    <!-- Contact Card -->
                    <div class="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-6">
                        
                         <!-- Address -->
                        <div>
                             <h3 class="font-bold text-stone-800 mb-2 flex items-center gap-2">
                                <span class="text-spa-500">${LocationIcon()}</span> Ubicación
                             </h3>
                            <p class="text-stone-600 pl-7">${safeAddress}</p>
                        </div>

                         <!-- Hours -->
                        <div>
                             <h3 class="font-bold text-stone-800 mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-spa-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Horarios
                             </h3>
                            <div class="pl-7">
                                ${hoursHtml}
                            </div>
                        </div>

                        <!-- WhatsApp CTA -->
                        ${data.whatsapp ? `
                           <a href="https://wa.me/549${data.whatsapp.replace(/\D/g, '')}" target="_blank" 
                              class="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                <div class="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                    </svg>
                                    Consultar por WhatsApp
                                </div>
                           </a>
                        ` : ''}
                    </div>

                    <!-- Promotions -->
                    ${data.promotions ? `
                    <div class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-xl p-5">
                         <div class="flex items-center gap-3 mb-2">
                             <div class="bg-yellow-100 p-2 rounded-full text-yellow-600 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                             </div>
                            <h4 class="font-bold text-stone-800">Promoción</h4>
                         </div>
                        <p class="text-stone-600 text-sm leading-relaxed">${safePromotions}</p>
                    </div>
                    ` : ''}

                    <!-- Hidden AdSense Placeholder (Sidebar) -->
                    <div class="hidden w-full bg-stone-50 border border-stone-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                        <span class="text-xs text-stone-400">Publicidad</span>
                    </div>

                </div>
            </div>
        </div>
    </div>
    `;
};
