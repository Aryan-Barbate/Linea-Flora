export function encodeBouquetState(mode, selectedFlowers, letter) {
  const params = new URLSearchParams();
  if (selectedFlowers.length) params.set('flowers', selectedFlowers.join(','));
  if (mode !== 'color') params.set('mode', mode);
  if (letter.message) params.set('message', letter.message);
  if (letter.recipient) params.set('recipient', letter.recipient);
  if (letter.sender) params.set('sender', letter.sender);
  const qs = params.toString();
  return qs ? `${window.location.origin}${window.location.pathname}?${qs}` : window.location.href;
}

export function decodeBouquetState() {
  const params = new URLSearchParams(window.location.search);
  const flowersStr = params.get('flowers');
  const mode = params.get('mode');
  const message = params.get('message');
  const recipient = params.get('recipient');
  const sender = params.get('sender');
  return {
    selectedFlowers: flowersStr ? flowersStr.split(',').filter(Boolean) : [],
    mode: mode === 'mono' ? 'mono' : 'color',
    letter: { sender: sender || '', recipient: recipient || '', message: message || '' },
  };
}
