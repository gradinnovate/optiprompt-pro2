import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

function updateIndexHtml(): void {
  const indexPath: string = path.join(__dirname, '..', 'dist', 'index.html');
  let content: string = fs.readFileSync(indexPath, 'utf8');
  
  // 更新資源路徑
  content = content.replace(/src="\//g, 'src="./');
  content = content.replace(/href="\//g, 'href="./');
  
  fs.writeFileSync(indexPath, content);
}

updateIndexHtml(); 