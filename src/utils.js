export const escapeHTML = (str) => {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

export const updateSchema = (business) => {
    // Remove existing schema to prevent duplicates
    removeSchema();

    const siteUrl = window.location.origin;

    // Validate and format Image URL
    let imageUrl = business.image;
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = new URL(imageUrl, siteUrl).href;
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "image": imageUrl ? [imageUrl] : [],
        "description": business.description || `Comercio en Villa Carmela: ${business.name}`,
        "@id": `${siteUrl}/business/${business.slug}`,
        "url": `${siteUrl}/business/${business.slug}`,
        "telephone": business.whatsapp ? `+549${business.whatsapp.replace(/\D/g, '')}` : undefined,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": business.address,
            "addressLocality": "Villa Carmela",
            "addressRegion": "Tucumán",
            "addressCountry": "AR"
        },
        "priceRange": "$$",
        "geo": {
            "@type": "GeoCoordinates",
            "addressCountry": "AR",
            "addressLocality": "Villa Carmela"
        },
        "openingHoursSpecification": []
    };

    // Hours Mapping (Compact String to Specification)
    if (business.hours) {
        if (business.hours.is24Hours) {
            schema.openingHoursSpecification.push({
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
            });
        } else if (business.hours.format === 'v3') {
            const daysMap = {
                weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                saturday: ["Saturday"],
                sunday: ["Sunday"]
            };

            for (const [key, days] of Object.entries(daysMap)) {
                const shifts = business.hours[key]?.shifts || [];
                shifts.forEach(shift => {
                    if (shift.start && shift.end) {
                        schema.openingHoursSpecification.push({
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": days,
                            "opens": shift.start,
                            "closes": shift.end
                        });
                    }
                });
            }
        }
    }

    // Prune empty properties
    if (schema.openingHoursSpecification.length === 0) delete schema.openingHoursSpecification;
    if (!schema.telephone) delete schema.telephone;
    if (schema.image.length === 0) delete schema.image;

    const script = document.createElement('script');
    script.id = 'business-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
};

export const removeSchema = () => {
    const existing = document.getElementById('business-schema');
    if (existing) {
        existing.remove();
    }
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

export const formatDaysRange = (days) => {
    if (!days || days.length === 0) return '';

    // Sort days: Mon(1) -> Sun(0). We need 0 to be last for "Lun-Dom" logic usually,
    // but JS getDay() is 0=Sun. Let's map 0->7 for sorting to get Mon(1)..Sat(6),Sun(7)
    const sortedDays = [...days].map(d => d === 0 ? 7 : d).sort((a, b) => a - b);

    // Map back 7->0 for output if needed, but for range check 1-7 is easier.
    const dayNames = {
        1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 7: 'Dom'
    };

    let ranges = [];
    let start = sortedDays[0];
    let prev = sortedDays[0];

    for (let i = 1; i < sortedDays.length; i++) {
        const current = sortedDays[i];
        if (current === prev + 1) {
            // Consecutive
            prev = current;
        } else {
            // Break
            if (start === prev) {
                ranges.push(dayNames[start]);
            } else if (prev === start + 1) {
                ranges.push(`${dayNames[start]}, ${dayNames[prev]}`);
            } else {
                ranges.push(`${dayNames[start]} a ${dayNames[prev]}`);
            }
            start = current;
            prev = current;
        }
    }

    // Push last range
    if (start === prev) {
        ranges.push(dayNames[start]);
    } else if (prev === start + 1) {
        ranges.push(`${dayNames[start]}, ${dayNames[prev]}`);
    } else {
        ranges.push(`${dayNames[start]} a ${dayNames[prev]}`);
    }

    return ranges.join(', ');
};
