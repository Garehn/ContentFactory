
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Clapperboard, Sparkles } from 'lucide-react';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
    ssr: false,
    loading: () => <div className="w-full h-64 bg-slate-900 animate-pulse rounded-lg" />
});

export default function Home() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [script, setScript] = useState<any>(null);

    const generateScript = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });
            const data = await res.json();
            if (data.video && data.video.script) {
                setScript(data.video.script);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate script.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-purple-500/30">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <header className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-400">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>AI Content Engine v0.1</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Create Viral Videos <br /> in Seconds.
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Autonomous content generation powered by Claude & Remotion.
                        Just enter a topic and watch the magic happen.
                    </p>
                </header>

                {/* Input Function */}
                <div className="bg-slate-900/50 border border-slate-800 p-2 rounded-2xl flex gap-2 shadow-2xl shadow-purple-900/10">
                    <input
                        type="text"
                        placeholder="What should we make a video about? (e.g. 'The History of Coffee')"
                        className="flex-1 bg-transparent border-none outline-none px-6 text-lg placeholder:text-slate-600"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateScript()}
                    />
                    <button
                        onClick={generateScript}
                        disabled={loading || !topic}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white px-8 py-4 rounded-xl font-medium flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Clapperboard className="w-5 h-5" />}
                        {loading ? 'Thinking...' : 'Generate'}
                    </button>
                </div>

                {/* Result Area */}
                {script && (
                    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Left: Script Preview */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                                <span className="w-2 h-8 bg-purple-500 rounded-full" />
                                Generated Script
                            </h3>
                            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 h-[400px] overflow-y-auto font-mono text-sm space-y-4">
                                <div className="text-emerald-400"># Title: {script.title}</div>
                                {script.scenes.map((scene: any, i: number) => (
                                    <div key={i} className="p-3 bg-slate-950 rounded-lg border border-slate-800/50">
                                        <div className="text-slate-500 text-xs mb-1">Scene {i + 1} ({scene.duration_estimate}s)</div>
                                        <div className="text-slate-300">{scene.text}</div>
                                        <div className="text-purple-400/60 text-xs mt-2 italic flex gap-1">
                                            <span>👁️</span> {scene.visual_cue}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Video Preview */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                                <span className="w-2 h-8 bg-emerald-500 rounded-full" />
                                Live Preview
                            </h3>
                            <VideoPlayer script={script} />
                            <div className="flex gap-2">
                                <button className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-lg text-sm font-medium transition-colors">
                                    Regenerate Script
                                </button>
                                <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-sm font-medium transition-colors">
                                    Export MP4
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
