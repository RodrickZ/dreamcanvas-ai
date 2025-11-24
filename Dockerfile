# Stage 1: 构建阶段 - 生成静态文件
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 执行构建，生成静态文件到 dist 目录
RUN npm run build

# Stage 2: 运行阶段 - 仅运行静态服务器
# 使用一个非常小的、安全的镜像来运行最终服务
FROM node:20-slim
WORKDIR /usr/src/app
# 在运行阶段仅安装 production 依赖（包含 serve），避免全局安装
# 先复制 package.json/package-lock.json，再安装 production 依赖
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# 从构建阶段复制静态文件
COPY --from=build /app/dist /usr/src/app/dist

# Cloud Run 默认端口是 8080，服务器必须监听它
ENV PORT 8080

# 使用本地安装的 serve（通过 npx 调用），并通过 shell 展开 $PORT
CMD ["sh", "-c", "npx serve -s dist -l \"$PORT\""]
