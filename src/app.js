import { dataService } from './services/dataService.js'
import { Card } from './components/Card.js'

import { updateSchema, removeSchema, debounce } from './utils.js'
import Fuse from 'fuse.js'

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
                    <p class="text-spa-100 font-light">Publicita con nosotros. <span class="font-bold text-white text-lg">¡Tu primer mes es GRATIS!</span></p>
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
                 <div class="max-w-xl mx-auto flex gap-2">
                    <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input type="text" id="category-search" placeholder="Buscar: gomería, gas envasado, peluquería…" class="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-spa-200 focus:border-spa-400 transition-all shadow-sm text-stone-700 placeholder-stone-400">
                    </div>
                    <button id="search-btn" class="bg-spa-600 hover:bg-spa-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-colors duration-200 flex-shrink-0">
                        Buscar
                    </button>
                </div>
                
                <!-- Quick Categories Toggle -->
                <div class="max-w-4xl mx-auto mt-6 text-center">
                    <button id="toggle-categories-btn" class="inline-flex items-center gap-2 text-sm font-bold text-spa-600 hover:text-spa-700 uppercase tracking-wider transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filtrar por Categoría
                        <svg id="cat-arrow" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300 transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div id="categories-container" class="hidden mt-6 animate-fade-in-down origin-top">
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
                            ${categories.sort().map(cat => {
            // Simple slugify for link
            const slug = cat.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').replace(/[^a-z0-9]/g, '-');
            return `
                                <a href="/category/${slug}" data-link class="group flex items-center justify-between px-4 py-3 bg-white text-stone-600 rounded-xl text-sm font-medium hover:text-spa-600 hover:border-spa-300 border border-stone-100 shadow-sm hover:shadow-md transition-all duration-200">
                                    <span>${cat}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-stone-300 group-hover:text-spa-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                                `;
        }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="hero-section" class="mb-12 text-center">
            <h1 class="text-3xl md:text-5xl font-headings font-bold text-stone-900 mb-4 tracking-tight">Comercios y servicios de Villa Carmela, para encontrar rápido lo que buscás</h1>
            <h2  class="text-lg text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">Todo lo que necesitás, rápido y en un solo lugar</h2>
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
                    // Save State Logic for Persistence
                    const currentScroll = window.scrollY;
                    const SearchInput = document.querySelector('#category-search');
                    const searchTerm = SearchInput ? SearchInput.value : '';

                    sessionStorage.setItem('home_persistence', JSON.stringify({
                        scroll: currentScroll,
                        search: searchTerm,
                        timestamp: Date.now()
                    }));

                    // Set return path for Back button logic
                    sessionStorage.setItem('return_path', '/');

                    // Navigate to business page, ONLY using slug
                    navigateTo(`/business/${business.slug}`);
                }
            }
        }

        featuredGrid.addEventListener('click', handleCardInteractions)
        grid.addEventListener('click', handleCardInteractions)



        // Populate Categories
        // Categories not needed for input search

        // Helper to render Featured
        function renderFeatured(data) {
            featuredGrid.innerHTML = '';
            const featuredData = data.filter(b => b.isFeatured);

            if (featuredData.length === 0) {
                featuredGrid.innerHTML = '<div class="col-span-1 md:col-span-3 text-center text-stone-400 py-10">No se encontraron negocios destacados con esa búsqueda.</div>';
                return;
            }

            featuredData.forEach(item => {
                featuredGrid.insertAdjacentHTML('beforeend', Card(item))
            });
        }

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

        // Initial Render
        renderFeatured(businesses);
        let filteredData = [...businesses];
        let displayedCount = 6;
        let isLoading = false;

        renderCards(filteredData.slice(0, displayedCount));

        // Event Listener: Search (Name, Category, Tags)
        // Initialize Fuse.js
        const fuse = new Fuse(businesses, {
            keys: ['name', 'category', 'description', 'tags'],
            threshold: 0.3,
            ignoreLocation: true
        });

        // Event Listener: Search (Name, Category, Tags)
        const performSearch = debounce((e) => {
            const searchTerm = e.target.value.trim()

            if (searchTerm) {
                const results = fuse.search(searchTerm);
                filteredData = results.map(result => result.item);
            } else {
                filteredData = [...businesses]
            }

            // Update Featured Grid
            renderFeatured(filteredData);

            // Update Main Grid
            displayedCount = 6
            grid.innerHTML = ''

            if (filteredData.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-1 md:col-span-3 text-center py-16">
                        <div class="bg-stone-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-medium text-stone-900 mb-1">No encontramos resultados</h3>
                        <p class="text-stone-500 max-w-xs mx-auto mb-6">Intentá con otra palabra clave o navegá por las categorías.</p>
                        <button id="clear-search-btn" class="text-spa-600 font-medium hover:text-spa-700 hover:underline">
                            Ver todos los comercios
                        </button>
                    </div>
                `;

                // Add listener to clear search
                const clearBtn = document.getElementById('clear-search-btn');
                if (clearBtn) {
                    clearBtn.addEventListener('click', () => {
                        categorySearch.value = '';
                        categorySearch.dispatchEvent(new Event('input'));
                    });
                }

                loadingSentinel.classList.add('hidden')
                observer.unobserve(loadingSentinel)
            } else {
                renderCards(filteredData.slice(0, displayedCount))

                if (filteredData.length > displayedCount) {
                    loadingSentinel.classList.remove('hidden')
                    observer.observe(loadingSentinel)
                } else {
                    loadingSentinel.classList.add('hidden')
                    observer.unobserve(loadingSentinel)
                }
            }
        }, 300);

        categorySearch.addEventListener('input', performSearch);

        // Search Button and Enter Key Logic (Auto-Scroll)
        const searchBtn = container.querySelector('#search-btn');

        const scrollToResults = () => {
            // Determine where to scroll: Featured or Main Grid?
            // Usually if filtering, main grid is what matters. 
            // Let's scroll to the start of the results area (Featured Header or Main Grid)
            // Ideally "Featured" if it has items, otherwise "All businesses".
            // Since we update both, let's scroll to the container wrapper of features to be safe.
            // Or simpler: The "Featured" section header.

            const resultsStart = container.querySelector('#featured-grid').previousElementSibling; // The h2 header wrapper
            if (resultsStart) {
                resultsStart.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                // Ensure search is triggered (it is debounce on input, but click is explicit)
                // performSearch is debounced, so calling it here might be delayed. 
                // But the input event already fired if typed. 
                // If they typed and immediately clicked, debounce might still be pending.
                // We can force a search or just trust the debounce. 
                // Let's just scroll.
                scrollToResults();
            });
        }

        // Toggle Categories Logic
        const toggleCatBtn = container.querySelector('#toggle-categories-btn');
        const catContainer = container.querySelector('#categories-container');
        const catArrow = container.querySelector('#cat-arrow');

        if (toggleCatBtn && catContainer) {
            toggleCatBtn.addEventListener('click', () => {
                const isHidden = catContainer.classList.contains('hidden');
                if (isHidden) {
                    catContainer.classList.remove('hidden');
                    catArrow.classList.add('rotate-180');
                } else {
                    catContainer.classList.add('hidden');
                    catArrow.classList.remove('rotate-180');
                }
            });
        }

        categorySearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default form submission if any
                scrollToResults();
                // Close keyboard on mobile
                categorySearch.blur();
            }
        });

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

        // --- Persistence Restoration Logic ---
        const savedState = sessionStorage.getItem('home_persistence');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                const now = Date.now();
                // Valid for 10 minutes to avoid stale state on long idle? Or keep it simple.
                // Let's just restore.

                if (state.search) {
                    categorySearch.value = state.search;
                    // Trigger search
                    categorySearch.dispatchEvent(new Event('input'));
                }

                if (state.scroll) {
                    // Small delay to allow rendering
                    setTimeout(() => {
                        window.scrollTo(0, state.scroll);
                        // Clear after restoring One-Time? 
                        // UX Decision: Do we want to keep it if they go back again?
                        // Usually yes. But maybe we clear it on "Logo Click" (Home reset).
                        // For now we leave it, but maybe main.js should clear it if not resolving "Back".
                        // Actually, simpler: always restore if present, rely on explicit "Reset Search" to clear or explicit navigation from other places.
                    }, 100);
                }
            } catch (e) {
                console.error('Error restoring state', e);
            }
        }


    } catch (error) {
        console.error("Failed to load data", error);
        container.innerHTML = `<div class="text-center p-10 text-red-500">Error cargando datos. Por favor intenta más tarde.</div>`;
    }
}
