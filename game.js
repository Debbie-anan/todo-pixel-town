// Keep the user's existing tasks and rewards; replace the entire scene presentation.
$('.brand small').textContent='完成任务 · 收集家具 · 布置小镇';
$('.welcome h1').textContent='欢迎来到你的待办小镇！';
$('.welcome p').textContent='今天的任务完成了吗？惊喜家具正在等你领取～';
$('.pill').textContent='☀ 海风正好，开始今天的冒险吧！';
$('.roomheader h2').firstChild.textContent='我的海滩小屋 ';
$('#roomSubtitle').textContent='完成任务获得家具，把海边小天地布置成喜欢的样子';
$('.scene-label').textContent='☀ 阳光海岸 · 你的专属小镇';
$('.bottom').firstElementChild.textContent='小镇公告：每完成 1 个任务，获得 1 件随机家具 + 10 小镇币！';
$('.bottom').lastElementChild.textContent='努力一点点，小镇更漂亮！';
furniture[0]='青柠双人沙发';furniture[1]='海边木书桌';furniture[2]='热带小盆栽';furniture[3]='金色落地灯';furniture[4]='草莓沙滩毯';furniture[5]='彩色小书架';furniture[6]='假日小茶桌';furniture[7]='猫咪小抱枕';
const originalSprite=sprite;
sprite=function(g,t,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);const r=(a,b,w,h,c)=>{g.fillStyle=c;g.fillRect(a,b,w,h)};const o='#473421';
// Small cast shadows and 1-pixel outlines give objects the reference's sprite feel.
g.fillStyle='#65512b44';g.beginPath();g.ellipse(2,20,t===0?29:17,5,0,0,Math.PI*2);g.fill();
if(t===0){r(-27,-24,51,29,o);r(-25,-22,46,21,'#73b93a');r(-23,-20,43,3,'#b0e569');r(24,-19,7,34,o);r(25,-17,4,27,'#478f21');r(-30,-10,9,31,o);r(-28,-8,6,25,'#94d548');r(-21,-4,44,23,o);r(-20,-2,42,14,'#8ed140');r(-18,-1,18,9,'#b0e967');r(2,-1,19,9,'#a1de52');r(-20,13,42,5,'#579a24');r(-25,21,5,5,o);r(20,20,5,5,o);r(-12,-15,10,10,'#fff3a3');r(-11,-14,8,7,'#ffd85c')}
else if(t===2){r(-9,2,20,5,o);r(-7,7,15,14,o);r(-6,8,13,11,'#e98125');r(-5,9,3,9,'#ffb45e');r(-1,-29,3,32,o);r(-15,-27,14,9,o);r(-14,-26,12,6,'#389b31');r(0,-37,14,12,o);r(2,-35,10,8,'#68c541');r(0,-18,17,9,o);r(2,-17,13,6,'#81d34a');r(-12,-10,12,9,o);r(-10,-9,9,5,'#4ab23c');r(4,-33,4,2,'#a6e666')}
else{originalSprite(g,t,0,0);if(t===1||t===6){r(-21,-8,40,2,'#ffe09c');r(-19,2,2,20,'#e5a04f')}if(t===3){r(-13,-29,26,2,'#ffef8f');r(-12,-27,3,8,'#ffd750')}if(t===4){r(-22,-6,45,2,'#ffd8ac');r(-9,-3,5,5,'#dc342e');r(7,1,5,5,'#dc342e');r(-8,-5,3,2,'#449436');r(8,-1,3,2,'#449436')}}g.restore()};
function character(g,x,y,shirt,hair='#74452b'){const r=(a,b,w,h,c)=>{g.fillStyle=c;g.fillRect(x+a,y+b,w,h)};g.fillStyle='#6a50254d';g.beginPath();g.ellipse(x+1,y+30,11,4,0,0,Math.PI*2);g.fill();r(-7,-15,16,18,'#403123');r(-6,-13,14,16,'#ffc38b');r(-8,-18,18,8,'#352b22');r(-7,-17,16,6,hair);r(-7,-11,4,6,hair);r(6,-10,3,5,hair);r(-3,-4,2,2,'#272324');r(4,-4,2,2,'#272324');r(0,1,4,1,'#cb7653');r(-7,4,16,16,'#352e24');r(-6,5,14,13,shirt);r(-3,5,4,4,'#ffe4ab');r(-10,7,4,11,'#e49a64');r(8,7,4,11,'#e49a64');r(-6,20,6,10,'#423327');r(3,20,6,10,'#423327');r(-5,20,4,6,'#78a8be');r(4,20,4,6,'#78a8be');r(-7,28,7,3,'#fff4ce');r(3,28,8,3,'#fff4ce')}
drawRoom=function(){const c=$('#room');c.width=640;c.height=420;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,640,420);const px=p=>({x:p.x*1.27-10,y:p.y*1.22-7});
// Thin sandy construction plot; it stays transparent so the beach artwork is visible.
g.fillStyle=edit?'#ffe99555':'#f6d98d28';g.beginPath();g.moveTo(170,180);g.lineTo(365,151);g.lineTo(478,284);g.lineTo(280,335);g.closePath();g.fill();g.strokeStyle=edit?'#fffac8':'#ba92576b';g.lineWidth=2;g.setLineDash(edit?[5,4]:[2,5]);g.stroke();g.setLineDash([]);
state.placed.slice().sort((a,b)=>a.y-b.y).forEach(p=>{const q=px(p);sprite(g,p.type,q.x,q.y,1.25)});character(g,238,258,'#f49a2d');character(g,462,174,'#ec6496','#9c4734');
if(edit){g.fillStyle='#fff6ce';g.fillRect(265,146,77,17);g.fillStyle='#78501e';g.font='10px Microsoft YaHei';g.fillText('家具布置区域',273,158)}
};
$('#room').onclick=e=>{if(!edit){toast('点击「布置小屋」开始装饰');return}const b=e.target.getBoundingClientRect(),sx=(e.clientX-b.left)/b.width*640,sy=(e.clientY-b.top)/b.height*420,x=(sx+10)/1.27,y=(sy+7)/1.22;const hit=state.placed.findLastIndex(p=>Math.abs(p.x-x)<22&&y>p.y-35&&y<p.y+22);if(hit>=0){const[p]=state.placed.splice(hit,1);state.bag[p.type]++;save();render();return}if(y<155||y>245||x<120||x>325){toast('请把家具摆在沙滩虚线区域内');return}if(!state.bag[selectedItem]){toast('这件家具已用完，选一件其他家具吧');return}state.bag[selectedItem]--;state.placed.push({type:selectedItem,x:Math.round(x/4)*4,y:Math.round(y/4)*4});save();render()};
const oldRender=render;render=function(){oldRender();$('#roomHint').textContent=edit?'点击沙滩摆放家具 · 点击家具收回':'完成任务 → 获得家具 → 装饰小镇';$('#editRoom').textContent=edit?'✓ 保存布置':'▧ 布置小镇';$('#roomSubtitle').textContent='完成任务获得家具，把海边小天地布置成喜欢的样子';};render();
