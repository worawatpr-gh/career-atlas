(() => {
'use strict';
const scriptUrl=document.currentScript?document.currentScript.src:new URL('assets/rabbit-guide-v9.js',location.href).href;
function initRabbit(){
 let root=document.getElementById('ca-rabbit');
 if(!root){
  root=document.createElement('div');root.id='ca-rabbit';
  root.innerHTML='<div id="ca-rabbit-panel" role="dialog" aria-live="polite"><button class="ca-close" type="button" aria-label="ปิด">×</button><h3 id="ca-rabbit-title">ผู้ช่วยนักสำรวจข้อมูล</h3><div id="ca-rabbit-body"><p>คลิกการ์ดหรือเมนู แล้วฉันจะช่วยอธิบายให้ฟัง</p></div></div><div id="ca-rabbit-caption">อยากรู้อะไรเกี่ยวกับข้อมูล คลิกได้เลย 🐰</div><button id="ca-rabbit-trigger" type="button" aria-label="เปิดผู้ช่วยกระต่าย"><img alt="กระต่ายผู้ช่วย Career Atlas"><span class="ca-rabbit-fallback" aria-hidden="true">🐰</span></button>';
  document.body.appendChild(root);
 }
 const css=document.createElement('style');
 css.textContent=[
 '#ca-rabbit{position:fixed!important;right:16px!important;bottom:12px!important;left:auto!important;top:auto!important;z-index:2147483647!important;display:flex!important;align-items:flex-end!important;gap:9px!important;font-family:Inter,"Noto Sans Thai",sans-serif!important;pointer-events:none!important;visibility:visible!important;opacity:1!important}',
 '#ca-rabbit *{box-sizing:border-box}',
 '#ca-rabbit-trigger{position:relative!important;display:grid!important;place-items:center!important;flex:0 0 92px!important;width:92px!important;height:112px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important;cursor:pointer!important;pointer-events:auto!important}',
 '#ca-rabbit-trigger img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;filter:drop-shadow(0 5px 8px rgba(50,12,101,.22))!important}',
 '#ca-rabbit-trigger .ca-rabbit-fallback{display:none;position:absolute;inset:0;place-items:center;font-size:68px}',
 '#ca-rabbit-caption{max-width:190px!important;margin:0 0 70px!important;padding:9px 12px!important;background:#fff!important;border:1px solid #e6dcf7!important;border-radius:13px 13px 2px 13px!important;color:#58427f!important;font-size:12px!important;line-height:1.5!important;box-shadow:0 4px 14px rgba(56,35,107,.12)!important;pointer-events:none!important}',
 '#ca-rabbit-panel{display:none;width:min(340px,calc(100vw - 130px))!important;max-height:65vh!important;overflow:auto!important;background:#fff!important;border:1px solid #e5dcf8!important;border-radius:18px!important;box-shadow:0 12px 38px rgba(40,24,76,.22)!important;padding:16px!important;color:#302744!important;position:relative!important;pointer-events:auto!important}',
 '#ca-rabbit.open #ca-rabbit-panel{display:block!important;animation:ca-panel-in .22s ease-out both}#ca-rabbit.open #ca-rabbit-caption{display:none!important}',
 '@keyframes ca-panel-in{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}',
 '#ca-rabbit.ca-bounce #ca-rabbit-trigger{animation:ca-rabbit-pop .42s ease-in-out 1}@keyframes ca-rabbit-pop{0%,100%{transform:translateY(0) rotate(0)}35%{transform:translateY(-10px) rotate(-5deg)}70%{transform:translateY(1px) rotate(3deg)}',
 '#ca-rabbit-panel h3{margin:0 28px 8px 0!important;font-size:15px!important;color:#4c2d89!important}#ca-rabbit-panel p{margin:7px 0!important;font-size:12px!important;line-height:1.65!important}',
 '#ca-rabbit-panel .ca-tip{margin-top:10px!important;padding:10px 11px!important;border-radius:11px!important;background:#f2edff!important;color:#513b7d!important;font-size:12px!important;line-height:1.6!important}',
 '#ca-rabbit-panel .ca-close{position:absolute!important;right:12px!important;top:10px!important;border:0!important;background:transparent!important;color:#7d6b9f!important;font-size:20px!important;cursor:pointer!important}',
 
 '.ca-guide-card{cursor:pointer}.ca-guide-card:focus-visible{outline:3px solid #9c80f2;outline-offset:3px}',
 '@media(max-width:640px){#ca-rabbit{right:6px!important;bottom:6px!important;gap:5px!important}#ca-rabbit-trigger{width:66px!important;height:84px!important;flex-basis:66px!important}#ca-rabbit-caption{max-width:120px!important;margin-bottom:46px!important;font-size:10px!important}#ca-rabbit-panel{width:min(280px,calc(100vw - 95px))!important;padding:12px!important}}'
 ].join('\n');
 document.head.appendChild(css);
 root.style.cssText+=';position:fixed!important;right:16px!important;bottom:12px!important;left:auto!important;top:auto!important;z-index:2147483647!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:none!important;';
 const img=root.querySelector('img');img.src=new URL('rabbit-3d.png',scriptUrl).href;
 img.addEventListener('error',()=>{img.style.display='none';root.querySelector('.ca-rabbit-fallback').style.display='grid';},{once:true});
 const title=root.querySelector('#ca-rabbit-title'),body=root.querySelector('#ca-rabbit-body');
 function home(){root.classList.remove('open','ca-bounce');}
 function explain(heading,description,tip,target){
  title.textContent=heading;body.replaceChildren();const p=document.createElement('p');p.textContent=description;body.appendChild(p);
  const box=document.createElement('div');box.className='ca-tip';box.textContent='คำแนะนำ: '+tip;body.appendChild(box);
  root.classList.add('open');root.classList.remove('ca-bounce');void root.offsetWidth;root.classList.add('ca-bounce');
 }
 root.querySelector('#ca-rabbit-trigger').addEventListener('click',()=>{if(root.classList.contains('open'))home();else explain('ผู้ช่วยนักสำรวจข้อมูล','ฉันช่วยอธิบายข้อมูล กราฟ และตัวกรองใน Career Atlas ได้','เลือกการ์ดหรือเมนูที่ต้องการให้ช่วยอธิบาย',null);});
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
 const textOf=el=>(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
 function explainCard(card){const text=textOf(card),rule=rules.find(item=>item[0].test(text));if(rule)explain(rule[1],rule[2],rule[3],card);else{const h=card.querySelector('h1,h2,h3,h4,strong,.metric-label,.card-index,.table-heading');explain(h?textOf(h):'ข้อมูลที่เลือก',text.slice(0,260)||'ส่วนนี้แสดงข้อมูลประกอบการสำรวจอาชีพ','สังเกตตัวเลข หน่วย ช่วงเวลา และตัวกรองก่อนสรุปผล',card);}}
 document.addEventListener('click',event=>{
  const nav=event.target.closest('.nav-tab');if(nav){const name=textOf(nav);explain(name,'หน้านี้แสดงข้อมูลในหัวข้อ '+name,'อ่านชื่อกราฟและตัวกรองก่อนเริ่มตีความ',nav);return;}
  const card=event.target.closest(cardSelector);if(card&&!event.target.closest('button,a,select,input,textarea'))explainCard(card);
 });
 document.addEventListener('change',event=>{const el=event.target;if(!el.matches('select,input'))return;const label=el.closest('label'),name=label?textOf(label).replace(el.value,'').trim():'ตัวกรอง',value=el.options?el.options[el.selectedIndex]?.text:el.value;explain('อัปเดตตัวกรอง: '+name,'คุณเลือกค่า “'+(value||'ไม่ได้ระบุ')+'” ระบบจะแสดงข้อมูลตามเงื่อนไขนี้','สังเกตว่ากราฟและค่าสรุปเปลี่ยนไปอย่างไร',el.parentElement);});
 document.querySelectorAll(cardSelector).forEach(card=>{card.classList.add('ca-guide-card');if(!card.hasAttribute('tabindex'))card.setAttribute('tabindex','0');card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();explainCard(card);}});});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initRabbit,{once:true});else initRabbit();
})();