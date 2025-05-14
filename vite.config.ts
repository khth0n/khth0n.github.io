// vite.config.ts
import { defineConfig } from "vite";

import { fileURLToPath } from 'url'

export default defineConfig({

    build: {

        outDir: 'docs',

        rollupOptions: {

                input: {
                    index:  fileURLToPath(new URL('index.html', import.meta.url)),
                    projects: fileURLToPath(new URL('projects/index.html', import.meta.url)),
                    demos: fileURLToPath(new URL('demos/index.html', import.meta.url)),
                    demos_noisegen: fileURLToPath(new URL('demos/noisegen/index.html', import.meta.url)),
                    qualifications: fileURLToPath(new URL('qualifications/index.html', import.meta.url)),
                    outreach: fileURLToPath(new URL('outreach/index.html', import.meta.url))
                }
        }
    }
    /*
    resolve: {
        alias: {
            '@': './src',
            '@projects': './src/projects'
        },
    }
    */
});