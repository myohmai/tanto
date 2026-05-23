import { supabase } from '@/lib/supabase';

export const isAdmin = async (): Promise<boolean> => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) return false;

    const { data } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

    return !!data;
};
