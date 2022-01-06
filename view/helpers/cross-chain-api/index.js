const API_BASE = 'http://47.57.239.181:18526'
export const getPrice = async (body) =>
  await fetch(`${API_BASE}/getPrice`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const checkTokenBridge = async (body) =>
  await fetch(`${API_BASE}/checkTokenBridge`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const getTokenGroup = async (body) =>
  await fetch(`${API_BASE}/getTokenGroup`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const getAssetIcon = ({ meta_chain_id, token_address }) =>
  `${API_BASE}/getAssetIcon/${meta_chain_id}/${token_address}`
export const getIndexAssets = async (body) =>
  await fetch(`${API_BASE}/getIndexAssets`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const getAllSupportBridge = async (body) =>
  await fetch(`${API_BASE}/getAllSupportBridge`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const getAllAssets = async () => 
  await fetch(`${API_BASE}/getAllAssets`, {
    method: 'POST',
    body: JSON.stringify({}),
  })