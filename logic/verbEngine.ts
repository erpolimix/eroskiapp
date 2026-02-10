
export type MorphemeType = 'subject' | 'object_plural' | 'root' | 'tense' | 'plural_marker';

export interface Morpheme {
    id: string;
    text: string;
    type: MorphemeType;
    label: string;
    character?: string; // For mnemonics
}

export const MORPHEMES: Record<string, Morpheme> = {
    // Subject Prefixes (NORK)
    'nik_prefix': { id: 'nik_prefix', text: 'N', type: 'subject', label: 'Ni (Yo)', character: 'Hammer-K' },
    'hark_prefix': { id: 'hark_prefix', text: 'D', type: 'subject', label: 'Hura (Él/Ella)' },
    'guk_prefix': { id: 'guk_prefix', text: 'G', type: 'subject', label: 'Gu (Nosotros)' },
    'zuk_prefix': { id: 'zuk_prefix', text: 'Z', type: 'subject', label: 'Zu (Tú)' },
    
    // Plural Object Markers
    'plural_obj': { id: 'plural_obj', text: 'IT', type: 'object_plural', label: 'Plural (Objetos)' },
    
    // Roots
    'root_ukan': { id: 'root_ukan', text: 'U', type: 'root', label: 'Ukan (Tener)' },
    
    // Suffixes (Subject indicators / Tense)
    'nik_suffix': { id: 'nik_suffix', text: 'T', type: 'subject', label: 'Yo (Final)', character: 'Hammer-K' },
    'guk_suffix': { id: 'guk_suffix', text: 'GU', type: 'subject', label: 'Nosotros' },
    'zuk_suffix': { id: 'zuk_suffix', text: 'ZU', type: 'subject', label: 'Tú' },
    'zuek_plural': { id: 'zuek_plural', text: 'TE', type: 'plural_marker', label: 'Plural (Sujeto)' },
    'haiek_plural': { id: 'haiek_plural', text: 'TE', type: 'plural_marker', label: 'Ellos' },
};

/**
 * Phonetic/Cacophony logic rules
 * Apply transformations to the assembled string
 */
export const applyCacophony = (parts: string[]): string => {
    let result = parts.join('');
    
    // Rule: D + U + T -> DUT
    // Rule: D + IT + U -> DITU
    
    // Rule: TUTE -> TUZTE (Plurality marker transformation)
    // If we have IT index before root or similar complexity
    if (result.includes('IT') && result.endsWith('TE')) {
        result = result.replace('TE', 'ZTE');
    }
    
    // Rule: N + U + T -> NUT -> NAUT (Some dialects/archaic, but let's stick to standard Batua)
    // In Batua: NI -> N-AU-T. Let's adjust roots or prefixes.
    
    // Simplify for A1/A2:
    // NI -> N-A-U-T (Actually NORK markers change)
    
    return result.toUpperCase();
};

export const assembleVerb = (morphemes: Morpheme[]): string => {
    const texts = morphemes.map(m => m.text);
    return applyCacophony(texts);
};

// Data for scenarios
export const VERB_SCENARIOS = [
    {
        id: 'scenario_1',
        title: 'En el bar',
        description: 'Pide dos cervezas. (Yo tengo / Nik ...)',
        targetVerb: 'DITUT',
        neededMorphemes: ['hark_prefix', 'plural_obj', 'root_ukan', 'nik_suffix']
    },
    {
        id: 'scenario_2',
        title: 'Hablando con amigos',
        description: 'Vosotros nos habéis visto. (Zuek gu ...)',
        targetVerb: 'ZAITUZTE',
        // Note: NOR-NORK complex forms will need more morphemes
    }
];
