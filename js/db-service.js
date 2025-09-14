import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.X.X/firebase-firestore.js";

/*
 Data model:
 users/{uid}/assets/{assetId}  -> { symbol, name, qty, priceAtAdd, createdAt }
 Optionally:
 users/{uid}/transactions/{txnId} -> { assetId, type: 'buy'|'sell', qty, price, timestamp }
*/

// add asset
export async function addAsset(uid, asset) {
  const col = collection(db, "users", uid, "assets");
  const data = {
    symbol: asset.symbol.toUpperCase(),
    name: asset.name || "",
    qty: Number(asset.qty),
    priceAtAdd: asset.price ? Number(asset.price) : null,
    createdAt: serverTimestamp()
  };
  const ref = await addDoc(col, data);
  return ref.id;
}

// update asset
export async function updateAsset(uid, assetId, updates) {
  const docRef = doc(db, "users", uid, "assets", assetId);
  await updateDoc(docRef, updates);
}

// delete asset
export async function deleteAsset(uid, assetId) {
  const docRef = doc(db, "users", uid, "assets", assetId);
  await deleteDoc(docRef);
}

// realtime listener for assets
export function listenAssets(uid, onChange) {
  const col = collection(db, "users", uid, "assets");
  const q = query(col, orderBy("createdAt", "desc"));
  return onSnapshot(q, snapshot => {
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    onChange(items);
  });
}

// fetch all assets once
export async function fetchAssets(uid) {
  const col = collection(db, "users", uid, "assets");
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
