import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('Testing direct HTTPS connection...');

const req = https.get('https://flibusta.info/g/sf', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  rejectUnauthorized: false,
  timeout: 15000,
}, res => {
  console.log('Status:', res.statusCode, 'Headers:', JSON.stringify(res.headers));
  let data = '';
  res.on('data', c => {
    data += c;
    console.log('Chunk:', data.length);
  });
  res.on('end', () => {
    console.log(`Total: ${data.length}B`);
    const books = data.match(/<a href='\/b\/(\d+)'>/g);
    console.log('Books:', books ? books.length : 0);
  });
});

req.on('error', e => console.log('Error:', e.message));
req.on('timeout', () => { console.log('Timeout'); req.destroy(); });

// Also try connecting directly
const net = await import('net');
const socket = net.createConnection({ host: 'flibusta.info', port: 443 });
socket.on('connect', () => console.log('TCP connected to 443'));
socket.on('error', e => console.log('TCP error:', e.message));
socket.on('timeout', () => console.log('TCP timeout'));
socket.setTimeout(5000);
