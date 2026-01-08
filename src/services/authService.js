import { supabase } from './supabaseClient.js';

export const authService = {
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data.user;
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.hash = '#admin/login';
        window.location.reload();
    },

    async getUser() {
        const { data } = await supabase.auth.getSession();
        return data.session?.user || null;
    },

    async isAuthenticated() {
        const { data } = await supabase.auth.getSession();
        return !!data.session;
    }
};
