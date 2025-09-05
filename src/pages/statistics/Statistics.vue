<template>
  <div class="container py-3">
    <div class="page-title d-flex align-items-center justify-content-between mb-3">
      <h1 class="h4 m-0">Tổng quan thống kê</h1>
      <div class="d-flex align-items-center gap-2">
        <small class="text-muted me-3">Tự động làm mới mỗi 30s</small>
        <button class="btn btn-light refresh-btn" @click="fetchStatistics">
          <i class="fa-solid fa-rotate"></i> Làm mới
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <!-- Tiles (đã bỏ Người dùng & Đơn vị) -->
    <div class="row g-3">
      <div class="col-12 col-sm-6 col-lg-3" v-for="t in tiles" :key="t.key">
        <div class="tile-stats pretty" :class="t.class">
          <div class="icon"><i :class="t.icon"></i></div>
          <div class="count"><span :ref="el => setCountRef(t.key, el)" class="skeleton block"></span></div>
          <h3>{{ t.label }}</h3>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="row mt-4 g-3">
      <!-- Vulnerability severity -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header bg-white fw-semibold d-flex justify-content-between align-items-center">
            <span>Phân bố mức độ lỗ hổng</span>
            <small class="text-muted" v-if="sumSev">Tổng: {{ sumSev.toLocaleString('vi-VN') }}</small>
          </div>
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-7">
                <canvas ref="sevCanvas" height="200"></canvas>
              </div>
              <div class="col-5">
                <ul class="legend list-unstyled m-0">
                  <li>
                    <span class="dot dot-low"></span>
                    Thấp
                    <b>{{ sevCounts.low.toLocaleString('vi-VN') }}</b>
                    <span class="pct" v-if="sumSev">({{ pct(sevCounts.low, sumSev) }}%)</span>
                  </li>
                  <li>
                    <span class="dot dot-medium"></span>
                    Trung bình
                    <b>{{ sevCounts.medium.toLocaleString('vi-VN') }}</b>
                    <span class="pct" v-if="sumSev">({{ pct(sevCounts.medium, sumSev) }}%)</span>
                  </li>
                  <li>
                    <span class="dot dot-high"></span>
                    Cao
                    <b>{{ sevCounts.high.toLocaleString('vi-VN') }}</b>
                    <span class="pct" v-if="sumSev">({{ pct(sevCounts.high, sumSev) }}%)</span>
                  </li>
                  <li>
                    <span class="dot dot-critical"></span>
                    Nghiêm trọng
                    <b>{{ sevCounts.critical.toLocaleString('vi-VN') }}</b>
                    <span class="pct" v-if="sumSev">({{ pct(sevCounts.critical, sumSev) }}%)</span>
                  </li>
                </ul>
                <div v-if="sumSev===0" class="text-muted small mt-2">Chưa có dữ liệu phân bố.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Website status -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header bg-white fw-semibold d-flex justify-content-between align-items-center">
            <span>Trạng thái website</span>
            <small class="text-muted" v-if="sumWeb">Tổng: {{ sumWeb.toLocaleString('vi-VN') }}</small>
          </div>
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-7">
                <canvas ref="webCanvas" height="200"></canvas>
              </div>
              <div class="col-5">
                <ul class="legend list-unstyled m-0">
                  <li>
                    <span class="dot dot-web-active"></span>
                    Đang hoạt động
                    <b>{{ webCounts.active.toLocaleString('vi-VN') }}</b>
                    <span class="pct" v-if="sumWeb">({{ pct(webCounts.active, sumWeb) }}%)</span>
                  </li>
                  <li>
                    <span class="dot dot-web-suspect"></span>
                    Nghi ngờ
                    <b>{{ webCounts.suspect.toLocaleString('vi-VN') }}</b>
                    <span class="pct" v-if="sumWeb">({{ pct(webCounts.suspect, sumWeb) }}%)</span>
                  </li>
                  <li>
                    <span class="dot dot-web-down"></span>
                    Ngừng hoạt động
                    <b>{{ webCounts.down.toLocaleString('vi-VN') }}</b>
                    <span class="pct" v-if="sumWeb">({{ pct(webCounts.down, sumWeb) }}%)</span>
                  </li>
                </ul>
                <div v-if="sumWeb===0" class="text-muted small mt-2">Chưa có dữ liệu trạng thái.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script setup>
import { ref, onMounted, nextTick, computed, onBeforeUnmount } from 'vue'

