export const metadata = {
  title: 'Alfalfa — Signal Intelligence',
  description: 'Live crypto signals. Meteora LP. Wallet tracking. By Cadence.',
}

export default function MiniAppLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0a" />
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { height: 100%; }
          body { height: 100%; background: #0a0a0a; color: #e8e0d0; font-family: -apple-system, 'SF Pro Text', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          button { font-family: inherit; outline: none; -webkit-tap-highlight-color: transparent; }
          a { color: inherit; }
          ::-webkit-scrollbar { display: none; }
          .ton-connect-button { all: unset; }
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
