/* Página: red primero (toma la versión nueva si hay internet), caché si no hay conexión. Íconos y manifiesto: caché primero. */
const C='iwcf-l4-v3';
const F=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const page=r.mode==='navigate'||r.url.endsWith('.html')||r.url.endsWith('/');
  if(page){e.respondWith(fetch(r,{cache:'no-cache'}).then(n=>{if(n.ok){const cp=n.clone();caches.open(C).then(c=>c.put('./index.html',cp))}return n}).catch(()=>caches.match('./index.html',{ignoreSearch:true})));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(n=>{const cp=n.clone();caches.open(C).then(x=>x.put(r,cp));return n})))});
