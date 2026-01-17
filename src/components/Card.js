import { escapeHTML, formatDaysRange } from '../utils.js';



export function PhoneIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
</svg>`
}

export function LocationIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>`
}



export function getSmartStatus(hoursData, isOpenOverride) {
    if (!hoursData) {
        // Fallback or Legacy
        return isOpenOverride
            ? { text: 'Abierto', class: 'text-green-600', isOpen: true }
            : { text: 'Cerrado', class: 'text-stone-500', isOpen: false };
    }

    if (hoursData.is24Hours) {
        return { text: 'Abierto 24hs', class: 'text-green-600', isOpen: true };
    }

    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 6 = Sat
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Determine shifts based on day (v3) or fallback (v2) or v4
    let shifts = [];
    if (hoursData.format === 'v4') {
        const todaySchedule = hoursData.schedules.find(s => s.days.includes(day));
        shifts = todaySchedule ? todaySchedule.shifts : [];
    } else if (hoursData.format === 'v3') {
        if (day === 0) shifts = hoursData.sunday?.shifts || [];
        else if (day === 6) shifts = hoursData.saturday?.shifts || [];
        else shifts = hoursData.weekdays?.shifts || [];
    } else {
        shifts = hoursData.shifts || [];
    }

    if (!shifts || shifts.length === 0) {
        // No shifts for today
        return { text: 'Cerrado', class: 'text-stone-500', isOpen: false };
    }

    // Check if within any shift
    let isOpen = false;
    let status = 'Cerrado';
    let cssClass = 'text-stone-500';

    for (const shift of shifts) {
        const [startH, startM] = shift.start.split(':').map(Number);
        const [endH, endM] = shift.end.split(':').map(Number);

        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
            isOpen = true;
            // Check if closing soon (within 30 mins)
            const minutesUntilClose = endMinutes - currentMinutes;
            if (minutesUntilClose <= 30) {
                status = 'Pronto a Cerrar';
                cssClass = 'text-orange-500';
            } else {
                status = 'Abierto';
                cssClass = 'text-green-600';
            }
            break;
        } else if (currentMinutes < startMinutes) {
            // Check if opening soon (within 30 mins)
            const minutesUntilOpen = startMinutes - currentMinutes;
            if (minutesUntilOpen <= 30 && status === 'Cerrado') {
                status = 'Pronto a Abrir';
                cssClass = 'text-yellow-600';
            }
        }
    }

    return { text: status, class: cssClass, isOpen };
}

export const Card = (data) => {
    const isFeatured = data.isFeatured;
    const safeName = escapeHTML(data.name);
    const safeCategory = escapeHTML(data.category);
    const safeAddress = escapeHTML(data.address);
    const safePhone = escapeHTML(data.phone);
    const safeWhatsapp = escapeHTML(data.whatsapp);

    // Handle Hours
    let hoursDisplay = '';
    let smartStatus = { text: 'Cerrado', class: 'text-stone-500', isOpen: false };

    if (data.hours && typeof data.hours === 'object') {
        if (data.hours.format === 'v4') {
            const parts = data.hours.schedules.map(sch => {
                const dStr = formatDaysRange(sch.days);
                const tStr = sch.shifts.map(s => `${s.start}-${s.end}`).join('/');
                return `${dStr}: ${tStr}`;
            });
            hoursDisplay = parts.join(' | ');
        } else if (data.hours.format === 'v2' || data.hours.format === 'v3') {
            hoursDisplay = escapeHTML(data.hours.display);
        }
        smartStatus = getSmartStatus(data.hours, data.isOpen);
    } else {
        // Legacy
        hoursDisplay = escapeHTML(Array.isArray(data.hours) ? data.hours.join(' ') : (data.hours || ''));
        smartStatus = data.isOpen
            ? { text: 'Abierto', class: 'text-green-600', isOpen: true }
            : { text: 'Cerrado', class: 'text-stone-500', isOpen: false };
    }


    return `
    <article class="bg-white rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col group relative ${isFeatured ? 'border-2 border-yellow-400 shadow-xl scale-[1.02]' : 'border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1'}" data-business-id="${data.id}" data-business-slug="${data.slug}">
        ${isFeatured ? `
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-4 py-1 rounded-b-lg shadow-sm tracking-widest uppercase">
            Destacado
        </div>
        ` : ''}
    
        <div class="relative h-48 overflow-hidden shrink-0">
            <img src="${data.image}" alt="${safeName}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
            <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold ${smartStatus.class} shadow-sm border border-stone-100 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full ${smartStatus.text === 'Abierto' ? 'bg-green-500' : smartStatus.text === 'Cerrado' ? 'bg-stone-400' : 'bg-yellow-500'}"></span>
                ${smartStatus.text}
            </div>
            ${data.promotions ? `
            <div class="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 z-10 intro-y">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Promo
            </div>
            ` : ''}
            ${data.delivery ? `
            <div class="absolute bottom-4 left-4 bg-spa-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0014 7z" />
                 </svg>
                 Delivery
            </div>
            ` : ''}
        </div>
        
        <div class="p-5 flex flex-col flex-grow">
            <div class="flex justify-between items-start mb-2">
                <div>
                     <span class="text-xs font-bold text-spa-600 uppercase tracking-wider">${safeCategory}</span>
                     <h3 class="text-xl font-bold text-stone-800 font-headings mt-1 group-hover:text-spa-600 transition-colors">${safeName}</h3>
                </div>
            </div>

            <div class="space-y-3 mb-6 flex-grow pt-2">
                <div class="flex items-start text-sm text-stone-600 z-10 relative w-fit">
                    <span class="mr-2 text-spa-400 mt-0.5 transition-transform">${LocationIcon()}</span>
                    <span class="tracking-tight">${safeAddress}</span>
                </div>
                <div class="flex items-center text-sm text-stone-600 group/link hover:text-green-600 transition-colors z-10 relative w-fit" data-action="whatsapp" data-phone="${safeWhatsapp || safePhone}">
                    <span class="mr-2 text-spa-400 group-hover/link:text-green-500 group-hover/link:scale-110 transition-transform">${PhoneIcon()}</span>
                    <span class="group-hover/link:underline decoration-green-300 underline-offset-2 tracking-tight">WhatsApp / Contacto</span>
                </div>

                <div class="mt-3 pt-2 border-t border-dashed border-stone-100">
                    <p class="text-xs text-stone-500 line-clamp-2">
                        ${escapeHTML(data.description || '')}
                    </p>
                </div>

            </div>

             <div class="pt-4 border-t border-stone-100 mt-auto">
                 ${data.paymentMethods ? `
                 <div class="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar mask-gradient-r">
                    ${data.paymentMethods.slice(0, 3).map(pm => `
                        <span class="text-[10px] uppercase font-bold text-stone-500 bg-stone-50 px-2 py-1 rounded border border-stone-200 whitespace-nowrap">
                            ${escapeHTML(pm)}
                        </span>
                    `).join('')}
                    ${data.paymentMethods.length > 3 ? `<span class="text-[10px] text-stone-400">+${data.paymentMethods.length - 3}</span>` : ''}
                 </div>
                 ` : ''}
                 
                 <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-xs text-stone-500 font-medium truncate" title="${hoursDisplay}">
                        ${hoursDisplay || 'Consultar Horarios'}
                    </span>
                </div>
            </div>
        </div>
    </article>
    `
}