/* ========== Chart.js + Datalabels via CDN ========== */
const CHART_CDN        = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js'
const DATALABELS_CDN   = 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0'
let ChartRef = null
async function loadScriptOnce(src){
  if (document.querySelector(`script[src="${src}"]`)) return
  await new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src; s.async = true
    s.onload = resolve; s.onerror = () => reject(new Error('Không tải được ' + src))
    document.head.appendChild(s)
  })
}
async function ensureChart(){
  if (!ChartRef){
    await loadScriptOnce(CHART_CDN)
    await loadScriptOnce(DATALABELS_CDN)
    ChartRef = window.Chart
    // đăng ký plugin datalabels
    if (window.ChartDataLabels) ChartRef.register(window.ChartDataLabels)
  }
  return ChartRef
}

/* ========== API endpoints ========== */
const API_STATS     = import.meta.env.VITE_STATS_API || '/api/statistics'
const API_VUL_LIST  = '/api/vulnerability'
const API_WEB_LIST  = '/api/website'
const USE_CREDENTIALS = true

/* ========== Tiles (đã bỏ users & group_units) ========== */
const error = ref('')
const tiles = [
  { key: 'devices',         label: 'Thiết bị',     icon: 'fa-solid fa-desktop',  class: 'pretty-blue' },
  { key: 'websites',        label: 'Website',      icon: 'fa-solid fa-globe',    class: 'pretty-amber' },
  { key: 'web_defaces',     label: 'Web deface',   icon: 'fa-solid fa-bolt',     class: 'pretty-red' },
  { key: 'vulnerabilities', label: 'Lỗ hổng bảo mật',      icon: 'fa-solid fa-shield',   class: 'pretty-slate' }
]
const countEls = {}
function setCountRef(key, el){ if (el) countEls[key] = el }
const ease = (t) => 1 - Math.pow(1 - t, 3)
const fmt  = (n) => Number(n || 0).toLocaleString('vi-VN')
function animateCount(el, to){
  if (!el) return
  el.classList.remove('skeleton','block')
  const from = Number(el.dataset.from || 0)
  const start = performance.now(), dur = 600
  function step(now){
    const p = Math.min(1, (now - start) / dur)
    const v = Math.round(from + (to - from) * ease(p))
    el.textContent = fmt(v)
    if (p < 1) requestAnimationFrame(step); else el.dataset.from = to
  }
  requestAnimationFrame(step)
}

/* ========== Donut: severity ========== */
const sevCanvas = ref(null)
let sevChart
const sevCounts = ref({ low:0, medium:0, high:0, critical:0 })
const sumSev = computed(()=> sevCounts.value.low + sevCounts.value.medium + sevCounts.value.high + sevCounts.value.critical)
const SEV_COLORS = { low:'#2ecc71', medium:'#f1c40f', high:'#e67e22', critical:'#e74c3c' }
async function renderSeverityChart(){
  await ensureChart()
  const ctx = sevCanvas.value?.getContext('2d'); if (!ctx) return
  const dataArr = [sevCounts.value.low, sevCounts.value.medium, sevCounts.value.high, sevCounts.value.critical]
  const total = dataArr.reduce((a,b)=>a+b,0) || 1
  const datalabelOpts = {
    formatter: (val) => `${Math.round(val*100/total)}%`,
    color: '#333',
    font: { weight: '600', size: 12 }
  }
  if (sevChart){
    sevChart.data.datasets[0].data = dataArr
    sevChart.options.plugins.datalabels = datalabelOpts
    sevChart.update()
    return
  }
  sevChart = new ChartRef(ctx, {
    type:'doughnut',
    data:{
      labels:['Thấp','Trung bình','Cao','Nghiêm trọng'],
      datasets:[{ data:dataArr, backgroundColor:[SEV_COLORS.low,SEV_COLORS.medium,SEV_COLORS.high,SEV_COLORS.critical], borderWidth:0, hoverOffset:4 }]
    },
    options:{
      cutout:'60%',
      plugins:{
        legend:{ display:false },
        datalabels: datalabelOpts,
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.raw || 0
              const p = Math.round(v*100/total)
              return `${ctx.label}: ${v.toLocaleString('vi-VN')} (${p}%)`
            }
          }
        }
      }
    }
  })
}

