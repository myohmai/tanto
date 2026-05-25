import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

const BUCKET = 'media';

export const uploadGlossMedia = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop() ?? 'bin';
    const path = `gloss/${nanoid()}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type });

    if (error) throw error;

    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path);

    return data.publicUrl;
};
