const form = document.getElementById('recordForm');
const formStatus = document.getElementById('formStatus');
const recordsTable = document.getElementById('recordsTable');
const recordRowTemplate = document.getElementById('recordRowTemplate');
const resultCount = document.getElementById('resultCount');
const statsContainer = document.getElementById('stats');
const searchInput = document.getElementById('searchInput');
const nameFilter = document.getElementById('nameFilter');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const searchButton = document.getElementById('searchButton');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatPrice(price) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) {
    return '-';
  }
  return `$${numeric.toLocaleString('zh-TW')}`;
}

function getQueryParams() {
  const params = new URLSearchParams();

  if (searchInput.value.trim()) {
    params.set('q', searchInput.value.trim());
  }

  if (nameFilter.value.trim()) {
    params.set('itemName', nameFilter.value.trim());
  }

  if (fromDate.value) {
    params.set('from', fromDate.value);
  }

  if (toDate.value) {
    params.set('to', toDate.value);
  }

  return params.toString();
}

async function loadSummary() {
  const params = new URLSearchParams();
  if (nameFilter.value.trim()) {
    params.set('itemName', nameFilter.value.trim());
  }

  const response = await fetch(`/api/summary?${params.toString()}`);
  const { summary } = await response.json();

  const cards = [
    { label: '總紀錄數', value: summary.totalCount ?? 0 },
    { label: '最低價格', value: formatPrice(summary.minPrice) },
    { label: '最高價格', value: formatPrice(summary.maxPrice) },
    { label: '平均價格', value: formatPrice(summary.avgPrice) },
    { label: '最早日期', value: summary.firstDate || '-' },
    { label: '最晚日期', value: summary.lastDate || '-' }
  ];

  statsContainer.innerHTML = cards
    .map((card) => `
      <div class="stat">
        <span>${escapeHtml(card.label)}</span>
        <strong>${escapeHtml(card.value)}</strong>
      </div>
    `)
    .join('');
}

function renderRows(records) {
  recordsTable.innerHTML = '';

  if (!records.length) {
    recordsTable.innerHTML = '<tr class="empty-row"><td colspan="5">目前沒有符合條件的資料，先新增第一筆票價紀錄吧。</td></tr>';
    resultCount.textContent = '0 筆結果';
    return;
  }

  const rows = records.map((record) => {
    const row = recordRowTemplate.content.cloneNode(true);
    row.querySelector('[data-field="record_date"]').textContent = record.record_date;
    row.querySelector('[data-field="item_name"]').textContent = record.item_name;
    row.querySelector('[data-field="price"]').textContent = formatPrice(record.price);
    row.querySelector('[data-field="source_site"]').textContent = record.source_site;
    row.querySelector('[data-field="note"]').textContent = record.note || '-';
    return row;
  });

  recordsTable.append(...rows);
  resultCount.textContent = `${records.length} 筆結果`;
}

async function loadRecords() {
  const query = getQueryParams();
  const response = await fetch(`/api/records?${query}`);
  const data = await response.json();
  renderRows(data.records);
}

async function refreshView() {
  await Promise.all([loadSummary(), loadRecords()]);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = '儲存中...';

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || '儲存失敗');
    }

    form.reset();
    formStatus.textContent = `已新增：${result.record.item_name}`;
    await refreshView();
  } catch (error) {
    formStatus.textContent = error.message;
  }
});

searchButton.addEventListener('click', refreshView);

[searchInput, nameFilter, fromDate, toDate].forEach((input) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      refreshView();
    }
  });
});

refreshView().catch((error) => {
  formStatus.textContent = `載入失敗：${error.message}`;
});