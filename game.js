(()=>{
'use strict';
const T=THREE, root=document.getElementById('game'), start=document.getElementById('start'), status=document.getElementById('loadStatus');
if(!T){status.textContent='Moteur 3D indisponible.';return}
const scene=new T.Scene();
scene.background=new T.Color(0x0b1830);
scene.fog=new T.FogExp2(0x6f86a0,.008);
const camera=new T.PerspectiveCamera(55,innerWidth/innerHeight,.1,220);
const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;
root.appendChild(renderer.domElement);

const ambient=new T.HemisphereLight(0x9fc8ff,0x23331f,2.2);scene.add(ambient);
const moon=new T.DirectionalLight(0xc9dcff,2.2);moon.position.set(-30,45,25);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);scene.add(moon);

const M=(color,rough=.8,metal=0)=>new T.MeshStandardMaterial({color,roughness:rough,metalness:metal});
const glow=(color,intensity=2)=>new T.MeshBasicMaterial({color,transparent:true,opacity:.85});
function mesh(g,m){const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;return o}
function box(w,h,d,m){return mesh(new T.BoxGeometry(w,h,d),m)}
function cyl(r,h,m,n=16){return mesh(new T.CylinderGeometry(r,r*.92,h,n),m)}
function sph(r,m){return mesh(new T.SphereGeometry(r,20,14),m)}
function cone(r,h,m,n=6){return mesh(new T.ConeGeometry(r,h,n),m)}

function makeSky(){
 const sky=box(2,2,2,M(0x172b55));sky.scale.set(180,90,180);sky.position.y=35;scene.add(sky);
 const moonDisc=sph(5,M(0xeaf3ff,.5));moonDisc.position.set(-35,48,-70);scene.add(moonDisc);
 const halo=sph(6,glow(0x9fc8ff,1));halo.position.copy(moonDisc.position);halo.scale.set(1,1,.15);scene.add(halo);
 for(let i=0;i<70;i++){const s=sph(.035,M(0xe8f2ff,.5));s.position.set((Math.random()-.5)*150,20+Math.random()*55,-45-Math.random()*90);scene.add(s)}
}
makeSky();

const ground=box(150,.8,150,M(0x263f2c));ground.position.y=-.4;scene.add(ground);
const grass=box(130,.18,130,M(0x42633a));grass.position.y=.05;scene.add(grass);

function road(x,z,w,d,rot=0){
 const r=box(w,.08,d,M(0x9c7956));r.position.set(x,.16,z);r.rotation.y=rot;scene.add(r);
 const edge=M(0x70533d);for(let i=-Math.floor(d/4);i<Math.floor(d/4);i++){const p=box(.12,.04,.35,edge);p.position.set(x-w/2+.4,.22,z+i*4);scene.add(p)}
}
road(0,8,7,100);
road(-16,-12,5,45,Math.PI/2);
road(17,-15,5,38,Math.PI/2);

function tree(x,z,s=1){
 const g=new T.Group(), trunk=cyl(.42,2.4,M(0x4a3023),12);trunk.position.y=1.2;g.add(trunk);
 const a=cone(1.9,3.4,M(0x214c32),8);a.position.y=3.2;g.add(a);
 const b=cone(1.55,2.8,M(0x2d6940),8);b.position.y=4.8;g.add(b);
 g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);return g
}
for(const p of [[-24,-27,1.5],[-31,-8,1.2],[-26,16,1.4],[-20,31,1.3],[23,-25,1.5],[31,-5,1.2],[26,18,1.5],[20,34,1.3],[-37,25,1.1],[38,24,1.1]])tree(...p);
for(let i=0;i<28;i++){const side=Math.random()<.5?-1:1;tree(side*(10+Math.random()*27),-35+Math.random()*75,.55+Math.random()*.5)}

function mountain(x,z,s){
 const g=new T.Group(), base=cone(10*s,18*s,M(0x394b62),7);base.position.y=9*s;g.add(base);
 const snow=cone(3.2*s,6*s,M(0xcbd8df),7);snow.position.y=17*s;g.add(snow);
 g.position.set(x,0,z);scene.add(g)
}
mountain(-48,-58,2.1);mountain(-5,-72,2.5);mountain(43,-63,2.0);mountain(55,-20,1.6);

