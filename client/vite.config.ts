import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    root: "./src",
    publicDir: "./public", // relative to root
    build: {
        emptyOutDir: true,
        outDir: "../build" // relative to root
    }
})