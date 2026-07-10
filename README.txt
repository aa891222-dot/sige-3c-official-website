四哥3C 官方網站 - 品牌官網 + 線上預訂 + D1 後台

這份專案適合部署到 Cloudflare Pages，因為它包含 Pages Functions 與 D1 資料庫功能。

主要內容
- index.html：品牌首頁、商品預訂、購物車、門市資訊
- admin.html：後台管理頁
- assets/css/styles.css：紅黑動漫科技風樣式與手機版 RWD
- assets/js/main.js：前台互動、商品讀取、購物車與訂單送出
- assets/js/admin.js：後台優惠、商品價格折扣、訂單狀態管理
- functions/api/offers.js：優惠 D1 API
- functions/api/products.js：商品 D1 API
- functions/api/orders.js：訂單 D1 API
- migrations/0001_shop_schema.sql：D1 資料表建立 SQL

已保留
- 紅黑動漫科技風
- 店長、黑貓 Kuro、白色貴賓 Momo 品牌角色
- Google 評論入口
- Facebook 粉絲專頁入口
- Google 地圖導航入口
- 撥打電話：03-363-9939
- 優惠後台與 Cloudflare D1

新增線上購物功能
- 目前分類：充電線、充電頭、行動電源
- 前台可加入購物車並送出預訂單
- 後台可設定 SKU、商品名稱、分類、原價、優惠價、庫存、描述、是否上架
- 優惠價留空表示沒有折扣
- 優惠價低於原價時，前台會顯示折扣價、原價刪除線與折扣標籤
- 訂單送出後會寫入 D1，並扣除商品庫存
- 後台可查看訂單並更新狀態：新訂單、已確認、可取貨、已完成、已取消

後台位置
部署後開啟：
/admin.html

Cloudflare Pages 設定
1. 將整個專案上傳或推送到 GitHub repository。
2. 在 Cloudflare Pages 連接該 repository。
3. 建立 D1 database，並綁定名稱為 DB。
4. 在 Pages 的環境變數新增 ADMIN_PASSWORD，作為後台管理密碼。
5. 可到 D1 Console 執行 migrations/0001_shop_schema.sql；即使未手動執行，API 也會嘗試自動建立資料表。
6. 部署完成後到 /admin.html 輸入 ADMIN_PASSWORD，就可以修改優惠、商品價格折扣與處理訂單。

注意
- 這份專案包含 Cloudflare Pages Functions，若部署到純 GitHub Pages，前台靜態畫面可顯示，但後台、D1、商品更新與訂單功能不會運作。
- 商品金額以新台幣整數儲存。
