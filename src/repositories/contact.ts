import { supabase } from '@/lib/supabase';
import type { UserContact, ContactType, ContactStatus } from '@/app/types/contact';

type ContactRow = {
    id: string;
    user_id: string;
    type: ContactType;
    title: string;
    body: string;
    status: ContactStatus;
    created_at: string;
};

const toUserContact = (row: ContactRow): UserContact => ({
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    body: row.body,
    status: row.status,
    createdAt: new Date(row.created_at).getTime(),
});

export const submitContact = async (
    type: ContactType,
    title: string,
    body: string,
): Promise<void> => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { error } = await supabase.from('user_contacts').insert({
        user_id: userId,
        type,
        title,
        body,
        status: 'pending',
    });

    if (error) throw error;
};

export const getContacts = async (): Promise<UserContact[]> => {
    const { data, error } = await supabase
        .from('user_contacts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as ContactRow[]).map(toUserContact);
};

export const getContactsByType = async (type: ContactType): Promise<UserContact[]> => {
    const { data, error } = await supabase
        .from('user_contacts')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as ContactRow[]).map(toUserContact);
};

export const updateContactStatus = async (id: string, status: ContactStatus): Promise<void> => {
    const { error } = await supabase
        .from('user_contacts')
        .update({ status })
        .eq('id', id);

    if (error) throw error;
};
