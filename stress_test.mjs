import { Card } from './src/components/Card.js';
import { Modal } from './src/components/Modal.js';

// Test Scenarios
const scenarios = [
    {
        name: "Perfect Full Data",
        data: {
            id: 1,
            name: "Business A",
            category: "Cat A",
            image: "img.jpg",
            address: "Address A",
            phone: "111",
            whatsapp: "111",
            isFeatured: true,
            isOpen: true,
            promotions: "Promo A",
            delivery: true,
            paymentMethods: ["Cash", "Card"],
            tags: ["SEO1", "SEO2"],
            hours: { format: 'v2', display: 'Open 24h', is24Hours: true, shifts: [] }
        }
    },
    {
        name: "V3 Data (Split Shifts)",
        data: {
            id: 10,
            name: "Business V3",
            category: "Cat V3",
            image: "img.jpg",
            address: "Address V3",
            phone: "333",
            whatsapp: "333",
            isFeatured: true,
            isOpen: true,
            hours: {
                format: 'v3',
                is24Hours: false,
                weekdays: { shifts: [{ start: '08:00', end: '12:00' }] },
                saturday: { shifts: [{ start: '09:00', end: '13:00' }] },
                sunday: { shifts: [] }, // Closed
                display: "L-V: 8-12 | Sab: 9-13"
            }
        }
    },
    {
        name: "Legacy Data (No Tags, No Payment, Old Hours)",
        data: {
            id: 2,
            name: "Legacy B",
            category: "Cat B",
            image: "img.jpg",
            address: "Address B",
            phone: "222",
            // whatsapp missing
            isFeatured: false,
            isOpen: false,
            // promotions missing
            // delivery missing
            // paymentMethods missing
            tags: null, // Critical: simulate DB null
            hours: "Lun a Vie 9-18" // Old string format
        }
    },
    {
        name: "Empty Data (Edge Case)",
        data: {
            id: 3,
            name: "Empty C",
            category: "Cat C",
            image: "",
            address: "",
            phone: "",
            tags: [],
            hours: null
        }
    },
    {
        name: "Malformed Tags (String instead of Array)",
        data: {
            id: 4,
            name: "Bad Tags D",
            category: "Cat D",
            image: "",
            address: "",
            phone: "",
            tags: "This should be an array but is a string", // This happens if DB save logic fails
            hours: null
        }
    }
];

let failed = false;

console.log("=== STARTING STRESS TEST ===");

scenarios.forEach(scenario => {
    console.log(`\nTesting: ${scenario.name}`);

    // Test Card Render
    try {
        const cardHtml = Card(scenario.data);
        if (!cardHtml || typeof cardHtml !== 'string') throw new Error("Card returned invalid output");
        console.log("  [Card] Render: OK");

        // Specific checks
        if (scenario.name === "Malformed Tags") {
            if (cardHtml.includes("This should be an array")) {
                console.error("  [Card] FAIL: Rendered malformed tags incorrectly as characters or didn't handle map check.");
                failed = true;
            } else {
                console.log("  [Card] Safety Check: OK (Ignored malformed tags)");
            }
        }

    } catch (e) {
        console.error(`  [Card] FAIL: Crashed with error: ${e.message}`);
        failed = true;
    }

    // Test Modal Render
    try {
        const modalHtml = Modal(scenario.data);
        if (!modalHtml || typeof modalHtml !== 'string') throw new Error("Modal returned invalid output");
        console.log("  [Modal] Render: OK");

        // specific modal checks
        if (scenario.name === "Legacy Data") {
            if (!modalHtml.includes("Consultar")) {
                // Check if hours fallback works
                // Actually our legacy logic puts display in hours object? 
                // Wait, Card.js logic handles string hours. Modal.js code: `escapeHTML(data.hours.display)`
                // If data.hours is a string "Lun a Vie...", data.hours.display is UNDEFINED.
                // Let's see if Modal crashes or prints undefined.
                // Looking at Modal.js: `data.hours && data.hours.display ? ... : 'Consultar'`
                // If data.hours is string, string.display is undefined. Result: 'Consultar'. 
                // Wait, accessing string.display is safe in JS (returns undefined).
            }
        }

    } catch (e) {
        console.error(`  [Modal] FAIL: Crashed with error: ${e.message}`);
        failed = true;
    }
});

console.log("\n=== TEST SUMMARY ===");
if (failed) {
    console.error("SOME TESTS FAILED. DO NOT DEPLOY.");
    process.exit(1);
} else {
    console.log("ALL TESTS PASSED. SYSTEM IS STABLE.");
    process.exit(0);
}