/* ========== Donut: website status ========== */
const webCanvas = ref(null)
let webChart
const webCounts = ref({ active:0, suspect:0, down:0 })
const sumWeb = computed(()=> webCounts.value.active + webCounts.value.suspect + webCounts.value.down)
const WEB_COLORS = { active:'#3498db', suspect:'#f39c12', down:'#7f8c8d' }
async function renderWebsiteChart(){
  await ensureChart()
  const ctx = webCanvas.value?.getContext('2d'); if (!ctx) return
  const dataArr = [webCounts.value.active, webCounts.value.suspect, webCounts.value.down]
  const total = dataArr.reduce((a,b)=>a+b,0) || 1
  const datalabelOpts = {
    formatter: (val) => `${Math.round(val*100/total)}%`,
    color: '#333',
    font: { weight: '600', size: 12 }
  }
  if (webChart){
    webChart.data.datasets[0].data = dataArr
    webChart.options.plugins.datalabels = datalabelOpts
    webChart.update()
    return
  }
  webChart = new ChartRef(ctx, {
    type:'doughnut',
    data:{
      labels:['Đang hoạt động','Nghi ngờ','Ngừng hoạt động'],
      datasets:[{ data:dataArr, backgroundColor:[WEB_COLORS.active,WEB_COLORS.suspect,WEB_COLORS.down], borderWidth:0, hoverOffset:4 }]
    },
    options:{
      cutout:'60%',
      plugins:{
        legend:{ display:false },
        datalabels: datalabelOpts,
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.raw || 0
              const p = Math.round(v*100/total)
              return `${ctx.label}: ${v.toLocaleString('vi-VN')} (${p}%)`
            }
          }
        }
      }
    }
  })
}
onBeforeUnmount(()=>{ if (sevChart) sevChart.destroy(); if (webChart) webChart.destroy() })

/* ========== Helpers & fetching ========== */
function buildHeaders(){
  const headers = { Accept:'application/json' }
  const token = localStorage.getItem('token')
  if (token) headers['Authorization'] = 'Bearer ' + token
  return headers
}

