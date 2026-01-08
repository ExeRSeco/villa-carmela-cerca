import './style.css'
import { renderHome } from './app.js'
import { About } from './views/about.js'
import { Contact } from './views/contact.js'
import { Login } from './views/admin/Login.js'
import { Dashboard } from './views/admin/Dashboard.js'
import { BusinessForm } from './views/admin/BusinessForm.js'
import { CategoryManager } from './views/admin/CategoryManager.js'
import { authService } from './services/authService.js'
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

document.querySelector('#app').innerHTML = `
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 shadow-sm transition-all duration-300" id="main-header">
    <div class="container mx-auto px-4 h-20 flex items-center justify-between">
        <div class="flex items-center gap-2 cursor-pointer" id="logo-btn">
            <div class="w-8 h-8 rounded-full bg-spa-500 flex items-center justify-center text-white font-bold font-headings">VC</div>
            <h1 class="text-2xl font-headings font-bold text-spa-900 tracking-tight">Villa Carmela Cerca</h1>
        </div>
        <div class="hidden md:block">
            <nav class="flex gap-6 text-stone-600 font-medium">
                <a href="#" id="nav-home" class="hover:text-spa-600 transition-colors text-spa-600">Inicio</a>
                <a href="#" id="nav-about" class="hover:text-spa-600 transition-colors">Nosotros</a>
                <a href="#" id="nav-contact" class="hover:text-spa-600 transition-colors">Publicita</a>
            </nav>
        </div>
    </div>
</header>

<main id="main-content" class="flex-grow container mx-auto px-4 py-8 max-w-7xl">
    <!-- View Content injected Here -->
</main>

<a href="https://wa.me/5493815055831" target="_blank" class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-bounce-subtle">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
</a>

<footer class="bg-stone-900 text-stone-300 py-12 mt-auto">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
                 <h3 class="text-xl font-headings font-bold text-white mb-4">Villa Carmela Cerca</h3>
                 <p class="text-sm font-light text-stone-400 leading-relaxed">Conectando a la comunidad con los mejores negocios locales. Calidad, confianza y cercanía.</p>
            </div>
            <div>
                <h4 class="text-lg font-bold text-white mb-4">Enlaces Rápidos</h4>
                 <ul class="space-y-2 text-sm font-light">
                    <li><button id="footer-contact-btn" class="hover:text-spa-400 transition-colors text-left">Registra tu negocio</button></li>
                    <li><button id="footer-about-btn" class="hover:text-spa-400 transition-colors text-left">Sobre Nosotros</button></li>
                    <li><button id="footer-contact-link-btn" class="hover:text-spa-400 transition-colors text-left">Contacto</button></li>
                </ul>
            </div>
        </div>
        <div class="border-t border-stone-800 pt-8 text-center text-xs text-stone-500">
            <p>&copy; 2024 Guía Amarilla. Todos los derechos reservados.</p>
        </div>
    </div>
</footer>
`

const mainContent = document.querySelector('#main-content')
const navHome = document.querySelector('#nav-home')
const navAbout = document.querySelector('#nav-about')
const navContact = document.querySelector('#nav-contact')
const logoBtn = document.querySelector('#logo-btn')
const footerAboutBtn = document.querySelector('#footer-about-btn')
const footerContactBtn = document.querySelector('#footer-contact-btn')
const footerContactLinkBtn = document.querySelector('#footer-contact-link-btn')


// Routing Logic
async function router() {
    const hash = window.location.hash || '#';

    // Reset active states
    navHome.classList.remove('text-spa-600', 'font-bold')
    navAbout.classList.remove('text-spa-600', 'font-bold')
    navContact.classList.remove('text-spa-600', 'font-bold')
    mainContent.innerHTML = ''
    window.scrollTo(0, 0)

    // Admin Routes
    if (hash.startsWith('#admin')) {
        const isAuth = await authService.isAuthenticated();

        if (hash === '#admin/login') {
            if (isAuth) {
                window.location.hash = '#admin/dashboard';
                return;
            }
            mainContent.innerHTML = Login();
            return;
        }

        if (!isAuth) {
            window.location.hash = '#admin/login';
            return;
        }

        if (hash === '#admin/dashboard') {
            mainContent.innerHTML = Dashboard();
        } else if (hash === '#admin/categories') {
            mainContent.innerHTML = CategoryManager();
        } else if (hash === '#admin/new') {
            mainContent.innerHTML = BusinessForm();
        } else if (hash.startsWith('#admin/edit/')) {
            const id = hash.split('/').pop();
            mainContent.innerHTML = BusinessForm(id);
        } else {
            // Fallback for unknown admin routes
            mainContent.innerHTML = Dashboard();
        }
        return;
    }

    // Public Routes
    if (hash === '#about') {
        mainContent.innerHTML = About()
        navAbout.classList.add('text-spa-600', 'font-bold')
    } else if (hash === '#contact') {
        const contactHTML = Contact()
        mainContent.innerHTML = contactHTML
        navContact.classList.add('text-spa-600', 'font-bold')
    } else {
        // Default Home
        renderHome(mainContent)
        navHome.classList.add('text-spa-600', 'font-bold')
    }
}

// Event Listeners for Nav (Updating Hash)
navHome.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = ''; })
navAbout.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = '#about'; })
navContact.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = '#contact'; })
logoBtn.addEventListener('click', () => { window.location.hash = ''; })
footerAboutBtn.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = '#about'; })
footerContactBtn.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = '#contact'; })
footerContactLinkBtn.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = '#contact'; })

// Listen for custom navigation events
document.addEventListener('navigate-to', (e) => {
    if (e.detail && e.detail.view) {
        if (e.detail.view === 'home') window.location.hash = '';
        else window.location.hash = '#' + e.detail.view;
    }
})

window.addEventListener('hashchange', router)
window.addEventListener('load', router)

// Auto Logout Logic
let idleTimer;
const TIMEOUT = 2 * 60 * 1000; // 2 Minutes

const resetIdleTimer = () => {
    // Only apply if in admin
    if (window.location.hash.startsWith('#admin')) {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            // Double check we are still in admin before logging out
            if (window.location.hash.startsWith('#admin')) {
                authService.logout();
            }
        }, TIMEOUT);
    }
}

// Listen for activity
const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
events.forEach(event => {
    document.addEventListener(event, resetIdleTimer, true);
})

// Trigger once on load
resetIdleTimer();
