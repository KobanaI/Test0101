# Node.jsの公式イメージを使用
FROM node:18

# Pythonをインストールするために必要なパッケージをインストール
RUN apt-get update && apt-get install -y python3 python3-pip

# 作業ディレクトリを作成
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピーしてnpm installを実行
COPY package*.json ./
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# ポートを開放
EXPOSE 4000

# サーバー起動コマンド（通常のExpressアプリケーションの場合）
CMD ["npm", "start"]