function house(x,z,s=1,roofColor=0x713c3c){
 const g=new T.Group(), wall=box(5*s,3.2*s,4*s,M(0xb98b62));wall.position.y=1.6*s;g.add(wall);
 const roof=cone(3.7*s,2.7*s,M(roofColor),4);roof.rotation.y=Math.PI/4;roof.position.y=4.5*s;g.add(roof);
 const door=box(.85*s,1.7*s,.15*s,M(0x35241d));door.position.set(0,.85*s,2.08*s);g.add(door);
 for(const q of [-1,1]){const win=box(.75*s,.7*s,.08*s,M(0x7ed5e5,0.35));win.position.set(q*1.45*s,1.8*s,2.05*s);g.add(win)}
 g.position.set(x,0,z);scene.add(g)
}
house(-9,-14,1.2);house(9,-14,1.1);house(-10,-25,.9);house(10,-25,.95);house(-18,-17,.8);house(18,-20,.85);

function castle(){
 const g=new T.Group(), stone=M(0x78808b,.7), dark=M(0x424a57), roof=M(0x28334a);
 const keep=box(13,9,9,stone);keep.position.y=4.5;g.add(keep);
 for(const x of [-8,8])for(const z of [-5,5]){const t=cyl(2.2,15,stone,12);t.position.set(x,7.5,z);g.add(t);const r=cone(2.9,5,roof,8);r.position.set(x,17,z);g.add(r)}
 const r=cone(8,7,roof,4);r.rotation.y=Math.PI/4;r.position.y=13;g.add(r);
 const gate=box(2.5,4,.3,M(0x24242c));gate.position.set(0,2.1,4.65);g.add(gate);
 g.position.set(0,0,-43);g.scale.setScalar(1.25);scene.add(g)
}
castle();

function guild(){
 const g=new T.Group(), wall=box(8,5,5,M(0x9d754f));wall.position.y=2.5;g.add(wall);
 const roof=cone(6,4,M(0x39465e),4);roof.rotation.y=Math.PI/4;roof.position.y=7;g.add(roof);
 const sign=box(4,.9,.25,M(0x5d3b25));sign.position.set(0,4.8,2.7);g.add(sign);
 const crest=cyl(.65,.16,M(0xd9b14d),8);crest.rotation.x=Math.PI/2;crest.position.set(0,5,2.86);g.add(crest);
 g.position.set(-16,-11,0);scene.add(g)
}
guild();

function portal(x,z){
 const g=new T.Group(), ring=new T.Mesh(new T.TorusGeometry(2.6,.25,12,48),glow(0x4fc9ff));ring.rotation.x=Math.PI/2;ring.position.y=2.7;g.add(ring);
 const core=sph(1.8,glow(0x2f8cff));core.position.y=2.7;core.scale.z=.15;g.add(core);
 for(let i=0;i<8;i++){const p=sph(.08,glow(i%2?0x9d6cff:0x4fffe0));p.position.set(Math.cos(i)*3,2.7+Math.sin(i)*2.3,Math.sin(i)*.4);g.add(p)}
 g.position.set(x,0,z);scene.add(g)
}
portal(29,27);

function fire(x,z){
 const g=new T.Group(), base=cyl(.25,1,M(0x4a3020));base.position.y=.5;g.add(base);
 const f=cone(.5,1.4,glow(0xff9a24));f.position.y=1.25;g.add(f);
 g.position.set(x,0,z);scene.add(g)
}
fire(-5,-11);fire(5,-11);fire(-19,-12);fire(19,-12);

