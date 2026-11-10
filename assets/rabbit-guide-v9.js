(() => {
'use strict';
const scriptUrl=document.currentScript?document.currentScript.src:new URL('assets/rabbit-guide-v9.js',location.href).href;
function initRabbit(){
 let root=document.getElementById('ca-rabbit');
 if(!root){
  root=document.createElement('div');root.id='ca-rabbit';
  root.innerHTML='<div id="ca-rabbit-panel" role="dialog" aria-live="polite"><button class="ca-close" type="button" aria-label="ปิด">×</button><h3 id="ca-rabbit-title">ผู้ช่วยนักสำรวจข้อมูล</h3><div id="ca-rabbit-body"><p>คลิกการ์ดหรือเมนู แล้วฉันจะช่วยอธิบายให้ฟัง</p></div></div><div id="ca-rabbit-caption">สงสัยกราฟไหน คลิกให้ฉันช่วยอธิบายได้ 🐰</div><button id="ca-rabbit-trigger" type="button" aria-label="เปิดผู้ช่วยกระต่าย"><img alt="กระต่ายผู้ช่วย Career Atlas"><span class="ca-rabbit-fallback" aria-hidden="true">🐰</span></button>';
  document.body.appendChild(root);
 }
 const css=document.createElement('style');
 css.textContent=[
 '#ca-rabbit{position:fixed!important;right:16px!important;bottom:12px!important;left:auto!important;top:auto!important;z-index:2147483647!important;display:flex!important;align-items:flex-end!important;gap:9px!important;font-family:Inter,"Noto Sans Thai",sans-serif!important;pointer-events:none!important;visibility:visible!important;opacity:1!important}',
 '#ca-rabbit *{box-sizing:border-box}',
 '#ca-rabbit-trigger{position:relative!important;display:grid!important;place-items:center!important;flex:0 0 78px!important;width:78px!important;height:96px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important;cursor:grab!important;touch-action:none!important;user-select:none!important;pointer-events:auto!important}',
 '#ca-rabbit.ca-dragging{transition:none!important;user-select:none!important}#ca-rabbit.ca-dragging #ca-rabbit-trigger{cursor:grabbing!important;animation:none!important}#ca-rabbit.ca-snapping{transition:left .32s cubic-bezier(.2,.8,.2,1),top .32s cubic-bezier(.2,.8,.2,1)!important}#ca-rabbit.ca-edge-left{flex-direction:row-reverse!important}#ca-rabbit.ca-edge-right{flex-direction:row!important}#ca-rabbit.ca-edge-left{align-items:flex-end!important}',
 '#ca-rabbit-trigger img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;filter:drop-shadow(0 5px 8px rgba(50,12,101,.22))!important}',
 '#ca-rabbit-trigger .ca-rabbit-fallback{display:none;position:absolute;inset:0;place-items:center;font-size:68px}',
 '#ca-rabbit-caption{max-width:165px!important;margin:0 0 56px!important;padding:8px 10px!important;background:#fff!important;border:1px solid #e6dcf7!important;border-radius:13px 13px 2px 13px!important;color:#58427f!important;font-size:11px!important;line-height:1.5!important;box-shadow:0 4px 14px rgba(56,35,107,.12)!important;pointer-events:none!important}',
 '#ca-rabbit-panel{display:none;width:min(310px,calc(100vw - 130px))!important;max-height:62vh!important;overflow:auto!important;background:#fff!important;border:1px solid #e5dcf8!important;border-radius:18px!important;box-shadow:0 12px 38px rgba(40,24,76,.22)!important;padding:14px!important;color:#302744!important;position:relative!important;pointer-events:auto!important}',
 '#ca-rabbit{position:fixed!important}#ca-rabbit.open #ca-rabbit-panel{display:block!important;position:fixed!important;right:auto!important;bottom:auto!important;left:12px!important;top:12px!important;margin:0!important;max-width:calc(100vw - 24px)!important;animation:ca-panel-in .22s ease-out both}#ca-rabbit.open #ca-rabbit-caption{display:none!important}',
 '@keyframes ca-panel-in{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}',
 '#ca-rabbit.ca-bounce #ca-rabbit-trigger{animation:ca-rabbit-pop .55s ease-in-out 1}',
 '@keyframes ca-rabbit-pop{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-12px) rotate(-5deg)}60%{transform:translateY(1px) rotate(4deg)}80%{transform:translateY(-3px) rotate(-2deg)}}',
 '#ca-rabbit-panel h3{margin:0 28px 8px 0!important;font-size:14px!important;color:#4c2d89!important}#ca-rabbit-panel p{margin:7px 0!important;font-size:11px!important;line-height:1.6!important}',
 '#ca-rabbit-panel .ca-tip{margin-top:10px!important;padding:8px 10px!important;border-radius:11px!important;background:#f2edff!important;color:#513b7d!important;font-size:12px!important;line-height:1.6!important}',
 '#ca-rabbit-panel .ca-close{position:absolute!important;right:12px!important;top:10px!important;width:28px!important;height:28px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:#7d6b9f!important;font-family:Arial,sans-serif!important;font-size:22px!important;font-weight:400!important;line-height:28px!important;text-align:center!important;cursor:pointer!important;box-shadow:none!important}',
 
 '.ca-guide-card{cursor:pointer}.ca-guide-card:focus-visible{outline:3px solid #9c80f2;outline-offset:3px}',
 '@media(max-width:900px){#ca-rabbit-trigger{width:68px!important;height:84px!important;flex-basis:68px!important}#ca-rabbit-caption{max-width:150px!important;margin-bottom:48px!important}}\n  @media(max-width:640px){#ca-rabbit{right:6px!important;bottom:6px!important;gap:5px!important}#ca-rabbit-trigger{width:56px!important;height:72px!important;flex-basis:56px!important}#ca-rabbit-caption{max-width:112px!important;margin-bottom:39px!important;font-size:9px!important;padding:7px 8px!important}#ca-rabbit-panel{width:min(260px,calc(100vw - 82px))!important;padding:11px!important}}'
 ].join('\n');
 document.head.appendChild(css);
 root.style.cssText+=';position:fixed!important;right:16px!important;bottom:12px!important;left:auto!important;top:auto!important;z-index:2147483647!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:none!important;';
 root.classList.remove('ca-edge-left','ca-edge-right','ca-edge-top','ca-edge-bottom');
 const img=root.querySelector('img');img.src=new URL('rabbit-3d.png',scriptUrl).href;
 img.addEventListener('error',()=>{img.style.display='none';root.querySelector('.ca-rabbit-fallback').style.display='grid';},{once:true});
 const title=root.querySelector('#ca-rabbit-title'),body=root.querySelector('#ca-rabbit-body');
 function home(){
  root.classList.remove('open','ca-bounce');
  // Closing restores the caption and increases the widget height; re-clamp it
  // so the rabbit and caption remain fully inside the viewport.
  requestAnimationFrame(()=>{
   const rect=root.getBoundingClientRect(),pad=innerWidth<=640?18:24;
   const side=root.classList.contains('ca-edge-left')?'left':'right';
   const left=side==='left'?pad:Math.max(pad,innerWidth-rect.width-pad);
   const top=clamp(rect.top,16,Math.max(16,innerHeight-rect.height-16));
   root.style.setProperty('left',left+'px','important');
   root.style.setProperty('top',top+'px','important');
   root.style.setProperty('right','auto','important');
   root.style.setProperty('bottom','auto','important');
  });
 }
 function positionPanel(){
  if(!root.classList.contains('open'))return;
  const panel=root.querySelector('#ca-rabbit-panel');
  const rr=root.getBoundingClientRect(),gap=10,pad=12;
  const pr=panel.getBoundingClientRect();
  const above=rr.top-pad-gap,below=innerHeight-rr.bottom-pad-gap;
  let top;
  if(above>=pr.height)top=rr.top-gap-pr.height;
  else if(below>=pr.height)top=rr.bottom+gap;
  else if(below>above)top=rr.bottom+gap;
  else top=rr.top-gap-pr.height;
  top=clamp(top,pad,Math.max(pad,innerHeight-pr.height-pad));
  let left;
  if(rr.left+rr.width/2>innerWidth/2)left=rr.right-pr.width;
  else left=rr.left;
  left=clamp(left,pad,Math.max(pad,innerWidth-pr.width-pad));
  panel.style.setProperty('left',left+'px','important');
  panel.style.setProperty('top',top+'px','important');
 }
 function explain(heading,description,tip,target){
  title.textContent=heading;body.replaceChildren();const p=document.createElement('p');p.textContent=description;body.appendChild(p);
  const box=document.createElement('div');box.className='ca-tip';box.textContent='คำแนะนำ: '+tip;body.appendChild(box);
  root.classList.add('open');root.classList.remove('ca-bounce');positionPanel();requestAnimationFrame(positionPanel);root.classList.add('ca-bounce');
 }
 const trigger=root.querySelector('#ca-rabbit-trigger');
 let dragState=null, dragged=false, suppressClick=false, suppressTimer=null;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 trigger.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;
  const rect=root.getBoundingClientRect();
  dragState={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height};
  dragged=false;
  if(suppressTimer)clearTimeout(suppressTimer);
  event.preventDefault();
  event.stopPropagation();
 });
 window.addEventListener('pointermove',event=>{
  if(!dragState||event.pointerId!==dragState.pointerId)return;
  const dx=event.clientX-dragState.startX,dy=event.clientY-dragState.startY;
  if(!dragged&&(Math.abs(dx)>4||Math.abs(dy)>4)){
   dragged=true;
   root.classList.add('ca-dragging');
   root.classList.remove('ca-snapping');
   root.style.setProperty('right','auto','important');
   root.style.setProperty('bottom','auto','important');
   root.style.setProperty('left',dragState.left+'px','important');
   root.style.setProperty('top',dragState.top+'px','important');
  }
  if(!dragged)return;
  event.preventDefault();
  root.style.setProperty('left',clamp(dragState.left+dx,0,Math.max(0,innerWidth-dragState.width))+'px','important');
  root.style.setProperty('top',clamp(dragState.top+dy,0,Math.max(0,innerHeight-dragState.height))+'px','important');
  // Keep the explanation panel attached to the rabbit while it is being dragged.
  positionPanel();
 },{passive:false});
 function finishDrag(event){
  if(!dragState||event.pointerId!==dragState.pointerId)return;
  const state=dragState;dragState=null;
  if(!dragged)return;
  suppressClick=true;
  root.classList.remove('ca-dragging');
  const rect=root.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  const distances=[{edge:'left',d:cx},{edge:'right',d:innerWidth-cx},{edge:'top',d:cy},{edge:'bottom',d:innerHeight-cy}].sort((a,b)=>a.d-b.d);
  const edge=distances[0].edge;
  // Keep the same horizontal layout at every height: corners use the
  // left/right side layout too, rather than switching to a top/bottom layout.
  const side=cx<=innerWidth/2?'left':'right';
  root.classList.remove('ca-edge-left','ca-edge-right','ca-edge-top','ca-edge-bottom');
  root.classList.add('ca-edge-'+side,'ca-snapping');
  let left=clamp(rect.left,0,Math.max(0,innerWidth-rect.width));
  let top=clamp(rect.top,0,Math.max(0,innerHeight-rect.height));
  const edgePad=innerWidth<=640?18:24;
  if(edge==='left')left=edgePad;
  if(edge==='right')left=Math.max(edgePad,innerWidth-rect.width-edgePad);
  if(edge==='top')top=16;
  if(edge==='bottom')top=Math.max(16,innerHeight-rect.height-16);
  root.style.setProperty('left',left+'px','important');
  root.style.setProperty('top',top+'px','important');
  root.style.setProperty('right','auto','important');
  root.style.setProperty('bottom','auto','important');
  setTimeout(()=>root.classList.remove('ca-snapping'),400);
  suppressTimer=setTimeout(()=>{suppressClick=false;},250);
 }
 window.addEventListener('resize',positionPanel);
 window.addEventListener('pointerup',finishDrag);
 window.addEventListener('pointercancel',finishDrag);
 trigger.addEventListener('click',()=>{if(suppressClick)return;if(root.classList.contains('open'))home();else explain('ผู้ช่วยนักสำรวจข้อมูล','ฉันช่วยอธิบายข้อมูล กราฟ และตัวกรองใน Career Atlas ได้','เลือกการ์ดหรือเมนูที่ต้องการให้ช่วยอธิบาย',null);});
 root.querySelector('.ca-close').addEventListener('click',home);
 const cardSelector='.metric-card,.welcome-stat,.overview-card,.model-card,.about-card,.insight-note,.method-grid>div,.summary-band,.chart-card,.table-card';
 const rules=[
  [/Career Ranking|TOP 10 OCCUPATION GROUPS|10 อันดับกลุ่มอาชีพ/i,'Career Ranking — 10 อันดับกลุ่มอาชีพ','กราฟแท่งแนวนอนแสดง 10 กลุ่มอาชีพที่มี occupation_share สูงที่สุดของประเทศไทยในปีที่เลือก ใช้ข้อมูลเพศรวม (Total) โดย occupation_share = จำนวนผู้มีงานทำในกลุ่มอาชีพ ÷ จำนวนผู้มีงานทำรวมของประเทศในปีนั้น × 100','อันดับสูงหมายถึงมีสัดส่วนสูงในโครงสร้างการจ้างงาน ไม่ได้หมายความว่าเป็นอาชีพที่ดีที่สุด รายได้สูงที่สุด หรือมีความต้องการแรงงานมากที่สุด'],
  [/Career Evolution|TIME SERIES|Linear Regression/i,'Career Evolution — การเปลี่ยนแปลงตามเวลา','กราฟใช้ข้อมูลเพศรวม (Total) ของกลุ่มอาชีพที่มีข้อมูลจริงอย่างน้อย 8 ปี เส้นทึบคือข้อมูลจริง เส้นประคือ Linear Regression ที่คำนวณจากข้อมูลจริง และเส้นจุดคือการต่อสมการแนวโน้มออกไปอีก 3 ปี','ค่าที่ต่อไปข้างหน้าเป็นสัดส่วนตามสมการแนวโน้ม ไม่ใช่จำนวนตำแหน่งงานหรือข้อยืนยันอนาคต และแนวโน้มไม่ได้บอกสาเหตุของการเปลี่ยนแปลง'],
  [/Career Heatmap|OCCUPATION PATTERNS|THAILAND OCCUPATION SHARE/i,'Career Heatmap — รูปแบบสัดส่วนอาชีพ','Heatmap ใช้ข้อมูลเพศรวม (Total) ของทุกกลุ่มอาชีพ ISCO-08 ที่มีข้อมูลอย่างน้อยหนึ่งปีในช่วงที่เลือก สีและตัวเลขในแต่ละช่องแทน occupation_share ของปีนั้น','ช่องว่างหมายถึงไม่มีข้อมูล ไม่ใช่ 0% สีเข้มหมายถึงค่าสัดส่วนสูงกว่าในสเกลของกราฟ ไม่ได้หมายถึงจำนวนแรงงานโดยตรง'],
  [/Gender Gap|GENDER STRUCTURE|FEMALE VS MALE/i,'Gender Gap — เปรียบเทียบโครงสร้างอาชีพตามเพศ','กราฟเปรียบเทียบ occupation_share ภายในกลุ่มผู้มีงานทำหญิงและชาย โดยใช้กลุ่มอาชีพที่ข้อมูลครบทุกปีและทั้งสองเพศในชุดเปรียบเทียบของประเทศไทย','ตัวหารของหญิงและชายแยกจากกัน จึงเป็นการเปรียบเทียบสัดส่วนภายในโครงสร้างแรงงานแต่ละเพศ ไม่ใช่จำนวนผู้หญิงเทียบกับจำนวนผู้ชาย และผลต่างรายงานเป็นจุดเปอร์เซ็นต์'],
  [/^Trend Line\s*0\.166/i,'ผลของวิธี Trend Line','Backtest ใช้ข้อมูลปี 2013–2023 ฝึกเส้น Linear Trend และทดสอบกับข้อมูลจริงปี 2024 และ 2025 ค่า MAE ที่บันทึกใน Snapshot คือ 0.166 ในปี 2024 และ 0.180 ในปี 2025 จุดเปอร์เซ็นต์','เปรียบเทียบ MAE กับ Naive ในปีเดียวกัน ค่า MAE ที่ต่ำกว่าหมายถึงความคลาดเคลื่อนเฉลี่ยน้อยกว่า'],
  [/^Naive\s*0\.136/i,'ผลของวิธี Naive','Naive ใช้ค่าสุดท้ายในช่วง Training เป็นค่าฐานสำหรับปีทดสอบ ค่า MAE ที่บันทึกใน Snapshot คือ 0.136 ในปี 2024 และ 0.148 ในปี 2025 จุดเปอร์เซ็นต์','Naive เป็นแบบจำลองฐานที่เรียบง่าย ไม่ได้หมายความว่าค่าจริงจะคงเดิมในอนาคต'],
  [/^ผลการเปรียบเทียบ\s+33\.8%/i,'ผลการเปรียบเทียบแบบจำลอง','ในผล Backtest ที่บันทึกไว้ Trend Line มีค่าความผิดพลาดต่ำกว่า Naive ใน 33.8% ของกรณีกลุ่มอาชีพ–ปีที่ทดสอบทั้งหมด 80 กรณี','ข้อสรุปนี้ใช้ได้กับชุดทดสอบ 2024–2025 เท่านั้น ไม่ควรเหมารวมว่าแบบจำลองใดดีกว่าในทุกอาชีพหรือทุกปี'],
  [/^MEAN ABSOLUTE ERROR|MAE/i,'Mean Absolute Error (MAE)','MAE คือค่าเฉลี่ยของขนาดความผิดพลาดระหว่างค่าที่แบบจำลองคาดการณ์กับค่าจริง โดยไม่สนใจทิศทางว่าทำนายสูงหรือต่ำเกินไป','ค่า MAE ยิ่งต่ำหมายถึงความคลาดเคลื่อนเฉลี่ยยิ่งน้อย และต้องเปรียบเทียบในหน่วยและชุดทดสอบเดียวกัน'],
  [/^5 กรณีที่เส้นแนวโน้มคลาดเคลื่อนมากที่สุด/i,'กรณีที่ Trend Line คลาดเคลื่อนมากที่สุด','ตารางแสดงคู่กลุ่มอาชีพ–ปีที่ Trend Line มีความคลาดเคลื่อนสูง พร้อมค่าจริง ค่าจาก Trend Line และค่าจาก Naive','เปรียบเทียบค่าทั้งสามคอลัมน์เพื่อดูว่าแบบจำลองใดใกล้ค่าจริงกว่าในแต่ละกรณี'],
  [/^ข้อค้นพบ:/i,'ข้อค้นพบจาก Backtest','ผลจาก Snapshot ปัจจุบันพบว่า Naive มี MAE เฉลี่ยต่ำกว่า Trend Line ทั้งปี 2024 และ 2025 แต่ Trend Line ยังมีบางกรณีที่คลาดเคลื่อนน้อยกว่า','สรุปโดยระบุปี หน่วย และจำนวนกรณีที่ทดสอบเสมอ'],
  [/คำถามหลักของโครงการ/i,'คำถามหลักของโครงการ','โครงการนี้สำรวจว่าโครงสร้างอาชีพของประเทศไทยเป็นอย่างไร และสัดส่วนของกลุ่มอาชีพเปลี่ยนแปลงไปตามเวลาอย่างไร','ใช้กราฟและตัวเลขจากข้อมูล ILOSTAT ที่แสดงบนหน้าเว็บเป็นหลักฐาน ไม่สรุปสาเหตุจากกราฟเพียงอย่างเดียว'],
  [/แหล่งข้อมูลต้นทาง|ILOSTAT/i,'แหล่งข้อมูล ILOSTAT','ชุดข้อมูล EMP_TEMP_SEX_OC2_NB_A คือ Employment by sex and occupation — ISCO level 2 โดยค่าจำนวนผู้มีงานทำรายงานเป็นพันคน และเว็บไซต์คำนวณสัดส่วนจากจำนวนผู้มีงานทำในอาชีพเทียบกับยอดรวมตามปีและเพศ','ตรวจสอบช่วงปีที่มีข้อมูลและค่า Missing ก่อนตีความ อย่าแทนค่าที่หายไปด้วยศูนย์']
 ];;
 const textOf=el=>(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
 function explainCard(card){
  const text=textOf(card);
  // Read the title from the card that was actually clicked, never from its tab.
  // Plotly chart titles are rendered dynamically as SVG text (.gtitle).
  const ownTitle=card.querySelector(
   '.chart-label,.table-heading h3,.metric-label,.card-index,h1,h2,h3,h4,b,strong,.gtitle'
  );
  let headingText=ownTitle?textOf(ownTitle):'';
  if(!headingText){
   const plotTitle=card.querySelector('.js-plotly-plot .gtitle');
   if(plotTitle)headingText=textOf(plotTitle);
  }
  // Chart cards without an explicit HTML heading (e.g. Career Evolution)
  // use their own chart's Plotly title, with a card-specific fallback.
  if(!headingText&&card.classList.contains('chart-card')){
   const plotTitle=card.querySelector('.gtitle');
   headingText=plotTitle?textOf(plotTitle):'กราฟข้อมูลอาชีพ';
  }
  if(!headingText)headingText='รายละเอียดในการ์ด';
  const rule=rules.find(item=>item[0].test(text));
  const description=text||'การ์ดนี้แสดงข้อมูลประกอบการสำรวจโครงสร้างอาชีพ';
  const tip=card.classList.contains('chart-card')
   ?'อ่านชื่อกราฟ แกน หน่วย และคำอธิบายสัญลักษณ์ก่อนเปรียบเทียบข้อมูล'
   :'อ่านหัวข้อและข้อความภายในการ์ด แล้วพิจารณาว่าข้อมูลนี้สนับสนุนข้อค้นพบอย่างไร';
  explain(headingText,rule?rule[1]+' — '+rule[2]:description.slice(0,420),rule?rule[3]:tip,card);
 }
 document.addEventListener('click',event=>{
  const nav=event.target.closest('.nav-tab');if(nav){const name=textOf(nav);explain(name,'หน้านี้แสดงข้อมูลในหัวข้อ '+name,'อ่านชื่อกราฟและตัวกรองก่อนเริ่มตีความ',nav);return;}
  const card=event.target.closest(cardSelector);if(card&&!event.target.closest('button,a,select,input,textarea'))explainCard(card);
 });
 document.addEventListener('change',event=>{const el=event.target;if(!el.matches('select,input'))return;const label=el.closest('label'),name=label?textOf(label).replace(el.value,'').trim():'ตัวกรอง',value=el.options?el.options[el.selectedIndex]?.text:el.value;explain('อัปเดตตัวกรอง: '+name,'คุณเลือกค่า “'+(value||'ไม่ได้ระบุ')+'” ระบบจะแสดงข้อมูลตามเงื่อนไขนี้','สังเกตว่ากราฟและค่าสรุปเปลี่ยนไปอย่างไร',el.parentElement);});
 document.querySelectorAll(cardSelector).forEach(card=>{card.classList.add('ca-guide-card');if(!card.hasAttribute('tabindex'))card.setAttribute('tabindex','0');card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();explainCard(card);}});});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initRabbit,{once:true});else initRabbit();
})();