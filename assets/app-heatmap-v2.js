(function () {
  'use strict';

  const DATA_URL = 'data/career_atlas_data.json';
  const $ = (id) => document.getElementById(id);
  const thaiNumber = (value, digits = 2) => Number(value).toLocaleString('th-TH', {minimumFractionDigits: digits, maximumFractionDigits: digits});
  const countryLabel = (country) => (window.CA_DATA?.meta?.countryLabels || {})[country] || country;
  const baseFont = '"Inter", "Noto Sans Thai", Tahoma, sans-serif';
  const countryColors = {
    'France': '#636EFA',
    'Japan': '#EF553B',
    'Thailand': '#00A987',
    'United States of America': '#AB63FA'
  };
  const plotConfig = {responsive: true, displaylogo: false, scrollZoom: false, modeBarButtonsToRemove: ['lasso2d', 'select2d'], toImageButtonOptions: {format: 'png', filename: 'career-atlas-chart', scale: 2}};
  let DATA;
  let evolutionOptions = [];

  function baseLayout(extra = {}) {
    return Object.assign({
      paper_bgcolor: '#ffffff', plot_bgcolor: '#ffffff',
      font: {family: baseFont, color: '#44566c', size: 11},
      margin: {l: 70, r: 35, t: 55, b: 60},
      hoverlabel: {font: {family: baseFont, size: 11}}
    }, extra);
  }

  function fillSelect(select, options, value) {
    select.innerHTML = '';
    options.forEach((option) => {
      const item = document.createElement('option');
      item.value = String(option.value);
      item.textContent = option.label;
      select.appendChild(item);
    });
    if (value !== undefined && value !== null) select.value = String(value);
  }

  function setActiveTab(tab) {
    document.querySelectorAll('.nav-tab').forEach((button) => button.classList.toggle('active', button.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      const isActive = panel.id === `panel-${tab}`;
      panel.classList.toggle('active', isActive);
      panel.hidden = !isActive;
      panel.setAttribute('aria-hidden', String(!isActive));
    });
    const tabLabels = {
      overview: 'Dashboard', ranking: 'Career Ranking', heatmap: 'Career Heatmap',
      evolution: 'Career Evolution', gender: 'Gender Gap',
      backtest: 'Backtest', about: 'Data & Method'
    };
    const breadcrumb = $('breadcrumb-current');
    if (breadcrumb) breadcrumb.textContent = tabLabels[tab] || 'Dashboard';
    if (window.matchMedia('(max-width: 760px)').matches) {
      document.body.classList.remove('sidebar-open');
      const toggle = $('sidebar-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
    if (tab === 'heatmap') setTimeout(() => window.Plotly?.Plots.resize($('heatmap-chart')), 40);
    if (tab === 'gender') setTimeout(() => window.Plotly?.Plots.resize($('gender-chart')), 40);
    if (tab === 'evolution') setTimeout(() => window.Plotly?.Plots.resize($('evolution-chart')), 40);
    
    if (tab === 'backtest') setTimeout(() => window.Plotly?.Plots.resize($('backtest-chart')), 40);
    if (tab === 'ranking') setTimeout(() => window.Plotly?.Plots.resize($('ranking-chart')), 40);
  }

  function setupNavigation() {
    document.querySelectorAll('.nav-tab').forEach((button) => button.addEventListener('click', () => setActiveTab(button.dataset.tab)));
    document.querySelectorAll('[data-open-tab]').forEach((button) => button.addEventListener('click', () => setActiveTab(button.dataset.openTab)));
    const toggle = $('sidebar-toggle');
    const backdrop = $('sidebar-backdrop');
    if (toggle) toggle.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 760px)').matches) {
        const open = !document.body.classList.contains('sidebar-open');
        document.body.classList.toggle('sidebar-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      } else {
        const collapsed = !document.body.classList.contains('sidebar-collapsed');
        document.body.classList.toggle('sidebar-collapsed', collapsed);
        toggle.setAttribute('aria-expanded', String(!collapsed));
      }
    });
    if (backdrop) backdrop.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function renderMetrics() {
    const m = DATA.meta;
    const years = [...new Set(DATA.thaiData.map(r => r.year))].sort((a,b) => a-b);
    const occupations = new Set(DATA.thaiData.map(r => r.code));
    $('metric-years').textContent = years.length ? `${years[0]}–${years[years.length - 1]}` : 'ไม่ระบุ';
    $('metric-occupations').textContent = occupations.size;
    const studyPeriod = $('study-period');
    if (studyPeriod) studyPeriod.textContent = years.length ? `${years[0]}–${years[years.length - 1]}` : 'ไม่ระบุ';
    const updated = m.fetchedAt || m.updatedAt || 'ไม่ระบุเวลา';
    $('snapshot-meta').textContent = `ดึงข้อมูลจาก ILOSTAT ล่าสุด: ${updated} · ${m.thaiRows || DATA.thaiData.length} แถว · ${occupations.size} กลุ่มอาชีพ · ค่า Missing ไม่ถูกแทนด้วย 0`;
  }

  function initRanking() {
    const years = [...new Set(DATA.thaiData.map(r => r.year))].sort((a,b) => a-b);
    fillSelect($('ranking-year'), years.map(y => ({value:y,label:String(y)})), years[years.length-1]);
    $('ranking-year').onchange = updateRanking;
    updateRanking();
  }

  function updateRanking() {
    const year = Number($('ranking-year').value);
    const rows = DATA.thaiData.filter(r => r.year === year)
      .sort((a,b) => b.share-a.share).slice(0,5).sort((a,b) => a.share-b.share);
    $('ranking-context').textContent = `ประเทศไทย · ${year} · 5 กลุ่มแรก`;
    const trace = {type:'bar',orientation:'h',x:rows.map(r=>r.share),y:rows.map(r=>r.nameTh),
      text:rows.map(r=>r.share.toFixed(1)),textposition:'outside',cliponaxis:false,
      marker:{color:rows.map((r,i)=>i===rows.length-1?'#12A58D':'#477DA5')},
      customdata:rows.map(r=>[r.code,r.value]),
      hovertemplate:'<b>%{y}</b><br>รหัสอาชีพ: %{customdata[0]}<br>สัดส่วน: %{x:.2f}%<br>จำนวนแรงงาน: %{customdata[1]:,.2f} พันคน<extra></extra>'};
    Plotly.react('ranking-chart',[trace],baseLayout({height:450,margin:{l:255,r:85,t:30,b:60},
      xaxis:{title:'สัดส่วนของผู้มีงานทำทั้งประเทศไทย (%)',rangemode:'tozero',gridcolor:'#edf1f5',ticksuffix:'%'},
      yaxis:{title:'',automargin:true,tickfont:{size:11}},showlegend:false}),plotConfig);
  }

  function initHeatmap() {
    const records = DATA.thaiData.slice();
    const occupations = [...new Map(records.map(r => [r.code,{code:r.code,nameTh:r.nameTh}])).values()]
      .sort((a,b)=>a.code.localeCompare(b.code,'en',{numeric:true}));
    const years = [...new Set(records.map(r=>r.year))].sort((a,b)=>a-b);
    const byKey = new Map(records.map(r=>[`${r.code}| ${r.year}`,r.share]));
    const z = occupations.map(o=>years.map(y=>byKey.has(`${o.code}| ${y}`)?byKey.get(`${o.code}| ${y}`):null));
    const text = z.map(row=>row.map(v=>v===null?'':Number(v).toFixed(1)));
    const trace = {type:'heatmap',x:years.map(String),y:occupations.map(o=>`${o.code} | ${o.nameTh}`),
      z,text,texttemplate:'%{text}',textfont:{family:baseFont,size:10,color:'#252525'},
      colorscale:[[0,'#fff7bc'],[0.25,'#fee391'],[0.5,'#fec44f'],[0.75,'#f16913'],[1,'#99000d']],
      zmin:0,colorbar:{title:'สัดส่วน (%)',thickness:14},
      hoverongaps:false,hovertemplate:'<b>%{y}</b><br>ปี: %{x}<br>สัดส่วน: %{z:.2f}%<extra></extra>'};
    Plotly.react('heatmap-chart',[trace],baseLayout({height:Math.max(720,occupations.length*34+180),
      margin:{l:310,r:80,t:35,b:80},xaxis:{title:'ปี',type:'category',tickangle:-45},
      yaxis:{title:'กลุ่มอาชีพ',autorange:'reversed',automargin:true,tickfont:{size:10}}}),plotConfig);
  }

  function linearFit(rows) {
    const n = rows.length;
    if (n < 2) return null;
    const meanX = rows.reduce((s, r) => s + r.year, 0) / n;
    const meanY = rows.reduce((s, r) => s + r.share, 0) / n;
    let numerator = 0, denominator = 0;
    rows.forEach(r => { numerator += (r.year - meanX) * (r.share - meanY); denominator += (r.year - meanX) ** 2; });
    if (!denominator) return null;
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    return {slope, intercept, predict: (year) => slope * year + intercept};
  }

  function initEvolution() {
    evolutionOptions = [...new Map(DATA.thaiData.map(r=>[r.code,{code:r.code,nameTh:r.nameTh}])).values()]
      .sort((a,b)=>a.code.localeCompare(b.code,'en',{numeric:true}));
    fillSelect($('evolution-occupation'),evolutionOptions.map(o=>({value:o.code,label:`${o.code} — ${o.nameTh}`})),evolutionOptions[0]?.code);
    $('evolution-occupation').onchange=updateEvolution;
    updateEvolution();
  }

  function updateEvolution() {
    const code=$('evolution-occupation').value;
    const occupation=evolutionOptions.find(o=>o.code===code);
    if(!occupation)return;
    const rows=DATA.thaiData.filter(r=>r.code===code).sort((a,b)=>a.year-b.year);
    if(!rows.length)return;
    const start=rows[0].year,end=rows[rows.length-1].year,forecastEnd=end+3;
    const fit=linearFit(rows),traces=[{type:'scatter',mode:'lines+markers',x:rows.map(r=>r.year),y:rows.map(r=>r.share),
      name:'ข้อมูลจริง',line:{color:'#2563EB',width:3},marker:{size:7},
      hovertemplate:'<b>ข้อมูลจริง</b><br>ปี: %{x}<br>สัดส่วน: %{y:.2f}%<extra></extra>'}];
    if(fit){
      const trendX=Array.from({length:end-start+1},(_,i)=>start+i);
      traces.push({type:'scatter',mode:'lines',x:trendX,y:trendX.map(fit.predict),name:'Linear Regression',
        line:{color:'#F59E0B',width:2.5,dash:'dash'},hovertemplate:'<b>แนวโน้ม</b><br>ปี: %{x}<br>ค่า: %{y:.2f}%<extra></extra>'});
      const forecastX=Array.from({length:4},(_,i)=>end+i);
      traces.push({type:'scatter',mode:'lines',x:forecastX,y:forecastX.map(fit.predict),name:'ต่อแนวโน้ม 3 ปี',
        line:{color:'#E11D48',width:3,dash:'dot'},hovertemplate:'<b>ต่อแนวโน้มเชิงเส้น</b><br>ปี: %{x}<br>ค่า: %{y:.2f}%<extra></extra>'});
    }
    const layout=baseLayout({height:580,margin:{l:75,r:30,t:65,b:70},
      title:{text:`ประเทศไทย: ${code} — ${occupation.nameTh}`,x:.5,xanchor:'center'},
      xaxis:{title:'ปี',dtick:1,range:[start,forecastEnd],gridcolor:'#edf1f5'},
      yaxis:{title:'สัดส่วนของผู้มีงานทำทั้งประเทศ (%)',rangemode:'tozero',gridcolor:'#edf1f5'},
      legend:{orientation:'h',y:-.22},hovermode:'x unified',
      shapes:[{type:'line',x0:end,x1:end,y0:0,y1:1,yref:'paper',line:{color:'#8895a4',dash:'dash'}}]});
    Plotly.react('evolution-chart',traces,layout,plotConfig);
  }

  function renderTable(tableId, rows, columns) {
    const tbody = $(tableId).querySelector('tbody');
    tbody.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        td.textContent = col.render ? col.render(row) : row[col.key];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function initGender() {
    const rows = DATA.genderGap.slice().sort((a, b) => a.difference - b.difference);
    const traceMale = {type: 'bar', orientation: 'h', y: rows.map(r => r.nameTh), x: rows.map(r => -r.male), name: 'Male (เพศชาย)',
      marker: {color: '#3984C6'}, customdata: rows.map(r => [r.male, r.code]), hovertemplate: '<b>%{y}</b><br>รหัสอาชีพ: %{customdata[1]}<br>เพศชาย: %{customdata[0]:.2f}%<extra></extra>'};
    const traceFemale = {type: 'bar', orientation: 'h', y: rows.map(r => r.nameTh), x: rows.map(r => r.female), name: 'Female (เพศหญิง)',
      marker: {color: '#E47C9A'}, customdata: rows.map(r => [r.code]), hovertemplate: '<b>%{y}</b><br>รหัสอาชีพ: %{customdata[0]}<br>เพศหญิง: %{x:.2f}%<extra></extra>'};
    const maxValue = Math.max(...rows.map(r => Math.max(r.female, r.male)));
    const layout = baseLayout({height: 900, margin: {l: 290, r: 35, t: 30, b: 70}, barmode: 'relative',
      xaxis: {title: 'สัดส่วนภายในกลุ่มเพศ (%) | ซ้าย: ชาย · ขวา: หญิง', ticksuffix: '%', zeroline: true, zerolinewidth: 2, gridcolor: '#edf1f5', range: [-maxValue * 1.08, maxValue * 1.08]},
      yaxis: {title: '', automargin: true, tickfont: {size: 10}}, legend: {orientation: 'h', y: -0.08}, hovermode: 'closest'});
    Plotly.react('gender-chart', [traceMale, traceFemale], layout, plotConfig);
    const top = rows.slice().sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference)).slice(0, 5);
    renderTable('gender-table', top, [
      {key: 'code'}, {key: 'nameTh'}, {render: r => thaiNumber(r.female)}, {render: r => thaiNumber(r.male)},
      {render: r => `${r.difference > 0 ? '+' : ''}${thaiNumber(r.difference)}`}
    ]);
  }

  function initThailand() {
    const byCode = new Map();
    DATA.thaiData.forEach(r => { if (!byCode.has(r.code)) byCode.set(r.code, r.nameTh); });
    const codes = [...byCode.keys()].sort((a, b) => a.localeCompare(b, 'en', {numeric: true}));
    fillSelect($('thailand-occupation'), codes.map(code => ({value: code, label: `${code} — ${byCode.get(code)}`})), byCode.has('25') ? '25' : codes[0]);
    $('thailand-occupation').onchange = updateThailand;
    updateThailand();
  }

  function updateThailand() {
    const code = $('thailand-occupation').value;
    const rows = DATA.thaiData.filter(r => r.code === code).sort((a, b) => a.year - b.year);
    if (!rows.length) return;
    const first = rows[0], last = rows[rows.length - 1];
    const delta = last.share - first.share;
    $('thailand-summary').innerHTML = `<span class="summary-main">${code} · ${last.nameTh}</span><span>ข้อมูล ${first.year}–${last.year} (${rows.length} ปีที่มีข้อมูล)</span><strong>${delta >= 0 ? '+' : ''}${thaiNumber(delta, 3)}</strong><span>จุดเปอร์เซ็นต์ ระหว่างปีแรกและปีล่าสุด</span>`;
    const fit = linearFit(rows);
    const traces = [{type: 'scatter', mode: 'lines+markers', x: rows.map(r => r.year), y: rows.map(r => r.share), name: 'ข้อมูลจริง (Actual Data)',
      line: {color: '#347DA8', width: 3}, marker: {size: 7}, customdata: rows.map(r => r.value),
      hovertemplate: '<b>ข้อมูลจริง</b><br>ปี: %{x}<br>สัดส่วน: %{y:.3f}%<br>จำนวนแรงงาน: %{customdata:,.2f} พันคน<extra></extra>'}];
    if (fit) traces.push({type: 'scatter', mode: 'lines', x: rows.map(r => r.year), y: rows.map(r => fit.predict(r.year)), name: 'แนวโน้ม (Linear Trend)',
      line: {color: '#D58D3E', width: 3, dash: 'dash'}, hovertemplate: '<b>แนวโน้ม</b><br>ปี: %{x}<br>ค่าตามแนวโน้ม: %{y:.3f}%<extra></extra>'});
    const layout = baseLayout({height: 500, margin: {l: 75, r: 30, t: 55, b: 65},
      title: {text: `ประเทศไทย: ${code} — ${last.nameTh}`, x: .5, font: {size: 15}},
      xaxis: {title: 'ปี', dtick: 1, gridcolor: '#edf1f5'}, yaxis: {title: 'สัดส่วนของผู้มีงานทำทั้งประเทศ (%)', rangemode: 'tozero', gridcolor: '#edf1f5'},
      legend: {orientation: 'h', y: -0.2}, hovermode: 'x unified'});
    Plotly.react('thailand-chart', traces, layout, plotConfig);
    renderTable('thailand-table', rows, [
      {key: 'year'}, {render: r => thaiNumber(r.value, 3)}, {render: r => thaiNumber(r.share, 3)}
    ]);
  }

  function initBacktest() {
    const rows = DATA.meta.backtestSummary || [];
    const cards = document.querySelectorAll('#panel-backtest .model-card');
    if (cards.length >= 3 && rows.length) {
      const first = rows[0], second = rows[1] || rows[0];
      cards[0].querySelector('strong').textContent = first.trendMAE.toFixed(3);
      cards[0].querySelector('small').textContent = `MAE ปี ${first.year} · จุดเปอร์เซ็นต์`;
      cards[0].querySelector('em').textContent = `${second.year}: ${second.trendMAE.toFixed(3)}`;
      cards[1].querySelector('strong').textContent = first.naiveMAE.toFixed(3);
      cards[1].querySelector('small').textContent = `MAE ปี ${first.year} · จุดเปอร์เซ็นต์`;
      cards[1].querySelector('em').textContent = `${second.year}: ${second.naiveMAE.toFixed(3)}`;
      cards[2].querySelector('strong').textContent = DATA.meta.backtestTrendBetterPct == null ? '—' : `${DATA.meta.backtestTrendBetterPct.toFixed(1)}%`;
      cards[2].querySelector('small').textContent = 'กรณีที่ Trend Line คลาดเคลื่อนน้อยกว่า Naive';
      cards[2].querySelector('em').textContent = `${rows.reduce((n,r)=>n+r.count,0)} กรณีอาชีพ–ปีที่ทดสอบ`;
    }
    const traceTrend = {type: 'bar', x: rows.map(r => String(r.year)), y: rows.map(r => r.trendMAE), name: 'Trend Line', marker: {color: '#477DA5'},
      text: rows.map(r => r.trendMAE.toFixed(3)), textposition: 'outside', hovertemplate: 'ปี %{x}<br>Trend MAE: %{y:.3f}<extra></extra>'};
    const traceNaive = {type: 'bar', x: rows.map(r => String(r.year)), y: rows.map(r => r.naiveMAE), name: 'Naive', marker: {color: '#13A38B'},
      text: rows.map(r => r.naiveMAE.toFixed(3)), textposition: 'outside', hovertemplate: 'ปี %{x}<br>Naive MAE: %{y:.3f}<extra></extra>'};
    const layout = baseLayout({height: 350, barmode: 'group', margin: {l: 70, r: 30, t: 25, b: 60},
      xaxis: {title: 'ปีที่ทดสอบ'}, yaxis: {title: 'MAE (จุดเปอร์เซ็นต์) · ยิ่งต่ำยิ่งดี', rangemode: 'tozero', gridcolor: '#edf1f5'},
      legend: {orientation: 'h', y: -0.25}});
    Plotly.react('backtest-chart', [traceTrend, traceNaive], layout, plotConfig);
    renderTable('backtest-table', DATA.meta.backtestWorst, [
      {key: 'code'}, {key: 'nameTh'}, {key: 'year'}, {render: r => thaiNumber(r.actual)},
      {render: r => thaiNumber(r.trend)}, {render: r => thaiNumber(r.naive)}
    ]);
  }

  async function loadData(manual = false) {
    const status = $('load-status');
    const refreshButton = $('refresh-data');
    if (refreshButton) {
      refreshButton.disabled = true;
      refreshButton.textContent = 'กำลังโหลด…';
    }
    status.textContent = manual ? 'กำลังโหลดข้อมูล Snapshot ล่าสุด…' : 'กำลังเตรียมข้อมูลสำหรับการสำรวจ…';
    status.classList.remove('error');
    try {
      const response = await fetch(`${DATA_URL}?refresh=${Date.now()}`, {cache: 'no-store'});
      if (!response.ok) throw new Error(`โหลดไฟล์ข้อมูลไม่สำเร็จ (${response.status})`);
      const nextData = await response.json();
      if (!nextData.meta || !Array.isArray(nextData.thaiData)) {
        throw new Error('รูปแบบไฟล์ข้อมูลไม่ถูกต้อง');
      }
      DATA = nextData;
      window.CA_DATA = DATA;
      renderMetrics();
      initRanking();
      initHeatmap();
      initEvolution();
      initGender();

      initBacktest();
      const updated = DATA.meta.fetchedAt ? ` · ดึงจาก ILOSTAT เมื่อ ${DATA.meta.fetchedAt}` : '';
      status.textContent = `พร้อมสำรวจข้อมูลแล้ว · ${DATA.meta.thaiRows.toLocaleString('th-TH')} แถวข้อมูลประเทศไทย${updated}`;
      status.classList.remove('error');
    } catch (error) {
      console.error(error);
      status.textContent = `เกิดปัญหาในการเปิดข้อมูล: ${error.message} · กำลังคงข้อมูลเดิมไว้หากมี`;
      status.classList.add('error');
    } finally {
      if (refreshButton) {
        refreshButton.disabled = false;
        refreshButton.textContent = '↻ โหลดข้อมูลล่าสุด';
      }
    }
  }

  function start() {
    setupNavigation();
    setActiveTab('overview');
    const refreshButton = $('refresh-data');
    if (refreshButton) refreshButton.addEventListener('click', () => loadData(true));
    loadData(false);
  }

  document.addEventListener('DOMContentLoaded', start);
})();
