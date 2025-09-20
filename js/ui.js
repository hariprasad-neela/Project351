import { formatCurrency, calcTotalValue } from './utils.js';

const el = {
  authScreen: document.getElementById('auth-section'),
  dashboard: document.getElementById('dashboard-wrapper'),
  totalValue: document.getElementById('total-value'),
  assetList: document.getElementById('asset-list'),
  assetDialog: document.getElementById('asset-dialog'),
  assetForm: document.getElementById('asset-form'),
  assetDialogTitle: document.getElementById('asset-dialog-title')
};

export function showAuth() {
  el.authScreen.hidden = false;
  el.dashboard.hidden = true;
}

export function showDashboard() {
  el.authScreen.hidden = true;
  el.dashboard.hidden = false;
}

export function renderAssets(assets) {
  el.assetList.innerHTML = '';
  if (!assets.length) {
    el.assetList.innerHTML = '<div>No assets yet — add one.</div>';
    el.totalValue.textContent = formatCurrency(0);
    return;
  }

  // optionally compute total
  const total = calcTotalValue(assets);
  el.totalValue.textContent = formatCurrency(total);

  assets.forEach(a => {
    const item = document.createElement('div');
    item.className = 'asset';
    item.innerHTML = `
      <div>
        <strong>${a.symbol}</strong> <div style="font-size:0.9rem;color:#666">${a.name || ''}</div>
        <div>Qty: ${a.qty}</div>
      </div>
      <div style="text-align:right">
        <div>${formatCurrency((a.currentPrice ?? a.priceAtAdd) * a.qty || 0)}</div>
        <button data-id="${a.id}" class="edit-asset">Edit</button>
        <button data-id="${a.id}" class="delete-asset">Delete</button>
      </div>
    `;
    el.assetList.appendChild(item);
  });
}

export function openAssetDialog({ mode='add', asset } = {}) {
  el.assetDialogTitle.textContent = mode === 'add' ? 'Add Asset' : 'Edit Asset';
  // populate fields if edit
  el.assetForm['asset-symbol'].value = asset?.symbol ?? '';
  el.assetForm['asset-name'].value = asset?.name ?? '';
  el.assetForm['asset-qty'].value = asset?.qty ?? '';
  el.assetForm['asset-price'].value = asset?.priceAtAdd ?? '';
  el.assetDialog.showModal();
}

export function closeAssetDialog() {
  el.assetDialog.close();
}
