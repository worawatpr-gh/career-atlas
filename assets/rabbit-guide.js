(() => {
'use strict';
const BUNNY='assets/rabbit-3d.png?v=1';
const css=`
#ca-rabbit{position:fixed;right:18px;bottom:10px;z-index:9998;display:flex;align-items:flex-end;gap:8px;font-family:Inter,"Noto Sans Thai",Tahoma,sans-serif}
#ca-rabbit-trigger{width:82px;height:108px;border:0;background:transparent;padding:0;box-shadow:none;cursor:pointer;animation:none!important;transform:none!important;filter:drop-shadow(0 5px 8px rgba(50,12,101,.2))}
#ca-rabbit-trigger img{width:100%;height:100%;object-fit:contain;display:block;animation:none!important;transform:none!important}
#ca-rabbit-panel{display:none;width:min(340px,calc(100vw - 120px));max-height:min(440px,70vh);overflow:auto;background:#fff;border:1px solid #e5dcf8;border-radius:18px;box-shadow:0 12px 38px rgba(40,24,76,.22);padding:16px;color:#302744;position:relative}
#ca-rabbit.open #ca-rabbit-panel{display:block}
#ca-rabbit-panel h3{margin:0 28px 8px 0;font-size:15px;color:#4c2d89}
#ca-rabbit-panel p{margin:7px 0;font-size:12px;line-height:1.65}
#ca-rabbit-panel .ca-tip{margin-top:10px;padding:10px 11px;border-radius:11px;background:#f2edff;color:#513b7d;font-size:12px;line-height:1.6}
#ca-rabbit-panel .ca-close{position:absolute;right:12px;top:10px;border:0;background:transparent;color:#7d6b9f;font-size:20px;cursor:pointer}
#ca-rabbit-caption{max-width:190px;margin-bottom:70px;padding:8px 11px;border-radius:13px 13px 2px 13px;background:#fff;border:1px solid #e7def7;color:#58427f;font-size:11px;line-height:1.5;box-shadow:0 4px 14px rgba(56,35,107,.1)}
#ca-rabbit.open #ca-rabbit-caption{display:none}
.ca-guide-card{cursor:pointer}
.ca-guide-card:focus-visible{outline:3px solid #9c80f2;outline-offset:3px}
@media(max-width:640px){#ca-rabbit{right:8px;bottom:8px}#ca-rabbit-trigger{width:60px;height:80px}#ca-rabbit-caption{max-width:125px;margin-bottom:46px;font-size:10px}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const root=document.createElement('div');root.id='ca-rabbit';
root.innerHTML=`<div id="ca-rabbit-panel" role="dialog" aria-live="polite" aria-label="ผู้ช่วยแนะนำ Career Atlas"><button class="ca-close" type="button" aria-label="ปิด">×</button><h3 id="ca-rabbit-title">ผู้ช่วยนักสำรวจข้อมูล</h3><div id="ca-rabbit-body"><p>คลิกการ์ด เมนู หรือเปลี่ยนตัวกรอง แล้วฉันจะอธิบายส่วนนั้นให้ฟัง</p><div class="ca-tip">คำแนะนำจะเปลี่ยนตามสิ่งที่คุณเลือก</div></div></div><div id="ca-rabbit-caption">อยากรู้อะไรเกี่ยวกับข้อมูล คลิกได้เลย 🐰</div><button id="ca-rabbit-trigger" type="button" aria-label="เปิดผู้ช่วยกระต่าย"><img alt="กระต่ายผู้ช่วย Career Atlas" src="${BUNNY}"></button>`;
document.body.appendChild(root);
const title=root.querySelector('#ca-rabbit-title'),body=root.querySelector('#ca-rabbit-body');
function guide(t,e,tip){title.textContent=t;body.replaceChildren();const p=document.createElement('p');p.textContent=e;body.appendChild(p);const b=document.createElement('div');b.className='ca-tip';b.textContent='คำแนะนำ: '+tip;body.appendChild(b);root.classList.add('open')}
root.querySelector('#ca-rabbit-trigger').addEventListener('click',()=>root.classList.contains('open')?root.classList.remove('open'):guide('ผู้ช่วยนักสำรวจข้อมูล','ฉันช่วยอธิบายข้อมูล กราฟ และตัวกรองใน Career Atlas ได้','เลือกการ์ด เมนู หรือเปลี่ยนตัวกรอง แล้วฉันจะแนะนำตามสิ่งที่คุณเลือก'));
root.querySelector('.ca-close').addEventListener('click',()=>root.classList.remove('open'));
const guides=[
[/ประเทศที่เปรียบเทียบ|ประเทศ.*4|DATA SOURCE/i,'ประเทศที่ใช้เปรียบเทียบ','Career Atlas ใช้ข้อมูล 4 ประเทศ ได้แก่ ไทย ฝรั่งเศส ญี่ปุ่น และสหรัฐอเมริกา เพื่อสำรวจความแตกต่างของโครงสร้างการจ้างงาน','เปรียบเทียบเฉพาะกลุ่มอาชีพและช่วงปีที่มีข้อมูลร่วมกัน'],
[/ช่วงปีเปรียบเทียบ|2013.?2023|STUDY PERIOD/i,'ช่วงเวลาที่เปรียบเทียบ','การเปรียบเทียบข้ามประเทศใช้ช่วงปี 2013–2023 ซึ่งเป็นช่วงที่ทั้ง 4 ประเทศมีข้อมูลร่วมกัน','ใช้ช่วงเวลาเดียวกันเมื่อต้องการเทียบประเทศ ส่วนข้อมูลไทยถึงปี 2025 อยู่ในหน้าเจาะลึกประเทศไทย'],
[/กลุ่มอาชีพที่เปรียบเทียบได้|21 กลุ่ม|ISCO.?08/i,'21 กลุ่มอาชีพที่เปรียบเทียบได้','นี่คือกลุ่มอาชีพ ISCO-08 ระดับ 2 หลักที่มีข้อมูลครบตามเกณฑ์ของทั้ง 4 ประเทศ ไม่ใช่รายการอาชีพทั้งหมด','เวลาสรุปให้ระบุว่า “ใน 21 กลุ่มที่เปรียบเทียบร่วมกัน”'],
[/เจาะลึกประเทศไทย|43 กลุ่ม|Thailand Deep Dive/i,'ข้อมูลเจาะลึกประเทศไทย','ส่วนนี้แสดง 43 กลุ่มอาชีพที่ประเทศไทยรายงานในช่วงปี 2013–2025 รวมกลุ่ม ICT ที่ไม่มีในชุดเปรียบเทียบข้ามประเทศ','ใช้ดูแนวโน้มของไทยโดยเฉพาะ อย่านำกลุ่มที่ไม่มีข้อมูลร่วมกันไปเทียบตรงกับประเทศอื่น'],
[/คำถามหลักของโครงการ/i,'คำถามหลักของโครงการ','คำถามนี้ชวนตรวจสอบว่าโครงสร้างอาชีพของไทยแตกต่างจากประเทศอื่นหรือไม่ และสัดส่วนเปลี่ยนไปตามเวลาอย่างไร','ตั้งสมมติฐานก่อนดูกราฟ แล้วตรวจว่าหลักฐานสนับสนุนหรือขัดแย้งอย่างไร'],
[/เลือกกราฟให้ตรงกับคำถาม|Career Ranking/i,'เลือกกราฟให้ตรงกับคำถาม','Career Ranking ใช้ดูอันดับสัดส่วนอาชีพ Country Fingerprint ใช้เปรียบเทียบหลายประเทศ และ Career Evolution ใช้ดูการเปลี่ยนแปลงตามเวลา','กำหนดคำถามก่อน แล้วเลือกกราฟที่ตอบคำถามได้ตรงที่สุด'],
[/อย่าเพิ่งสรุปเกินข้อมูล/i,'อย่าสรุปเกินสิ่งที่ข้อมูลบอก','ข้อมูลนี้แสดงจำนวนและสัดส่วนผู้มีงานทำ ไม่ได้บอกเงินเดือน ความพึงพอใจ ตำแหน่งงานว่าง หรือสาเหตุของการเปลี่ยนแปลง','อย่ายืนยันสาเหตุหากไม่มีข้อมูลอื่นมาสนับสนุน'],
[/Trend Line|Linear Trend/i,'เส้นแนวโน้ม (Linear Trend)','เส้นแนวโน้มคำนวณจากรูปแบบข้อมูลในอดีตเพื่อช่วยมองทิศทาง ไม่ใช่ข้อมูลจริงของทุกปีหรือคำยืนยันอนาคต','อ่านเส้นแนวโน้มควบคู่กับข้อมูลจริง และระบุช่วงปีที่ใช้สร้างแบบจำลอง'],
[/Naive|MAE|Backtest/i,'การทดสอบแบบจำลอง (Backtest)','Backtest เปรียบเทียบค่าที่แบบจำลองทำนายกับข้อมูลจริงในช่วงทดสอบ ส่วน MAE ยิ่งต่ำหมายถึงค่าคลาดเคลื่อนเฉลี่ยยิ่งน้อย','สรุปเฉพาะช่วงทดสอบ อย่าเหมารวมผลไปทุกปีหรือทุกอาชีพ'],
[/ข้อจำกัด|HOW TO READ|COMPARABILITY/i,'ข้อจำกัดและการตีความ','ข้อมูลมีขอบเขตด้านประเทศ ช่วงเวลา และกลุ่มอาชีพ จึงควรอ่านหมายเหตุประกอบกราฟก่อนสรุปผล','ระบุแหล่งข้อมูล ช่วงปี กลุ่มอาชีพ หน่วย และข้อจำกัดอย่างน้อยหนึ่งข้อ']
];
const tabs=[
[/Dashboard/i,'Dashboard','หน้านี้เป็นภาพรวมของโครงการ แสดงแหล่งข้อมูล ช่วงเวลา ประเทศ และจำนวนกลุ่มอาชีพ','เริ่มจากอ่านตัวเลขภาพรวม แล้วเลือกกราฟที่ตอบคำถาม'],
[/Career Ranking/i,'Career Ranking','หน้านี้จัดอันดับกลุ่มอาชีพตามสัดส่วนในประเทศและปีที่เลือก','ตรวจประเทศ ปี และหน่วยก่อนเปรียบเทียบอันดับ'],
[/Country Fingerprint/i,'Country Fingerprint','หน้านี้เปรียบเทียบรูปแบบโครงสร้างอาชีพของ 4 ประเทศ','ดูสีและค่าของแต่ละกลุ่ม แล้วสังเกตรูปแบบที่เหมือนหรือต่างกัน'],
[/Career Evolution/i,'Career Evolution','หน้านี้แสดงการเปลี่ยนแปลงของสัดส่วนอาชีพตามเวลา พร้อมเส้นแนวโน้มและการคาดการณ์','แยกข้อมูลจริงออกจากเส้นแนวโน้มและค่าคาดการณ์'],
[/Gender Gap/i,'Gender Gap','หน้านี้เปรียบเทียบสัดส่วนหญิงและชายในแต่ละกลุ่มอาชีพของประเทศไทย','อ่านความแตกต่างเป็นจุดเปอร์เซ็นต์ และตรวจตัวหารของแต่ละเพศ'],
[/Thailand Deep Dive/i,'Thailand Deep Dive','หน้านี้เจาะลึก 43 กลุ่มอาชีพที่ประเทศไทยรายงานระหว่างปี 2013–2025','ใช้ดูบริบทประเทศไทย ไม่เทียบตรงกับกลุ่มที่ไม่มีข้อมูลร่วมกัน'],
[/Backtest/i,'Backtest','หน้านี้ตรวจสอบความคลาดเคลื่อนของ Linear Trend เทียบกับ Naive ในชุดทดสอบ','เปรียบเทียบค่า MAE โดยค่าต่ำกว่าหมายถึงคลาดเคลื่อนน้อยกว่าในชุดทดสอบ'],
[/Data & Method/i,'Data & Method','หน้านี้อธิบายแหล่งข้อมูล วิธีคำนวณ และข้อจำกัดของการวิเคราะห์','อ่านนิยาม ตัวหาร หน่วย และข้อจำกัดก่อนอ้างอิง']
];
const txt=el=>(el.innerText||el.textContent||'').replace(/\\s+/g,' ').trim();
const cards='.metric-card,.welcome-stat,.overview-card,.model-card,.about-card,.insight-note,.method-grid>div,.privacy-panel,.summary-band,.warning-panel,.chart-card,.table-card';
function explainBacktest(card){
 const model=card.closest('.model-card');
 if(model){
  const label=txt(model.querySelector('span'))||'ผลการทดสอบ';
  if(/Trend Line/i.test(label))return guide('ผลของแบบจำลอง Trend Line','ค่า MAE ของ Trend Line เท่ากับ 0.166 จุดเปอร์เซ็นต์ในปี 2024 และ 0.180 ในปี 2025 ค่า MAE ยิ่งต่ำยิ่งหมายถึงค่าที่ทำนายคลาดเคลื่อนจากข้อมูลจริงน้อยกว่า','เปรียบเทียบตัวเลขนี้กับ Naive ในปีเดียวกัน และจำไว้ว่าผลนี้มาจากชุดทดสอบของประเทศไทยปี 2024–2025');
  if(/Naive/i.test(label))return guide('ผลของแบบจำลอง Naive','ค่า MAE ของ Naive เท่ากับ 0.136 จุดเปอร์เซ็นต์ในปี 2024 และ 0.148 ในปี 2025 ซึ่งต่ำกว่า Trend Line ในทั้งสองปีของชุดทดสอบนี้','ใช้เป็นแบบจำลองพื้นฐานสำหรับเปรียบเทียบ และอย่าสรุปว่า Naive จะดีกว่าในทุกอาชีพหรือทุกช่วงเวลา');
  if(/ผลการเปรียบเทียบ/.test(label))return guide('ผลการเปรียบเทียบแบบจำลอง','33.8% คือสัดส่วนของกรณีอาชีพ–ปี 80 กรณีที่ Trend Line มีค่าคลาดเคลื่อนต่ำกว่า Naive ไม่ใช่เปอร์เซ็นต์ความแม่นยำของแบบจำลอง','ดูค่า MAE ประกอบด้วย เพราะผลรวมของชุดทดสอบนี้ Naive มี MAE เฉลี่ยต่ำกว่า Trend Line ทั้งปี 2024 และ 2025');
 }
 if(card.matches('#backtest-chart')||card.closest('#backtest-chart')||card.matches('#panel-backtest .chart-card'))return guide('กราฟเปรียบเทียบ MAE','กราฟนี้เปรียบเทียบค่าความคลาดเคลื่อนเฉลี่ย (MAE) ของ Trend Line และ Naive ในปี 2024 และ 2025 หน่วยเป็นจุดเปอร์เซ็นต์ แท่งที่ต่ำกว่าหมายถึงคลาดเคลื่อนน้อยกว่า','เทียบสีของแบบจำลองในปีเดียวกัน และสังเกตว่า Naive มีค่า MAE ต่ำกว่าในทั้งสองปีของชุดทดสอบนี้');
 if(card.matches('#panel-backtest .table-card'))return guide('ตารางกรณีที่คลาดเคลื่อนมาก','ตารางนี้แสดง 5 กรณีที่ Trend Line คลาดเคลื่อนมากที่สุด โดยเปรียบเทียบค่าจริงกับค่าที่ได้จาก Trend และ Naive','ดูความต่างระหว่างค่าจริงกับค่าทำนายของแต่ละแบบจำลอง ไม่ใช้เพียงแถวเดียวตัดสินประสิทธิภาพทั้งหมด');
 if(card.matches('#panel-backtest .insight-note'))return guide('ข้อค้นพบจาก Backtest','ในชุดทดสอบนี้ Naive มี MAE เฉลี่ยต่ำกว่า Trend Line ทั้งปี 2024 และ 2025 จึงทำได้ดีกว่าในภาพรวมของชุดทดสอบนี้','จำกัดข้อสรุปไว้กับประเทศไทยและช่วงทดสอบ 2024–2025 ไม่เหมารวมไปทุกอาชีพหรือทุกช่วงเวลา');
 return false;
}
function explain(card){const s=txt(card),g=guides.find(x=>x[0].test(s));if(g)return guide(g[1],g[2],g[3]);const h=card.querySelector('h1,h2,h3,h4,strong,.metric-label,.card-index,.table-heading'),name=h?txt(h):'ข้อมูลที่เลือก';guide(name,'ส่วนที่คุณเลือกแสดงข้อมูลดังนี้: '+s.slice(0,250)+(s.length>250?'…':''),'สังเกตตัวเลข หน่วย ช่วงเวลา และตัวกรอง จากนั้นเปรียบเทียบกับส่วนอื่นก่อนสรุป')}
document.addEventListener('click',ev=>{const bt=ev.target.closest('#panel-backtest .model-card, #panel-backtest .chart-card, #panel-backtest .table-card, #panel-backtest .insight-note');if(bt){explainBacktest(bt);return}const legend=ev.target.closest('#backtest-chart .legend');if(legend){const label=txt(legend);if(/Naive/i.test(label))guide('Naive ในกราฟ','Naive เป็นแบบจำลองพื้นฐานที่ใช้ค่าล่าสุดที่ทราบเป็นค่าคาดการณ์สำหรับช่วงถัดไป','เปรียบเทียบค่า MAE ของ Naive กับ Trend Line ในปีเดียวกัน');else if(/Trend Line/i.test(label))guide('Trend Line ในกราฟ','Trend Line ใช้เส้นตรงประมาณแนวโน้มจากข้อมูลฝึกในอดีต แล้วนำไปทดสอบกับข้อมูลจริงในปี 2024–2025','พิจารณาค่า MAE เทียบกับ Naive และไม่ตีความเส้นเป็นข้อมูลจริง');return}const tab=ev.target.closest('.nav-tab');if(tab){const g=tabs.find(x=>x[0].test(txt(tab)));if(g)guide(g[1],g[2],g[3]);return}const card=ev.target.closest(cards);if(card&&!ev.target.closest('button,a,select,input,textarea'))explain(card)});
document.addEventListener('change',ev=>{const el=ev.target;if(!el.matches('select,input'))return;const lab=el.closest('label'),name=lab?txt(lab).replace(el.value,'').trim():'ตัวกรอง',value=el.options?el.options[el.selectedIndex]?.text:el.value;guide('อัปเดตตัวกรอง: '+name,'คุณเลือกค่า “'+(value||'ไม่ได้ระบุ')+'” ระบบจะแสดงข้อมูลตามเงื่อนไขนี้','สังเกตว่ากราฟ ตาราง และค่าสรุปเปลี่ยนไปอย่างไร แล้วเปรียบเทียบกับค่าก่อนหน้า')});
document.querySelectorAll(cards).forEach(card=>{card.classList.add('ca-guide-card');if(!card.hasAttribute('tabindex'))card.setAttribute('tabindex','0');card.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();explain(card)}})});
})();