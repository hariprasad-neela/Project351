import * as Auth from './auth-service.js';
import * as DB from './db-service.js';
import * as UI from './ui.js';

let currentUser = null;
let unsubscribeAssets = null;

// wire auth state
Auth.onAuthState(async user => {
  currentUser = user;
  if (user) {
    UI.showDashboard();

    // start listening to assets
    if (unsubscribeAssets) unsubscribeAssets();
    unsubscribeAssets = DB.listenAssets(user.uid, assets => {
      // NOTE: for live pricing, you'd call an API to annotate assets with currentPrice
      UI.renderAssets(assets);
    });
  } else {
    UI.showAuth();
    if (unsubscribeAssets) unsubscribeAssets();
    unsubscribeAssets = null;
  }
});

// AUTH form handlers
document.getElementById('sign-up-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.querySelector('#su-email').value;
  const pass = e.target.querySelector('#su-pass').value;
  try {
    alert('signup',email,pass);
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('sign-in-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = e.target.querySelector('#si-email').value;
  const pass = e.target.querySelector('#si-pass').value;
  try {
    await Auth.signIn(email, pass);
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('google-signin').addEventListener('click', async () => {
  try {
    await Auth.signInWithGoogle();
  } catch (err) { alert(err.message); }
});

document.getElementById('sign-out-btn').addEventListener('click', async () => {
  await Auth.signOutUser();
});

// add asset UI
document.getElementById('add-asset-btn').addEventListener('click', () => UI.openAssetDialog({mode:'add'}));
document.getElementById('asset-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentUser) return alert('Not signed in');
  const symbol = document.getElementById('asset-symbol').value.trim();
  const name = document.getElementById('asset-name').value.trim();
  const qty = document.getElementById('asset-qty').value;
  const price = document.getElementById('asset-price').value;
  try {
    await DB.addAsset(currentUser.uid, { symbol, name, qty, price });
    UI.closeAssetDialog();
  } catch (err) { alert(err.message); }
});

// delegate edit/delete
document.getElementById('asset-list').addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains('delete-asset')) {
    if (!currentUser) return;
    if (confirm('Delete asset?')) {
      await DB.deleteAsset(currentUser.uid, id);
    }
  } else if (e.target.classList.contains('edit-asset')) {
    // fetch asset, open dialog for edit
    // For brevity we'll open dialog and let user re-save; implement updateAsset similarly
    UI.openAssetDialog({ mode: 'edit', asset: { id } });
  }
});
