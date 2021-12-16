const API_BASE = 'http://112.47.58.57:8899';

export const getPrice = async (body) => await fetch(`${API_BASE}/getPrice`, {
  method: 'POST',
  body: JSON.stringify(body)
});

export const checkTokenBridge = async (body) => await fetch(`${API_BASE}/checkTokenBridge`, {
  method: 'POST',
  body: JSON.stringify(body)
});

export const getTokenGroup = async (body) => await fetch(`${API_BASE}/getTokenGroup`, {
  method: 'POST',
  body: JSON.stringify(body)
});

export const getAssetIcon = async (body) => await fetch(`${API_BASE}/lightwallet/dex/logo`, {
  method: 'POST',
  body: JSON.stringify(body)
});

export const getIndexAssets = async (body) => await fetch(`${API_BASE}/getIndexAssets`, {
  method: 'POST',
  body: JSON.stringify(body)
});

export const getAllSupportBridge = async (body) => await fetch(`${API_BASE}/getAllSupportBridge`, {
  method: 'POST',
  body: JSON.stringify(body)
});
