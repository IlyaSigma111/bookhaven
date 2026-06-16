import { execFileSync } from 'child_process';

// Test 1: basic curl
try {
  const r1 = execFileSync('curl.exe', ['--version'], { encoding: 'utf8', timeout: 5000 });
  console.log('curl version:', r1.split('\n')[0]);
} catch (e) {
  console.log('curl not found:', e.message);
}

// Test 2: fetch a genre
try {
  const html = execFileSync('curl.exe', [
    '-sL', '--max-time', '15',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'https://flibusta.info/g/sf_techno',
  ], { encoding: 'utf8', timeout: 20000 });
  console.log('sf_techno: OK, length:', html.length);
  const books = html.match(/<a href='\/b\/(\d+)'>/g);
  console.log('Books:', books ? books.length : 0);
} catch (e) {
  console.log('sf_techno failed:', e.status, e.stderr?.toString().slice(0, 200));
}

// Test 3: fetch sf_action
try {
  const html2 = execFileSync('curl.exe', [
    '-sL', '--max-time', '15',
    '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'https://flibusta.info/g/sf_action',
  ], { encoding: 'utf8', timeout: 20000 });
  console.log('sf_action: OK, length:', html2.length);
} catch (e) {
  console.log('sf_action failed:', e.status, e.message.slice(0, 200));
}
