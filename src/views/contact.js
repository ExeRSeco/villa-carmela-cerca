export const Contact = () => {
    return `
    <div class="max-w-5xl mx-auto animate-fade-in-up">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-headings font-bold text-stone-900 mb-4 tracking-tight">Elige el Plan Perfecto para Ti</h2>
            <p class="text-lg text-stone-500 font-light max-w-2xl mx-auto">Potencia la visibilidad de tu negocio con nuestras soluciones publicitarias diseñadas a medida.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <!-- Plan Básico -->
            <div class="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 relative group">
                <div class="p-8 flex-grow">
                    <h3 class="text-xl font-bold font-headings text-stone-800 mb-2">Plan Básico</h3>
                    <p class="text-stone-500 text-sm mb-6">Ideal para comenzar a tener presencia digital.</p>
                    <div class="flex items-baseline mb-8">
                        <span class="text-4xl font-bold text-stone-900">$5.000</span>
                        <span class="text-stone-500 ml-2">/mes</span>
                    </div>
                    <ul class="space-y-4 text-stone-600 mb-8">
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Presencia en el listado general</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Link directo a WhatsApp</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Presencia en Google</span>
                        </li>
                         <li class="flex items-start">
                            <svg class="w-5 h-5 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Detalle de horarios y servicios</span>
                        </li>
                    </ul>
                </div>
                <div class="p-8 pt-0 mt-auto">
                    <a href="https://wa.me/5493815055831?text=Hola,%20me%20interesa%20contratar%20el%20Plan%20Básico%20de%20Villa%20Carmela%20Cerca" target="_blank" class="block w-full text-center bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-4 rounded-xl transition-colors">
                        Contratar Plan Básico
                    </a>
                </div>
            </div>

            <!-- Plan Destacado -->
            <div class="bg-white rounded-3xl shadow-xl border-2 border-spa-500 overflow-hidden flex flex-col relative transform md:-translate-y-4">
                <div class="absolute top-0 right-0 bg-spa-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                    Recomendado
                </div>
                <div class="p-8 flex-grow">
                    <h3 class="text-xl font-bold font-headings text-stone-800 mb-2">Plan Destacado</h3>
                    <p class="text-stone-500 text-sm mb-6">Máxima exposición para tu negocio.</p>
                    <div class="flex items-baseline mb-8">
                        <span class="text-4xl font-bold text-spa-600">$7.000</span>
                        <span class="text-stone-500 ml-2">/mes</span>
                    </div>
                    <ul class="space-y-4 text-stone-600 mb-8">
                         <li class="flex items-start">
                            <svg class="w-5 h-5 text-spa-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span class="font-bold text-stone-800">Todo lo del Plan Básico</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-spa-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Aparición en la sección "Destacados"</span>
                        </li>
                         <li class="flex items-start">
                            <svg class="w-5 h-5 text-spa-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Badge "Destacado" en tu tarjeta</span>
                        </li>
                        <li class="flex items-start">
                            <svg class="w-5 h-5 text-spa-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Prioridad en resultados de búsqueda</span>
                        </li>
                         <li class="flex items-start">
                            <svg class="w-5 h-5 text-spa-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            <span>Soporte personalizado por WhatsApp</span>
                        </li>
                    </ul>
                </div>
                <div class="p-8 pt-0 mt-auto">
                    <a href="https://wa.me/5493815055831?text=Hola,%20me%20interesa%20contratar%20el%20Plan%20Destacado%20de%20Villa%20Carmela%20Cerca" target="_blank" class="block w-full text-center bg-gradient-to-r from-spa-600 to-spa-500 hover:from-spa-500 hover:to-spa-400 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
                        Contratar Plan Destacado
                    </a>
                </div>
            </div>
        </div>
    </div>
    `
}
