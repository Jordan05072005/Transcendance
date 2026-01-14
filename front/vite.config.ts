import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'


export default defineConfig({
  plugins: [react(), tailwindcss()],
	 resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
	server: {
		host: true,
		port: 5173,
		proxy: {
			'/auth': {
				target: 'https://auth-service:3001',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/auth/, ''),
			},
			'/users': {
				target: 'https://users-service:3001',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/users/, ''),
			},
			'/friends': {
				target: 'https://friends-service:3001',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/friends/, ''),
			},
			'/matches': {
				target: 'https://matches-service:3001',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path,
			},
	}},
})

