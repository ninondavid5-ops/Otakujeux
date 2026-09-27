(()=>{'use strict';
const T=THREE,root=document.getElementById('game'),start=document.getElementById('start'),status=document.getElementById('loadStatus');
const scene=new T.Scene();scene.background=new T.Color(0x081426);scene.fog=new T.FogExp2(0x71849b,.0065);
const camera=new T.PerspectiveCamera(55,innerWidth/innerHeight,.1,300);
const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});const MOBILE=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||innerWidth<900;renderer.setPixelRatio(MOBILE?Math.min(devicePixelRatio||1,1.15):Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=!MOBILE;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;root.appendChild(renderer.domElement);
scene.add(new T.HemisphereLight(0xa9cfff,0x26351f,2.1));
const sun=new T.DirectionalLight(0xdce8ff,2.5);sun.position.set(-40,55,25);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const M=(c,r=.8,m=0)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const G=(c,o=.85)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false});
const mesh=(g,m)=>{const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;return o};
const box=(w,h,d,m)=>mesh(new T.BoxGeometry(w,h,d),m),cyl=(r,h,m,n=16)=>mesh(new T.CylinderGeometry(r,r*.92,h,n),m),sph=(r,m)=>mesh(new T.SphereGeometry(r,18,14),m),cone=(r,h,m,n=7)=>mesh(new T.ConeGeometry(r,h,n),m);
const rand=(a,b)=>a+Math.random()*(b-a),dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const world=box(190,.8,190,M(0x243d2d));world.position.y=-.4;scene.add(world);
const grass=box(175,.12,175,M(0x3d5c36));grass.position.y=.04;scene.add(grass);
const water=box(13,.22,175,M(0x1c6280,.28));water.position.set(35,.08,0);scene.add(water);
function road(x,z,w,d,r=0){const q=box(w,.07,d,M(0x9d7a58));q.position.set(x,.13,z);q.rotation.y=r;scene.add(q)}
road(0,10,7,130);road(-18,-16,5,55,Math.PI/2);road(18,-18,5,45,Math.PI/2);road(0,-42,5,40);
function tree(x,z,s=1,dead=false){const g=new T.Group(),tr=cyl(.38,2.5,M(dead?0x3b3027:0x503322),12);tr.position.y=1.25;g.add(tr);if(dead){const br=cyl(.12,2,M(0x392a24),8);br.rotation.z=.65;br.position.set(.35,2.2,0);g.add(br)}else{for(const [y,r,c] of [[3.1,2.1,0x28583a],[4.55,1.65,0x347044],[5.55,1.05,0x418653]]){const a=cone(r,2.7,M(c),8);a.position.y=y;g.add(a)}}g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g)}
for(let i=0;i<(MOBILE?30:55);i++){let x=rand(-78,78),z=rand(-78,78);if(Math.abs(x)<25&&Math.abs(z)<30)continue;tree(x,z,rand(.65,1.35),z<-48)}
function rock(x,z,s=1){const r=mesh(new T.DodecahedronGeometry(rand(.7,1.3)*s,1),M(0x66717a));r.position.set(x,rand(.2,.7),z);r.scale.y=.65;scene.add(r)}
for(let i=0;i<(MOBILE?22:42);i++)rock(rand(-80,80),rand(-80,80),rand(.6,1.5));
function mountain(x,z,s){const b=cone(11*s,20*s,M(0x3c4b60),8);b.position.set(x,10*s,z);scene.add(b);const sn=cone(4*s,7*s,M(0xd8e1e5),8);sn.position.set(x,18*s,z);scene.add(sn)}
mountain(-62,-70,2.4);mountain(-12,-82,2.8);mountain(48,-70,2.3);mountain(75,-20,1.8);
function house(x,z,s=1,c=0x713d3c){const g=new T.Group(),w=box(5*s,3.1*s,4*s,M(0xb88b63));w.position.y=1.55*s;g.add(w);const r=cone(3.7*s,2.6*s,M(c),4);r.rotation.y=Math.PI/4;r.position.y=4.3*s;g.add(r);const d=box(.85*s,1.65*s,.16*s,M(0x32231d));d.position.set(0,.82*s,2.08*s);g.add(d);g.position.set(x,0,z);scene.add(g)}
[[-10,-13,1.15], [10,-13,1.05],[-11,-25,.9],[11,-24,.95],[-20,-17,.8],[20,-20,.85]].forEach(p=>house(...p));
function castle(){const g=new T.Group(),st=M(0x737d89,.72),roof=M(0x29334a);const k=box(14,9,10,st);k.position.y=4.5;g.add(k);for(const x of[-9,9])for(const z of[-5,5]){const t=cyl(2.2,15,st,12);t.position.set(x,7.5,z);g.add(t);const r=cone(2.8,5,roof,8);r.position.set(x,17,z);g.add(r)}const gate=box(3,5,.4,M(0x2b211e));gate.position.set(0,2.5,5.2);g.add(gate);g.position.set(0,0,-49);g.scale.setScalar(1.25);scene.add(g)}
castle();
function guild(){const g=new T.Group(),w=box(9,5,5,M(0xa27650));w.position.y=2.5;g.add(w);const r=cone(6,4,M(0x3b465f),4);r.rotation.y=Math.PI/4;r.position.y=7;g.add(r);const sign=box(5,.9,.22,M(0x573822));sign.position.set(0,4.9,2.7);g.add(sign);const emblem=cyl(.72,.18,M(0xd8b65c,.35,.5),8);emblem.rotation.x=Math.PI/2;emblem.position.set(0,5.2,2.85);g.add(emblem);g.position.set(-17,-11,0);scene.add(g)}
guild();
function ruin(x,z){const g=new T.Group();for(const p of [[-3,2,0],[3,2,0],[-3,2,4],[3,2,4]]){const c=box(1.2,4,1.2,M(0x62636a));c.position.set(...p);g.add(c)}const ring=mesh(new T.TorusGeometry(3,.28,10,32),G(0x6b48ff));ring.rotation.x=Math.PI/2;ring.position.y=3;g.add(ring);g.position.set(x,0,z);scene.add(g)}
ruin(-42,25);ruin(49,32);
function portal(x,z,c=0x46d9ff){const g=new T.Group(),r=mesh(new T.TorusGeometry(3,.3,14,48),G(c));r.rotation.x=Math.PI/2;r.position.y=3;g.add(r);const q=sph(2,G(c,.28));q.position.y=3;q.scale.z=.12;g.add(q);g.position.set(x,0,z);scene.add(g);return g}
portal(42,37);portal(-48,-27,0xb45cff);
function dungeon(){const g=new T.Group(),door=box(9,7,2,M(0x282936));door.position.y=3.5;g.add(door);const arch=mesh(new T.TorusGeometry(4,.55,12,32),M(0x4d465a));arch.position.set(0,4,1.1);g.add(arch);for(let i=0;i<4;i++){const t=cone(.55,1.8,M(0xff7438),7);t.position.set(i*2-3,7,0);g.add(t)}g.position.set(-42,-55,0);scene.add(g)}
dungeon();
for(const p of [[-5,-11],[5,-11],[-18,-11],[18,-11],[-42,-27],[42,37]]){const f=cyl(.22,1,M(0x4a3020));f.position.set(p[0],.5,p[1]);scene.add(f);const fl=cone(.48,1.25,G(0xff9a28));fl.position.set(p[0],1.35,p[1]);scene.add(fl)}
const md=sph(5,M(0xeaf4ff,.45));md.position.set(-48,52,-75);scene.add(md);
for(let i=0;i<(MOBILE?45:100);i++){const s=sph(.025,M(0xf0f6ff,.4));s.position.set(rand(-95,95),rand(25,85),rand(-105,-30));scene.add(s)}
const S=Object.assign({level:1,xp:0,hp:120,maxHp:120,gold:40,rep:0,guild:0,bond:20,potions:3,kills:0,stage:0,skills:0,loot:0,day:0},JSON.parse(localStorage.getItem('otaku3d')||'{}'));
const player={x:0,z:18,model:new T.Group(),ready:false,mixer:null,actions:{},attack:0,walking:false};const lyra={x:-3,z:4,model:new T.Group(),ready:false,mixer:null,actions:{}};player.model.visible=true;lyra.model.visible=true;
scene.add(player.model,lyra.model);
function fit(obj,h){obj.visible=true;obj.updateMatrixWorld(true);const b=new T.Box3().setFromObject(obj),sz=b.getSize(new T.Vector3());if(sz.y)obj.scale.multiplyScalar(h/sz.y);obj.updateMatrixWorld(true);const b2=new T.Box3().setFromObject(obj);obj.position.y-=b2.min.y;obj.updateMatrixWorld(true);obj.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;n.frustumCulled=false}})}
function weapon(target,type){let hand=null;target.model.traverse(n=>{if(!hand&&/right.?hand|hand_r|mixamorigRightHand/i.test(n.name))hand=n});const g=new T.Group();if(type==='sword'){const blade=box(.13,1.65,.07,M(0xe6efff,.22,.8));blade.position.y=.82;g.add(blade);const guard=box(.58,.09,.13,M(0xd9b14d,.3,.7));guard.position.y=.1;g.add(guard)}else{const staff=cyl(.06,1.9,M(0x68452b),10);staff.position.y=.95;g.add(staff);const orb=sph(.18,G(0x64dcff));orb.position.y=1.98;g.add(orb)}if(hand)hand.add(g);else{g.position.set(0,1,0);target.model.add(g)}}
function loadHero(target,url,h,type){return new Promise((resolve,reject)=>{const l=new T.GLTFLoader();let done=false;const ok=g=>{if(done)return;done=true;const m=g.scene;fit(m,h);target.model=m;target.ready=true;m.visible=true;m.position.set(target.x||0,0,target.z||0);scene.add(m);const idle=g.animations.find(a=>/idle|stand|breath/i.test(a.name))||g.animations[0],walk=g.animations.find(a=>/walk|run|locomotion|samba/i.test(a.name))||idle;const mixer=new T.AnimationMixer(m);target.mixer=mixer;target.actions={idle:idle?mixer.clipAction(idle):null,walk:walk?mixer.clipAction(walk):null};if(target.actions.idle)target.actions.idle.play();mixers.push(mixer);weapon(target,type);heroMarker(target,type==='sword'?'AREN':'LYRA',type==='sword'?0x69a7ff:0xff6f9d);resolve()};l.load(url,ok,undefined,e=>{if(!done){done=true;reject(e)}})})}
const AREN_URL='https://threejs.org/examples/models/gltf/Soldier.glb',LYRA_URL='https://threejs.org/examples/models/gltf/Michelle.glb';

