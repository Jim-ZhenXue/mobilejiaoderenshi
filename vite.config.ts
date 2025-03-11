import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 确保静态资源被复制到构建目录
    assetsDir: 'assets',
    // 复制静态文件到构建目录
    rollupOptions: {
      input: {
        main: './index.html',
        txt: './public/kE9LyVjiV0.txt'
      }
    }
  },
  // 配置开发服务器以正确处理静态文件
  server: {
    watch: {
      usePolling: true
    }
  },
  // 确保public目录中的文件可以正确被引用
  publicDir: 'public'
})