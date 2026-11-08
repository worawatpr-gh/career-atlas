(() => {
  'use strict';
  const BUNNY = 'data:image/webp;base64,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';
  const style = document.createElement('style');
  style.textContent = `
    #ca-rabbit { position:fixed; right:22px; bottom:20px; z-index:9998; display:flex; align-items:flex-end; gap:10px; font-family:Inter,"Noto Sans Thai",Tahoma,sans-serif; }
    #ca-rabbit-trigger { width:88px; height:88px; border:2px solid #e4d9ff; border-radius:50%; background:#fff; padding:3px; box-shadow:0 7px 24px rgba(56,35,107,.22); cursor:pointer; transition:transform .2s; animation:caRabbitFloat 3s ease-in-out infinite; transform-origin:50% 85%; }
    #ca-rabbit-trigger:hover { transform:translateY(-4px) scale(1.04); }
    #ca-rabbit-trigger img { width:100%; height:100%; object-fit:cover; border-radius:50%; display:block; animation:caRabbitSway 4.5s ease-in-out infinite; }
    #ca-rabbit-panel { display:none; width:min(340px,calc(100vw - 132px)); max-height:min(440px,70vh); overflow:auto; background:#fff; border:1px solid #e5dcf8; border-radius:18px; box-shadow:0 12px 38px rgba(40,24,76,.22); padding:16px; color:#302744; }
    #ca-rabbit.open #ca-rabbit-panel { display:block; animation:caRabbitIn .18s ease-out; }
    #ca-rabbit-panel h3 { margin:0 28px 8px 0; font-size:15px; color:#4c2d89; }
    #ca-rabbit-panel p { margin:7px 0; font-size:12px; line-height:1.65; }
    #ca-rabbit-panel .ca-tip { margin-top:10px; padding:10px 11px; border-radius:11px; background:#f2edff; color:#513b7d; font-size:12px; line-height:1.6; }
    #ca-rabbit-panel .ca-close { position:absolute; right:12px; top:10px; border:0; background:transparent; color:#7d6b9f; font-size:20px; cursor:pointer; }
    #ca-rabbit-panel { position:relative; }
    #ca-rabbit-caption { max-width:130px; margin-bottom:12px; padding:8px 11px; border-radius:13px 13px 2px 13px; background:#fff; border:1px solid #e7def7; color:#58427f; font-size:11px; line-height:1.5; box-shadow:0 4px 14px rgba(56,35,107,.1); }
    #ca-rabbit.open #ca-rabbit-caption { display:none; }
    .ca-guide-card { cursor:pointer; }
    .ca-guide-card:focus-visible { outline:3px solid #9c80f2; outline-offset:3px; }
    @keyframes caRabbitIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes caRabbitFloat { 0%,100% { transform:translateY(0) rotate(-1deg); } 50% { transform:translateY(-7px) rotate(1deg); } }
    @keyframes caRabbitSway { 0%,100% { transform:rotate(0deg) scale(1); } 25% { transform:rotate(-2deg) scale(1.015); } 75% { transform:rotate(2deg) scale(1.015); } }
    @media (prefers-reduced-motion: reduce) { #ca-rabbit-trigger, #ca-rabbit-trigger img { animation:none; } }
    @media(max-width:600px) { #ca-rabbit { right:10px; bottom:12px; gap:6px; } #ca-rabbit-trigger { width:68px; height:68px; } #ca-rabbit-caption { max-width:100px; font-size:10px; } }
  `;
  document.head.appendChild(style);
  const root = document.createElement('div');
  root.id = 'ca-rabbit';
  root.innerHTML = `
    <div id="ca-rabbit-panel" role="dialog" aria-live="polite" aria-label="ผู้ช่วยแนะนำ Career Atlas">
      <button class="ca-close" type="button" aria-label="ปิด">×</button>
      <h3 id="ca-rabbit-title">ผู้ช่วยนักสำรวจข้อมูล</h3>
      <div id="ca-rabbit-body"><p>สวัสดี! ฉันช่วยอธิบายการ์ดและแนะนำวิธีอ่านข้อมูลใน Career Atlas ได้นะ</p><div class="ca-tip">ลองคลิกการ์ดที่สนใจ หรือถามฉันจากปุ่มกระต่ายได้เลย</div></div>
    </div>
    <div id="ca-rabbit-caption">มีอะไรสงสัยเกี่ยวกับข้อมูลไหม? 🐰</div>
    <button id="ca-rabbit-trigger" type="button" aria-label="เปิดผู้ช่วยกระต่าย"><img alt="กระต่ายผู้ช่วย Career Atlas" src="${BUNNY}"></button>
  `;
  document.body.appendChild(root);
  const titleEl = root.querySelector('#ca-rabbit-title');
  const bodyEl = root.querySelector('#ca-rabbit-body');
  const open = () => root.classList.add('open');
  const close = () => root.classList.remove('open');
  const setGuide = (title, explanation, tip) => {
    titleEl.textContent = title;
    bodyEl.innerHTML = '';
    const p = document.createElement('p'); p.textContent = explanation; bodyEl.appendChild(p);
    const box = document.createElement('div'); box.className = 'ca-tip'; box.textContent = 'คำแนะนำ: ' + tip; bodyEl.appendChild(box);
    open();
  };
  root.querySelector('#ca-rabbit-trigger').addEventListener('click', () => {
    if (root.classList.contains('open')) close();
    else { titleEl.textContent = 'ผู้ช่วยนักสำรวจข้อมูล'; bodyEl.innerHTML = '<p>ฉันช่วยอธิบายการ์ดและแนะนำวิธีอ่านข้อมูลได้ ลองคลิกการ์ดใดก็ได้บนหน้าเว็บ</p><div class="ca-tip">เริ่มจากดูว่า “ตัวเลขนี้หมายถึงอะไร หน่วยอะไร และเปรียบเทียบกับอะไร”</div>'; open(); }
  });
  root.querySelector('.ca-close').addEventListener('click', close);

  const guides = [
    {match:/ประเทศที่เปรียบเทียบ|ประเทศ.*4|DATA SOURCE/i, title:'ประเทศที่ใช้เปรียบเทียบ', explanation:'Career Atlas ใช้ข้อมูล 4 ประเทศ ได้แก่ ไทย ฝรั่งเศส ญี่ปุ่น และสหรัฐอเมริกา เพื่อดูว่าโครงสร้างการจ้างงานในกลุ่มอาชีพต่าง ๆ แตกต่างกันอย่างไร', tip:'เปรียบเทียบภายใต้กลุ่มอาชีพและช่วงปีที่มีข้อมูลร่วมกัน อย่าเพิ่งสรุปว่าประเทศหนึ่งดีกว่าอีกประเทศหนึ่ง'},
    {match:/ช่วงปีเปรียบเทียบ|2013–2023|STUDY PERIOD/i, title:'ช่วงเวลาที่เปรียบเทียบ', explanation:'การเปรียบเทียบข้ามประเทศใช้ช่วงปี 2013–2023 ซึ่งเป็นช่วงที่ทั้ง 4 ประเทศมีข้อมูลร่วมกันครบตามเกณฑ์ของโครงการ', tip:'ใช้ช่วงเวลาเดียวกันเมื่อต้องการเทียบประเทศ ส่วนข้อมูลไทยที่ยาวถึงปี 2025 อยู่ในหน้า Thailand Deep Dive'},
    {match:/กลุ่มอาชีพที่เปรียบเทียบได้|21 กลุ่ม|ISCO-08/i, title:'21 กลุ่มอาชีพที่เปรียบเทียบได้', explanation:'นี่คือกลุ่มอาชีพ ISCO-08 ระดับ 2 หลัก ที่มีข้อมูลครบตามเกณฑ์ของทั้ง 4 ประเทศและทุกปีในช่วงเปรียบเทียบ ไม่ใช่รายการอาชีพทั้งหมดของโลก', tip:'เวลาสรุปผล ให้พูดว่า “ใน 21 กลุ่มที่เปรียบเทียบร่วมกัน” เพื่อไม่ให้ผู้ฟังเข้าใจว่าเป็นทุกอาชีพ'},
    {match:/เจาะลึกประเทศไทย|43 กลุ่ม|Thailand Deep Dive/i, title:'ข้อมูลเจาะลึกประเทศไทย', explanation:'ส่วนนี้แสดง 43 กลุ่มอาชีพที่ประเทศไทยรายงานในช่วงปี 2013–2025 จึงมีรายละเอียดบางกลุ่มที่ไม่มีในชุดเปรียบเทียบ 4 ประเทศ เช่น ICT Professionals และ ICT Technicians', tip:'ใช้ดูแนวโน้มของไทยโดยเฉพาะ และอย่านำกลุ่มที่ไม่มีข้อมูลครบไปจัดอันดับเทียบกับอีก 3 ประเทศ'},
    {match:/คำถามหลักของโครงการ/i, title:'คำถามหลักของโครงการ', explanation:'คำถามนี้ชวนให้ตรวจสอบว่าโครงสร้างอาชีพของไทยมีสัดส่วนแตกต่างจากประเทศอื่นหรือไม่ และสัดส่วนเหล่านั้นเปลี่ยนไปตามเวลาอย่างไร', tip:'ก่อนเปิดกราฟ ลองเขียนสมมติฐานเบื้องต้น แล้วกลับมาตรวจว่าหลักฐานสนับสนุนหรือขัดแย้งกับสมมติฐานอย่างไร'},
    {match:/เลือกกราฟให้ตรงกับคำถาม|Career Ranking/i, title:'เลือกกราฟให้ตรงกับคำถาม', explanation:'Career Ranking ใช้ดูอันดับสัดส่วนอาชีพในประเทศและปีที่เลือก ส่วน Country Fingerprint ใช้เปรียบเทียบรูปแบบโครงสร้างอาชีพหลายประเทศ และ Career Evolution ใช้ดูการเปลี่ยนแปลงตามเวลา', tip:'เริ่มจากกำหนดคำถามให้ชัด แล้วเลือกกราฟที่ตอบคำถามนั้นได้ตรงที่สุด'},
    {match:/อย่าเพิ่งสรุปเกินข้อมูล/i, title:'อย่าสรุปเกินสิ่งที่ข้อมูลบอก', explanation:'ข้อมูลนี้แสดงจำนวนและสัดส่วนผู้มีงานทำในกลุ่มอาชีพ ไม่ได้บอกเงินเดือน ความพึงพอใจ ตำแหน่งงานว่าง หรือสาเหตุที่ทำให้การจ้างงานเปลี่ยนแปลง', tip:'ใช้ถ้อยคำว่า “พบความสัมพันธ์หรือแนวโน้ม” แทนการยืนยันสาเหตุ หากไม่มีข้อมูลอื่นมาสนับสนุน'},
    {match:/Trend Line|Linear Trend/i, title:'เส้นแนวโน้ม (Linear Trend)', explanation:'เส้นแนวโน้มเป็นเส้นที่คำนวณจากรูปแบบข้อมูลในอดีต เพื่อช่วยมองทิศทางโดยรวม ไม่ใช่ข้อมูลจริงของทุกปีและไม่ใช่คำยืนยันอนาคต', tip:'เปรียบเทียบเส้นแนวโน้มกับข้อมูลจริง และบอกช่วงปีที่ใช้สร้างแบบจำลองทุกครั้ง'},
    {match:/Naive|MAE|Backtest/i, title:'การทดสอบแบบจำลอง (Backtest)', explanation:'Backtest นำข้อมูลบางช่วงที่แบบจำลองไม่ได้ใช้ฝึกมาเปรียบเทียบกับค่าจริง โดย MAE ยิ่งต่ำหมายถึงค่าคลาดเคลื่อนเฉลี่ยยิ่งน้อยในชุดทดสอบนั้น', tip:'สรุปผลเฉพาะช่วงทดสอบที่เห็น อย่าเหมารวมว่าแบบจำลองจะทำได้ดีในทุกปีหรือทุกอาชีพ'},
    {match:/ข้อจำกัด|HOW TO READ|COMPARABILITY/i, title:'ข้อจำกัดและการตีความ', explanation:'ชุดข้อมูลมีขอบเขตด้านประเทศ ช่วงเวลา และกลุ่มอาชีพ รวมทั้งมีหมายเหตุการจัดกลุ่มบางประเทศ จึงต้องอ่านคำอธิบายข้อมูลควบคู่กับกราฟ', tip:'เวลานำเสนอ ระบุแหล่งข้อมูล ช่วงปี กลุ่มที่นำมาวิเคราะห์ หน่วย และข้อจำกัดอย่างน้อยหนึ่งข้อ'}
  ];
  function plainText(el) { return (el.innerText || el.textContent || '').replace(/\s+/g,' ').trim(); }
  function guideCard(card) {
    const text = plainText(card);
    const match = guides.find(g => g.match.test(text));
    if (match) return setGuide(match.title, match.explanation, match.tip);
    const heading = card.querySelector('h1,h2,h3,h4,strong,.metric-label,.card-index,.table-heading');
    const title = heading ? plainText(heading) : 'การ์ดข้อมูลที่เลือก';
    const summary = text.slice(0, 240);
    setGuide(title, 'การ์ดนี้แสดงข้อมูลว่า: ' + summary + (text.length > 240 ? '…' : ''), 'สังเกตชื่อหัวข้อ ตัวเลข หน่วย และช่วงเวลาที่แสดง จากนั้นลองเปรียบเทียบกับการ์ดหรือกราฟที่เกี่ยวข้องก่อนสรุปผล');
  }
  const selectors = '.metric-card, .welcome-stat, .overview-card, .model-card, .about-card, .insight-note, .method-grid > div, .privacy-panel, .summary-band, .warning-panel';
  document.addEventListener('click', (event) => {
    const card = event.target.closest(selectors);
    if (!card || event.target.closest('button,a,select,input,textarea')) return;
    guideCard(card);
  });
  document.querySelectorAll(selectors).forEach(card => {
    card.classList.add('ca-guide-card');
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
    card.setAttribute('aria-label','คลิกเพื่อให้กระต่ายอธิบายการ์ดนี้');
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); guideCard(card); }
    });
  });
})();
