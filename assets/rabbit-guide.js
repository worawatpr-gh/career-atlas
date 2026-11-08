(() => {
'use strict';
if (document.getElementById('ca-rabbit')) return;
const rabbitSrc = '/career-atlas/assets/rabbit-3d.png';
const style = document.createElement('style');
style.textContent = \`
#ca-rabbit{position:fixed!important;right:18px!important;bottom:12px!important;left:auto;top:auto;z-index:2147483000!important;display:flex!important;align-items:flex-end;gap:10px;font-family:Inter,"Noto Sans Thai",sans-serif;pointer-events:none}
#ca-rabbit *{box-sizing:border-box}
#ca-rabbit-trigger{display:block!important;flex:0 0 92px;width:92px!important;height:116px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important;cursor:pointer;pointer-events:auto;filter:drop-shadow(0 5px 9px rgba(50,12,101,.25))}
#ca-rabbit-trigger img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important}
#ca-rabbit-caption{max-width:180px;margin:0 0 72px;padding:9px 12px;background:#fff;border:1px solid #e6dcf7;border-radius:13px 13px 2px 13px;color:#58427f;font-size:12px;line-height:1.5;box-shadow:0 4px 14px rgba(56,35,107,.12);pointer-events:none}
#ca-rabbit-panel{display:none;width:min(340px,calc(100vw - 130px));max-height:65vh;overflow:auto;background:#fff;border:1px solid #e5dcf8;border-radius:18px;box-shadow:0 12px 38px rgba(40,24,76,.22);padding:16px;color:#302744;position:relative;pointer-events:auto}
#ca-rabbit.open #ca-rabbit-panel{display:block}
#ca-rabbit.open #ca-rabbit-caption{display:none}
#ca-rabbit-panel h3{margin:0 28px 8px 0;font-size:15px;color:#4c2d89}
#ca-rabbit-panel p{margin:7px 0;font-size:12px;line-height:1.65}
#ca-rabbit-panel .ca-tip{margin-top:10px;padding:10px 11px;border-radius:11px;background:#f2edff;color:#513b7d;font-size:12px;line-height:1.6}
#ca-rabbit-panel .ca-close{position:absolute;right:12px;top:10px;border:0;background:transparent;color:#7d6b9f;font-size:20px;cursor:pointer}
#ca-rabbit.ca-moving{transition:left .65s ease,top .65s ease,right .65s,bottom .65s}
#ca-rabbit.ca-moving #ca-rabbit-trigger{animation:ca-hop .28s ease-in-out 2}
@keyframes ca-hop{50%{transform:translateY(-10px) rotate(-4deg)}}
.ca-guide-card{cursor:pointer}
.ca-guide-card:focus-visible{outline:3px solid #9c80f2;outline-offset:3px}
@media(max-width:640px){#ca-rabbit{right:6px!important;bottom:6px!important;gap:5px}#ca-rabbit-trigger{width:66px!important;height:86px!important;flex-basis:66px}#ca-rabbit-caption{max-width:120px;margin-bottom:48px;font-size:10px}#ca-rabbit-panel{width:min(280px,calc(100vw - 95px));padding:12px}}
\`;
document.head.appendChild(style);
const root=document.createElement('div');
root.id='ca-rabbit';
root.innerHTML='<div id="ca-rabbit-panel" role="dialog" aria-live="polite"><button class="ca-close" type="button" aria-label="ปิด">×</button><h3 id="ca-rabbit-title">ผู้ช่วยนักสำรวจข้อมูล</h3><div id="ca-rabbit-body"><p>คลิกการ์ดหรือเมนู แล้วฉันจะช่วยอธิบายให้ฟัง</p></div></div><div id="ca-rabbit-caption">อยากรู้อะไรเกี่ยวกับข้อมูล คลิกได้เลย 🐰</div><button id="ca-rabbit-trigger" type="button" aria-label="เปิดผู้ช่วยกระต่าย"><img alt="กระต่ายผู้ช่วย Career Atlas"></button>';
document.body.appendChild(root);
const img=root.querySelector('img');img.src=rabbitSrc;
img.addEventListener('error',()=>{root.querySelector('#ca-rabbit-caption').textContent='โหลดรูปกระต่ายไม่สำเร็จ';});
const title=root.querySelector('#ca-rabbit-title'),body=root.querySelector('#ca-rabbit-body');
function moveTo(target){
 if(!target||!target.getBoundingClientRect)return;
 const rect=target.getBoundingClientRect(),mobile=innerWidth<640;
 const left=Math.max(8,Math.min(innerWidth-(mobile?90:110),rect.left+rect.width/2-(mobile?150:215)));
 const top=Math.max(85,Math.min(innerHeight-180,rect.top+rect.height/2-70));
 root.style.right='auto';root.style.bottom='auto';root.style.left=(innerWidth-110)+'px';root.style.top=(innerHeight-150)+'px';
 root.classList.add('ca-moving');requestAnimationFrame(()=>{root.style.left=left+'px';root.style.top=top+'px';});
 setTimeout(()=>root.classList.remove('ca-moving'),900);
}
function home(){root.classList.remove('open');root.style.left='auto';root.style.top='auto';root.style.right='18px';root.style.bottom='12px';}
function explain(heading,description,tip,target){
 title.textContent=heading;body.replaceChildren();
 const p=document.createElement('p');p.textContent=description;body.appendChild(p);
 const box=document.createElement('div');box.className='ca-tip';box.textContent='คำแนะนำ: '+tip;body.appendChild(box);
 root.classList.add('open');if(target)moveTo(target);
}
root.querySelector('#ca-rabbit-trigger').addEventListener('click',()=>{
 if(root.classList.contains('open'))home();
 else explain('ผู้ช่วยนักสำรวจข้อมูล','ฉันช่วยอธิบายข้อมูล กราฟ และตัวกรองใน Career Atlas ได้','เลือกการ์ดหรือเมนูที่ต้องการให้ช่วยอธิบาย',null);
});
root.querySelector('.ca-close').addEventListener('click',home);
const cardSelector='.metric-card,.welcome-stat,.overview-card,.model-card,.about-card,.insight-note,.method-grid>div,.summary-band,.chart-card,.table-card';
const rules=[
[/ประเทศที่เปรียบเทียบ|DATA SOURCE/i,'ประเทศที่ใช้เปรียบเทียบ','Career Atlas ใช้ข้อมูล 4 ประเทศ ได้แก่ ไทย ฝรั่งเศส ญี่ปุ่น และสหรัฐอเมริกา','เปรียบเทียบเฉพาะกลุ่มอาชีพและช่วงปีที่มีข้อมูลร่วมกัน'],
[/ช่วงปีเปรียบเทียบ|STUDY PERIOD/i,'ช่วงเวลาที่เปรียบเทียบ','การเปรียบเทียบข้ามประเทศใช้ช่วงปี 2013–2023 ซึ่งเป็นช่วงที่ทั้ง 4 ประเทศมีข้อมูลร่วมกัน','ใช้ช่วงเวลาเดียวกันเมื่อต้องการเทียบประเทศ'],
[/กลุ่มอาชีพที่เปรียบเทียบได้|21 กลุ่ม/i,'21 กลุ่มอาชีพที่เปรียบเทียบได้','เป็นกลุ่มอาชีพ ISCO-08 ระดับ 2 หลักที่มีข้อมูลครบตามเกณฑ์ของทั้ง 4 ประเทศ','ระบุว่าเป็น 21 กลุ่มที่เปรียบเทียบร่วมกัน ไม่ใช่ทุกอาชีพ'],
[/เจาะลึกประเทศไทย|43 กลุ่ม/i,'ข้อมูลเจาะลึกประเทศไทย','แสดง 43 กลุ่มอาชีพที่ประเทศไทยรายงานในช่วงปี 2013–2025','ใช้ดูบริบทไทย ไม่เทียบตรงกับกลุ่มที่ไม่มีข้อมูลร่วมกัน'],
[/Trend Line|Linear Trend/i,'เส้นแนวโน้ม (Linear Trend)','เส้นแนวโน้มคำนวณจากรูปแบบข้อมูลในอดีต ไม่ใช่ข้อมูลจริงของทุกปีหรือคำยืนยันอนาคต','อ่านควบคู่กับข้อมูลจริงและระบุช่วงปีที่ใช้สร้างแบบจำลอง'],
[/Naive|MAE|Backtest/i,'การทดสอบแบบจำลอง (Backtest)','Backtest เปรียบเทียบค่าที่แบบจำลองทำนายกับข้อมูลจริง ส่วน MAE ยิ่งต่ำหมายถึงค่าคลาดเคลื่อนเฉลี่ยยิ่งน้อย','สรุปเฉพาะช่วงทดสอบ ไม่เหมารวมทุกปีหรือทุกอาชีพ'],
[/คำถามหลักของโครงการ/i,'คำถามหลักของโครงการ','ตรวจสอบว่าโครงสร้างอาชีพของไทยแตกต่างจากประเทศอื่นหรือไม่ และเปลี่ยนแปลงตามเวลาอย่างไร','ตั้งสมมติฐานก่อนดูกราฟ แล้วตรวจสอบด้วยหลักฐาน']
];
function textOf(el){return (el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();}
function explainCard(card){
 const text=textOf(card),rule=rules.find(item=>item[0].test(text));
 if(rule)explain(rule[1],rule[2],rule[3],card);
 else{const h=card.querySelector('h1,h2,h3,h4,strong,.metric-label,.card-index,.table-heading');explain(h?textOf(h):'ข้อมูลที่เลือก',text.slice(0,260)||'ส่วนนี้แสดงข้อมูลประกอบการสำรวจอาชีพ','สังเกตตัวเลข หน่วย ช่วงเวลา และตัวกรองก่อนสรุปผล',card);}
}
document.addEventListener('click',event=>{
 const nav=event.target.closest('.nav-tab');
 if(nav){const name=textOf(nav);explain(name,'หน้านี้แสดงข้อมูลในหัวข้อ '+name,'อ่านชื่อกราฟและตัวกรองก่อนเริ่มตีความ',nav);return;}
 const card=event.target.closest(cardSelector);
 if(card&&!event.target.closest('button,a,select,input,textarea'))explainCard(card);
});
document.addEventListener('change',event=>{
 const el=event.target;if(!el.matches('select,input'))return;
 const label=el.closest('label'),name=label?textOf(label).replace(el.value,'').trim():'ตัวกรอง',value=el.options?el.options[el.selectedIndex]?.text:el.value;
 explain('อัปเดตตัวกรอง: '+name,'คุณเลือกค่า “'+(value||'ไม่ได้ระบุ')+'” ระบบจะแสดงข้อมูลตามเงื่อนไขนี้','สังเกตว่ากราฟและค่าสรุปเปลี่ยนไปอย่างไร',el.parentElement);
});
document.querySelectorAll(cardSelector).forEach(card=>{
 card.classList.add('ca-guide-card');if(!card.hasAttribute('tabindex'))card.setAttribute('tabindex','0');
 card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();explainCard(card);}});
});
})();