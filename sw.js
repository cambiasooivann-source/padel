/* Pádel Champions · service worker: permite instalar la app y abrirla sin internet */
const C='padel-v57';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'])).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // el juego: primero internet (para recibir versiones nuevas), si no hay, la copia guardada
 if(u.origin===location.origin){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));return}
 // librerías 3D de los CDN: guardadas para jugar sin conexión
 if(/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com/.test(u.host)&&!/peerjs/.test(u.pathname)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res})));return}
});
