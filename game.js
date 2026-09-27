(()=>{
'use strict';
const root=document.getElementById('game'),start=document.getElementById('start'),status=document.getElementById('loadStatus');
if(!window.THREE){status.textContent='Le moteur 3D local n’est pas disponible.';return}
const T=THREE, scene=new T.Scene();
scene.background=new T.Color(0x91c8e5); scene.fog=new T.Fog(0x91c8e5,45,120);
const camera=new T.PerspectiveCamera(58,innerWidth/innerHeight,.1,180);
const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;root.appendChild(renderer.domElement);
scene.add(new T.HemisphereLight(0xeaf6ff,0x50613b,2.1));
const sun=new T.DirectionalLight(0xffe5bd,3.1);sun.position.set(-25,35,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const mat=(c,rough=1)=>new T.MeshStandardMaterial({color:c,roughness:rough});
const ground=new T.Mesh(new T.PlaneGeometry(150,150),mat(0x4c7b48));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const path=new T.Mesh(new T.PlaneGeometry(7,120),mat(0xb99a6a));path.rotation.x=-Math.PI/2;path.position.y=.02;scene.add(path);
function cube(w,h,d,m){const x=new T.Mesh(new T.BoxGeometry(w,h,d),m);x.castShadow=x.receiveShadow=true;return x}
function cyl(r,h,m){const x=new T.Mesh(new T.CylinderGeometry(r,r*.9,h,12),m);x.castShadow=x.receiveShadow=true;return x}
function sphere(r,m){const x=new T.Mesh(new T.SphereGeometry(r,16,12),m);x.castShadow=x.receiveShadow=true;return x}
function tree(x,z,s=1){const g=new T.Group();const trunk=cyl(.35,2,mat(0x68442d));trunk.position.y=1;g.add(trunk);const a=sphere(1.5,mat(0x2f6d3d));a.position.y=3;g.add(a);const b=sphere(1.15,mat(0x3f8248));b.position.set(.7,3.6,.2);g.add(b);g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g)}
function rock(x,z,s=1){const g=new T.Group();const r=new T.Mesh(new T.DodecahedronGeometry(1,0),mat(0x747b7c));r.scale.set(1.2,.7,.9);r.castShadow=r.receiveShadow=true;g.add(r);g.position.set(x,.45,z);g.scale.setScalar(s);scene.add(g)}
for(const p of [[-14,-18],[15,-22],[-20,2],[19,8],[-14,20],[14,26],[-28,-12],[27,-5],[-25,25],[28,28]])tree(p[0],p[1],1.2);
for(const p of [[-9,-2],[10,-7],[11,18],[-12,12],[21,-18]])rock(p[0],p[1],1);
function house(x,z,scale=1){
 const g=new T.Group();const wall=mat(0xd9b27c), roof=mat(0x793f35);
 const b=cube(5,3.2,4,wall);b.position.y=1.6;g.add(b);
 const r=new T.Mesh(new T.ConeGeometry(3.5,2.5,4),roof);r.rotation.y=Math.PI/4;r.position.y=4.45;r.castShadow=true;g.add(r);
 const door=cube(.9,1.8,.12,mat(0x4a2b22));door.position.set(0,.9,2.06);g.add(door);
 g.position.set(x,0,z);g.scale.setScalar(scale);scene.add(g)
}
house(-7,-10,1);house(7,-10,.9);house(0,-17,1.15);
const villageSign=cube(3,.3,.25,mat(0x6b452b));villageSign.position.set(0,2.2,-5);scene.add(villageSign);
function makeHuman(name,skin,hair,clothes,accent){
 const g=new T.Group();g.userData.name=name;
 const body=cube(.9,1.35,.55,mat(clothes,.8));body.position.y=1.15;g.add(body);
 const head=sphere(.48,mat(skin,.65));head.position.y=2.15;g.add(head);
 const hairCap=sphere(.51,mat(hair,.6));hairCap.scale.y=.65;hairCap.position.set(0,2.43,0);g.add(hairCap);
 for(const sx of [-1,1]){const arm=cube(.25,1.15,.28,mat(clothes));arm.position.set(sx*.63,1.25,0);arm.rotation.z=sx*.08;g.add(arm);const hand=sphere(.16,mat(skin));hand.position.set(sx*.64,.65,0);g.add(hand);const leg=cube(.28,1.15,.3,mat(accent));leg.position.set(sx*.25,.05,0);g.add(leg)}
 const belt=cube(1,.18,.62,mat(accent));belt.position.y=.75;g.add(belt);
 const eye=mat(0x172033);for(const sx of [-.16,.16]){const e=sphere(.045,eye);e.scale.z=.2;e.position.set(sx,2.2,.46);g.add(e)}
 g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});return g
}
const S=Object.assign({level:1,xp:0,hp:100,maxHp:100,gold:25,rep:0,guild:0,bond:15,potions:2,stage:0,kills:0},JSON.parse(localStorage.getItem('otaku3d')||'{}'));
const player={x:0,z:18,model:makeHuman('Aren',0xd99b78,0x252536,0x394b73,0xc8a95d),walking:false,attack:0};
const lyra={x:-3,z:7,model:makeHuman('Lyra',0xe2b08d,0x6b3d5a,0x713d69,0xe6b35b)};
player.model.position.set(player.x,0,player.z);lyra.model.position.set(lyra.x,0,lyra.z);scene.add(player.model,lyra.model);
const enemies=[];
function makeMonster(){const g=new T.Group();const body=sphere(.7,mat(0x6d7b83));body.scale.y=.85;g.add(body);const head=sphere(.48,mat(0x82929a));head.position.y=.65;g.add(head);for(const sx of [-.35,.35]){const h=sphere(.08,mat(0xff5555));h.position.set(sx*.55,.78,.42);g.add(h)}g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});return g}
for(let i=0;i<6;i++){const a=Math.random()*Math.PI*2,r=11+Math.random()*25;const e={x:Math.cos(a)*r,z:Math.sin(a)*r,hp:50+S.level*8,cd:0,model:makeMonster()};e.model.position.set(e.x,0,e.z);scene.add(e.model);enemies.push(e)}
const keys={};let started=false,dialog=false,last=performance.now(),attackCd=0,msg=0;
function rank(){return S.guild>=80?'S':S.guild>=60?'A':S.guild>=40?'B':S.guild>=25?'C':S.guild>=12?'D':S.guild>=5?'E':'F'}
function need(){return 70+(S.level-1)*50}
function save(){localStorage.setItem('otaku3d',JSON.stringify(S));hud()}
function gainxp(n){S.xp+=n;while(S.xp>=need()){S.xp-=need();S.level++;S.maxHp+=15;S.hp=S.maxHp;toast('✨ Niveau '+S.level+' !')}}
function hud(){document.getElementById('stats').innerHTML='<b>AREN · RANG '+rank()+'</b><br>PV '+Math.round(S.hp)+'/'+S.maxHp+' · Niv. '+S.level+' · 💰 '+S.gold+'<div class="bar"><div class="hp" style="width:'+100*S.hp/S.maxHp+'%"></div></div><div class="bar"><div class="xp" style="width:'+100*S.xp/need()+'%"></div></div><span class="small">XP '+S.xp+'/'+need()+' · Réputation '+S.rep+' · Lyra '+S.bond+'</span>';const q=S.stage===0?'Retrouver Lyra':S.stage===1?'Parler à Lyra et accepter la mission':S.stage===2?'Vaincre 3 monstres ('+S.kills+'/3)':S.stage===3?'Retourner voir Lyra':'Explorer le monde';document.getElementById('quest').innerHTML='<b>QUÊTE</b><br>'+q+'<br><span class="small">Guilde '+rank()+' · Potions '+S.potions+'</span>'}
function toast(t){const e=document.getElementById('message');e.textContent=t;e.style.display='block';msg=3}
function closeDialog(){dialog=false;document.getElementById('dialog').style.display='none';hud()}
function dialogBox(w,t,opts){dialog=true;document.getElementById('speaker').textContent=w;document.getElementById('dialogText').textContent=t;const c=document.getElementById('choices');c.innerHTML='';opts.forEach(o=>{const b=document.createElement('button');b.className='choice';b.textContent=o[0];b.onclick=o[1];c.appendChild(b)});document.getElementById('dialog').style.display='block'}
function interact(){if(!started||dialog)return;if(Math.hypot(player.x-lyra.x,player.z-lyra.z)<4){if(S.stage===0)dialogBox('LYRA','Aren ! Tu es enfin arrivé. La guilde recrute des aventuriers.',[['Partir avec Lyra',()=>{S.stage=1;S.bond+=8;closeDialog();toast('Lyra rejoint ton aventure.');save()}]]);else if(S.stage===1)dialogBox('LYRA','Commençons par une mission de rang F : vaincre trois monstres.',[['Accepter',()=>{S.stage=2;S.guild+=5;closeDialog();toast('Mission F commencée.');save()}]]);else if(S.stage===3)dialogBox('LYRA','Tu as réussi. Notre vraie aventure commence maintenant.',[['Continuer',()=>{S.stage=4;S.rep+=10;S.guild+=12;S.gold+=40;gainxp(60);closeDialog();toast('🌲 Une nouvelle région est ouverte.');save()}]]);else toast('Lyra : Notre aventure ne fait que commencer.')}else toast('Approche-toi de Lyra.')}
function potion(){if(S.potions<=0)return toast('Plus de potion.');if(S.hp>=S.maxHp)return toast('PV au maximum.');S.potions--;S.hp=Math.min(S.maxHp,S.hp+45);save();toast('🧪 +45 PV')}
function attack(){if(!started||dialog||attackCd>0)return;attackCd=.45;let best=null,bd=3.2;for(const e of enemies){const d=Math.hypot(player.x-e.x,player.z-e.z);if(d<bd){bd=d;best=e}}if(!best)return toast('Aucun ennemi à portée.');best.hp-=20+S.level*5;toast('⚔️ Coup porté');if(best.hp<=0){scene.remove(best.model);enemies.splice(enemies.indexOf(best),1);S.kills++;S.gold+=10;S.rep+=3;S.guild+=2;gainxp(28);if(S.stage===2&&S.kills>=3){S.stage=3;toast('Mission terminée ! Retourne voir Lyra.')}save()}}
function animateHum(g,t,walking,attacking){const s=walking?Math.sin(t*9)*.35:0;g.children.forEach((o,i)=>{if(i===4||i===5){o.rotation.x=s*(i===4?1:-1)}});if(attacking)g.rotation.y+=Math.sin(t*25)*.04}
function startGame(){started=true;document.getElementById('intro').style.display='none';toast('Bienvenue dans Renaissance. Retrouve Lyra.')}
start.onclick=startGame;start.disabled=false;start.textContent='ENTRER DANS LE MONDE';status.textContent='Monde 3D local prêt. Aucun téléchargement externe requis.';hud();
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key===' '){e.preventDefault();attack()}if(e.key.toLowerCase()==='e')interact();if(e.key.toLowerCase()==='p')potion()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();keys[k]=true};b.onpointerup=b.onpointercancel=b.onpointerleave=()=>keys[k]=false});
document.querySelectorAll('[data-act]').forEach(b=>b.onpointerdown=()=>({attack,potion,interact}[b.dataset.act])());
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6))}addEventListener('resize',resize);
function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;if(started&&!dialog){let x=(keys.d?1:0)-(keys.a?1:0),z=(keys.s?1:0)-(keys.w?1:0);if(x||z){const l=Math.hypot(x,z);player.x+=x/l*5.5*dt;player.z+=z/l*5.5*dt;player.model.rotation.y=Math.atan2(x,z);player.walking=true}else player.walking=false;player.x=Math.max(-55,Math.min(55,player.x));player.z=Math.max(-55,Math.min(55,player.z));player.model.position.x=player.x;player.model.position.z=player.z;
for(const e of enemies){e.cd-=dt;const dx=player.x-e.x,dz=player.z-e.z,d=Math.hypot(dx,dz);if(d<20&&d>.3){e.x+=dx/d*1.8*dt;e.z+=dz/d*1.8*dt;e.model.position.x=e.x;e.model.position.z=e.z;e.model.rotation.y=Math.atan2(dx,dz)}if(d<1.5&&e.cd<=0){e.cd=1;S.hp=Math.max(0,S.hp-(5+S.level*2));if(S.hp===0){S.hp=S.maxHp/2;player.x=0;player.z=18;S.gold=Math.max(0,S.gold-15);toast('Tu as été vaincu.')}save()}}attackCd=Math.max(0,attackCd-dt);hud();if(msg>0){msg-=dt;if(msg<=0)document.getElementById('message').style.display='none'}}
animateHum(player.model,t/1000,player.walking,attackCd>0);camera.position.lerp(new T.Vector3(player.x+9,7,player.z+10),.08);camera.lookAt(new T.Vector3(player.x,1.25,player.z));renderer.render(scene,camera);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();