(() => {
  'use strict';
  const BUNNY = 'assets/rabbit-3d.png?v=1';
  const style = document.createElement('style');
  style.textContent = `
    #ca-rabbit { position:fixed; right:22px; bottom:20px; z-index:9998; display:flex; align-items:flex-end; gap:10px; font-family:Inter,"Noto Sans Thai",Tahoma,sans-serif; }
    #ca-rabbit-trigger { width:112px; height:146px; border:0; border-radius:0; background:transparent; padding:0; box-shadow:none; cursor:pointer; transition:transform .2s; animation:caRabbitFloat 2.6s ease-in-out infinite; transform-origin:50% 90%; filter:drop-shadow(0 8px 12px rgba(56,35,107,.22)); }
    #ca-rabbit-trigger:hover { transform:translateY(-4px) scale(1.04); }
    #ca-rabbit-trigger img { width:100%; height:100%; object-fit:contain; border-radius:0; display:block; animation:caRabbitSway 3.6s ease-in-out infinite; transform-origin:50% 82%; }
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
    @keyframes caRabbitFloat { 0%,100% { transform:translateY(0) rotate(-2deg) scale(1); } 35% { transform:translateY(-11px) rotate(1deg) scale(1.025); } 55% { transform:translateY(-6px) rotate(2deg) scale(1.01); } }
    @keyframes caRabbitSway { 0%,100% { transform:rotate(0deg) scale(1); } 25% { transform:rotate(-3deg) scale(1.02); } 50% { transform:rotate(1deg) scale(1.035); } 75% { transform:rotate(3deg) scale(1.02); } }
    #ca-rabbit.ca-react #ca-rabbit-trigger { animation:caRabbitHop .65s ease-in-out 2; }
    @keyframes caRabbitHop { 0%,100% { transform:translateY(0) rotate(0); } 35% { transform:translateY(-24px) rotate(-7deg); } 65% { transform:translateY(-10px) rotate(7deg); } }
    @media (prefers-reduced-motion: reduce) { #ca-rabbit-trigger, #ca-rabbit-trigger img { animation:none; } }
    @media(max-width:600px) { #ca-rabbit { right:10px; bottom:12px; gap:6px; } #ca-rabbit-trigger { width:88px; height:116px; } #ca-rabbit-caption { max-width:100px; font-size:10px; } }
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
    root.classList.remove('ca-react');
    void root.offsetWidth;
    root.classList.add('ca-react');
    window.setTimeout(() => root.classList.remove('ca-react'), 1400);
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
