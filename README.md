# Task App

An Task (Todo) mobile application built using **React Native**, **Expo** and **Firebase** for user authentication, authorization, and Data Storage. The app provides a seamless Tasks management with features like Adding, Updating, and Deletion of taks. The app integrates state management using Redux and navigation with React Navigation.

## 🖼 Screenshots

| Sign In                                     | Sign Up                                   | Sign In                                    |
|---------------------------------------------|-------------------------------------------|--------------------------------------------|
| ![Sign In Screen](https://github.com/faiziop05/Task-App/blob/main/UI%20images/Screenshot_1727957016.png) | ![Sign Up Screen](https://github.com/faiziop05/Task-App/blob/main/UI%20images/Screenshot_1727957022.png) | ![Sign In](https://github.com/faiziop05/Task-App/blob/main/UI%20images/Screenshot_1727957049.png) |

| Home Screen                                 | Task Screen                               | Add Task Screen                            | All Tasks by Date                          |       
|---------------------------------------------|-------------------------------------------|--------------------------------------------|--------------------------------------------|
| ![Home Screen](https://github.com/faiziop05/Task-App/blob/main/UI%20images/Screenshot_1727958203.png) | ![Task Screen](https://github.com/faiziop05/Task-App/blob/main/UI%20images/Screenshot_1727957901.png) | ![Add Task Screen](https://github.com/faiziop05/Task-App/blob/main/UI%20images/Screenshot_1727957281.png) | ![All Tasks](https://github.com/faiziop05/Task-App/blob/main/UI%20images/Screenshot_1727957539.png) 


## 📜 Features

- 📝 **Task Management:** Add, update, and delete tasks easily.
- 📅 **Task Exploration:** Browse upcoming and previous tasks to stay organized.
- 💾 **Local Storage:** Stores tasks locally using AsyncStorage for offline access.
- 🔄 **State Management:** Integrated Redux for efficient state handling.
- 🔍 **Smooth Navigation:** Utilizes React Navigation for seamless app transitions.
- 🔐 **Firebase Authentication:** Secure user login and signup using Firebase Authentication.
- ☁️ **Cloud Storage:** All tasks and user data are stored in Firebase for real-time synchronization across devices.

## 🛠 Packages Used

Here’s a list of major packages and technologies used in the app:

- **React Native**: `react-native 0.74.5`
- **Expo**: `expo 51.0.28`
- **React Navigation**: `@react-navigation/native 6.1.18`, `@react-navigation/bottom-tabs 6.6.1`, `@react-navigation/stack 6.4.1`
- **Redux Toolkit**: `@reduxjs/toolkit 2.2.7`
- **Async Storage**: `@react-native-async-storage/async-storage 2.0.0`
- **Expo Google Fonts**: `@expo-google-fonts/inter 0.2.3`
- **DateTime Picker**: `@react-native-community/datetimepicker 8.0.1`
- **Expo Network**: `expo-network 6.0.1`

## 🚀 Installation and Setup

To get a local copy of the project up and running, follow these steps:

### Prerequisites

- Ensure that you have **Node.js** and **npm** installed on your machine.
- Install **Expo CLI** globally if you haven’t already:
  ```bash
  npm install -g expo-cli
## Installation
- Clone the project files
Navigate into the project directory:
```bash
  cd ToDo
```
Install the required dependencies:
```bash
  npm install
```
Start the Expo development server:
```bash
  npm start
```
## Running the App
You can run the app on different platforms:

Android:
```bash
  npm run android
```
iOS (only on macOS):
```bash
  npm run ios
```
Web:
```bash
npm run web
```
## Building the App
For a production-ready build, you can use Expo’s build tools:
```bash
  expo build:android
  expo build:ios
```
## 🤝 Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📧 Contact
If you have any questions or suggestions, feel free to contact me:

Email: faizanhanif369@gmail.com

© 2024 Faizan Hanif