function makeAren(){
 const g=new T.Group();g.userData.name='Aren';
 const skin=M(0xd99578,.65), hair=M(0x18233a,.55), blue=M(0x243d73,.7), steel=M(0x8295ae,.45, .45), gold=M(0xd4a94b,.4,.5), dark=M(0x242536);
 const torso=box(1.15,1.5,.7,blue);torso.position.y=1.45;g.add(torso);
 const armor=box(1.25,.42,.78,steel);armor.position.y=1.95;g.add(armor);
 const head=sph(.52,skin);head.position.y=2.65;g.add(head);
 const hairTop=sph(.6,hair);hairTop.scale.set(1, .72, 1);hairTop.position.set(0,2.92,0);g.add(hairTop);
 for(let i=0;i<7;i++){const spike=cone(.16,.55,hair,5);spike.rotation.z=(i-3)*.18;spike.position.set((i-3)*.13,3.05,.1);g.add(spike)}
 for(const sx of [-1,1]){const arm=box(.3,1.35, .35,blue);arm.position.set(sx*.78,1.45,0);arm.rotation.z=sx*.12;g.add(arm);const pa=box(.38,.28,.5,steel);pa.position.set(sx*.78,1.95,0);g.add(pa);const leg=box(.4,1.3,.4,dark);leg.position.set(sx*.3,.15,0);g.add(leg);const boot=box(.48,.3,.72,steel);boot.position.set(sx*.3,-.48,.15);g.add(boot)}
 const belt=box(1.25,.18,.75,gold);belt.position.y=.78;g.add(belt);
 const cape=box(1.5,2.2,.08,M(0x18254d));cape.position.set(0,1.45,-.48);g.add(cape);
 const sword=new T.Group();const blade=box(.16,2.8,.12,M(0xbfeaff,.2,.8));blade.position.y=1.4;sword.add(blade);const guard=box(.8,.12,.18,gold);guard.position.y=.1;sword.add(guard);const grip=box(.18,.65,.18,dark);grip.position.y=-.3;sword.add(grip);sword.position.set(1.25,1.1,.15);sword.rotation.z=-.22;g.add(sword);g.userData.sword=sword;
 const eye=M(0x17233a);for(const sx of [-.17,.17]){const e=sph(.055,eye);e.position.set(sx,2.68,.48);g.add(e)}
 g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});return g
}
function makeLyra(){
 const g=new T.Group();g.userData.name='Lyra';
 const skin=M(0xe3aa91,.6), hair=M(0xa94731,.5), purple=M(0x573069,.7), gold=M(0xd5a64d,.4,.5), white=M(0xe8d9cf,.7);
 const torso=box(1.05,1.45,.65,purple);torso.position.y=1.4;g.add(torso);
 const head=sph(.5,skin);head.position.y=2.58;g.add(head);
 const hairBack=sph(.72,hair);hairBack.scale.set(.9,1.15,.65);hairBack.position.set(0,2.55,-.18);g.add(hairBack);
 for(const sx of [-1,1]){const lock=cyl(.18,1.8,hair,10);lock.position.set(sx*.58,2.1,.02);lock.rotation.z=sx*.18;g.add(lock)}
 const cape=box(1.45,1.9, .08,white);cape.position.set(0,1.25,-.45);g.add(cape);
 for(const sx of [-1,1]){const arm=box(.28,1.2,purple);arm.position.set(sx*.72,1.4,0);arm.rotation.z=sx*.08;g.add(arm);const leg=box(.38,1.25,purple);leg.position.set(sx*.28,.12,0);g.add(leg);const boot=box(.46,.3,.7,gold);boot.position.set(sx*.28,-.5,.15);g.add(boot)}
 const belt=box(1.1,.18,.68,gold);belt.position.y=.76;g.add(belt);
 const staff=new T.Group();const pole=cyl(.08,3.5,M(0x5b3b2b),10);pole.position.y=1.7;staff.add(pole);const orb=sph(.35,glow(0x55cfff));orb.position.y=3.55;staff.add(orb);const aura=sph(.65,glow(0x4b8dff));aura.position.y=3.55;aura.scale.z=.25;staff.add(aura);staff.position.set(.85,0,.15);staff.rotation.z=-.08;g.add(staff);g.userData.staff=staff;
 const eye=M(0x432338);for(const sx of [-.16,.16]){const e=sph(.055,eye);e.position.set(sx,2.61,.46);g.add(e)}
 g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});return g
}

