import { defineConfig } from 'vite';
import { resolve } from 'path';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

export default defineConfig({
    plugins: [
        ViteEjsPlugin({
            title: 'Сергей Андреев',
            description:
                'IT-архитектор и руководитель с фокусом на продуктовую разработку. Создаю эффективные команды и масштабируемые решения для бизнеса.',
            twitterUrl: 'https://twitter.com/dragorww',
            telegramUrl: 'https://t.me/dragorww',
            telegramChannelUrl: 'https://t.me/AndreevSergey_IT',
            githubUrl: 'https://github.com/dragorww',
            youtubeUrl: 'https://youtube.com/@dragorww',
        }),
        {
            name: 'reload-on-ejs-change',
            handleHotUpdate({ file, server }) {
                if (file.endsWith('.ejs')) {
                    server.ws.send({
                        type: 'full-reload',
                        path: '*',
                    });
                    return [];
                }
            },
        },
    ],
    root: 'src',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    base: '/',
    server: {
        open: true,
        watch: {
            usePolling: true,
        },
        hmr: {
            overlay: true,
        },
    },
});