/* chuẩn hoá status (đã fix đ/Đ) */
const norm = (s) => String(s ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd')
  .replace(/\s+/g, ' ')
  .replace(/[^\w\s]/g, '')
  .trim()
  .toLowerCase()

function classifyVNStatus(raw){
  const k = norm(raw)
  if (!k) return null
  if (/\bngung\s+hoat\s+dong\b/.test(k)) return 'down'
  if (/\bnghi\s+ngo\b/.test(k))          return 'suspect'
  if (/\bdang\s+hoat\s+dong\b/.test(k))  return 'active'
  return null
}
function extractRows(json){
  if (Array.isArray(json)) return json
  if (Array.isArray(json?.data)) return json.data
  if (json?.data && Array.isArray(json.data.data)) return json.data.data
  if (Array.isArray(json?.items)) return json.items
  if (Array.isArray(json?.records)) return json.records
  return []
}
function reduceStatusObject(obj){
  const c = { active:0, suspect:0, down:0 }
  if (!obj) return c
  for (const [k,v] of Object.entries(obj)){
    const cls = classifyVNStatus(k)
    if (cls) c[cls] += Number(v) || 0
  }
  return c
}
async function fetchSeverityFallback(){
  try{
    const params = new URLSearchParams({ draw:'1', start:'0', length:'10000' })
    const res = await fetch(`${API_VUL_LIST}?${params.toString()}`, { headers:buildHeaders(), credentials: USE_CREDENTIALS ? 'include' : 'same-origin' })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const json = await res.json()
    const rows = extractRows(json)
    const c = { low:0, medium:0, high:0, critical:0 }
    for (const r of rows){
      const s = String(r?.severity||'').toLowerCase()
      if (s==='low') c.low++
      else if (s==='medium') c.medium++
      else if (s==='high') c.high++
      else if (s==='critical') c.critical++
    }
    return c
  }catch{ return { low:0, medium:0, high:0, critical:0 } }
}
async function fetchWebsiteFallback(){
  try{
    const params = new URLSearchParams({ draw:'1', start:'0', length:'10000' })
    const res = await fetch(`${API_WEB_LIST}?${params.toString()}`, { headers:buildHeaders(), credentials: USE_CREDENTIALS ? 'include' : 'same-origin' })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const json = await res.json()
    const rows = extractRows(json)
    const c = { active:0, suspect:0, down:0 }
    for (const r of rows){
      const cls = classifyVNStatus(r?.status)
      if (cls) c[cls]++
    }
    return c
  }catch{ return { active:0, suspect:0, down:0 } }
}

/* fetch toàn bộ + render */
async function fetchStatistics(){
  error.value = ''
  try{
    const res = await fetch(API_STATS, { headers:buildHeaders(), credentials: USE_CREDENTIALS ? 'include' : 'same-origin' })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const data = await res.json()
    await nextTick()

    // tiles
    tiles.forEach(t => {
      const el = countEls[t.key]
      const val = data && Object.prototype.hasOwnProperty.call(data, t.key) ? Number(data[t.key] || 0) : 0
      animateCount(el, val)
    })

    // severity
    let sev = data?.vulnerabilities_by_severity || null
    if (!sev){
      sev = { low:Number(data?.vuln_low||0), medium:Number(data?.vuln_medium||0), high:Number(data?.vuln_high||0), critical:Number(data?.vuln_critical||0) }
    }
    if (!sev || (sev.low+sev.medium+sev.high+sev.critical)===0){
      sev = await fetchSeverityFallback()
    }
    sevCounts.value = { low:sev.low||0, medium:sev.medium||0, high:sev.high||0, critical:sev.critical||0 }
    renderSeverityChart()

    // website status (validate; nếu lệch, fallback)
    let fromStats = reduceStatusObject(data?.websites_by_status)
    const sumStats = fromStats.active + fromStats.suspect + fromStats.down
    const totalWeb = Number(data?.websites || 0)
    if (sumStats > 0 && (totalWeb === 0 || sumStats === totalWeb)) {
      webCounts.value = fromStats
    } else {
      webCounts.value = await fetchWebsiteFallback()
    }
    renderWebsiteChart()

  }catch(e){
    error.value = 'Không thể tải thống kê: ' + (e?.message || e)
  }
}

/* tiện ích % */
const pct = (n, total) => total ? Math.round((n*100)/total) : 0

/* auto refresh 30s */
const REFRESH_MS = 30000
let _timer = null
onMounted(async () => {
  await fetchStatistics()
  _timer = setInterval(fetchStatistics, REFRESH_MS)
})
onBeforeUnmount(() => { if (_timer) clearInterval(_timer) })
</script>

<style scoped>
.page-title{display:flex;align-items:center;justify-content:space-between;margin:18px 0}
.refresh-btn{border:1px solid #e6e9ed}

/* Tiles đẹp hơn */
.tile-stats{position:relative;background:#fff;border:1px solid #eceff3;border-radius:16px;padding:22px 22px 18px;box-shadow:0 8px 24px rgba(0,0,0,.06);transition:transform .15s ease, box-shadow .15s ease}
.tile-stats.pretty::before{content:"";position:absolute;inset:0;border-radius:16px;background:linear-gradient(135deg,rgba(255,255,255,.5),rgba(255,255,255,.2));z-index:0}
.tile-stats:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.08)}
.tile-stats .icon{position:absolute;right:18px;top:18px;font-size:36px;opacity:.17}
.tile-stats .count{position:relative;z-index:1;font-size:34px;font-weight:800;line-height:1;margin:4px 0 6px;min-height:34px;letter-spacing:.3px}
.tile-stats h3{position:relative;z-index:1;font-size:13px;margin:0;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.3px}

/* Accents */
.pretty-blue  .icon{color:#3b82f6}
.pretty-amber .icon{color:#f59e0b}
.pretty-red   .icon{color:#ef4444}
.pretty-slate .icon{color:#334155}

/* Skeleton */
.skeleton{background:linear-gradient(90deg,#f0f2f5 25%,#fafbfc 50%,#f0f2f5 75%);background-size:400% 100%;animation:skeleton 1.2s ease-in-out infinite}
.block{display:inline-block;width:90px;height:30px;border-radius:8px}
@keyframes skeleton{0%{background-position:100% 0}100%{background-position:0 0}}

/* Legend */
.legend li{display:flex;align-items:center;gap:.5rem;margin:.35rem 0;color:#555}
.legend .dot{display:inline-block;width:.8rem;height:.8rem;border-radius:50%}
.legend .dot-low{background:#2ecc71}
.legend .dot-medium{background:#f1c40f}
.legend .dot-high{background:#e67e22}
.legend .dot-critical{background:#e74c3c}
.legend .dot-web-active{background:#3498db}
.legend .dot-web-suspect{background:#f39c12}
.legend .dot-web-down{background:#7f8c8d}
.legend b{color:#111;margin-left:auto}
.legend .pct{color:#6b7280;margin-left:.35rem}
</style>