const S=Object.assign({level:1,xp:0,hp:100,maxHp:100,gold:25,rep:0,guild:0,bond:15,potions:2,stage:0,kills:0},JSON.parse(localStorage.getItem('otaku3d')||'{}'));
const player={x:0,z:18,model:makeAren(),walking:false,attack:0};const lyra={x:-3,z:4,model:makeLyra()};player.model.position.set(0,0,18);lyra.model.position.set(-3,0,4);scene.add(player.model,lyra.model);
function monster(){
 const g=new T.Group(), body=sph(.65,M(0x566b76)), head=sph(.48,M(0x728994));head.position.y=.55;g.add(body,head);
 for(const sx of [-.16,.16]){const e=sph(.07,glow(0xff455c));e.position.set(sx,.68,.42);g.add(e)}
 const horn1=cone(.12,.55,M(0xddd0ad));horn1.position.set(-.3,.95,0);g.add(horn1);const horn2=horn1.clone();horn2.position.x=.3;g.add(horn2);g.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true});return g
}
const enemies=[];for(let i=0;i<7;i++){const a=Math.random()*6.28,r=12+Math.random()*30,e={x:Math.cos(a)*r,z:Math.sin(a)*r,hp:50+S.level*8,cd:0,model:monster()};e.model.position.set(e.x,0,e.z);scene.add(e.model);enemies.push(e)}

