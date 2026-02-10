'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, Clapperboard, Sparkles, Target, Search, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
    ssr: false,
    loading: () => <div className="w-full h-64 bg-slate-900 animate-pulse rounded-lg" />
});

interface AgentProgress {
    stage: 'strategist' | 'investigator' | 'scribe' | 'refiner' | 'complete';
    percentage: number;
    currentAgent: string;
    output?: any;
}

export default function MultiAgentPage() {
    const [topic, setTopic] = useState('');
    const [audience, setAudience] = useState('');
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState<AgentProgress | null>(null);

    // Outputs from each agent
    const [strategicBrief, setStrategicBrief] = useState<string | null>(null);
    const [researchDossier, setResearchDossier] = useState<string | null>(null);
    const [script, setScript] = useState<any>(null);
    const [qualityAssessment, setQualityAssessment] = useState<any>(null);

    // For voiceover and images
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [sceneImages, setSceneImages] = useState<Record<number, string>>({});
    const [generatingVoice, setGeneratingVoice] = useState(false);
    const [generatingImages, setGeneratingImages] = useState(false);

    const generateWithMultiAgent = async () => {
        if (!topic) return;

        setGenerating(true);
        setProgress(null);
        setStrategicBrief(null);
        setResearchDossier(null);
        setScript(null);
        setQualityAssessment(null);
        setAudioUrl(null);
        setSceneImages({});

        try {
            const response = await fetch('/api/generate-multi-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    audience: audience || undefined
                })
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader available');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.slice(6));

                        setProgress(data);

                        // Store outputs as they complete
                        if (data.output?.brief) setStrategicBrief(data.output.brief);
                        if (data.output?.dossier) setResearchDossier(data.output.dossier);
                        if (data.output?.script) setScript(data.output.script);
                        if (data.output?.assessment) setQualityAssessment(data.output.assessment);

                        // When complete, trigger voiceover and images
                        if (data.stage === 'complete' && data.output?.script) {
                            await Promise.all([
                                generateVoiceover(data.output.script),
                                generateImages(data.output.script)
                            ]);
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate video.");
        } finally {
            setGenerating(false);
        }
    };

    const generateVoiceover = async (scriptData: any) => {
        setGeneratingVoice(true);
        try {
            const narration = scriptData.scenes.map((scene: any) => scene.text).join(' ');

            const res = await fetch('/api/voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: narration })
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                console.log('✅ Voiceover generated');
            }
        } catch (e) {
            console.error('Voiceover error:', e);
        } finally {
            setGeneratingVoice(false);
        }
    };

    const generateImages = async (scriptData: any) => {
        setGeneratingImages(true);
        const imageMap: Record<number, string> = {};

        try {
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
                        }
                    }
                } catch (err) {
                    console.error(`Error generating image ${index + 1}:`, err);
                }
            });

            await Promise.all(imagePromises);
            setSceneImages(imageMap);
        } catch (e) {
            console.error('Image generation error:', e);
        } finally {
            setGeneratingImages(false);
        }
    };

    const getStageIcon = (stage: string) => {
        switch (stage) {
            case 'strategist': return <Target className="w-5 h-5" />;
            case 'investigator': return <Search className="w-5 h-5" />;
            case 'scribe': return <FileText className="w-5 h-5" />;
            case 'refiner': return <CheckCircle2 className="w-5 h-5" />;
            default: return <Sparkles className="w-5 h-5" />;
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white p-8 font-sans selection:bg-purple-500/30">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <header className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-400">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Multi-Agent System v2.0</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Premium Daily Video<br />Production System
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        4-Agent orchestration: Strategist → Investigator → Scribe → Refiner.
                        Quality-first approach for one exceptional video per day.
                    </p>
                </header>

                {/* Input Section */}
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Video Topic</label>
                        <input
                            type="text"
                            placeholder="e.g., 'Why black holes don't suck' or 'The hidden world of quantum computing'"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-6 py-4 text-lg placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && generateWithMultiAgent()}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Target Audience (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g., 'Science enthusiasts aged 25-40' or leave blank for default"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-6 py-4 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={generateWithMultiAgent}
                        disabled={generating || !topic}
                        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Clapperboard className="w-5 h-5" />}
                        {generating ? 'Generating...' : 'Generate Premium Video'}
                    </button>
                </div>

                {/* Progress Visualization */}
                {progress && (
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {getStageIcon(progress.stage)}
                                <div>
                                    <h3 className="font-semibold">{progress.currentAgent}</h3>
                                    <p className="text-sm text-slate-400">Stage: {progress.stage}</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-purple-400">{progress.percentage}%</span>
                        </div>

                        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-500"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>

                        {/* Agent Status Pills */}
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { name: 'Strategist', stage: 'strategist' },
                                { name: 'Investigator', stage: 'investigator' },
                                { name: 'Scribe', stage: 'scribe' },
                                { name: 'Refiner', stage: 'refiner' }
                            ].map(({ name, stage }) => (
                                <div
                                    key={stage}
                                    className={`px-3 py-2 rounded-lg text-sm text-center transition-all ${progress.stage === stage
                                            ? 'bg-purple-600 text-white'
                                            : progress.percentage > getStagePercentage(stage)
                                                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600'
                                                : 'bg-slate-800 text-slate-500'
                                        }`}
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Outputs Grid */}
                {script && (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column: Outputs */}
                        <div className="space-y-4">
                            {/* Strategic Brief */}
                            {strategicBrief && (
                                <details className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                                    <summary className="font-semibold cursor-pointer flex items-center gap-2">
                                        <Target className="w-4 h-4 text-purple-400" />
                                        Strategic Brief
                                    </summary>
                                    <pre className="mt-4 text-xs text-slate-300 whitespace-pre-wrap overflow-auto max-h-60">
                                        {strategicBrief}
                                    </pre>
                                </details>
                            )}

                            {/* Research Dossier */}
                            {researchDossier && (
                                <details className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                                    <summary className="font-semibold cursor-pointer flex items-center gap-2">
                                        <Search className="w-4 h-4 text-blue-400" />
                                        Research Dossier
                                    </summary>
                                    <pre className="mt-4 text-xs text-slate-300 whitespace-pre-wrap overflow-auto max-h-60">
                                        {researchDossier}
                                    </pre>
                                </details>
                            )}

                            {/* Final Script */}
                            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                                <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-4">
                                    <FileText className="w-5 h-5 text-emerald-400" />
                                    Final Script
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="text-emerald-400 font-mono"># {script.title}</div>
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

                            {/* Quality Assessment */}
                            {qualityAssessment && (
                                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                                    <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        Quality Scores
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(qualityAssessment.scores || {}).map(([key, value]: [string, any]) => (
                                            <div key={key} className="bg-slate-950 p-3 rounded-lg">
                                                <div className="text-xs text-slate-400 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                                <div className={`text-2xl font-bold ${value >= 8 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                                    {value}/10
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-3 bg-slate-950 rounded-lg flex items-center justify-between">
                                        <span className="text-sm text-slate-400">Overall Score</span>
                                        <span className="text-3xl font-bold text-emerald-400">
                                            {qualityAssessment.overallScore}/60
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Video Preview */}
                        <div className="space-y-4">
                            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                                <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2 mb-4">
                                    <Clapperboard className="w-5 h-5 text-emerald-400" />
                                    Live Preview
                                    {generatingVoice && (
                                        <span className="text-xs text-purple-400 flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Voice...
                                        </span>
                                    )}
                                    {generatingImages && (
                                        <span className="text-xs text-blue-400 flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Images ({Object.keys(sceneImages).length}/5)
                                        </span>
                                    )}
                                </h3>
                                <VideoPlayer script={script} audioUrl={audioUrl} sceneImages={sceneImages} />
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => generateWithMultiAgent()}
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        🔄 Regenerate
                                    </button>
                                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-sm font-medium transition-colors">
                                        📹 Export MP4
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}

function getStagePercentage(stage: string): number {
    switch (stage) {
        case 'strategist': return 25;
        case 'investigator': return 50;
        case 'scribe': return 70;
        case 'refiner': return 90;
        default: return 0;
    }
}
