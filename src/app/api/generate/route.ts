
import { NextResponse } from 'next/server';
import { generateScript } from '@/lib/claude';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        // 1. Generate Script with Claude
        console.log(`Generatng script for topic: ${topic}`);
        const script = await generateScript(topic);
        console.log("Script generated:", script);

        // 2. Save to Supabase
        const { data, error } = await supabase
            .from('videos') // Make sure this table exists!
            .insert([
                {
                    topic,
                    script,
                    status: 'script_generated',
                    metadata: {
                        provider: "claude-3-5-sonnet",
                        version: "1.0"
                    }
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
        }

        return NextResponse.json({ success: true, video: data });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