const keys={};let started=false,dialog=false,last=performance.now(),attackCd=0,msg=0;
function rank(){return S.guild>=80?'S':S.guild>=60?'A':S.guild>=40?'B':S.guild>=25?'C':S.guild>=12?'D':S.guild>=5?'E':'F'}
function need(){return 70+(S.level-1)*50}
function save(){localStorage.setItem('otaku3d',JSON.stringify(S));hud()}
function gainxp(n){S.xp+=n;while(S.xp>=need()){S.xp-=need();S.level++;S.maxHp+=15;S.hp=S.maxHp;toast('✨ Niveau '+S.level+' !')}}
function hud(){document.getElementById('stats').innerHTML='<b>AREN · RANG '+rank()+'</b><br>PV '+Math.round(S.hp)+'/'+S.maxHp+' · Niv. '+S.level+' · 💰 '+S.gold+'<div class="bar"><div class="hp" style="width:'+100*S.hp/S.maxHp+'%"></div></div><div class="bar"><div class="xp" style="width:'+100*S.xp/need()+'%"></div></div><span class="small">XP '+S.xp+'/'+need()+' · Réputation '+S.rep+' · Lyra '+S.bond+'</span>';const q=S.stage===0?'Retrouver Lyra':S.stage===1?'Parler à Lyra et accepter la mission':S.stage===2?'Vaincre 3 monstres ('+S.kills+'/3)':S.stage===3?'Retourner voir Lyra':'Explorer le monde';document.getElementById('quest').innerHTML='<b>QUÊTE</b><br>'+q+'<br><span class="small">Guilde '+rank()+' · Potions '+S.potions+'</span>'}
function toast(t){const e=document.getElementById('message');e.textContent=t;e.style.display='block';msg=3}
function closeDialog(){dialog=false;document.getElementById('dialog').style.display='none';hud()}
function dialogBox(w,t,opts){dialog=true;document.getElementById('speaker').textContent=w;document.getElementById('dialogText').textContent=t;const c=document.getElementById('choices');c.innerHTML='';opts.forEach(o=>{const b=document.createElement('button');b.className='choice';b.textContent=o[0];b.onclick=o[1];c.appendChild(b)});document.getElementById('dialog').style.display='block'}
function interact(){if(!started||dialog)return;if(Math.hypot(player.x-lyra.x,player.z-lyra.z)<4){if(S.stage===0)dialogBox('LYRA','Aren ! Le village n’est que le début. La Guilde des Aventuriers t’attend.',[['Partir avec Lyra',()=>{S.stage=1;S.bond+=8;closeDialog();toast('Lyra rejoint ton aventure.');save()}]]);else if(S.stage===1)dialogBox('LYRA','Une menace rôde dans la forêt. Prouvons notre valeur : trois monstres.',[['Accepter',()=>{S.stage=2;S.guild+=5;closeDialog();toast('Mission F commencée.');save()}]]);else if(S.stage===3)dialogBox('LYRA','Tu as réussi. Regarde au loin… le monde est immense.',[['Continuer',()=>{S.stage=4;S.rep+=10;S.guild+=12;S.gold+=40;gainxp(60);closeDialog();toast('🌌 Une nouvelle région est ouverte.');save()}]]);else toast('Lyra : Notre aventure ne fait que commencer.')}else toast('Approche-toi de Lyra.')}
function potion(){if(S.potions<=0)return toast('Plus de potion.');if(S.hp>=S.maxHp)return toast('PV au maximum.');S.potions--;S.hp=Math.min(S.maxHp,S.hp+45);save();toast('🧪 +45 PV')}
function attack(){if(!started||dialog||attackCd>0)return;attackCd=.48;let best=null,bd=3.4;for(const e of enemies){const d=Math.hypot(player.x-e.x,player.z-e.z);if(d<bd){bd=d;best=e}}if(!best)return toast('Aucun ennemi à portée.');best.hp-=20+S.level*5;player.attack=.25;toast('⚔️ Coup porté');if(best.hp<=0){scene.remove(best.model);enemies.splice(enemies.indexOf(best),1);S.kills++;S.gold+=10;S.rep+=3;S.guild+=2;gainxp(28);if(S.stage===2&&S.kills>=3){S.stage=3;toast('Mission terminée ! Retourne voir Lyra.')}save()}}
function animate(t){
 const walk=player.walking,s=Math.sin(t*9)*.35;
 const parts=player.model.children;if(walk){parts.forEach((o,i)=>{if(i===5||i===7)o.rotation.x=s*(i===5?1:-1)})}
 if(player.attack>0){player.attack-=.016;player.model.userData.sword.rotation.z=-.22-Math.sin((.25-player.attack)*12)*.8}
 else player.model.userData.sword.rotation.z=-.22;
 lyra.model.userData.staff.rotation.y=Math.sin(t*2)*.12;lyra.model.userData.staff.children[1].scale.setScalar(1+.12*Math.sin(t*4));
}
function startGame(){started=true;document.getElementById('intro').style.display='none';toast('Bienvenue à Renaissance. Retrouve Lyra.')}
start.onclick=startGame;start.disabled=false;start.textContent='ENTRER DANS LE MONDE';status.textContent='Monde fantasy 3D prêt.';hud();
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key===' '){e.preventDefault();attack()}if(e.key.toLowerCase()==='e')interact();if(e.key.toLowerCase()==='p')potion()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.onpointerdown=e=>{e.preventDefault();keys[k]=true};b.onpointerup=b.onpointercancel=b.onpointerleave=()=>keys[k]=false});
document.querySelectorAll('[data-act]').forEach(b=>b.onpointerdown=()=>({attack,potion,interact}[b.dataset.act])());
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5))}addEventListener('resize',resize);
function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;if(started&&!dialog){let x=(keys.d?1:0)-(keys.a?1:0),z=(keys.s?1:0)-(keys.w?1:0);if(x||z){const l=Math.hypot(x,z);player.x+=x/l*5.5*dt;player.z+=z/l*5.5*dt;player.model.rotation.y=Math.atan2(x,z);player.walking=true}else player.walking=false;player.x=Math.max(-58,Math.min(58,player.x));player.z=Math.max(-58,Math.min(58,player.z));player.model.position.x=player.x;player.model.position.z=player.z;
for(const e of enemies){e.cd-=dt;const dx=player.x-e.x,dz=player.z-e.z,d=Math.hypot(dx,dz);if(d<20&&d>.3){e.x+=dx/d*1.8*dt;e.z+=dz/d*1.8*dt;e.model.position.x=e.x;e.model.position.z=e.z;e.model.rotation.y=Math.atan2(dx,dz)}if(d<1.5&&e.cd<=0){e.cd=1;S.hp=Math.max(0,S.hp-(5+S.level*2));if(S.hp===0){S.hp=S.maxHp/2;player.x=0;player.z=18;S.gold=Math.max(0,S.gold-15);toast('Tu as été vaincu.')}save()}}attackCd=Math.max(0,attackCd-dt);hud();if(msg>0){msg-=dt;if(msg<=0)document.getElementById('message').style.display='none'}}
animate(t/1000);
camera.position.lerp(new T.Vector3(player.x+10,7.5,player.z+11),.075);camera.lookAt(new T.Vector3(player.x,1.8,player.z));
renderer.render(scene,camera);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();