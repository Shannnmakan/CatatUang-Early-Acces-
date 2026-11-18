$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

$appJsx = [System.IO.File]::ReadAllText("src\App.jsx", [System.Text.Encoding]::UTF8)

# Transform for Babel standalone
$appJsx = $appJsx -replace "import \{ useState, useMemo, useEffect, useRef \} from 'react'", "const { useState, useMemo, useEffect, useRef } = React;"
$appJsx = $appJsx -replace "export default function App\(\)", "function App()"

$htmlHeader = @'
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>CatatUang - Expense Tracker (Neobrutalism)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <!-- Firebase SDK (App & Auth) -->
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
    <script>
      const firebaseConfig = {
        apiKey: "AIzaSyATAzQfxwkq7F04zn4dtKPUWtcdc6KOZWY",
        authDomain: "catat-uang-app-62c98.firebaseapp.com",
        projectId: "catat-uang-app-62c98",
        storageBucket: "catat-uang-app-62c98.firebasestorage.app",
        messagingSenderId: "575796302424",
        appId: "1:575796302424:web:5077cf2868958d0799702d",
        measurementId: "G-NMVEY5YF6W"
      };
      if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
    </script>
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "neo-yellow": "#fef08a",
              "neo-lime": "#bef264",
              "neo-peach": "#fed7aa",
              "neo-lilac": "#ddd6fe",
              "neo-pink": "#fbcfe8",
              "neo-cream": "#fef9f3",
              "neo-dark": "#1b1b1d",
              "neo-orange": "#fed7aa",
              "neo-purple": "#ddd6fe",
              "neo-blue": "#bae6fd",
              "neo-coral": "#fca5a5",
              "neo-card": "#ffffff"
            },
            fontFamily: {
              headline: ["Syne", "sans-serif"],
              display: ["Space Grotesk", "sans-serif"],
              body: ["Open Sans", "sans-serif"],
              sans: ["Open Sans", "sans-serif"],
              syne: ["Syne", "sans-serif"],
              grotesk: ["Space Grotesk", "sans-serif"],
              jakarta: ["Plus Jakarta Sans", "sans-serif"],
              "body-md": ["Plus Jakarta Sans", "sans-serif"],
              "headline-lg": ["Syne", "sans-serif"],
              "headline-xl": ["Syne", "sans-serif"],
              "label-sm": ["Space Grotesk", "sans-serif"],
              "body-lg": ["Plus Jakarta Sans", "sans-serif"],
              "numeric-display": ["Space Grotesk", "sans-serif"],
              "headline-md": ["Syne", "sans-serif"],
              "label-md": ["Space Grotesk", "sans-serif"],
              "headline-sm": ["Syne", "sans-serif"],
              "label-lg": ["Space Grotesk", "sans-serif"],
              "body-sm": ["Plus Jakarta Sans", "sans-serif"]
            },
            boxShadow: {
              brutal: "3px 3px 0px #000000",
              "brutal-lg": "4px 4px 0px #000000",
              "brutal-xl": "6px 6px 0px #000000",
              "brutal-sm": "2px 2px 0px #000000",
              "neo-sm": "2px 2px 0px #000000",
              neo: "3px 3px 0px #000000",
              "neo-lg": "4px 4px 0px #000000",
              "neo-press": "1px 1px 0px #000000"
            }
          }
        }
      }
    </script>
    <style>
      .material-symbols-outlined {
        font-family: 'Material Symbols Outlined' !important;
        font-weight: normal;
        font-style: normal;
        font-size: 20px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
        user-select: none;
      }
      ::-webkit-scrollbar { height: 5px; width: 5px; }
      ::-webkit-scrollbar-thumb { background: #00000040; border-radius: 9999px; }
      .neo-btn { transition: transform 0.1s ease, box-shadow 0.1s ease; }
      .neo-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0px #000000 !important; }
      .pb-safe { padding-bottom: max(env(safe-area-inset-bottom, 16px), 16px); }
      .pt-safe { padding-top: max(env(safe-area-inset-top, 0px), 28px); }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
'@

$htmlFooter = @'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
    </script>
  </body>
</html>
'@

$fullHtml = $htmlHeader + "`n" + $appJsx + "`n" + $htmlFooter

if (!(Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist" -Force | Out-Null
}

[System.IO.File]::WriteAllText("preview-catatuang.html", $fullHtml, $utf8NoBom)
[System.IO.File]::WriteAllText("dist\index.html", $fullHtml, $utf8NoBom)
Write-Output "SUCCESS: Generated preview-catatuang.html and dist\index.html with UTF-8 encoding."