function heroMarker(target,name,color){
 const g=new T.Group();
 const ring=mesh(new T.RingGeometry(.75,.9,32),G(color,.72));ring.rotation.x=-Math.PI/2;ring.position.y=.035;g.add(ring);
 const glow=mesh(new T.CircleGeometry(.68,32),G(color,.10));glow.rotation.x=-Math.PI/2;glow.position.y=.025;g.add(glow);
 const cv=document.createElement('canvas');cv.width=512;cv.height=128;const cx=cv.getContext('2d');cx.font='bold 54px system-ui';cx.textAlign='center';cx.fillStyle='#ffffff';cx.strokeStyle='#111827';cx.lineWidth=10;cx.strokeText(name,256,70);cx.fillText(name,256,70);
 const tx=new T.CanvasTexture(cv);const sp=mesh(new T.PlaneGeometry(3.2,.8),new T.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false}));sp.position.y=4.0;sp.rotation.x=0;g.add(sp);
 g.position.set(0,0,0);target.marker=g;target.model.add(g);
}
heroMarker(player,'AREN',0x69a7ff);heroMarker(lyra,'LYRA',0xff6f9d);

const mixers=[];
Promise.all([loadHero(player,AREN_URL,3.25,'sword'),loadHero(lyra,LYRA_URL,3.05,'staff')]).then(()=>{start.disabled=false;start.textContent='ENTRER DANS LE MONDE';status.textContent='✓ AREN + LYRA visibles · mode mobile optimisé · monde prêt.'}).catch(e=>{console.error(e);status.textContent='⚠️ Un personnage n’a pas répondu. Nouvelle tentative…';setTimeout(()=>location.reload(),1800)});
function goblin(){const g=new T.Group(),skin=M(0x607d3b),dark=M(0x293029),leather=M(0x64442e);const body=cyl(.48,1.15,skin,10);body.scale.set(1,.9,.72);body.position.y=.8;g.add(body);const head=sph(.58,skin);head.scale.set(1.05,.9,.85);head.position.y=1.7;g.add(head);const nose=cone(.22,.45,skin,7);nose.rotation.x=Math.PI/2;nose.position.set(0,1.62,.52);g.add(nose);for(const x of[-.35,.35]){const ear=cone(.3,.75,skin,5);ear.rotation.z=x<0?-1:1;ear.position.set(x,1.78,0);g.add(ear);const eye=sph(.075,G(0xffd33d));eye.position.set(x*.52,1.78,.51);g.add(eye)}const tunic=box(.9,.72,.72,dark);tunic.position.y=.72;g.add(tunic);for(const x of[-.62,.62]){const arm=cyl(.14,.85,leather,8);arm.rotation.z=x<0?-.35:.35;arm.position.set(x*.65,.95,0);g.add(arm)}const blade=box(.08,1.35,.1,M(0xaeb7bd,.35,.4));blade.position.set(.9,1.1,.05);blade.rotation.z=-.55;g.add(blade);const shield=box(.55,.7,.12,leather);shield.position.set(-.82,1,.15);g.add(shield);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
function slime(){const g=new T.Group(),b=sph(.78,M(0x6a49a2,.4));b.scale.y=.7;g.add(b);for(const x of[-.22,.22]){const e=sph(.08,G(0xffffff));e.position.set(x,.18,.62);g.add(e);const p=sph(.035,G(0x15151c));p.position.set(x,.18,.69);g.add(p)}return g}
function wolf(){const g=new T.Group(),b=box(1.25,.65,.55,M(0x59636e));b.position.y=.65;g.add(b);const h=sph(.43,M(0x59636e));h.position.set(0,.95,.62);g.add(h);for(const x of[-.38,.38])for(const z of[-.22,.22]){const l=cyl(.1,.7,M(0x414a53),8);l.position.set(x,.35,z);g.add(l)}return g}
function wraith(){const g=new T.Group(),b=sph(.75,G(0x76a7ff,.45));b.position.y=1.2;g.add(b);const eye=sph(.16,G(0xffffff));eye.position.set(0,1.3,.68);g.add(eye);return g}
const kinds=[['Gobelin',goblin,65,12,1.8],['Slime',slime,45,9,1.3],['Loup des Brumes',wolf,80,15,2.2],['Spectre',wraith,105,18,1.4]];
const enemies=[];
function spawn(kind,x,z){const k=kinds[kind],e={kind:k[0],model:k[1](),x,z,hp:k[2]+S.level*7,max:k[2]+S.level*7,atk:k[3],speed:k[4],cd:rand(0,.8),dead:false};e.model.position.set(x,0,z);scene.add(e.model);enemies.push(e);return e}
for(let i=0;i<5;i++)spawn(0,rand(-48,-27),rand(-40,5));
for(let i=0;i<4;i++)spawn(1,rand(25,65),rand(-45,45));
for(let i=0;i<4;i++)spawn(2,rand(20,60),rand(25,70));
for(let i=0;i<3;i++)spawn(3,rand(-65,-30),rand(25,65));
function chest(x,z){const g=new T.Group(),c=box(1.4,.75,1,M(0x7b4a25));c.position.y=.45;g.add(c);const lid=box(1.45,.35,1.05,M(0xb67a32));lid.position.y=.93;g.add(lid);const lock=box(.18,.22,.08,M(0xf0cc57,.3,.7));lock.position.set(0,.65,.54);g.add(lock);g.position.set(x,0,z);scene.add(g);return g}
const chests=[chest(-28,13),chest(27,-8),chest(48,26),chest(-53,-45)];const opened=new Set();
function rank(){return S.guild>=100?'S':S.guild>=75?'A':S.guild>=55?'B':S.guild>=35?'C':S.guild>=18?'D':S.guild>=7?'E':'F'}
function need(){return 80+(S.level-1)*60}
function save(){localStorage.setItem('otaku3d',JSON.stringify(S));hud()}
function gainxp(n){S.xp+=n;while(S.xp>=need()){S.xp-=need();S.level++;S.maxHp+=18;S.hp=S.maxHp;toast('✨ Niveau '+S.level+' — ta légende grandit !')}}
function hud(){const hp=Math.max(0,100*S.hp/S.maxHp),xp=100*S.xp/need();document.getElementById('stats').innerHTML='<b>AREN · RANG '+rank()+'</b><br>❤️ '+Math.round(S.hp)+'/'+S.maxHp+' · Niv. '+S.level+' · 💰 '+S.gold+'<div class="bar"><div class="hp" style="width:'+hp+'%"></div></div><div class="bar"><div class="xp" style="width:'+xp+'%"></div></div><span class="small">XP '+S.xp+'/'+need()+' · Réputation '+S.rep+' · Lien Lyra '+S.bond+'</span>';const q=S.stage===0?'Retrouver Lyra':S.stage===1?'Accepter la chasse aux gobelins':S.stage===2?'Éliminer 3 créatures ('+S.kills+'/3)':S.stage===3?'Retourner à Lyra':'Explorer les régions et trouver les trésors';document.getElementById('quest').innerHTML='<b>📜 QUÊTE ACTIVE</b><br>'+q+'<br><span class="small">Guilde '+rank()+' · 🧪 '+S.potions+' · ⚔️ '+S.skills+' compétences</span>'}
let toastTimer=0;function toast(t){const e=document.getElementById('message');e.textContent=t;e.style.display='block';toastTimer=3}
let dialog=false;function closeDialog(){dialog=false;document.getElementById('dialog').style.display='none';hud()}
function dialogBox(w,t,opts){dialog=true;document.getElementById('speaker').textContent=w;document.getElementById('dialogText').textContent=t;const c=document.getElementById('choices');c.innerHTML='';opts.forEach(o=>{const b=document.createElement('button');b.className='choice';b.textContent=o[0];b.onclick=o[1];c.appendChild(b)});document.getElementById('dialog').style.display='block'}
function interact(){if(!started||dialog)return;if(dist(player,lyra)<4.5){if(S.stage===0)dialogBox('LYRA','Aren ! La forêt est infestée de gobelins. Si nous voulons être reconnus, il faut commencer quelque part.',[['Partir ensemble',()=>{S.stage=1;S.bond+=10;closeDialog();toast('🤝 Lyra rejoint ton aventure.');save()}]]);else if(S.stage===1)dialogBox('LYRA','Trois créatures. Mais fais attention : certains ennemis sont plus rapides que les autres.',[['Accepter la mission',()=>{S.stage=2;S.guild+=5;closeDialog();toast('⚔️ Contrat de la guilde accepté.');save()}]]);else if(S.stage===3)dialogBox('LYRA','Tu as tenu parole. Au-delà des montagnes, un ancien donjon nous attend.',[['Continuer',()=>{S.stage=4;S.rep+=20;S.guild+=15;S.gold+=80;gainxp(100);closeDialog();toast('🌌 De nouvelles terres deviennent accessibles.');save()}]]);else dialogBox('LYRA','Regarde les gobelins : ils ne ressemblent plus aux simples créatures de légende. Certains portent des armes, des boucliers et travaillent en meute.',[['D’accord',()=>{S.bond++;closeDialog()}]]);return}
for(const c of chests){if(!opened.has(c)&&Math.hypot(player.x-c.position.x,player.z-c.position.z)<2.7){opened.add(c);c.rotation.x=-.25;S.gold+=rand(15,45)|0;S.loot++;gainxp(25);toast('🎁 Coffre ouvert : butin trouvé !');save();return}}toast('Il n’y a personne à qui parler ici.')}
function potion(){if(S.potions<=0)return toast('Plus de potion.');if(S.hp>=S.maxHp)return toast('PV au maximum.');S.potions--;S.hp=Math.min(S.maxHp,S.hp+55);save();toast('🧪 Potion utilisée : +55 PV')}
let attackCd=0;
function attack(){if(!started||dialog||attackCd>0)return;attackCd=.45;let best=null,bd=4;for(const e of enemies){const d=dist(player,e);if(d<bd){bd=d;best=e}}if(!best)return toast('Aucun ennemi à portée.');const damage=25+S.level*6+S.skills*3;best.hp-=damage;player.attack=.28;toast('⚔️ '+best.kind+' touché — '+damage);if(best.hp<=0){scene.remove(best.model);best.dead=true;S.kills++;S.gold+=best.kind==='Gobelin'?16:11;S.rep+=best.kind==='Gobelin'?4:2;S.guild+=2;gainxp(best.kind==='Loup des Brumes'?38:28);if(S.stage===2&&S.kills>=3){S.stage=3;toast('🏆 Mission accomplie ! Retourne voir Lyra.')}save()}}
function skill(){if(S.gold<35)return toast('Il faut 35 pièces pour apprendre une compétence.');S.gold-=35;S.skills++;S.maxHp+=5;toast('✨ Nouvelle compétence apprise !');save()}
function animate(dt){for(const m of mixers)m.update(dt);if(lyra.model)lyra.model.position.y=Math.sin(phase*1.6)*.025;const a=player.actions,w=a&&(player.attack>0?a.idle:(player.walking?a.walk:a.idle));if(w&&!w.isRunning()){Object.values(a).filter(Boolean).forEach(x=>x.stop());w.reset().fadeIn(.12).play()}if(player.attack>0)player.attack=Math.max(0,player.attack-dt)}
function startGame(){if(!player.ready||!lyra.ready)return;started=true;document.getElementById('intro').style.display='none';toast('🌅 Renaissance commence. Retrouve Lyra au village.')}
start.onclick=startGame;hud();
const keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key===' '){e.preventDefault();attack()}if(e.key.toLowerCase()==='e')interact();if(e.key.toLowerCase()==='p')potion();if(e.key.toLowerCase()==='k')skill()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();keys[k]=true};b.onpointerup=b.onpointercancel=b.onpointerleave=()=>keys[k]=false});document.querySelectorAll('[data-act]').forEach(b=>b.onpointerdown=()=>({attack,potion,interact,skill}[b.dataset.act])());
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6))});
let started=false,last=performance.now(),phase=0;
function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;phase+=dt;
if(started&&!dialog){lyra.model.position.set(lyra.x,0,lyra.z);lyra.model.rotation.y=Math.sin(phase*.5)*.18;let x=(keys.d?1:0)-(keys.a?1:0),z=(keys.s?1:0)-(keys.w?1:0);if(x||z){const l=Math.hypot(x,z);player.x+=x/l*5.8*dt;player.z+=z/l*5.8*dt;player.model.rotation.y=Math.atan2(x,z);player.walking=true}else player.walking=false;
player.x=Math.max(-82,Math.min(82,player.x));player.z=Math.max(-82,Math.min(82,player.z));player.model.position.set(player.x,0,player.z);
for(const e of enemies){if(e.dead)continue;e.cd-=dt;const dx=player.x-e.x,dz=player.z-e.z,d=Math.hypot(dx,dz);if(d<22&&d>.4){e.x+=dx/d*e.speed*dt;e.z+=dz/d*e.speed*dt;e.model.position.set(e.x,0,e.z);e.model.rotation.y=Math.atan2(dx,dz)}if(d<1.7&&e.cd<=0){e.cd=1.1;S.hp=Math.max(0,S.hp-e.atk);toast('💥 '+e.kind+' t’attaque !');if(S.hp===0){S.hp=S.maxHp*.55;player.x=0;player.z=18;S.gold=Math.max(0,S.gold-20);toast('💀 Tu as été vaincu. Retour au village.')}save()}}
attackCd=Math.max(0,attackCd-dt);if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)document.getElementById('message').style.display='none'}hud()}
const night=(Math.sin(phase*.025)+1)/2;sun.intensity=1.15+night*1.4;scene.fog.density=.0058+night*.003;scene.background.setHSL(.60,.45,.07+.06*night);animate(dt);
const camDist=MOBILE?7.5:10.5;const target=new T.Vector3(player.x+camDist*.72,MOBILE?5.1:6.6,player.z+camDist);camera.position.lerp(target,.09);camera.lookAt(new T.Vector3(player.x,1.7,player.z));renderer.render(scene,camera);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();
