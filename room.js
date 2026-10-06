'use strict';
$('.brand small').textContent='完成任务 · 收集家具 · 布置小屋';
$('.welcome h1').textContent='今天，也为自己的小屋添一点美好！';
$('.welcome p').textContent='完成一个小目标，收获一件可爱的像素家具。';
$('.pill').textContent='✿ 新增皮卡堂家具 · 收集小美好';
$('.roomheader h2').firstChild.textContent='我的花园小屋 ';
$('.scene-label').textContent='✿ 草莓花园 · 温暖的小家';
$('.bottom').firstElementChild.textContent='小镇公告：完成 1 个任务，获得 1 件随机家具 + 10 小镇币！';
$('.bottom').lastElementChild.textContent='一点点努力，把喜欢的小屋住满。';
const roomSpecs=[{name:'花语薄荷沙发',w:3,d:2,pixels:112},{name:'蜂蜜写字桌',w:2,d:2,pixels:94},{name:'草莓雏菊花瓶',w:1,d:1,pixels:52},{name:'郁金香落地灯',w:1,d:1,pixels:48},{name:'草莓软绒地毯',w:3,d:3,pixels:119,flat:true},{name:'花园小屋书架',w:2,d:1,pixels:83},{name:'粉绿小屋床',w:3,d:4,pixels:145},{name:'耳机小鸭摆件',w:1,d:1,pixels:42}];
roomSpecs.push(...officialFurniture,...wardrobeItems);
roomSpecs.forEach((s,i)=>{furniture[i]=s.name;if(!Number.isFinite(state.bag[i]))state.bag[i]=0});save();
// The starter walls use original game objects. Subsequent rewards replace them.
if(!state.decor){state.decor={window:48,door:52,wallpaper:55,painting:58};save()}
let collectionFilter='all',movingItem=null,movingSurface=null;
function clearMove(){movingItem=null;movingSurface=null;previewCell=null}
function movementOthers(){return state.placed.filter(p=>p!==movingItem)}
const equippedCount=i=>[...Object.values(state.decor),...Object.values(state.avatar||{})].filter(id=>id===i).length;
const isWearable=i=>['wearable','avatar'].includes(roomSpecs[i].kind);
state.decorPositions=state.decorPositions||{};
let surfaceRects=[];
const ownedCount=i=>state.bag[i]+state.placed.filter(p=>p.type===i).length+equippedCount(i);
const isSurface=i=>['window','door','wallpaper','painting'].includes(roomSpecs[i].kind);
function equipDecoration(i){if(!state.bag[i]){toast('这件收藏还在小屋里，或尚未获得');return}const kind=roomSpecs[i].kind,old=state.decor[kind];if(old!==undefined)state.bag[old]++;state.bag[i]--;state.decor[kind]=i;clearMove();save();render();toast('已使用'+furniture[i]+'，原来的装修已收回背包')}
const iso=(u,v)=>({x:360+(u-v)*24,y:180+(u+v)*12});
const uniso=(x,y)=>({u:((y-180)/12+(x-360)/24)/2,v:((y-180)/12-(x-360)/24)/2});
function overlaps(a,b){if(roomSpecs[a.type].flat||roomSpecs[b.type].flat)return false;const sa=roomSpecs[a.type],sb=roomSpecs[b.type];return a.u<b.u+sb.w&&a.u+sa.w>b.u&&a.v<b.v+sb.d&&a.v+sa.d>b.v}
function validPlacement(p,others=state.placed){const s=roomSpecs[p.type];return p.u>=0&&p.v>=0&&p.u+s.w<=12&&p.v+s.d<=12&&!others.some(q=>overlaps(p,q))}
function freePosition(type,preferred){if(preferred&&validPlacement({type,...preferred}))return preferred;for(let v=0;v<12;v++)for(let u=0;u<12;u++)if(validPlacement({type,u,v}))return {u,v};return null}
// Convert old scene coordinates once, preserving tasks, coins and owned items.
if(state.roomVersion!==3){const old=state.placed.slice();state.placed=[];const slots=[{u:7,v:6},{u:1,v:5},{u:0,v:1},{u:9,v:1},{u:5,v:7},{u:0,v:8},{u:3,v:0},{u:9,v:9}];old.forEach(p=>{const pos=freePosition(p.type,slots[p.type]);if(pos)state.placed.push({type:p.type,...pos});else state.bag[p.type]++});for(const type of [5,6])if(!state.placed.some(p=>p.type===type)&&!state.bag[type]){const pos=freePosition(type,slots[type]);if(pos)state.placed.push({type,...pos});else state.bag[type]++}state.roomVersion=3;save()}
let atlasReady=false,atlasFailed=false,baseReady=false,officialReady=false,previewCell=null,pickedRects=[];
const atlas=new Image(),art=[];
const baseAssetPromise=new Promise(resolve=>{atlas.onload=()=>{try{const regions=[[0,0,384,512],[384,0,384,512],[768,0,384,512],[1152,0,384,512],[0,512,426,512],[426,512,304,512],[730,512,480,512],[1210,512,326,512]];for(let i=0;i<8;i++){const [sx,sy,sw,sh]=regions[i],cw=Math.round(sw*atlas.width/1536),ch=Math.round(sh*atlas.height/1024);const c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d');g.drawImage(atlas,sx*atlas.width/1536,sy*atlas.height/1024,cw,ch,0,0,cw,ch);const data=g.getImageData(0,0,cw,ch).data;let left=cw,right=0,top=ch,bottom=0;for(let y=0;y<ch;y++)for(let x=0;x<cw;x++)if(data[(y*cw+x)*4+3]>100){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}if(right<=left||bottom<=top)throw Error('Empty furniture sprite');art[i]={canvas:c,x:left,y:top,w:right-left+1,h:bottom-top+1}}baseReady=true;atlasReady=officialReady;render();resolve(true)}catch(e){atlasFailed=true;render();resolve(false)}};atlas.onerror=()=>{atlasFailed=true;render();resolve(false)};atlas.src='furniture-atlas.png?v=3'});
const officialAssetsPromise=Promise.all([...officialFurniture,...wardrobeItems].map((s,i)=>new Promise(resolve=>{const image=new Image();image.onload=()=>{const c=document.createElement('canvas');c.width=image.width;c.height=image.height;c.getContext('2d').drawImage(image,0,0);art[i+8]={canvas:c,...s.crop};resolve(true)};image.onerror=()=>resolve(false);image.src=s.asset}))).then(results=>{officialReady=results.every(Boolean);if(!officialReady)atlasFailed=true;atlasReady=baseReady&&officialReady;render();return officialReady});
const assetPromise=Promise.all([baseAssetPromise,officialAssetsPromise]).then(results=>results.every(Boolean));
// The room, backpack and reward dialog all use the same furniture atlas.
sprite=function(g,t,x,y,scale=1){if(!atlasReady)return;const a=art[t],w=Math.min(53,53*a.w/a.h)*scale,h=w*a.h/a.w;g.imageSmoothingEnabled=false;g.drawImage(a.canvas,a.x,a.y,a.w,a.h,Math.round(x-w/2),Math.round(y+21*scale-h),Math.round(w),Math.round(h))};
function furnitureRect(p){const s=roomSpecs[p.type],a=art[p.type],foot=iso(p.u+s.w/2,p.v+s.d/2),w=s.pixels,h=a?w*a.h/a.w:w;return {x:Math.round(foot.x-w/2),y:Math.round(foot.y+(s.w+s.d)*5-h),w:Math.round(w),h:Math.round(h),p}}
function polygon(g,points,fill,stroke='#64563a'){g.beginPath();points.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke()}}
function drawWallWindow(g){const wall=(u,z)=>{const p=iso(0,u);return [p.x,p.y-z]};polygon(g,[wall(3,38),wall(6.6,38),wall(6.6,106),wall(3,106)],'#887454');polygon(g,[wall(3.2,41),wall(6.4,41),wall(6.4,103),wall(3.2,103)],'#b7ded9');polygon(g,[wall(3.4,44),wall(4.7,44),wall(4.7,98),wall(3.4,98)],'#e0f6e9',null);polygon(g,[wall(4.8,41),wall(5,41),wall(5,103),wall(4.8,103)],'#9a8260',null);polygon(g,[wall(3.2,69),wall(6.4,69),wall(6.4,73),wall(3.2,73)],'#9a8260',null);polygon(g,[wall(2.6,110),wall(3.25,110),wall(3.25,37),wall(2.6,37)],'#f09aa6');polygon(g,[wall(6.35,110),wall(7,110),wall(7,37),wall(6.35,37)],'#f09aa6');polygon(g,[wall(2.4,110),wall(7.2,110),wall(7.2,116),wall(2.4,116)],'#cc747d');polygon(g,[wall(2.8,34),wall(6.9,34),wall(7.1,38),wall(3,38)],'#c99b67')}
function drawWallpaper(g){if(!atlasReady)return;const a=art[state.decor.wallpaper];if(!a)return;const vertical=a.h-a.w*.5,scale=130/vertical,step=a.w*scale;
 for(const side of [-1,1]){g.save();g.beginPath();g.moveTo(360,50);g.lineTo(360+side*288,194);g.lineTo(360+side*288,324);g.lineTo(360,180);g.closePath();g.clip();for(let offset=0;offset<288;offset+=step){g.save();g.translate(360+side*offset,50+offset*.5);g.scale(side,1);g.drawImage(a.canvas,a.x,a.y,a.w,a.h,0,0,step,a.h*scale);g.restore()}g.restore()}}
function surfaceRect(kind){const id=state.decor[kind],a=art[id];if(!a)return null;const h=kind==='door'?122:kind==='window'?98:74,w=h*a.w/a.h,defaultSide=kind==='window'?-1:1,pos=state.decorPositions[kind]||{side:defaultSide,t:kind==='door'?10:kind==='window'?5:6.5,z:kind==='door'?0:22},p=iso(pos.side===-1?0:pos.t,pos.side===-1?pos.t:0);return {kind,type:id,x:p.x-w/2,y:p.y-pos.z-h,w,h,mirror:pos.side===-1}}
function drawSurfaceDecor(g){surfaceRects=[];if(!atlasReady)return;for(const kind of ['window','door','painting']){const r=surfaceRect(kind);if(!r)continue;surfaceRects.push(r);const a=art[r.type];g.save();g.translate(r.x+(r.mirror?r.w:0),r.y);if(r.mirror)g.scale(-1,1);g.drawImage(a.canvas,a.x,a.y,a.w,a.h,0,0,r.w,r.h);g.restore();if(movingSurface===kind){g.strokeStyle='#2c85b4';g.lineWidth=3;g.strokeRect(r.x-3,r.y-3,r.w+6,r.h+6)}}}
function wallPoint(pt){const distance=Math.abs(pt.x-360);return distance<=288&&pt.y>=50+distance*.5&&pt.y<=180+distance*.5}
function pickedSurface(pt){return surfaceRects.slice().reverse().find(r=>{if(pt.x<r.x||pt.x>r.x+r.w||pt.y<r.y||pt.y>r.y+r.h)return false;const a=art[r.type],relative=(pt.x-r.x)/r.w,x=Math.max(0,Math.min(a.w-1,Math.floor((r.mirror?1-relative:relative)*a.w))),y=Math.max(0,Math.min(a.h-1,Math.floor((pt.y-r.y)/r.h*a.h)));return a.canvas.getContext('2d').getImageData(a.x+x,a.y+y,1,1).data[3]>70})}
function clearRoom(){for(const p of state.placed)state.bag[p.type]++;for(const id of Object.values(state.decor))if(Number.isInteger(id))state.bag[id]++;state.placed=[];state.decor={};state.decorPositions={};clearMove();save();render();toast('小屋已清空，所有家具和装修已收回背包')}
$('#clearRoom').onclick=()=>{if(!edit){edit=true;render()}modal('<h2>清空小屋布置？</h2><p>地板家具、门窗、壁画和壁纸会全部收回背包，已获得的收藏和任务奖励会保留。</p><button class="primary" id="confirmClearRoom">清空并收回背包</button> <button class="outline" id="cancelClearRoom">取消</button>');$('#confirmClearRoom').onclick=()=>{close();clearRoom()};$('#cancelClearRoom').onclick=close};
function drawRoomShell(g){const a=iso(0,0),b=iso(12,0),c=iso(12,12),d=iso(0,12),h=130;
polygon(g,[[d.x,d.y],[c.x,c.y],[c.x,c.y+10],[d.x,d.y+10]],'#b98a55');polygon(g,[[c.x,c.y],[b.x,b.y],[b.x,b.y+10],[c.x,c.y+10]],'#9d754a');
polygon(g,[[a.x,a.y-h],[d.x,d.y-h],[d.x,d.y],[a.x,a.y]],'#bad8ad');polygon(g,[[a.x,a.y-h],[b.x,b.y-h],[b.x,b.y],[a.x,a.y]],'#f3d9bb');
for(let i=1;i<12;i++){let p=iso(0,i);g.strokeStyle='#9fbd9355';g.lineWidth=1;g.beginPath();g.moveTo(p.x,p.y-h);g.lineTo(p.x,p.y);g.stroke();p=iso(i,0);g.strokeStyle='#d6b68f55';g.beginPath();g.moveTo(p.x,p.y-h);g.lineTo(p.x,p.y);g.stroke()}
drawWallpaper(g);
for(let u=0;u<12;u++)for(let v=0;v<12;v++){const p=[iso(u,v),iso(u+1,v),iso(u+1,v+1),iso(u,v+1)];polygon(g,p.map(q=>[q.x,q.y]),(u+v)%2?'#e8c99c':'#f1d6ab','#c6a77a');g.strokeStyle='#f8e2bc';g.lineWidth=1;g.beginPath();g.moveTo(p[0].x+2,p[0].y+2);g.lineTo(p[1].x,p[1].y+2);g.stroke()}
polygon(g,[[a.x,a.y-6],[d.x,d.y-6],[d.x,d.y],[a.x,a.y]],'#9eb483');polygon(g,[[a.x,a.y-6],[b.x,b.y-6],[b.x,b.y],[a.x,a.y]],'#d3b084');g.strokeStyle='#5d563c';g.lineWidth=2;g.beginPath();g.moveTo(d.x,d.y-h);g.lineTo(a.x,a.y-h);g.lineTo(b.x,b.y-h);g.stroke();
drawSurfaceDecor(g);
}
drawRoom=function(){const c=$('#room');c.width=720;c.height=520;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,c.width,c.height);drawRoomShell(g);pickedRects=[];
if(!atlasReady){g.fillStyle='#805c34';g.font='14px Microsoft YaHei';g.textAlign='center';g.fillText(atlasFailed?'家具素材加载失败，请刷新页面':'正在把可爱家具搬进小屋…',360,347);return}
state.placed.slice().sort((a,b)=>Number(!roomSpecs[a.type].flat)-Number(!roomSpecs[b.type].flat)||(a.u+a.v+roomSpecs[a.type].w+roomSpecs[a.type].d)-(b.u+b.v+roomSpecs[b.type].w+roomSpecs[b.type].d)).forEach(p=>{const r=furnitureRect(p),a=art[p.type];g.save();if(p===movingItem){g.globalAlpha=.65;g.strokeStyle="#2c85b4";g.lineWidth=2;g.strokeRect(r.x-3,r.y-3,r.w+6,r.h+6)}g.drawImage(a.canvas,a.x,a.y,a.w,a.h,r.x,r.y,r.w,r.h);g.restore();pickedRects.push(r)});
if(edit&&previewCell&&!movingSurface&&(movingItem||state.bag[selectedItem])&&!isSurface(selectedItem)&&!isWearable(selectedItem)){const p={type:selectedItem,...previewCell},s=roomSpecs[selectedItem],valid=validPlacement(p,movementOthers()),corners=[iso(p.u,p.v),iso(p.u+s.w,p.v),iso(p.u+s.w,p.v+s.d),iso(p.u,p.v+s.d)];polygon(g,corners.map(q=>[q.x,q.y]),valid?'#79c95c66':'#e8797966',valid?'#3e8835':'#b34642');if(valid){const r=furnitureRect(p),a=art[p.type];g.save();g.globalAlpha=.55;g.drawImage(a.canvas,a.x,a.y,a.w,a.h,r.x,r.y,r.w,r.h);g.restore()}}
};
function pointerToRoom(e){const b=$('#room').getBoundingClientRect();return {x:(e.clientX-b.left)/b.width*720,y:(e.clientY-b.top)/b.height*520}}
function cellForPoint(p){const uv=uniso(p.x,p.y),s=roomSpecs[selectedItem];return {u:Math.floor(uv.u-s.w/2),v:Math.floor(uv.v-s.d/2)}}
function pickedAt(pt){return pickedRects.slice().reverse().find(r=>{if(!(pt.x>=r.x&&pt.x<=r.x+r.w&&pt.y>=r.y&&pt.y<=r.y+r.h))return false;const a=art[r.p.type],x=Math.min(a.w-1,Math.max(0,Math.floor((pt.x-r.x)/r.w*a.w))),y=Math.min(a.h-1,Math.max(0,Math.floor((pt.y-r.y)/r.h*a.h)));return a.canvas.getContext('2d').getImageData(a.x+x,a.y+y,1,1).data[3]>70})}
$('#room').onpointermove=e=>{if(!edit||!atlasReady)return;previewCell=cellForPoint(pointerToRoom(e));drawRoom()};
$('#room').onpointerleave=()=>{previewCell=null;drawRoom()};
$('#room').onclick=e=>{if(!edit){toast('点击「布置小屋」后，就可以选中家具移动');return}if(!atlasReady)return;const pt=pointerToRoom(e),hit=pickedAt(pt);if(hit){clearMove();movingItem=hit.p;selectedItem=hit.p.type;previewCell=null;render();toast('已选中'+furniture[selectedItem]+'，点击空闲地板移动');return}const surface=pickedSurface(pt);if(surface){clearMove();movingSurface=surface.kind;selectedItem=surface.type;render();toast('已选中'+furniture[selectedItem]+'，点击墙面移动或收回背包');return}if(movingSurface){if(movingSurface==='wallpaper'){toast('壁纸覆盖整个墙面，可收回或从背包更换');return}if(!wallPoint(pt)){toast('门窗和壁画请放在墙面上');return}const h=surfaceRect(movingSurface).h,t=Math.max(1,Math.min(11,Math.abs(pt.x-360)/24)),floorY=180+t*12;state.decorPositions[movingSurface]={side:pt.x<360?-1:1,t,z:movingSurface==='door'?0:Math.max(0,Math.min(130-h,floorY-pt.y-h/2))};clearMove();save();render();toast('墙面物品已移动');return}if(!movingItem&&wallPoint(pt)&&Number.isInteger(state.decor.wallpaper)){clearMove();movingSurface='wallpaper';selectedItem=state.decor.wallpaper;render();toast('已选中壁纸，可收回或从背包更换');return}if(!movingItem&&!state.bag[selectedItem]){toast('点击小屋里的家具移动，或从背包选一件摆放');return}const p={type:selectedItem,...cellForPoint(pt)};if(isSurface(selectedItem)||isWearable(selectedItem)||!validPlacement(p,movementOthers())){toast('请放在空闲地板上，家具不能重叠或越过墙壁');return}if(movingItem){movingItem.u=p.u;movingItem.v=p.v;toast('家具已移动')}else{state.bag[selectedItem]--;state.placed.push(p)}clearMove();save();render()};
$('#cancelMove').onclick=()=>{clearMove();render()};
$('#returnItem').onclick=()=>{if(movingSurface){state.bag[state.decor[movingSurface]]++;delete state.decor[movingSurface];delete state.decorPositions[movingSurface];clearMove();save();render();toast('装修已收回背包');return}if(!movingItem)return;state.placed=state.placed.filter(p=>p!==movingItem);state.bag[movingItem.type]++;clearMove();save();render();toast('已收回背包')};
$('#editRoom').onclick=()=>{edit=!edit;clearMove();render()};
const previousRender=render;render=function(){previousRender();$('#roomHint').textContent=edit?'点家具 → 点地板移动 · 点门窗壁画 → 点墙面移动':'完成任务 → 收集家具、装修与伙伴 → 布置小屋';$('#editRoom').textContent=edit?'✓ 保存布置':'▧ 布置小屋';$('#roomSubtitle').textContent='收藏不同主题的家具，也邀请新伙伴来做客';$('#bagCount').textContent=`背包 ${state.bag.reduce((a,b)=>a+b,0)} 件 · 小屋 ${state.placed.length+Object.keys(state.decor).length} 件`;$('#room').setAttribute('aria-label','像素小屋：可更换门窗、墙纸与壁画，摆放家具和角色伙伴');renderScreen();};
function renderScreen(){
 $('#clearRoom').hidden=!edit;$('#moveControls').hidden=(!movingItem&&!movingSurface)||view!=='room';$('#selectionName').textContent=movingItem?'已选中：'+furniture[movingItem.type]:movingSurface?'已选中：'+furniture[state.decor[movingSurface]]:'';$('#characterPanel').hidden=view!=='avatar';
 document.body.dataset.screen=view;
 const tasks=$('.tasks'),home=$('.layout > section:last-child');
 tasks.hidden=view!=='today';home.hidden=view==='today';
 $('.roomheader').hidden=view!=='room';$('.scene').hidden=view!=='room';
 const text={today:['今天，完成几个小目标吧！','一步一步来，每完成一个待办，就能收获一件家具。'],room:['欢迎回到你的花园小屋！','从背包挑一件家具，把小屋布置成喜欢的样子。'],avatar:['我的人物与衣橱','用今天的小努力，解锁一套新穿搭。'],bag:['我的家具图鉴','看看已经收集的小美好，也找找下一件想要的家具。']};
 $('.welcome h1').textContent=text[view][0];$('.welcome p').textContent=text[view][1];
 $('#catalogNote').innerHTML=`共 ${furniture.length} 款收藏：家具、门窗、墙纸、壁画、角色与服饰。完成待办随机获得；装修可直接替换，伙伴可以摆放到小屋，服饰在「我的人物」中穿戴。<br>皮卡堂原画：上海爱扑网络科技股份有限公司 · <a href="https://web.picatown.com/" target="_blank" rel="noopener">素材来源</a>`;
 const visibleIds=furniture.map((_,i)=>i).filter(i=>view==='bag'||view==='avatar'||state.bag[i]>0);
 document.querySelectorAll('#items .item').forEach((e,index)=>{const i=visibleIds[index],s=roomSpecs[i];e.hidden=collectionFilter!=='all'&&(collectionFilter==='装修'?!isSurface(i):collectionFilter==='伙伴'?s.kind!=='character':(s.theme||'原创花园')!==collectionFilter);if(view==='avatar')e.hidden=!isWearable(i);if(view==='room'&&isWearable(i))e.hidden=true;if(view==='room'){if(isSurface(i)){e.querySelector('em').textContent='点击使用';e.onclick=()=>equipDecoration(i)}else{e.onclick=()=>{clearMove();selectedItem=i;edit=true;render();toast('点击空闲地板摆放'+furniture[i])}}}});
 $('#collectionFilters').hidden=view==='today';
 document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-current',b.dataset.view===view?'page':'false')});
 if(view==='avatar'){renderAvatar();document.querySelectorAll('#items .item').forEach((e,index)=>{const i=visibleIds[index];if(!isWearable(i))return;e.classList.toggle('locked',ownedCount(i)===0);e.querySelector('em').textContent=Object.values(state.avatar||{}).includes(i)?'正在穿戴':ownedCount(i)>0?'点击穿戴':'待解锁';e.onclick=()=>equipOutfit(i)});$('#bagTitle').textContent='我的衣橱';$('#collectionFilters').hidden=true}
 if(view==='bag'){
  const owned=ownedCount;
  $('#bagCount').textContent=`已收集 ${furniture.filter((_,i)=>owned(i)>0).length} / ${furniture.length} 款`;
  document.querySelectorAll('#items .item').forEach((e,i)=>{
   e.classList.toggle('locked',owned(i)===0);e.classList.remove('selected');
   e.querySelector('em').textContent=(roomSpecs[i].official?'皮卡堂 · ':'原创 · ')+(owned(i)?`已收集 ×${owned(i)}`:'待收集');
   e.onclick=()=>{const s=roomSpecs[i],help=isWearable(i)?'获得后在「我的人物」中点击穿戴。':isSurface(i)?'获得后在小屋背包点击使用，替换同类装修。':s.kind==='character'?'获得后可以像家具一样摆在小屋里，作为角色伙伴。':'获得后从背包选择，再点击地板摆放。';modal(`<div class="eyebrow">${s.theme||'原创花园'}</div><h2>${furniture[i]}</h2><canvas id="furnitureDetail" width="64" height="64"></canvas><p>${owned(i)?`已拥有 ${owned(i)} 件，其中 ${state.bag[i]} 件在背包中。`:'完成每日待办，有机会收到这件收藏。'}<br>${help}</p>${s.official?'<p class="assetCredit">原画：皮卡堂 / 上海爱扑网络<br><a href="https://web.picatown.com/" target="_blank" rel="noopener">查看素材来源</a></p>':''}<button class="primary" id="detailClose">知道了</button>`);sprite($('#furnitureDetail').getContext('2d'),i,32,36);$('#detailClose').onclick=close};
  });
 }
}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;edit=false;clearMove();render();});
$('#collectionFilter').onchange=e=>{collectionFilter=e.target.value;render()};
render();
