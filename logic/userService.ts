
import { supabase } from '../lib/supabase';
import { User } from '../types';

export const getUserProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    if (data) {
        // Check if we need to reset daily XP (new day)
        const lastActive = new Date(data.last_active_date);
        const today = new Date();
        const isSameDay = lastActive.getDate() === today.getDate() &&
            lastActive.getMonth() === today.getMonth() &&
            lastActive.getFullYear() === today.getFullYear();

        let currentDailyXp = data.daily_xp || 0;

        if (!isSameDay) {
            // It's a new day, reset daily XP in DB
            currentDailyXp = 0;
            await supabase.from('profiles').update({
                daily_xp: 0,
                last_active_date: new Date().toISOString()
            }).eq('id', userId);
        }

        return {
            name: data.full_name || data.username || 'Usuario',
            xp: data.xp || 0,
            streak: data.streak || 0,
            level: data.level || 1,
            avatar: data.avatar_url || '',
            daily_xp: currentDailyXp,
            daily_goal: data.daily_goal || 50
        };
    }
    return null;
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
    // Map User type back to database columns
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.full_name = updates.name;
    if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
    if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.avatar) dbUpdates.avatar_url = updates.avatar;
    if (updates.daily_xp !== undefined) dbUpdates.daily_xp = updates.daily_xp;

    const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
    }
};

export const addXp = async (userId: string, amount: number) => {
    // First get current XP
    const { data: profile } = await supabase
        .from('profiles')
        .select('xp, level, daily_xp, last_active_date')
        .eq('id', userId)
        .single();

    if (!profile) return;

    let newXp = (profile.xp || 0) + amount;

    // Daily Logic
    const lastActive = new Date(profile.last_active_date);
    const today = new Date();
    const isSameDay = lastActive.getDate() === today.getDate() &&
        lastActive.getMonth() === today.getMonth() &&
        lastActive.getFullYear() === today.getFullYear();

    let newDailyXp = (isSameDay ? (profile.daily_xp || 0) : 0) + amount;

    let newLevel = profile.level;
    // Simple level up logic: Level = sqrt(XP / 100) or similar, 
    // but for now let's just say every 500 XP is a level
    const calculatedLevel = Math.floor(newXp / 500) + 1;
    if (calculatedLevel > newLevel) {
        newLevel = calculatedLevel;
        // Maybe return a "levelUp" flag?
    }

    await supabase.from('profiles').update({
        xp: newXp,
        level: newLevel,
        daily_xp: newDailyXp,
        last_active_date: new Date().toISOString()
    }).eq('id', userId);

    return { newXp, newLevel, newDailyXp, levelUp: newLevel > profile.level };
};

export const saveScenarioProgress = async (userId: string, scenarioId: string, score: number) => {
    const { error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: userId,
            scenario_id: scenarioId,
            status: 'completed',
            score: score,
            last_played_at: new Date().toISOString()
        }, { onConflict: 'user_id,scenario_id' });

    if (error) {
        console.error('Error saving progress:', error);
    }
};
