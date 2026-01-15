import { supabase } from './supabaseClient.js';

// Helper to Map DB (snake_case) to App (camelCase)
const mapFromDb = (b) => ({
    id: b.id,
    name: b.name,
    category: b.category,
    description: b.description,
    phone: b.phone,
    whatsapp: b.whatsapp,
    address: b.address,
    image: b.image,
    isOpen: b.is_open,
    isFeatured: b.is_featured,
    delivery: b.delivery,
    isPaid: b.is_paid,
    startDate: b.start_date,
    expirationDate: b.expiration_date,
    hours: b.hours, // JSONB comes as object/array automatically
    paymentMethods: b.payment_methods,
    promotions: b.promotions,
    clarification: b.clarification,
    // Use DB slug
    slug: b.slug
});

// Helper to Map App to DB
const mapToDb = (b) => ({
    name: b.name,
    category: b.category,
    description: b.description,
    phone: b.phone,
    whatsapp: b.whatsapp,
    address: b.address,
    image: b.image,
    is_open: b.isOpen,
    is_featured: b.isFeatured,
    delivery: b.delivery,
    is_paid: b.isPaid,
    start_date: b.startDate || null,
    expiration_date: b.expirationDate || null,
    hours: b.hours,
    payment_methods: b.paymentMethods,
    promotions: b.promotions,
    clarification: b.clarification,
    slug: b.slug
});

export const dataService = {
    async getAll() {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .order('is_featured', { ascending: false }); // Show featured first

        if (error) {
            console.error('Error fetching businesses:', error);
            return [];
        }
        return data.map(mapFromDb);
    },

    async getById(id) {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return mapFromDb(data);
    },

    async getBySlug(slug) {
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return null;
        return mapFromDb(data);
    },

    async save(business) {
        const payload = mapToDb(business);

        if (business.id) {
            // Update
            const { error } = await supabase
                .from('businesses')
                .update(payload)
                .eq('id', business.id);
            if (error) throw error;
        } else {
            // Create
            const { error } = await supabase
                .from('businesses')
                .insert([payload]);
            if (error) throw error;
        }
    },

    async delete(id) {
        const { error } = await supabase
            .from('businesses')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('name')
            .order('name');

        if (error) {
            console.error(error);
            return ['AL ERROR: CHECK DB CONNECTION'];
        }
        return data.map(c => c.name);
    },

    async addCategory(name) {
        const { error } = await supabase
            .from('categories')
            .insert([{ name }]);
        if (error) throw error;
    },

    async deleteCategory(name) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('name', name);
        if (error) throw error;
    },

    async uploadImage(file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('business-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('business-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};
