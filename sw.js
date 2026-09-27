const CACHE='otakujeux-runtime-v1';
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url);
 if(event.request.method!=='GET') return;
 const isGame=u.pathname.endsWith('/game.js')||u.pathname.endsWith('/index.html')||u.pathname.includes('/vendor/');
 const isHero=u.href==='https://threejs.org/examples/models/gltf/Soldier.glb'||u.href==='https://threejs.org/examples/models/gltf/Michelle.glb';
 if(!isGame&&!isHero)return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
   const hit=await cache.match(event.request);
   if(hit)return hit;
   try{
     const res=await fetch(event.request);
     if(res.ok||res.type==='cors') cache.put(event.request,res.clone());
     return res;
   }catch(e){return cache.match(event.request)||Response.error();}
 }));
});