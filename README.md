# Benchmark test for iReversi Server
[iReversi GitHub repository](https://github.com/ireversi/ireversi-client)  
src/test/default.js author - [@Shohei-Japan](https://github.com/Shohei-Japan)

## Setup
1. Install [Node.js v8.x.x or v10.x.x](https://nodejs.org/en/)
1. Install Git on your own
1. Open tarminal

```bash
$ git clone https://github.com/ireversi/ireversi-benchmark.git
```

4. Copy and rename src/test/template.js -> src/test/{yourname}.js

```bash
$ cd ireversi-benchmark

$ npm install

$ npm run dev

# stop - Ctrl + C
```

5. Edit src/test/{yourname}.js

## 設定
1. [Node.js v8.x.x or v10.x.x](https://nodejs.org/ja/) をインストール
1. Gitを自力でインストール
1. ターミナルに以下コマンドを入力

```bash
$ git clone https://github.com/ireversi/ireversi-benchmark.git
# Gitのインストールがわからない場合は上記URLからZIPをDL
```

4. src/test/template.js をコピーして src/test/{yourname}.js にリネーム

```bash
$ cd ireversi-benchmark

$ npm install

$ npm run dev

# 停止するには - Ctrl + C
```

5. src/test/{yourname}.js を編集

## 条件
1. src/test/{yourname}.js 以外を変更しない
1. resultの%はマシン依存なく比較できる想定
1. failureが出ない範囲において src/test/{yourname}.jsは自由に編集して良い
1. src/test/default.js を土台にしても良い
1. userIdは1-65,535を想定
1. 盤面の最大サイズはXY軸共に-256から255（262,144マス）
1. 初期駒は { x: 0, y: 0, userId: 1 }  
1. 速度を計測する関数はjudgePieceのみ  
