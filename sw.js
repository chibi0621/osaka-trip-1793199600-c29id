/* 離線用：第一次打開時把頁面和圖片存進手機；之後沒網路也能開。更新頁面時把 VERSION 改掉。 */
const VERSION="osaka-walk-v11";
const FILES=["./","index.html","manifest.webmanifest",
 "img/banner-pink.jpg","img/banner-lilac.jpg","img/icon-180.png","img/icon-192.png","img/icon-512.png",
 "img/me-d1.png","img/me-d2.png","img/me-d3.png","img/me-d4.png","img/me-d5.png","img/me-d6.png","img/kitty.png","img/cinnamoroll.png","img/kuromi.png","img/pompompurin.png","img/piano.png","img/pochacco.png","img/keroppi.png","img/usahana.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    // 自己的檔案：有網路就拿新的並更新快取，沒網路就用存好的
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));return r}).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));
  }else if(url.host.includes("fonts.googleapis.com")||url.host.includes("fonts.gstatic.com")){
    // 字型：先用存好的
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(req,cp));return res})));
  }
});
