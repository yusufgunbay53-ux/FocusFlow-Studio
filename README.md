# FocusFlow Studio

AI destekli görev ve odaklanma asistanı.

- Dark neon UI (`#0b111e` / `#00d2ff`) + glassmorphism
- Sürükle-bırak Kanban (Yapılacaklar / Yapılıyor / Tamamlandı)
- 25/5 Pomodoro, tarayıcı bildirimi + chime
- Lo-Fi ve yağmur ambient (Web Audio, harici dosya yok)
- Mock AI performans koçu (API’ye hazır `coachFromApi`)
- `localStorage` kalıcılığı
- PWA manifest + service worker

## Çalıştır

```bash
npm install
npm run dev
```

Üretim:

```bash
npm run build
npm run preview
```

## Veri modeli

`src/lib/models.js` içinde Task / Session / Stats şemaları var. İleride Supabase veya Firebase’e aynı JSON ile bağlanabilir.

## Stack

React 18 · Vite · Tailwind CSS · Lucide · @dnd-kit
