// Declarações de tipo para arquivos CSS e Tailwind
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }
  
  declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  // Extensões para Tailwind CSS
  declare module 'tailwindcss/lib/util/flattenColorPalette' {
    const flattenColorPalette: (colors: any) => any;
    export default flattenColorPalette;
  }
  
  declare module 'tailwindcss/plugin' {
    const plugin: any;
    export default plugin;
  }