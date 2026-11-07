import { defineEcConfig, setLuminance, setAlpha } from 'astro-expressive-code'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'

// https://expressive-code.com/reference/configuration/
export default defineEcConfig({
  /* Basics */
  defaultLocale: 'en-US',
  defaultProps: {
    wrap: false,
    preserveIndent: true,
    showLineNumbers: false,
    collapseStyle: 'collapsible-auto',
  },
  // Every token at least 5.5:1 against the code background (WCAG AA with margin).
  minSyntaxHighlightingColorContrast: 5.5,

  /* Plugins */
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],

  /* Styles: Geist's code block, a hairline frame on the page's second background */
  styleOverrides: {
    borderColor: 'var(--ds-gray-alpha-400)',
    borderRadius: '6px',
    uiFontFamily: 'var(--font-sans)',
    uiFontSize: '0.8125rem',
    // concrete colours, not tokens: the contrast check above needs to read them
    codeBackground: ({ theme }) =>
      theme.type === 'dark' ? '#000000' : '#fafafa',
    codeFontFamily: 'var(--font-mono)',
    codeFontSize: '0.8125rem',
    codeLineHeight: '1.65',
    codePaddingBlock: '1rem',
    codePaddingInline: '1rem',
    focusBorder: 'var(--ds-blue-700)',

    /* Editor & Terminal Frames */
    frames: {
      frameBoxShadowCssValue: 'none',
      editorTabBarBackground: 'var(--ds-background-100)',
      editorTabBarBorderBottomColor: 'var(--ds-gray-alpha-400)',
      editorActiveTabBackground: 'var(--ds-background-100)',
      editorActiveTabForeground: 'var(--ds-gray-1000)',
      editorActiveTabIndicatorTopColor: 'transparent',
      editorActiveTabIndicatorBottomColor: 'var(--ds-gray-1000)',
      editorBackground: ({ theme }) =>
        theme.type === 'dark' ? '#000000' : '#fafafa',
      terminalTitlebarBackground: 'var(--ds-background-100)',
      terminalTitlebarForeground: 'var(--ds-gray-900)',
      terminalTitlebarBorderBottomColor: 'var(--ds-gray-alpha-400)',
      terminalTitlebarDotsForeground: 'var(--ds-gray-500)',
      terminalTitlebarDotsOpacity: '1',
      terminalBackground: ({ theme }) =>
        theme.type === 'dark' ? '#000000' : '#fafafa',
      inlineButtonBackgroundActiveOpacity: '0.2',
      inlineButtonBackgroundHoverOrFocusOpacity: '0.1',
      tooltipSuccessBackground: ({ theme }) =>
        setLuminance(theme.colors['terminal.ansiGreen'] || '#0dbc79', 0.22),
    },

    /* Text & Line Markers */
    textMarkers: {
      backgroundOpacity: '0.25',
      borderOpacity: '0.5',
    },

    /* Collapsible Sections */
    collapsibleSections: {
      closedBackgroundColor: ({ theme }) =>
        setAlpha(theme.colors['editor.foldBackground'], 0.06) ||
        'rgb(84 174 255 / 20%)',
    },
  },

  /* Theme */
  themes: ['github-dark-default', 'github-light-default'],
  themeCssRoot: ':root',
  themeCssSelector: (theme) =>
    theme.name === 'github-dark-default' ? ':root.dark' : ':root:not(.dark)',
  useDarkModeMediaQuery: false,
  useStyleReset: false,
})
