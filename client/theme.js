const themes = {
  default: {
    "--primary": "#7c3aed",
    "--primary-dark": "#5b21b6",
    "--accent": "#06b6d4",
  },
  frontend: {
    "--primary": "#8b5cf6",
    "--primary-dark": "#6d28d9",
    "--accent": "#06b6d4",
  },
  backend: {
    "--primary": "#0ea5a4",
    "--primary-dark": "#0f766e",
    "--accent": "#7c3aed",
  },
  "data-science": {
    "--primary": "#06b6d4",
    "--primary-dark": "#0891b2",
    "--accent": "#7c3aed",
  },
};

function applyTheme(themeName) {
  const theme = themes[themeName] || themes.default;
  for (const [key, value] of Object.entries(theme)) {
    document.documentElement.style.setProperty(key, value);
  }
  localStorage.setItem("theme", themeName);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "default";
  applyTheme(savedTheme);
}

document.addEventListener("DOMContentLoaded", loadTheme);
