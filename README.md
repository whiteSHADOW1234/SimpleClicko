# Clicko

Welcome to Clicko, your go-to platform for organizing and participating in campaign events. Clicko provides a comprehensive solution for managing contests, tracking user rankings, and even ordering coffee beans through its integrated online shop. This repository contains the source code for the Clicko website, built using React for the front end and Firebase as the backend.

## Features:

1. **Contest Creation:** Users can raise contests utilizing the Glicko ranking system. This feature allows users to create and manage contests efficiently. The Glicko ranking system ensures fair competition among participants.

2. **Complete User Ranking:** Clicko provides a comprehensive ranking system that displays the rankings of all users participating in various contests. This feature allows users to track their progress and compare their performance with others.

3. **Online Shop:** An integrated online shop allows users to order coffee beans conveniently. This feature enhances user engagement by offering additional services related to the campaign event theme.

4. **Responsive Design:** Clicko is built with a responsive design, ensuring seamless user experience across different devices and screen sizes. Users can access the site from desktops, tablets, and mobile devices without compromising functionality or aesthetics.

## Technologies Used:

- **React:** The front end of Clicko is built using React, a popular JavaScript library for building user interfaces. React provides a modular and efficient way to develop interactive UI components.

- **Firebase:** Firebase is utilized as the backend platform for Clicko. It offers various services such as authentication, real-time database, and cloud functions. Firestore API is specifically used to interact with the cloud database, providing a scalable and reliable backend infrastructure.

## Getting Started:

To run Clicko locally, follow these steps:

1. Fork this repository and clone it to your local machine.
   ```bash
   git clone https://github.com/your-username/clicko.git
   ```

2. Navigate to the project directory.
   ```bash
   cd clicko
   ```

3. Install dependencies using npm.
   ```bash
   npm install
   ```

4. Configure Firebase:
   - Create a Firebase project on the Firebase console.
   - Enable Firestore database service.
   - Set up Firebase authentication if required.
   - Obtain your Firebase configuration credentials.

5. Update Firebase configuration:
   - Locate and open the Firebase configuration file (`src/backend/firebase.js`).
   - Replace the placeholder values with your Firebase configuration credentials.
   - Code in `firebase.js` should look like this :point_down:
        ```javascript
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "firebase/app";
        import { getAuth } from "firebase/auth";
        import { getFirestore } from "firebase/firestore";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        // Initialize Firebase Authentication and get a reference to the service
        export const auth = getAuth(app);

        // Initialize Firestore and get a reference to the service
        export const db = getFirestore(app);
        ```

6. Start the development server.
   ```bash
   npm start
   ```

7. Access Clicko in your browser by visiting `http://localhost:3000`.

## Contributing:

Contributions to Clicko are welcome. To contribute, please follow these guidelines:

1. Fork the repository and create your branch.
2. Make your changes and ensure they are well-tested.
3. Create a pull request with a clear description of your changes.

## License:

This project is licensed under the MIT License. Feel free to modify and distribute the code for your own purposes.