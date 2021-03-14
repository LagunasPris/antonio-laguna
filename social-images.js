const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const jsonPagesPath = './social/pages.json';
const imagesDir = path.resolve(__dirname, './src/img/previews');
const command = 'npx eleventy-social-images --siteName \'Antonio Laguna\' --outputDir \'src/img/\' --dataFile social/pages.json --templatePath social/template.html --stylesPath social/style.css';

(async () => {
  console.log('Running 11ty build');

  try {
    await exec('npm run build');
  } catch (error) {
    console.error('Error running build', error);
    return;
  }

  let pages;

  try {
    pages = await fs.readFile(jsonPagesPath, 'utf8').then(content => JSON.parse(content));
  } catch (error) {
    console.error('Error reading pages.json');
    return;
  }

  let existingImages;

  try {
    existingImages = await fs.readdir(imagesDir);
  } catch (error) {
    // Images don't exist probably
    existingImages = [];
  }

  const filteredPages = pages.filter(page => {
    const imageName = `${page.imgName}.png`;
    return !existingImages.includes(imageName);
  });

  if (filteredPages.length) {
    console.log('There are %d missing page(s)', filteredPages.length);

    if (filteredPages.length !== pages.length) {
      console.log('Updated pages.json to account for existing images.');
      await fs.writeFile(jsonPagesPath, JSON.stringify(filteredPages));
    }

    console.log('Generating images');
    await exec(command);
  } else {
    console.log('No images to generate!');
  }
})();
