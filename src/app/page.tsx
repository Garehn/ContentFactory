
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
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [generatingVoice, setGeneratingVoice] = useState(false);
    const [sceneImages, setSceneImages] = useState<Record<number, string>>({});
    const [generatingImages, setGeneratingImages] = useState(false);
    const [exporting, setExporting] = useState(false);

    const generateScript = async () => {
        if (!topic) return;
        setLoading(true);
        setAudioUrl(null); // Reset audio
        setSceneImages({}); // Reset images
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });
            const data = await res.json();
            if (data.video && data.video.script) {
                setScript(data.video.script);
                // Automatically generate voiceover and images
                await Promise.all([
                    generateVoiceover(data.video.script),
                    generateImages(data.video.script)
                ]);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate script.");
        } finally {
            setLoading(false);
        }
    };

    const generateVoiceover = async (scriptData: any) => {
        setGeneratingVoice(true);
        try {
            // Combine all scene text into narration
            const narration = scriptData.scenes
                .map((scene: any) => scene.text)
                .join(' ');

            const res = await fetch('/api/voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: narration })
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                console.log('✅ Voiceover generated successfully');
            } else {
                console.warn('Voice generation failed, continuing without audio');
            }
        } catch (e) {
            console.error('Voiceover error:', e);
            // Don't block the UI if voice fails
        } finally {
            setGeneratingVoice(false);
        }
    };

    const generateImages = async (scriptData: any) => {
        setGeneratingImages(true);
        const imageMap: Record<number, string> = {};

        try {
            console.log('🎨 Generating B-roll images for', scriptData.scenes.length, 'scenes');

            // Generate images for each scene (limit to first 5 to avoid rate limits)
            const scenesToGenerate = scriptData.scenes.slice(0, 5);

            const imagePromises = scenesToGenerate.map(async (scene: any, index: number) => {
                try {
                    const res = await fetch('/api/generate-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            visualCue: scene.visual_cue,
                            sceneText: scene.text
                        })
                    });

                    if (res.ok) {
                        const data = await res.json();
                        if (data.imageUrl) {
                            imageMap[index] = data.imageUrl;
                            console.log(`✅ Generated image ${index + 1}/${scenesToGenerate.length}`);
                        }
                    } else {
                        console.warn(`Image generation failed for scene ${index + 1}`);
                    }
                } catch (err) {
                    console.error(`Error generating image for scene ${index + 1}:`, err);
                }
            });

            await Promise.all(imagePromises);
            setSceneImages(imageMap);
            console.log('🎨 All images generated:', Object.keys(imageMap).length);

        } catch (e) {
            console.error('Image generation error:', e);
            // Don't block the UI if images fail
        } finally {
            setGeneratingImages(false);
        }
    };

    const handleExport = async () => {
        if (!script) return;

        setExporting(true);
        try {
            console.log('📹 Initiating video export...');

            const res = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    script,
                    audioUrl,
                    sceneImages
                })
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${script.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.mp4`;
                a.click();
                URL.revokeObjectURL(url);
                console.log('✅ Video exported successfully');
            } else {
                throw new Error('Export failed');
            }
        } catch (e) {
            console.error('Export error:', e);
            alert('Failed to export video. Please try again.');
        } finally {
            setExporting(false);
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
                                {generatingVoice && (
                                    <span className="text-xs text-purple-400 flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Generating voice...
                                    </span>
                                )}
                                {generatingImages && (
                                    <span className="text-xs text-blue-400 flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Generating images... ({Object.keys(sceneImages).length}/5)
                                    </span>
                                )}
                            </h3>
                            <VideoPlayer script={script} audioUrl={audioUrl} sceneImages={sceneImages} />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => generateScript()}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    🔄 Regenerate Script
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {exporting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>📹 Export MP4</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
