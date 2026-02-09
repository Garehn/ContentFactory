import { NextRequest, NextResponse } from 'next/server';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { script, audioUrl, sceneImages } = body;

        if (!script) {
            return NextResponse.json({ error: 'Script is required' }, { status: 400 });
        }

        console.log('📹 Starting video export...');

        // Bundle the Remotion code
        const bundleLocation = await bundle({
            entryPoint: path.join(process.cwd(), 'src/remotion/index.ts'),
            webpackOverride: (config) => config,
        });

        console.log('✅ Bundle created');

        // Get composition
        const composition = await selectComposition({
            serveUrl: bundleLocation,
            id: 'MyVideo',
            inputProps: {
                title: script.title,
                scenes: script.scenes,
                audioSrc: audioUrl,
                sceneImages: sceneImages || {}
            },
        });

        console.log('✅ Composition selected');

        // Create output path
        const outputPath = path.join(os.tmpdir(), `video-${Date.now()}.mp4`);

        // Render video
        await renderMedia({
            composition,
            serveUrl: bundleLocation,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps: {
                title: script.title,
                scenes: script.scenes,
                audioSrc: audioUrl,
                sceneImages: sceneImages || {}
            },
        });

        console.log('✅ Video rendered to:', outputPath);

        // Read the video file
        const videoBuffer = await fs.readFile(outputPath);

        // Clean up
        await fs.unlink(outputPath);
        await fs.rm(bundleLocation, { recursive: true, force: true });

        // Return the video
        return new NextResponse(videoBuffer, {
            headers: {
                'Content-Type': 'video/mp4',
                'Content-Disposition': `attachment; filename="video-${Date.now()}.mp4"`,
                'Content-Length': videoBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('Video export error:', error);
        return NextResponse.json({
            error: 'Video export failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
