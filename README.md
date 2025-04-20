# Text: Modern Cross-Platform Chat App 🚀

A beautiful, full-featured chat application built with [Expo](https://expo.dev), [React Native](https://reactnative.dev/), and [Expo Router](https://docs.expo.dev/router/introduction/).
Supports **Android, iOS, and Web** with a single codebase.

---

## ✨ Features

- **Modern Chat UI**
  - Pinned chats with pastel cards, avatars, and last message preview
  - Group and single chat screens with message bubbles, image galleries, and input bar
  - Animated transitions, parallax effects, and haptic feedback
- **Authentication**
  - Animated login/register forms
  - Secure token storage (SecureStore/localStorage)
  - Backend connectivity check
- **Universal Design**
  - Responsive layouts for web and mobile
  - Light & dark mode with theme-aware components
  - Custom fonts and icons
- **Real-Time Communication**
  - WebSocket integration for live chat (see `services/websocket.ts`)
- **Reusable Components**
  - ParallaxScrollView, Collapsible sections, ThemedText/View, HapticTab, HelloWave animation, ExternalLink, and more
- **Developer Experience**
  - File-based routing with Expo Router
  - TypeScript, Jest testing, and linting
  - Easy to extend and customize

---

## 🚦 Quick Start

```bash
# Install dependencies
npm install

# Run on web
npm run web

# Or start Expo Dev Tools for all platforms
npx expo start
```

- Edit files in the `app/` directory to start building your features.
- Use `npm run reset-project` to reset to a blank starter.

---

## 🗂️ Project Structure

```
Text/
├── app/                # File-based routing (Expo Router)
│   ├── auth/           # Authentication screens (login, register)
│   ├── chat/           # Chat list, single chat, group chat
│   └── (tabs)/         # Tab navigation (Explore, Home, etc.)
├── components/         # Reusable UI (ParallaxScrollView, Collapsible, ThemedText, etc.)
├── services/           # API/WebSocket logic
├── hooks/              # Custom hooks (theme, color scheme)
├── constants/          # App-wide constants (colors, etc.)
├── assets/             # Fonts, images, icons
├── package.json        # Project config
└── ...
```

---

## 🖌️ UI/UX Highlights

- **Pinned Chats**: Horizontal scrollable cards, each with unique pastel color, shadow, and avatar.
- **Chat List**: Modern, clean, and responsive with search, avatars, and sectioned chats.
- **Single Chat**:
  - Header with avatar, name, call/video icons
  - Message bubbles (left/right), image gallery, and input bar
  - Fully responsive and theme-aware
- **Explore Tab**: Interactive collapsible sections, parallax header, and links to docs.
- **Animations**:
  - Parallax header (see `ParallaxScrollView`)
  - Waving hand emoji (`HelloWave`)
  - Animated transitions in auth and chat screens

---

## 🛠️ Tech Stack

- **React Native** (0.76+)
- **Expo** (52+)
- **Expo Router** for navigation
- **TypeScript** for type safety
- **Jest** for testing
- **Socket.io-client** for real-time features
- **react-native-reanimated** for animations
- **@expo/vector-icons** and custom fonts

---

## 🌐 Web & Mobile Ready

- Works out of the box on Android, iOS, and Web ([Expo Web](https://docs.expo.dev/workflow/web/))
- Responsive layouts and touch-friendly UI
- Theme-aware (light/dark mode)

---

## 🧩 Notable Components

- `ParallaxScrollView`: Parallax effect for headers
- `Collapsible`: Expand/collapse sections
- `ThemedText` & `ThemedView`: Theme-aware UI
- `HapticTab`: Haptic feedback on tab press (iOS)
- `HelloWave`: Animated emoji
- `ExternalLink`: Smart external links (in-app browser on mobile)

---

## 🔌 Real-Time & API

- `services/websocket.ts`:
  - Connects to a backend WebSocket server for live chat
  - Easily extend for notifications, typing indicators, etc.

---

## 🖍️ Customization

- **Colors**: Edit `constants/Colors.ts` for your palette
- **Fonts**: Add to `assets/fonts/` and load in `_layout.tsx`
- **Images**: Place in `assets/images/` and use in your screens

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Socket.io-client](https://socket.io/docs/v4/client-api/)

---

## 🤝 Community & Contributing

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord](https://chat.expo.dev)
- PRs and issues welcome!

---

> _Built with ❤️ using Expo, React Native, and a passion for beautiful, universal apps._
