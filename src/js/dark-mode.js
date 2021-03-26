(() => {
  const Themes = {
    Dark: 'dark',
    Light: 'light'
  };
  const ModeLabel = {
    dark: 'luminoso',
    light: 'oscuro'
  };
  const Key = 'theme';

  const root = document.documentElement;
  let currentTheme = root.dataset.theme;
  const button = document.querySelector('.color-scheme-toggler');
  const getLabel = () => `Cambiar a modo ${ModeLabel[currentTheme]}`;

  const onButtonClick = () => {
    const newTheme = currentTheme === Themes.Dark ? Themes.Light : Themes.Dark;

    currentTheme = newTheme;
    root.dataset.theme = newTheme;
    localStorage.setItem(Key, newTheme);
    button.setAttribute('aria-label', getLabel());
    button.dispatchEvent(new CustomEvent('changeTheme', {
      detail: {
        theme: newTheme
      },
      bubbles: true,
      cancelable: false
    }));
  };

  button.setAttribute('aria-label', getLabel());
  button.addEventListener('click', onButtonClick);
})();
