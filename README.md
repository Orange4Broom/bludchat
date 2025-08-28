# BludChat

A modern, real-time chat application built with React and Firebase, featuring Google authentication, room-based messaging, friend management, and a responsive design.

## 🚀 Features

- **Google Authentication**: Secure sign-in using Google accounts
- **Real-time Chat**: Instant messaging in chat rooms
- **Room Management**: Create, join, and manage chat rooms
- **Friend System**: Add friends and start private conversations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **File Sharing**: Support for file uploads and sharing
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Offline Support**: Persistent local caching for better performance

## 🛠️ Technologies Used

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **SCSS/Sass** - Advanced CSS preprocessing
- **React Toastify** - User notification system
- **AOS (Animate On Scroll)** - Smooth scroll animations
- **FontAwesome** - Icon library

### Backend & Services

- **Firebase Authentication** - Google OAuth integration
- **Firestore** - NoSQL cloud database with offline persistence
- **Firebase Storage** - File storage and management

### Development Tools

- **ESLint** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Vite TSConfig Paths** - Path alias support

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 16 or higher)
- **Yarn** package manager (or npm)
- **Google Firebase account** for backend services

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bludchat.git
cd bludchat
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Firebase Configuration

You'll need to set up your own Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Google sign-in
4. Create a Firestore database
5. Enable Storage
6. Get your Firebase configuration

Update the Firebase configuration in `src/firebase/firebase.ts` with your own credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id",
};
```

### 4. Run the Application

#### Development Mode

```bash
yarn dev
```

The app will be available at `http://localhost:5173`

#### Build for Production

```bash
yarn build
```

#### Preview Production Build

```bash
yarn preview
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── blocks/         # Main feature components
│   │   ├── chatRoom/   # Chat room functionality
│   │   ├── friendList/ # Friend management
│   │   └── roomList/   # Room listing and management
│   └── elements/       # Reusable UI elements
├── hooks/              # Custom React hooks
├── firebase/           # Firebase configuration
├── typings/            # TypeScript type definitions
└── images/             # Static assets
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint for code quality

## 🌟 Key Features Explained

### Authentication

- Google OAuth integration for secure user authentication
- Automatic user profile creation in Firestore
- Persistent login state

### Chat Rooms

- Create and join chat rooms
- Real-time messaging with Firestore
- Room member management
- File sharing capabilities

### Friend System

- Add and remove friends
- Start private conversations
- Friend list management

### Responsive Design

- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Ensure you've followed the setup instructions correctly

## 🔮 Future Enhancements

- End-to-end encryption
- Voice and video calls
- Message reactions and replies
- Advanced search functionality
- Dark/light theme toggle
- Push notifications
- Multi-language support

---

Built with ❤️ using React and Firebase
