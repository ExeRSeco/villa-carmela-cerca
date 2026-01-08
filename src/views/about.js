export const About = () => {
    return `
    <div class="max-w-4xl mx-auto animate-fade-in-up">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-headings font-bold text-stone-900 mb-6 tracking-tight">Sobre Villa Carmela Cerca</h2>
            <div class="w-24 h-1 bg-spa-500 mx-auto rounded-full"></div>
        </div>

        <div class="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mb-12">
            <div class="md:flex">
                <div class="md:w-1/2 relative h-64 md:h-auto">
                    <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1000&auto=format&fit=crop" 
                         alt="Relaxing spa environment" 
                         class="absolute inset-0 w-full h-full object-cover">
                    <div class="absolute inset-0 bg-spa-900/10 mix-blend-multiply"></div>
                </div>
                <div class="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                    <h3 class="text-2xl font-headings font-bold text-spa-800 mb-4">Nuestra Misión</h3>
                    <p class="text-stone-600 leading-relaxed mb-6 font-light">
                        Nacimos con el propósito de conectar a las personas con experiencias de bienestar y servicios de calidad en su comunidad. Creemos en el poder de lo local y en la importancia de encontrar espacios que nutran el cuerpo y el alma.
                    </p>
                    <p class="text-stone-600 leading-relaxed font-light">
                        Seleccionamos cuidadosamente cada negocio para garantizar que encuentres solo lo mejor.
                    </p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div class="text-center p-6 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div class="w-12 h-12 bg-spa-100 rounded-full flex items-center justify-center mx-auto mb-4 text-spa-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h4 class="font-bold text-stone-800 mb-2">Calidad Verificada</h4>
                <p class="text-sm text-stone-500 font-light">Solo los mejores servicios locales.</p>
            </div>
            <div class="text-center p-6 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div class="w-12 h-12 bg-spa-100 rounded-full flex items-center justify-center mx-auto mb-4 text-spa-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h4 class="font-bold text-stone-800 mb-2">Información Real</h4>
                <p class="text-sm text-stone-500 font-light">Horarios y estados actualizados.</p>
            </div>
            <div class="text-center p-6 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div class="w-12 h-12 bg-spa-100 rounded-full flex items-center justify-center mx-auto mb-4 text-spa-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h4 class="font-bold text-stone-800 mb-2">Comunidad</h4>
                <p class="text-sm text-stone-500 font-light">Hecho para conectar vecinos.</p>
            </div>
        </div>
    </div>
    `
}
