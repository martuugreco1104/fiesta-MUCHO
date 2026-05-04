const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  require.resolve('sharp');
} catch (e) {
  console.log("Installing sharp...");
  execSync('npm install sharp --no-save', { stdio: 'inherit' });
}

const sharp = require('sharp');

const directories = ['img', 'Flyers', 'Mockups', 'Logos'];
const MAX_WIDTH = 1080; // Ideal para mobile/desktop moderno sin pesar tanto

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const filePath = path.join(dir, file);
      const tempPath = path.join(dir, 'temp_' + file);
      
      try {
        const metadata = await sharp(filePath).metadata();
        let pipeline = sharp(filePath);
        
        // Reducir tamaño si es mayor a 1080px (suficiente para retina mobile y buen fit para desktop web)
        if (metadata.width > MAX_WIDTH && dir !== 'Logos') {
          pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
        } else if (dir === 'Logos' && metadata.width > 500) {
            // Logos doesn't need to be huge
            pipeline = pipeline.resize(500, null, { withoutEnlargement: true });
        }
        
        // Comprimir calidades
        if (ext === '.jpg' || ext === '.jpeg') {
          pipeline = pipeline.jpeg({ quality: 75, progressive: true, mozjpeg: true });
        } else if (ext === '.png') {
          pipeline = pipeline.png({ quality: 75, compressionLevel: 8, effort: 7 });
        }
        
        await pipeline.toFile(tempPath);
        
        // Reemplazar original
        const oldSize = fs.statSync(filePath).size;
        fs.unlinkSync(filePath); // delete original
        fs.renameSync(tempPath, filePath); // rename temp to original
        const newSize = fs.statSync(filePath).size;
        
        console.log(`Optimized ${file}: ${(oldSize/1024/1024).toFixed(2)}MB -> ${(newSize/1024/1024).toFixed(2)}MB`);
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err.message);
      }
    }
  }
}

async function main() {
  for (const dir of directories) {
    await processDirectory(dir);
  }
  console.log('Todas las imágenes optimizadas para mobile!');
}

main();
