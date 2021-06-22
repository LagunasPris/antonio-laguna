const CLOUDNAME = 'antonio-laguna';
const FOLDER = 'v1624199559/antonio.laguna/';
const BASE_URL = `https://res.cloudinary.com/${CLOUDNAME}/image/upload/`;
const FALLBACK_WIDTHS = [300, 600, 928, 1856];
const FALLBACK_WIDTH = 618;

const SHARE_IMAGE_FILE = 'social-template_lfj9sg.jpg';
const TITLE_FONT = 'Fira%20Sans';
const TITLE_FONT_SIZE = '54';
const TITLE_BOTTOM_OFFSET = 306;
const TAGLINE_FONT_SIZE = '30';
const TAGLINE_TOP_OFFSET = 356;
const TAGLINE_LINE_HEIGHT = '10';
const TEXT_AREA_WIDTH = '705';
const TEXT_LEFT_OFFSET = 455;
const TEXT_COLOR = 'fff';

function getSrc(file, width) {
  return `${BASE_URL}q_auto,f_auto,w_${width || FALLBACK_WIDTH}/${FOLDER}${file}`;
}

function getSrcset(file, widths) {
  const widthSet = widths || FALLBACK_WIDTHS;
  return widthSet.map(width => `${getSrc(file, width)} ${width}w`).join(', ');
}

function image(src, imageWidth, imageHeight, alt, caption, className, width) {
  let figCaption = '';
  let cssClass = '';
  const imageSrc = getSrc(src, width);

  if (caption) {
    figCaption = `<figcaption>${caption}</figcaption>`;
  }

  if (className) {
    cssClass = ` class="${className}" `;
  }

  return `<figure data-type="image"><img alt="${alt}"${cssClass} loading="lazy" decoding="async" src="${imageSrc}" width="${imageWidth}" height="${imageHeight}" srcset="${getSrcset(src)}" sizes="(min-width: 684px) 618px, 90.4vw">${figCaption}</figure>`;
}

function cloudinarySafeText(text) {
  return encodeURIComponent(text).replace(/(%2C)/g, '%252C').replace(/(%2F)/g, '%252F');
}

function socialImageUrl(title, description) {
  const width = '1280';
  const height = '640';
  let tagLineText = '';
  const imageConfig = [
    `w_${width}`,
    `h_${height}`,
    'q_auto:best',
    'c_fill',
    'f_jpg',
  ].join(',');

  const titleConfig = [
    `w_${TEXT_AREA_WIDTH}`,
    'c_fit',
    `co_rgb:${TEXT_COLOR}`,
    'g_south_west',
    `x_${TEXT_LEFT_OFFSET}`,
    `y_${TITLE_BOTTOM_OFFSET}`,
    `l_text:${TITLE_FONT}_${TITLE_FONT_SIZE}_bold:${cloudinarySafeText(title)}`,
  ].join(',');

  if (description.trim()) {
    const taglineConfig = [
      `w_${TEXT_AREA_WIDTH}`,
      'c_fit',
      `co_rgb:${TEXT_COLOR}`,
      'g_north_west',
      `x_${TEXT_LEFT_OFFSET}`,
      `y_${TAGLINE_TOP_OFFSET}`,
      `l_text:${TITLE_FONT}_${TAGLINE_FONT_SIZE}_line_spacing_${TAGLINE_LINE_HEIGHT}:${cloudinarySafeText(description)}`,
    ].join(',');
    tagLineText = `${taglineConfig}/`;
  }

  return `${BASE_URL}${imageConfig}/${titleConfig}/${tagLineText}${FOLDER}${SHARE_IMAGE_FILE}`;
}

module.exports = {
  srcset: getSrcset,
  src: getSrc,
  socialImage: socialImageUrl,
  image,
  defaultSizes: () => '(min-width: 684px) 618px, 90.4vw',
};
