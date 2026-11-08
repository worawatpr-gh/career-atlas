(() => {
  'use strict';
  const BUNNY = 'assets/rabbit-3d.png?v=1';
  const style = document.createElement('style');
  style.textContent = `
    #ca-rabbit { position:fixed; right:18px; bottom:10px; z-index:9998; display:flex; align-items:flex-end; gap:8px; font-family:Inter,"Noto Sans Thai",Tahoma,sans-serif; }
    #ca-rabbit-trigger { width:82px; height:108px; border:0; background:transparent; padding:0; box-shadow:none; cursor:pointer; animation:none !important; transform:none !important; filter:drop-shadow(0 5px 8px rgba(50,12,101,.2)); }
    #ca-rabbit-trigger img { width:100%; height:100%; object-fit:contain; display:block; animation:none !important; transform:none !important; }
    #ca-rabbit-panel { display:none; width:min(340px,calc(100vw - 120px)); max-height:min(440px,70vh); overflow:auto; background:#fff; border:1px solid #e5dcf8; border-radius:18px; box-shadow:0 12px 38px rgba(40,24,76,.22); padding:16px; color:#302744; position:relative; }
    #ca-rabbit.open #ca-rabbit-panel { display:block; }
    #ca-rabbit-panel h3 { margin:0 28px 8px 0; font-size:15px; color:#4c2d89; }
    #ca-rabbit-panel p { margin:7px 0; font-size:12px; line-height:1.65; }
    #ca-rabbit-panel .ca-tip { margin-top:10px; padding:10px 11px; border-radius:11px; background:#f2edff; color:#513b7d; font-size:12px; line-height:1.6; }
    #ca-rabbit-panel .ca-close { position:absolute; right:12px; top:10px; border:0; background:transparent; color:#7d6b9f; font-size:20px; cursor:pointer; }
    #ca-rabbit-caption { max-width:190px; margin-bottom:70px; padding:8px 11px; border-radius:13px 13px 2px 13px; background:#fff; border:1px solid #e7def7; color:#58427f; font-size:11px; line-height:1.5; box-shadow:0 4px 14px rgba(56,35,107,.1); }
    #ca-rabbit.open #ca-rabbit-caption { display:none; }
    .ca-guide-card { cursor:pointer; }
    .ca-guide-card:focus-visible { outline:3px solid #9c80f2; outline-offset:3px; }
    @media(max-width:640px) { #ca-rabbit { right:8px; bottom:8px; } #ca-rabbit-trigger { width:60px; height:80px; } #ca-rabbit-caption { max-width:125px; margin-bottom:46px; font-size:10px; } }
  `;
  document.head.appendChild(style);

  const root=document.createElement('div');
  root.id='ca-rabbit';
  root.innerHTML=`
    <div id="ca-rabbit-panel" role="dialog" aria-live="polite" aria-label="ผู้ช่วยแนะนำ Career Atlas">
      <button class="ca-close" type="button" aria-label="ปิด">×</button>
      <h3 id="ca-rabbit-title">ผู้ช่วยนักสำรวจข้อมูล</h3>
      <div id="ca-rabbit-body"><p>สวัสดี! คลิกการ์ดหรือเมนูที่สนใจ แล้วฉันจะอธิบายส่วนนั้นให้ฟัง</p><div class="ca-tip">ฉันจะเปลี่ยนคำแนะนำตามสิ่งที่คุณเลือก</div></div>
    </div>
    <div id="ca-rabbit-caption">อยากรู้อะไรเกี่ยวกับข้อมูล คลิกได้เลย 🐰</div>
    <button id="ca-rabbit-trigger" type="button" aria-label="เปิดผู้ช่วยกระต่าย"><img alt="กระต่ายผู้ช่วย Career Atlas" src="${BUNNY}"></button>
  `;
  document.body.appendChild(root);
  const titleEl=root.querySelector('#ca-rabbit-title');
  const bodyEl=root.querySelector('#ca-rabbit-body');
  const open=()=>root.classList.add('open');
  const close=()=>root.classList.remove('open');
  function setGuide(title,explanation,tip) {
    titleEl.textContent=title;
    bodyEl.replaceChildren();
    const p=document.createElement('p'); p.textContent=explanation; bodyEl.appendChild(p);
    const box=document.createElement('div'); box.className='ca-tip'; box.textContent='คำแนะนำ: '+tip; bodyEl.appendChild(box);
    open();
  }
  root.querySelector('#ca-rabbit-trigger').addEventListener('click',()=>{
    if(root.classList.contains('open')) close();
    else setGuide('ผู้ช่วยนักสำรวจข้อมูล','ฉันช่วยอธิบายข้อมูล กราฟ และตัวกรองใน Career Atlas ได้','เลือกการ์ด เมนู หรือเปลี่ยนตัวกรอง แล้วฉันจะแนะนำตามสิ่งที่คุณเลือก');
  });
  root.querySelector('.ca-close').addEventListener('click',close);

  const guides=[
    {re:/ประเทศที่เปรียบเทียบ|ประเทศ.*4|DATA SOURCE/i,t:'ประเทศที่ใช้เปรียบเทียบ',e:'Career Atlas ใช้ข้อมูล 4 ประเทศ ได้แก่ ไทย ฝรั่งเศส ญี่ปุ่น และสหรัฐอเมริกา เพื่อสำรวจความแตกต่างของโครงสร้างการจ้างงาน',tip:'เปรียบเทียบเฉพาะกลุ่มอาชีพและช่วงปีที่มีข้อมูลร่วมกัน อย่าสรุปว่าประเทศหนึ่งดีกว่าอีกประเทศหนึ่ง'},
    {re:/ช่วงปีเปรียบเทียบ|2013.?2023|STUDY PERIOD/i,t:'ช่วงเวลาที่เปรียบเทียบ',e:'การเปรียบเทียบข้ามประเทศใช้ช่วงปี 2013–2023 ซึ่งเป็นช่วงที่ทั้ง 4 ประเทศมีข้อมูลร่วมกันตามเกณฑ์ของโครงการ',tip:'ใช้ช่วงเวลาเดียวกันเมื่อต้องการเทียบประเทศ ส่วนข้อมูลไทยถึงปี 2025 อยู่ในหน้าเจาะลึกประเทศไทย'},
    {re:/กลุ่มอาชีพที่เปรียบเทียบได้|21 กลุ่ม|ISCO.?08/i,t:'21 กลุ่มอาชีพที่เปรียบเทียบได้',e:'นี่คือกลุ่มอาชีพ ISCO-08 ระดับ 2 หลักที่มีข้อมูลครบตามเกณฑ์ของทั้ง 4 ประเทศ ไม่ใช่รายการอาชีพทั้งหมด',tip:'เวลาสรุปให้ระบุว่า “ใน 21 กลุ่มที่เปรียบเทียบร่วมกัน”'},
    {re:/เจาะลึกประเทศไทย|43 กลุ่ม|Thailand Deep Dive/i,t:'ข้อมูลเจาะลึกประเทศไทย',e:'ส่วนนี้แสดง 43 กลุ่มอาชีพที่ประเทศไทยรายงานในช่วงปี 2013–2025 รวมกลุ่ม ICT ที่ไม่มีในชุดเปรียบเทียบข้ามประเทศ',tip:'ใช้ดูแนวโน้มของไทยโดยเฉพาะ อย่านำกลุ่มที่ไม่มีข้อมูลร่วมกันไปจัดอันดับเทียบประเทศอื่น'},
    {re:/คำถามหลักของโครงการ/i,t:'คำถามหลักของโครงการ',e:'คำถามนี้ชวนตรวจสอบว่าโครงสร้างอาชีพของไทยแตกต่างจากประเทศอื่นหรือไม่ และสัดส่วนเปลี่ยนไปตามเวลาอย่างไร',tip:'ตั้งสมมติฐานก่อนดูกราฟ แล้วตรวจว่าหลักฐานสนับสนุนหรือขัดแย้งอย่างไร'},
    {re:/เลือกกราฟให้ตรงกับคำถาม|Career Ranking/i,t:'เลือกกราฟให้ตรงกับคำถาม',e:'Career Ranking ใช้ดูอันดับสัดส่วนอาชีพ Country Fingerprint ใช้เปรียบเทียบรูปแบบหลายประเทศ และ Career Evolution ใช้ดูการเปลี่ยนแปลงตามเวลา',tip:'กำหนดคำถามก่อน แล้วเลือกกราฟที่ตอบคำถามได้ตรงที่สุด'},
    {re:/อย่าเพิ่งสรุปเกินข้อมูล/i,t:'อย่าสรุปเกินสิ่งที่ข้อมูลบอก',e:'ข้อมูลนี้แสดงจำนวนและสัดส่วนผู้มีงานทำ ไม่ได้บอกเงินเดือน ความพึงพอใจ ตำแหน่งงานว่าง หรือสาเหตุของการเปลี่ยนแปลง',tip:'อย่ายืนยันสาเหตุหากไม่มีข้อมูลอื่นมาสนับสนุน'},
    {re:/Trend Line|Linear Trend/i,t:'เส้นแนวโน้ม (Linear Trend)',e:'เส้นแนวโน้มคำนวณจากรูปแบบข้อมูลในอดีตเพื่อช่วยมองทิศทาง ไม่ใช่ข้อมูลจริงของทุกปีหรือคำยืนยันอนาคต',tip:'อ่านเส้นแนวโน้มควบคู่กับข้อมูลจริง และระบุช่วงปีที่ใช้สร้างแบบจำลอง'},
    {re:/Naive|MAE|Backtest/i,t:'การทดสอบแบบจำลอง (Backtest)',e:'Backtest เปรียบเทียบค่าที่แบบจำลองทำนายกับข้อมูลจริงในช่วงทดสอบ ส่วน MAE ยิ่งต่ำหมายถึงค่าคลาดเคลื่อนเฉลี่ยยิ่งน้อย',tip:'สรุปเฉพาะช่วงทดสอบ อย่าเหมารวมผลไปทุกปีหรือทุกอาชีพ'},
    {re:/ข้อจำกัด|HOW TO READ|COMPARABILITY/i,t:'ข้อจำกัดและการตีความ',e:'ข้อมูลมีขอบเขตด้านประเทศ ช่วงเวลา และกลุ่มอาชีพ จึงควรอ่านหมายเหตุประกอบกราฟก่อนสรุปผล',tip:'ระบุแหล่งข้อมูล ช่วงปี กลุ่มอาชีพ หน่วย และข้อจำกัดอย่างน้อยหนึ่งข้อ'}
  ];
  const tabs=[
    [/Dashboard/i,'Dashboard','หน้านี้เป็นภาพรวมของโครงการ แสดงแหล่งข้อมูล ช่วงเวลา ประเทศ และจำนวนกลุ่มอาชีพ','เริ่มจากอ่านตัวเลขภาพรวม แล้วเลือกการ์ดหรือกราฟที่ตอบคำถามที่สนใจ'],
    [/Career Ranking/i,'Career Ranking','หน้านี้จัดอันดับกลุ่มอาชีพตามสัดส่วนในประเทศและปีที่เลือก','ตรวจประเทศ ปี และหน่วยก่อนเปรียบเทียบอันดับ'],
    [/Country Fingerprint/i,'Country Fingerprint','หน้านี้เปรียบเทียบรูปแบบโครงสร้างอาชีพของ 4 ประเทศในกลุ่มอาชีพที่มีข้อมูลร่วมกัน','ดูสีและค่าของแต่ละกลุ่ม แล้วสังเกตว่าประเทศใดมีรูปแบบใกล้เคียงกัน'],
    [/Career Evolution/i,'Career Evolution','หน้านี้แสดงการเปลี่ยนแปลงของสัดส่วนอาชีพตามเวลา พร้อมเส้นแนวโน้มและการคาดการณ์','แยกข้อมูลจริงออกจากเส้นแนวโน้มและค่าคาดการณ์'],
    [/Gender Gap/i,'Gender Gap','หน้านี้เปรียบเทียบสัดส่วนหญิงและชายในแต่ละกลุ่มอาชีพของประเทศไทย','ดูตัวหารของแต่ละเพศและอ่านความต่างเป็นจุดเปอร์เซ็นต์'],
    [/Thailand Deep Dive/i,'Thailand Deep Dive','หน้านี้เจาะลึก 43 กลุ่มอาชีพที่ประเทศไทยรายงานระหว่างปี 2013–2025','ใช้ดูบริบทประเทศไทย ไม่เทียบตรงกับกลุ่มที่ไม่มีข้อมูลร่วมกัน'],
    [/Backtest/i,'Backtest','หน้านี้ตรวจสอบความคลาดเคลื่อนของ Linear Trend เทียบกับ Naive ในชุดทดสอบ','เปรียบเทียบค่า MAE โดยค่าที่ต่ำกว่าหมายถึงคลาดเคลื่อนน้อยกว่าในชุดทดสอบ'],
    [/Data & Method/i,'Data & Method','หน้านี้อธิบายแหล่งข้อมูล วิธีคำนวณ และข้อจำกัดของการวิเคราะห์','อ่านนิยาม ตัวหาร หน่วย และข้อจำกัดก่อนนำผลไปอ้างอิง']
  ];
  function textOf(el){return (el.innerText||el.textContent||'').replace(/\\s+/g,' ').trim();}
  function guideCard(card){
    const txt=textOf(card);
    const g=guides.find(x=>x.re.test(txt));
    if(g) return setGuide(g.t,g.e,g.tip);
    const h=card.querySelector('h1,h2,h3,h4,strong,.metric-label,.card-index,.table-heading');
    const heading=h?textOf(h):'ข้อมูลที่เลือก';
    const snippet=txt.slice(0,260);
    setGuide(heading,'ส่วนที่คุณเลือกแสดงข้อมูลดังนี้: '+snippet+(txt.length>260?'…':''),'สังเกตตัวเลข หน่วย ช่วงเวลา และตัวกรอง จากนั้นเปรียบเทียบกับข้อมูลส่วนอื่นก่อนสรุป');
  }
  const cardSelector='.metric-card,.welcome-stat,.overview-card,.model-card,.about-card,.insight-note,.method-grid>div,.privacy-panel,.summary-band,.warning-panel,.chart-card,.table-card';
  document.addEventListener('click',event=>{
    const tab=event.target.closest('.nav-tab');
    if(tab){
      const label=textOf(tab);
      const item=tabs.find(x=>x[0].test(label));
      if(item) setGuide(item[1],item[2],item[3]);
      return;
    }
    const card=event.target.closest(cardSelector);
    if(card && !event.target.closest('button,a,select,input,textarea')) guideCard(card);
  });
  document.addEventListener('change',event=>{
    const control=event.target;
    if(!control.matches('select,input')) return;
    const label=control.closest('label');
    const field=label?textOf(label).replace(control.value,'').trim():'ตัวกรอง';
    const value=control.options?control.options[control.selectedIndex]?.text:control.value;
    setGuide('อัปเดตตัวกรอง: '+field,'คุณเลือกค่า “'+(value||'ไม่ได้ระบุ')+'” ระบบจะแสดงข้อมูลตามเงื่อนไขนี้','สังเกตว่ากราฟ ตาราง และค่าที่สรุปเปลี่ยนไปอย่างไร แล้วเปรียบเทียบกับค่าก่อนหน้า');
  });
  document.querySelectorAll(cardSelector).forEach(card=>{
    card.classList.add('ca-guide-card');
    if(!card.hasAttribute('tabindex')) card.setAttribute('tabindex','0');
    card.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){event.preventDefault();guideCard(card);}
    });
  });
})();