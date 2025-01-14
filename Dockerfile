# -----------------------------
# 1) 빌드(Stage 1): Node로 React 빌드
# -----------------------------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    RUN npm run build
    
    
    # -----------------------------
    # 2) 최종(Stage 2): Nginx로 서빙
    # -----------------------------
    FROM nginx:alpine
    
    # 1) 빌드 결과물(정적 파일) 복사
    COPY --from=builder /app/build /usr/share/nginx/html
    
    # 2) Nginx 설정 파일 복사 (위에서 만든 default.conf)
    COPY nginx/nginx.conf /etc/nginx/nginx.conf
    
    # Nginx 기본 포트
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    