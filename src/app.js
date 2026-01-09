import { dataService } from './services/dataService.js'
import { Card } from './components/Card.js'
import { Modal } from './components/Modal.js'

export async function renderHome(container, targetSlug = null) {
    // Show Loading State
    container.innerHTML = `
        <div class="flex items-center justify-center min-h-screen">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-spa-600"></div>
        </div>
    `;

    try {
        const [businesses, categories] = await Promise.all([
            dataService.getAll(),
            dataService.getCategories()
        ]);

        // Inject Home HTML with new Banner and Featured Section
        container.innerHTML = `
        <!-- Advertise Banner -->
        <div class="bg-gradient-to-r from-spa-600 to-spa-500 rounded-2xl p-6 md:p-8 mb-10 text-white shadow-lg relative overflow-hidden animate-fade-in-up">
            <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="text-center md:text-left">
                    <h3 class="text-2xl font-headings font-bold mb-2">¿Tenés un comercio o brindás servicios?</h3>
                    <p class="text-spa-100 font-light">Publicita con nosotros desde <span class="font-bold text-white">$5.000/mes</span></p>
                </div>
                <button id="banner-contact-btn" class="bg-white text-spa-900 px-6 py-3 rounded-full font-bold shadow-md hover:bg-stone-50 hover:scale-105 transition-all duration-300">
                    Contactar Ahora
                </button>
            </div>
            <!-- Decorative circles -->
            <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <!-- Search Bar Section -->
        <div class="bg-white border-b border-stone-100 py-6 mb-10 rounded-2xl shadow-sm" id="search-container">
            <div class="px-4">
                 <div class="relative max-w-lg mx-auto">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input type="text" id="category-search" placeholder="Busca comercios y servicios en Villa Carmela por categoría..." class="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-spa-200 focus:border-spa-400 transition-all shadow-sm text-stone-700 placeholder-stone-400">
                </div>
            </div>
        </div>

        <div id="hero-section" class="mb-12 text-center">
            <h2 class="text-3xl md:text-5xl font-headings font-bold text-stone-900 mb-4 tracking-tight">Guía de comercios y servicios en Villa Carmela</h2>
            <p class="text-lg text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">Encuentra comercios y servicios en Villa Carmela con horarios, ubicación, WhatsApp y atención a domicilio.</p>
        </div>

        <!-- Featured Section -->
        <div class="mb-16">
            <div class="flex items-center gap-4 mb-8">
                <h2 class="text-2xl font-headings font-bold text-stone-800">Comercios y servicios destacados en Villa Carmela</h2>
                <div class="h-px flex-grow bg-stone-200"></div>
            </div>
            <div id="featured-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Featured Cards injected by JS -->
            </div>
        </div>
        
        <div class="flex items-center gap-4 mb-8">
                <h3 class="text-2xl font-headings font-bold text-stone-800">Todos los comercios y servicios de Villa Carmela</h3>
                <div class="h-px flex-grow bg-stone-200"></div>
        </div>

        <div id="business-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Business Cards injected by JS -->
        </div>

        <div id="loading-sentinel" class="h-24 flex flex-col items-center justify-center mt-16 opacity-0 transition-opacity duration-300">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-spa-600 mb-2"></div>
            <span class="text-xs text-stone-400 uppercase tracking-widest">Cargando más</span>
        </div>

        <footer class="mt-20 border-t border-stone-100 py-10 text-center">
            <p class="text-stone-400 text-sm mb-4">© 2026 Villa Carmela Cerca. Todos los derechos reservados.</p>
            <a href="/admin" data-link class="text-stone-300 hover:text-stone-500 text-xs transition-colors font-medium">Soy Dueño</a>
        </footer>
        `;

        const grid = container.querySelector('#business-grid')
        const featuredGrid = container.querySelector('#featured-grid')
        const categorySearch = container.querySelector('#category-search')
        const loadingSentinel = container.querySelector('#loading-sentinel')
        const bannerContactBtn = container.querySelector('#banner-contact-btn')

        // Navigate to contact logic
        bannerContactBtn.addEventListener('click', () => {
            const event = new CustomEvent('navigate-to', { detail: { view: 'contact' } });
            document.dispatchEvent(event);
        })

        // Handle Card Interactions (Delegation)
        const handleCardInteractions = (e) => {
            const mapBtn = e.target.closest('[data-action="map"]')
            const whatsappBtn = e.target.closest('[data-action="whatsapp"]')
            const card = e.target.closest('[data-business-id]')

            if (mapBtn) {
                e.stopPropagation()
                const address = mapBtn.dataset.address
                if (address) {
                    window.open(`https://www.google.com/maps?q=${encodeURIComponent(address)}`, '_blank')
                }
                return
            }

            if (whatsappBtn) {
                e.stopPropagation()
                const phone = whatsappBtn.dataset.phone
                if (phone) {
                    let cleanPhone = phone.replace(/\D/g, '')

                    // Logic to ensure 549 prefix for Argentina
                    // If it starts with 11 or other local area code without 54/9
                    // Heuristic: If length is 10 (e.g. 11 1234 5678), add 549
                    // If starts with 54 but not 549 (rare but possible mistake), insert 9

                    if (!cleanPhone.startsWith('54')) {
                        cleanPhone = '549' + cleanPhone;
                    } else if (cleanPhone.startsWith('54') && !cleanPhone.startsWith('549')) {
                        cleanPhone = cleanPhone.replace('54', '549');
                    }

                    window.open(`https://wa.me/${cleanPhone}`, '_blank')
                }
                return
            }

            if (card) {
                const businessId = parseInt(card.dataset.businessId)
                const business = businesses.find(b => b.id === businessId)
                if (business) {
                    openModal(business)
                }
            }
        }

        featuredGrid.addEventListener('click', handleCardInteractions)
        grid.addEventListener('click', handleCardInteractions)

        // Modal Logic
        function openModal(business) {
            // Close existing modal if any
            closeModal()

            const modalHTML = Modal(business)
            document.body.insertAdjacentHTML('beforeend', modalHTML)

            const modal = document.getElementById('business-modal')
            const backdrop = document.getElementById('modal-backdrop')
            const closeBtn = document.getElementById('modal-close')
            const closeBtnInternal = document.getElementById('modal-close-btn')

            // Animate in
            requestAnimationFrame(() => {
                modal.querySelector('#modal-backdrop').classList.remove('opacity-0')
                modal.querySelector('div[class*="scale-95"]').classList.remove('scale-95', 'opacity-0')
            })

            const handleClose = () => {
                modal.remove()
            }

            backdrop.addEventListener('click', handleClose)
            closeBtn.addEventListener('click', handleClose)
            closeBtnInternal.addEventListener('click', handleClose)
        }

        function closeModal() {
            const existingModal = document.getElementById('business-modal')
            if (existingModal) existingModal.remove()
        }

        // Populate Categories
        // Categories not needed for input search

        // Render Featured
        const featuredBusinesses = businesses.filter(b => b.isFeatured)
        featuredBusinesses.forEach(item => {
            featuredGrid.insertAdjacentHTML('beforeend', Card(item))
        })

        // Main Grid Logic
        let filteredData = [...businesses]
        let displayedCount = 6
        let isLoading = false

        // Initial Render
        renderCards(filteredData.slice(0, displayedCount))

        // Event Listener: Category Filter
        // Event Listener: Category Search
        categorySearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim()

            if (searchTerm) {
                filteredData = businesses.filter(business =>
                    business.category.toLowerCase().includes(searchTerm)
                )
            } else {
                filteredData = [...businesses]
            }

            displayedCount = 6
            grid.innerHTML = ''
            renderCards(filteredData.slice(0, displayedCount))

            if (filteredData.length > displayedCount) {
                loadingSentinel.classList.remove('hidden')
                observer.observe(loadingSentinel)
            } else {
                loadingSentinel.classList.add('hidden')
                observer.unobserve(loadingSentinel)
            }
        })

        function renderCards(data) {
            data.forEach(item => {
                const cardHTML = Card(item)
                grid.insertAdjacentHTML('beforeend', cardHTML)

                const lastChild = grid.lastElementChild
                lastChild.classList.add('animate-fade-in-up')
                lastChild.style.opacity = '0'
                lastChild.style.transform = 'translateY(20px)'
                setTimeout(() => {
                    lastChild.style.opacity = '1'
                    lastChild.style.transform = 'translateY(0)'
                }, 50)
            })
        }

        // Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isLoading && displayedCount < filteredData.length) {
                    isLoading = true
                    loadingSentinel.style.opacity = '1'

                    setTimeout(() => {
                        const nextBatch = filteredData.slice(displayedCount, displayedCount + 3)
                        renderCards(nextBatch)
                        displayedCount += 3
                        isLoading = false
                        loadingSentinel.style.opacity = '0'

                        if (displayedCount >= filteredData.length) {
                            observer.unobserve(loadingSentinel)
                        }
                    }, 800)
                }
            })
        }, { rootMargin: '100px' })

        if (filteredData.length > displayedCount) {
            observer.observe(loadingSentinel)
        }

        // Open Permalink Modal
        if (targetSlug) {
            const targetBusiness = businesses.find(b => b.slug === targetSlug)
            if (targetBusiness) {
                openModal(targetBusiness)
                // Update title for SEO/Sharing
                document.title = `${targetBusiness.name} - Villa Carmela Cerca`
            }
        }
    } catch (error) {
        console.error("Failed to load data", error);
        container.innerHTML = `<div class="text-center p-10 text-red-500">Error cargando datos. Por favor intenta más tarde.</div>`;
    }
}
