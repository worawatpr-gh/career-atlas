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
      overview: 'Dashboard', ranking: 'Career Ranking', fingerprint: 'Country Fingerprint',
      evolution: 'Career Evolution', gender: 'Gender Gap', thailand: 'Thailand Deep Dive',
      backtest: 'Backtest', about: 'Data & Method'
    };
    const breadcrumb = $('breadcrumb-current');
    if (breadcrumb) breadcrumb.textContent = tabLabels[tab] || 'Dashboard';
    if (window.matchMedia('(max-width: 760px)').matches) {
      document.body.classList.remove('sidebar-open');
      const toggle = $('sidebar-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
    if (tab === 'fingerprint') setTimeout(() => window.Plotly?.Plots.resize($('fingerprint-chart')), 40);
    if (tab === 'gender') setTimeout(() => window.Plotly?.Plots.resize($('gender-chart')), 40);
    if (tab === 'evolution') setTimeout(() => window.Plotly?.Plots.resize($('evolution-chart')), 40);
    if (tab === 'thailand') setTimeout(() => window.Plotly?.Plots.resize($('thailand-chart')), 40);
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
    $('metric-countries').textContent = m.countries.length;
    $('metric-years').textContent = `${m.sharedYears[0]}–${m.sharedYears[m.sharedYears.length - 1]}`;
    $('metric-occupations').textContent = m.occupationCount;
    $('metric-thai').textContent = m.thaiOccupationCount;
    $('metric-thai-years').textContent = `${m.thaiOccupationCount} กลุ่มที่ไทยรายงาน · ${m.thaiYears[0]}–${m.thaiYears[1]}`;
    $('snapshot-meta').textContent = `Snapshot ที่ใช้ในกิจกรรม: ${m.rawRows.toLocaleString('th-TH')} แถว · ${m.rawColumns} คอลัมน์ · พบ obs_value ที่หายไป ${m.missingObsValue} รายการ (ไม่นำมาตีความเป็นศูนย์) · แสดงค่าเฉลี่ย/แนวโน้มตามวิธีคำนวณใน Notebook`;
  }

  function initRanking() {
    const countries = [...DATA.meta.countries].sort((a, b) => countryLabel(a).localeCompare(countryLabel(b), 'th'));
    fillSelect($('ranking-country'), countries.map(c => ({value: c, label: countryLabel(c)})), 'Thailand');
    fillSelect($('ranking-year'), DATA.meta.sharedYears.map(y => ({value: y, label: String(y)})), Math.max(...DATA.meta.sharedYears));
    $('ranking-country').addEventListener('change', updateRanking);
    $('ranking-year').addEventListener('change', updateRanking);
    updateRanking();
  }

  function updateRanking() {
    const country = $('ranking-country').value;
    const year = Number($('ranking-year').value);
    const rows = DATA.commonData.filter(r => r.country === country && r.year === year && r.sex === 'Sex: Total')
      .sort((a, b) => b.share - a.share).slice(0, 10).sort((a, b) => a.share - b.share);
    $('ranking-context').textContent = `${countryLabel(country)} · ${year} · 10 กลุ่มแรก`;
    const trace = {
      type: 'bar', orientation: 'h',
      x: rows.map(r => r.share), y: rows.map(r => r.nameTh),
      text: rows.map(r => `${r.share.toFixed(1)}%`), textposition: 'outside', cliponaxis: false,
      marker: {color: rows.map((r, i) => i === rows.length - 1 ? '#12A58D' : '#477DA5'), line: {width: 0}},
      customdata: rows.map(r => [r.code, r.value]),
      hovertemplate: '<b>%{y}</b><br>รหัสอาชีพ: %{customdata[0]}<br>สัดส่วน: %{x:.2f}%<br>จำนวนแรงงาน: %{customdata[1]:,.2f} พันคน<extra></extra>'
    };
    const layout = baseLayout({
      height: 545, margin: {l: 255, r: 85, t: 30, b: 60},
      xaxis: {title: 'สัดส่วนของผู้มีงานทำทั้งประเทศ (%)', rangemode: 'tozero', gridcolor: '#edf1f5', ticksuffix: '%'},
      yaxis: {title: '', automargin: true, tickfont: {size: 11}}, showlegend: false
    });
    Plotly.react('ranking-chart', [trace], layout, plotConfig);
  }

  function initFingerprint() {
    const occ = DATA.heatmap;
    const z = occ.map(r => r.values);
    const text = z.map(row => row.map(v => v === null ? '' : Number(v).toFixed(1)));
    const trace = {
      type: 'heatmap', x: DATA.heatmapCountries.map(countryLabel),
      y: occ.map(r => `${r.code} · ${r.nameTh}`), z, text, texttemplate: '%{text}',
      textfont: {family: baseFont, size: 10}, colorscale: 'YlOrRd',
      colorbar: {title: 'สัดส่วน (%)', titleside: 'right', thickness: 14},
      customdata: occ.map(r => DATA.heatmapCountries.map(() => r.code)),
      hovertemplate: '<b>%{y}</b><br>ประเทศ: %{x}<br>รหัสอาชีพ: %{customdata}<br>สัดส่วนเฉลี่ย: %{z:.2f}%<extra></extra>'
    };
    const layout = baseLayout({
      height: Math.max(850, occ.length * 38 + 200),
      margin: {l: 300, r: 95, t: 28, b: 80},
      xaxis: {title: 'ประเทศ', side: 'bottom', tickangle: 0},
      yaxis: {title: '', autorange: 'reversed', automargin: true, tickfont: {size: 10}}
    });
    Plotly.newPlot('fingerprint-chart', [trace], layout, plotConfig);
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
    evolutionOptions = [...new Map(DATA.commonData.filter(r => r.sex === 'Sex: Total').map(r => [r.nameEn, {code: r.code, nameEn: r.nameEn, nameTh: r.nameTh}])).values()]
      .sort((a, b) => a.nameEn.localeCompare(b.nameEn, 'en'));
    fillSelect($('evolution-occupation'), evolutionOptions.map(o => ({value: o.code, label: `${o.code} — ${o.nameTh}`})), evolutionOptions[0]?.code);
    $('evolution-occupation').addEventListener('change', updateEvolution);
    updateEvolution();
  }

  function updateEvolution() {
    const code = $('evolution-occupation').value;
    const occupation = evolutionOptions.find(o => o.code === code);
    if (!occupation) return;
    const actualRecords = DATA.commonData.filter(r => r.code === code && r.sex === 'Sex: Total');
    const start = DATA.meta.sharedYears[0];
    const end = DATA.meta.sharedYears[DATA.meta.sharedYears.length - 1];
    const forecastEnd = end + 3;
    const traces = [];
    DATA.meta.countries.slice().sort().forEach(country => {
      const rows = actualRecords.filter(r => r.country === country).sort((a, b) => a.year - b.year);
      if (!rows.length) return;
      const color = countryColors[country] || '#888888';
      const label = countryLabel(country);
      traces.push({type: 'scatter', mode: 'lines+markers', x: rows.map(r => r.year), y: rows.map(r => r.share),
        name: `${label} · ข้อมูลจริง`, legendgroup: country, line: {color, width: 2.5}, marker: {size: 6},
        customdata: rows.map(r => r.value), hovertemplate: `<b>${label} · ${code} ${occupation.nameTh} (ข้อมูลจริง)</b><br>ปี: %{x}<br>สัดส่วนจริง: %{y:.2f}%<br>จำนวนแรงงาน: %{customdata:,.2f} พันคน<extra></extra>`});
      const fit = linearFit(rows);
      if (!fit) return;
      const trendX = Array.from({length: end - start + 1}, (_, i) => start + i);
      traces.push({type: 'scatter', mode: 'lines', x: trendX, y: trendX.map(fit.predict), name: `${label} · แนวโน้ม`, legendgroup: country,
        line: {color, width: 2.3, dash: 'dash'}, hovertemplate: `<b>${label} · แนวโน้ม</b><br>ปี: %{x}<br>ค่าตามแนวโน้ม: %{y:.2f}%<extra></extra>`});
      const forecastX = Array.from({length: forecastEnd - end + 1}, (_, i) => end + i);
      traces.push({type: 'scatter', mode: 'lines', x: forecastX, y: forecastX.map(fit.predict), name: `${label} · คาดการณ์`, legendgroup: country,
        line: {color, width: 3, dash: 'dot'}, hovertemplate: `<b>${label} · คาดการณ์เชิงเส้น</b><br>ปี: %{x}<br>สัดส่วนที่คาดการณ์: %{y:.2f}%<extra></extra>`});
    });
    const layout = baseLayout({
      height: 650, margin: {l: 75, r: 30, t: 75, b: 70},
      title: {text: `การเปลี่ยนแปลงของกลุ่มอาชีพ: ${code} — ${occupation.nameTh} (ข้อมูลจริง ${start}–${end})`, x: .5, xanchor: 'center', font: {size: 15}},
      xaxis: {title: 'ปี', dtick: 1, range: [start, forecastEnd], gridcolor: '#edf1f5'},
      yaxis: {title: 'สัดส่วนของผู้มีงานทำทั้งประเทศ (%)', rangemode: 'tozero', gridcolor: '#edf1f5'},
      legend: {title: {text: 'ประเทศและประเภทเส้น'}, orientation: 'h', y: -0.23}, hovermode: 'x unified',
      shapes: [{type: 'line', x0: end, x1: end, y0: 0, y1: 1, yref: 'paper', line: {color: '#8895a4', width: 1.4, dash: 'dash'}}],
      annotations: [{x: end, y: 1, yref: 'paper', text: 'เริ่มช่วงคาดการณ์', showarrow: false, xanchor: 'right', yanchor: 'bottom', font: {size: 9, color: '#748397'}}]
    });
    Plotly.react('evolution-chart', traces, layout, plotConfig);
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
    Plotly.newPlot('gender-chart', [traceMale, traceFemale], layout, plotConfig);
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
    $('thailand-occupation').addEventListener('change', updateThailand);
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
    const rows = DATA.meta.backtestSummary;
    const traceTrend = {type: 'bar', x: rows.map(r => String(r.year)), y: rows.map(r => r.trendMAE), name: 'Trend Line', marker: {color: '#477DA5'},
      text: rows.map(r => r.trendMAE.toFixed(3)), textposition: 'outside', hovertemplate: 'ปี %{x}<br>Trend MAE: %{y:.3f}<extra></extra>'};
    const traceNaive = {type: 'bar', x: rows.map(r => String(r.year)), y: rows.map(r => r.naiveMAE), name: 'Naive', marker: {color: '#13A38B'},
      text: rows.map(r => r.naiveMAE.toFixed(3)), textposition: 'outside', hovertemplate: 'ปี %{x}<br>Naive MAE: %{y:.3f}<extra></extra>'};
    const layout = baseLayout({height: 350, barmode: 'group', margin: {l: 70, r: 30, t: 25, b: 60},
      xaxis: {title: 'ปีที่ทดสอบ'}, yaxis: {title: 'MAE (จุดเปอร์เซ็นต์) · ยิ่งต่ำยิ่งดี', rangemode: 'tozero', gridcolor: '#edf1f5'},
      legend: {orientation: 'h', y: -0.25}});
    Plotly.newPlot('backtest-chart', [traceTrend, traceNaive], layout, plotConfig);
    renderTable('backtest-table', DATA.meta.backtestWorst, [
      {key: 'code'}, {key: 'nameTh'}, {key: 'year'}, {render: r => thaiNumber(r.actual)},
      {render: r => thaiNumber(r.trend)}, {render: r => thaiNumber(r.naive)}
    ]);
  }

  async function start() {
    setupNavigation();
    setActiveTab('overview');
    const status = $('load-status');
    try {
      const response = await fetch(DATA_URL, {cache: 'no-store'});
      if (!response.ok) throw new Error(`โหลดไฟล์ข้อมูลไม่สำเร็จ (${response.status})`);
      DATA = await response.json();
      window.CA_DATA = DATA;
      renderMetrics();
      initRanking();
      initFingerprint();
      initEvolution();
      initGender();
      initThailand();
      initBacktest();
      status.textContent = `พร้อมสำรวจข้อมูลแล้ว · ${DATA.meta.commonRows.toLocaleString('th-TH')} แถวสำหรับเปรียบเทียบ · ${DATA.meta.thaiRows.toLocaleString('th-TH')} แถวสำหรับเจาะลึกประเทศไทย`;
      status.classList.remove('error');
    } catch (error) {
      console.error(error);
      status.textContent = `เกิดปัญหาในการเปิดข้อมูล: ${error.message} · กรุณาตรวจว่ามีไฟล์ data/career_atlas_data.json และเปิดผ่านเว็บเซิร์ฟเวอร์หรือ GitHub Pages`;
      status.classList.add('error');
    }
  }

  document.addEventListener('DOMContentLoaded', start);
})();
