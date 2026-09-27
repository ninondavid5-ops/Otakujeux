(function(){
'use strict';
const root=document.getElementById('game'), start=document.getElementById('start'), status=document.getElementById('loadStatus');
if(!window.THREE||!THREE.GLTFLoader){status.textContent='Le moteur 3D n’a pas pu être chargé. Recharge la page.';return}
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9bc7df);
scene.fog=new THREE.Fog(0x9bc7df,45,125);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,180);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;root.appendChild(renderer.domElement);
const hemi=new THREE.HemisphereLight(0xe8f4ff,0x46532e,2.2);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe6bd,3);sun.position.set(-25,35,20);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(140,140),new THREE.MeshStandardMaterial({color:0x4d7d48,roughness:1}));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const path=new THREE.Mesh(new THREE.PlaneGeometry(7,100),new THREE.MeshStandardMaterial({color:0xb99a6b,roughness:1}));
path.rotation.x=-Math.PI/2;path.position.y=.012;scene.add(path);
const loader=new THREE.GLTFLoader();
loader.register((parser)=>new THREE_VRM.VRMLoaderPlugin(parser));
loader.crossOrigin='anonymous';
const ASSETS={
aren:'https://arweave.net/-eJyDjujQRvakRImdvulg-1dKQkPwMeQv-55IbKqLh4',
lyra:'https://raw.githubusercontent.com/GY19A/jev-stage/main/static/vrm/anime_girl.vrm',
village:'https://cdn.3dassets.dev/assets/38092/v1/model.glb',
boar:'https://gobkit.com/freebies/animalB/Boar.glb',
tree:'https://gobkit.com/freebies/environment/TreeMed001.glb',
rock:'https://gobkit.com/freebies/environment/Rock002.glb'
};
const S=Object.assign({level:1,xp:0,hp:100,maxHp:100,gold:25,rep:0,guild:0,bond:15,potions:2,stage:0,kills:0},JSON.parse(localStorage.getItem('otaku3d')||'{}'));
const keys={};let started=false,dialog=false,last=performance.now(),attackCd=0,msg=0;
const player={x:0,z:18,model:null,vrm:null};const lyra={x:-3,z:7,model:null,vrm:null};const enemies=[];
function save(){localStorage.setItem('otaku3d',JSON.stringify(S));hud()}
function rank(){return S.guild>=80?'S':S.guild>=60?'A':S.guild>=40?'B':S.guild>=25?'C':S.guild>=12?'D':S.guild>=5?'E':'F'}
function need(){return 70+(S.level-1)*50}
function gainxp(n){S.xp+=n;while(S.xp>=need()){S.xp-=need();S.level++;S.maxHp+=15;S.hp=S.maxHp;toast('✨ Niveau '+S.level+' !')}}
function hud(){document.getElementById('stats').innerHTML='<div class="title">AREN · RANG '+rank()+'</div>PV '+Math.round(S.hp)+'/'+S.maxHp+' · Niv. '+S.level+' · 💰 '+S.gold+'<div class="bar"><div class="hp" style="width:'+100*S.hp/S.maxHp+'%"></div></div><div class="bar"><div class="xp" style="width:'+100*S.xp/need()+'%"></div></div><span class="small">XP '+S.xp+'/'+need()+' · Réputation '+S.rep+' · Lyra '+S.bond+'</span>';const q=S.stage===0?'Retrouver Lyra':S.stage===1?'Parler à Lyra et accepter la mission':S.stage===2?'Vaincre 3 monstres ('+S.kills+'/3)':S.stage===3?'Retourner voir Lyra':'Explorer le monde';document.getElementById('quest').innerHTML='<b>QUÊTE</b><br>'+q+'<br><span class="small">Guilde '+rank()+' · Potions '+S.potions+'</span>'}
function toast(t){const e=document.getElementById('message');e.textContent=t;e.style.display='block';msg=3}
function dialogBox(w,t,opts){dialog=true;document.getElementById('speaker').textContent=w;document.getElementById('dialogText').textContent=t;const c=document.getElementById('choices');c.innerHTML='';opts.forEach(o=>{const b=document.createElement('button');b.className='choice';b.textContent=o[0];b.onclick=o[1];c.appendChild(b)});document.getElementById('dialog').style.display='block'}
function closeDialog(){dialog=false;document.getElementById('dialog').style.display='none';hud()}
function interact(){if(!started||dialog)return;if(Math.hypot(player.x-lyra.x,player.z-lyra.z)<4){if(S.stage===0)dialogBox('LYRA','Aren ! Tu es enfin libre. La guilde recrute des aventuriers.',[['Partir avec Lyra',()=>{S.stage=1;S.bond+=8;closeDialog();toast('Lyra rejoint ton aventure.');save()}]]);else if(S.stage===1)dialogBox('LYRA','Commençons par une mission de rang F : vaincre trois monstres.',[['Accepter',()=>{S.stage=2;S.guild+=5;closeDialog();toast('Mission F commencée.');save()}]]);else if(S.stage===3)dialogBox('LYRA','Tu as réussi. Notre vraie aventure commence maintenant.',[['Continuer',()=>{S.stage=4;S.rep+=10;S.guild+=12;S.gold+=40;gainxp(60);closeDialog();toast('🌲 Une nouvelle région est ouverte.');save()}]]);else toast('Lyra : Notre aventure ne fait que commencer.')}else toast('Approche-toi de Lyra.')}
function potion(){if(S.potions<=0)return toast('Plus de potion.');if(S.hp>=S.maxHp)return toast('PV au maximum.');S.potions--;S.hp=Math.min(S.maxHp,S.hp+45);save();toast('🧪 +45 PV')}
function attack(){if(!started||dialog||attackCd>0)return;attackCd=.4;let best=null,bd=3.2;for(const e of enemies){const d=Math.hypot(player.x-e.x,player.z-e.z);if(d<bd){bd=d;best=e}}if(!best)return toast('Aucun ennemi à portée.');best.hp-=20+S.level*5;toast('⚔️ Coup porté');if(best.hp<=0){scene.remove(best.model);enemies.splice(enemies.indexOf(best),1);S.kills++;S.gold+=10;S.rep+=3;S.guild+=2;gainxp(28);if(S.stage===2&&S.kills>=3){S.stage=3;toast('Mission terminée ! Retourne voir Lyra.')}save()}}
function load(url,onDone,scale){loader.load(url,g=>{const vrm=g.userData.vrm;if(vrm){const m=vrm.scene;m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});m.scale.setScalar(scale||1);onDone(m,vrm)}else{const m=g.scene;m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});m.scale.setScalar(scale||1);onDone(m,null)}},undefined,()=>onDone(null,null))}
function placeWorld(){
load(ASSETS.village,(m)=>{if(m){m.position.set(0,0,-9);scene.add(m)}},1);
for(const p of [[-14,0,-18],[15,0,-22],[-20,0,2],[19,0,8],[-14,0,20],[14,0,26]])load(ASSETS.tree,m=>{if(m){m.position.set(p[0],p[1],p[2]);m.scale.multiplyScalar(2.5);scene.add(m)}});
for(const p of [[-9,0,-2],[10,0,-7],[11,0,18],[-12,0,12]])load(ASSETS.rock,m=>{if(m){m.position.set(p[0],p[1],p[2]);m.scale.multiplyScalar(1.8);scene.add(m)}});
}
function loadVrm(url,onDone,scale){loader.load(url,g=>{const vrm=g.userData.vrm;if(!vrm)return onDone(null);const m=vrm.scene;m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});m.scale.setScalar(scale||1);onDone(vrm)},undefined,()=>onDone(null))}
function animateAvatar(vrm,t,walking,attacking){
if(!vrm)return;
vrm.update(1/60);
const h=vrm.humanoid;
if(h){
 const lArm=h.getNormalizedBoneNode&&h.getNormalizedBoneNode('leftUpperArm'), rArm=h.getNormalizedBoneNode&&h.getNormalizedBoneNode('rightUpperArm');
 const lLeg=h.getNormalizedBoneNode&&h.getNormalizedBoneNode('leftUpperLeg'), rLeg=h.getNormalizedBoneNode&&h.getNormalizedBoneNode('rightUpperLeg');
 const spine=h.getNormalizedBoneNode&&h.getNormalizedBoneNode('spine');
 if(walking){const s=Math.sin(t*9)*.38;if(lArm)lArm.rotation.x=s;if(rArm)rArm.rotation.x=-s;if(lLeg)lLeg.rotation.x=-s;if(rLeg)rLeg.rotation.x=s}
 else {if(lArm)lArm.rotation.x=0;if(rArm)rArm.rotation.x=0;if(lLeg)lLeg.rotation.x=0;if(rLeg)rLeg.rotation.x=0}
 if(attacking&&rArm){rArm.rotation.x=-1.5-Math.max(0,Math.sin(t*24))*.7}
 if(spine)spine.rotation.y=Math.sin(t*1.7)*.025;
}
if(vrm.expressionManager){vrm.expressionManager.setValue('happy',Math.sin(t*1.2)>.65?.18:0);vrm.expressionManager.update()}
}
function makeCharacters(){
loadVrm(ASSETS.aren,vrm=>{if(vrm){player.vrm=vrm;player.model=vrm.scene;player.model.position.set(player.x,0,player.z);player.model.scale.setScalar(1.15);scene.add(player.model)}});
loadVrm(ASSETS.lyra,vrm=>{if(vrm){lyra.vrm=vrm;lyra.model=vrm.scene;lyra.model.position.set(lyra.x,0,lyra.z);lyra.model.scale.setScalar(1.05);scene.add(lyra.model)}});
for(let i=0;i<5;i++){const a=Math.random()*Math.PI*2,r=10+Math.random()*24,e={x:Math.cos(a)*r,z:Math.sin(a)*r,hp:50+S.level*8,cd:0,model:null};enemies.push(e);load(ASSETS.boar,m=>{if(m){e.model=m;m.position.set(e.x,0,e.z);m.scale.setScalar(.9);scene.add(m)}},1)}
}
placeWorld();makeCharacters();hud();
let loaded=true;status.textContent='Monde 3D chargé. Personnages et décor texturés prêts.';start.disabled=false;start.textContent='ENTRER DANS LE MONDE';
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key===' '){e.preventDefault();attack()}if(e.key.toLowerCase()==='e')interact();if(e.key.toLowerCase()==='p')potion()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();keys[k]=true};b.onpointerup=b.onpointercancel=b.onpointerleave=()=>keys[k]=false});
document.querySelectorAll('[data-act]').forEach(b=>b.onpointerdown=()=>({attack,potion,interact}[b.dataset.act])());
start.onclick=()=>{started=true;document.getElementById('intro').style.display='none';toast('Bienvenue dans Renaissance. Retrouve Lyra.');};
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5))}addEventListener('resize',resize);
function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;if(started&&!dialog){let x=(keys.d?1:0)-(keys.a?1:0),z=(keys.s?1:0)-(keys.w?1:0);if(x||z){const l=Math.hypot(x,z);player.x+=x/l*5.5*dt;player.z+=z/l*5.5*dt;if(player.model){player.model.rotation.y=Math.atan2(x,z);player.model.position.x=player.x;player.model.position.z=player.z}}player.x=Math.max(-55,Math.min(55,player.x));player.z=Math.max(-55,Math.min(55,player.z));if(player.model){player.model.position.x=player.x;player.model.position.z=player.z}
if(lyra.model){lyra.model.position.x=lyra.x;lyra.model.position.z=lyra.z}
for(const e of enemies){e.cd-=dt;const dx=player.x-e.x,dz=player.z-e.z,d=Math.hypot(dx,dz);if(d<20&&d>.3){e.x+=dx/d*1.8*dt;e.z+=dz/d*1.8*dt;if(e.model){e.model.position.x=e.x;e.model.position.z=e.z;e.model.rotation.y=Math.atan2(dx,dz)}}if(d<1.5&&e.cd<=0){e.cd=1;S.hp=Math.max(0,S.hp-(5+S.level*2));if(S.hp===0){S.hp=S.maxHp/2;player.x=0;player.z=18;S.gold=Math.max(0,S.gold-15);toast('Tu as été vaincu.')}save()}}attackCd=Math.max(0,attackCd-dt);hud();if(msg>0){msg-=dt;if(msg<=0)document.getElementById('message').style.display='none'}}
animateAvatar(player.vrm,t/1000,!!(keys.w||keys.a||keys.s||keys.d),attackCd>0);animateAvatar(lyra.vrm,t/1000,false,false);const target=new THREE.Vector3(player.x,1.25,player.z);const desired=new THREE.Vector3(player.x+9,7,player.z+10);camera.position.lerp(desired,.08);camera.lookAt(target);renderer.render(scene,camera);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();
