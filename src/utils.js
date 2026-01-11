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
        "@id": `${siteUrl}/business/${business.slug || business.id}`,
        "url": `${siteUrl}/business/${business.slug || business.id}`,
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
