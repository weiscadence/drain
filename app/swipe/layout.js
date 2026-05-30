// Isolated layout for the mini app - no wallet wrapper, no global nav
// Forces full viewport height for Telegram Mini App

export const metadata = {
  title: 'drain.fun — swipe',
  description: 'Tinder for memecoins',
  other: {
    'telegram-web-app': 'true',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function SwipeLayout({ children }) {
  return children;
}
