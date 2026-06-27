import fs from 'fs';
import path from 'path';

function checkImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      checkImports(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
          const resolvedPath = path.resolve(dir, importPath);
          let targetDir = path.dirname(resolvedPath);
          let targetFile = path.basename(resolvedPath);
          
          // Vite automatically resolves .js, .jsx, etc.
          let found = false;
          try {
            const targetDirFiles = fs.readdirSync(targetDir);
            for (const ext of ['', '.js', '.jsx', '.css']) {
              if (targetDirFiles.includes(targetFile + ext)) {
                found = true;
                break;
              }
            }
            if (!found && targetDirFiles.includes(targetFile)) {
              found = true;
            }
          } catch (e) {
            // Directory might not exist
          }
          
          if (!found) {
            console.log(`ERROR: Case mismatch or missing file in ${fullPath}`);
            console.log(`-> Import: ${importPath}`);
          }
        }
      }
    }
  }
}

checkImports(path.join(process.cwd(), 'src'));
console.log('Check complete.');
