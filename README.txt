四哥3C Official Website FULL v1 - Optimized

這是一份可直接部署到 GitHub Pages、Netlify、Vercel 或一般靜態主機的網站專案。

專案內容
- index.html：四哥3C 官方網站首頁
- assets/css/style.css：紅黑動漫科技風樣式與手機版 RWD
- assets/js/script.js：選單、動畫、資料連結套用與效能優化
- assets/data/site.json：店家電話、Google 評論、Facebook、Google 地圖等集中設定
- assets/images/concept-design.jpeg：概念主視覺
- assets/images/store-sign.jpeg：店家招牌圖

已確認保留功能
- Google 評論入口
- Facebook 粉絲專頁入口
- Google 地圖導航入口
- 電話撥打入口：03-363-9939
- NFC / QR Code 導流說明
- 最新優惠區塊
- 服務項目與選擇理由區塊
- 店家招牌與概念圖素材

已優化項目
- HTML 語意結構與 SEO meta
- CSS RWD 手機版版面
- 動畫效能：游標光暈與捲動事件使用 requestAnimationFrame
- reveal 動畫只觸發一次，減少後續觀察成本
- 支援 prefers-reduced-motion，降低使用者不適與效能負擔
- 主要連結可從 assets/data/site.json 集中維護

部署方式
1. 將整個資料夾內容上傳到 GitHub repository 根目錄。
2. 到 Settings > Pages。
3. Source 選 Deploy from a branch。
4. Branch 選 main，資料夾選 / root。
5. 儲存後等待 GitHub Pages 建置。

NFC 建議寫入網址
https://aa891222-dot.github.io/sige-3c-official-website/
