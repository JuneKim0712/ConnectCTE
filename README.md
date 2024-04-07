<p align="center">
  <img src="https://github.com/JuneKim0712/FBLA23/blob/main/public/asset/logo-only.png" width="100" />
</p>
<p align="center">
    <h1 align="center">Connect CTE</h1>
</p>
<p align="center">
    <em>Connect CTE: Store buissness and community partners data easily and safely.</em>
</p>
Website: fbla23jk.web.app
<p align="center">
	<img src="https://img.shields.io/github/license/JuneKim0712/FBLA23?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/JuneKim0712/FBLA23?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/JuneKim0712/FBLA23?style=flat&color=0080ff" alt="repo-top-language">
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/Firebase-FFCA28.svg?style=flat&logo=Firebase&logoColor=black" alt="Firebase">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/Mocha-8D6748.svg?style=flat&logo=Mocha&logoColor=white" alt="Mocha">
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
	<img src="https://img.shields.io/badge/Ajv-23C8D2.svg?style=flat&logo=Ajv&logoColor=white" alt="Ajv">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
    	<img src="https://img.shields.io/badge/Bootstrap-563D7C?&logo=bootstrap&logoColor=white" alt="Bootrap">
	<img src="https://img.shields.io/badge/Vscode-007ACC?&logo=visualstudiocode&logoColor=white" alt="Vscode">

</p>
<hr>

##  Quick Links

> - [ Overview](#-overview)
> - [ Features](#-features)
> - [ Repository Structure](#-repository-structure)
> - [ Files ](#-Files)
> - [ Getting Started](#-getting-started)
>   - [ Tests](#-tests)
> - [ License](#-license)
> - [ Acknowledgments](#-acknowledgments)

---

##  Overview

Connect CTE is a web application designed for Connect CTE partners to manage and access crucial data efficiently. Utilizing Firebase for user authentication and Firestore for database management, the platform ensures secure operations for verified users based on their roles, maintaining data integrity and access control. The project focuses on showcasing user-friendly interfaces and seamless user experiences, with features like fetching server items for dynamic content, managing database indexes for optimal performance, and handling user authentication seamlessly. By combining a robust backend architecture with polished frontend elements like CSS styling and interactive UI components, Connect CTE offers a valuable solution for partners to engage with Connect CTE resources effortlessly.

---

##  Features

|   | Feature          | Description                                                                                       |
|---|------------------|---------------------------------------------------------------------------------------------------|
| ⚙️ | **Architecture** | The project has a modular architecture with various dependencies like `firebase`, `js-yaml`, `mocha`, `bootstrap`.                          |
| 🔩 | **Code Quality** | The codebase uses `eslint` to enforce style, uses `mocha` to test features and be bug free. Indicating a focus on maintaining code quality standards. |
| 📄 | **Documentation**| Readme.md file and comments within the code for easier understanding of the code.        |
| 🧪 | **Testing**      | Testing frameworks utilized are `mocha` and `eslint`, emphasizing a focus on code quality assurance. |
| 🛡️ | **Security**     | Safe access using firebase authentication using google sign in and firestore.rules.          |
| 📦 | **Dependencies** | Key dependencies include `firebase`, `bootstrap`, `mocha`, and more.                                |

---

##  Repository Structure

```sh
└── FBLA23/
    ├── LICENSE
    ├── README.md
    ├── .eslintrc.js
    ├── firebase.json
    ├── firestore.indexes.json
    ├── firestore.rules
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── asset
    │   │   ├── connect_cte-white.png
    │   │   ├── connect_cte.png
    │   │   └── logo-only.png
    │   ├── help.html
    │   ├── home.html
    │   ├── index.html
    │   ├── script.js
    │   ├── app.js
    │   └── styles.css
    └── test
        ├── package-lock.json
        ├── package.json
        └── test.js
```

---

##  Files

<details closed><summary>.</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                                                                                                         |
| ---                                                                                                | ---                                                                                                                                                                                                                                                                                                                                             |
| [package.json](https://github.com/JuneKim0712/FBLA23/blob/master/package.json)                     |  Gives current information of project's necessary libraries and tools it needs to work correctly.                                                                                                                                                 |
| [firebase.json](https://github.com/JuneKim0712/FBLA23/blob/master/firebase.json)                   | Code snippet in `firebase.json` manages Firestore rules & hosting config, setting up necessary ports for emulators. It ensures secure data access & deploys web app correctly.                                                                                                                                                                  |
| [firestore.rules](https://github.com/JuneKim0712/FBLA23/blob/master/firestore.rules)               | Code snippet in firestore.rules governs Firestore database access for partners collection based on user roles, verifying partner data integrity and validity while ensuring restricted operations for verified users in the parent repository architecture.                                                                                     |
| [package-lock.json](https://github.com/JuneKim0712/FBLA23/blob/master/package-lock.json)           | Code snippet: Gives current information on the dependencies or packages installed for a node. js project, including their exact version numbers. |
| [firestore.indexes.json](https://github.com/JuneKim0712/FBLA23/blob/master/firestore.indexes.json) | Code Summary: This snippet manages Firestore indexes & field overrides. Vital for optimizing database performance & customizing schema for the parent repository's Firestore architecture.                                                                                                                                                    |

</details>

<details closed><summary>public</summary>

| File                                                                              | Summary                                                                                                                                                                                                                             |
| ---                                                                               | ---                                                                                                                                                                                                                                 |
| [styles.css](https://github.com/JuneKim0712/FBLA23/blob/master/public/styles.css) | Code snippet in public/styles.css resets default CSS properties for consistent styling across the web app. It configures layout, typography, and color scheme, enhancing user experience throughout the platform.                   |
| [index.html](https://github.com/JuneKim0712/FBLA23/blob/master/public/index.html) | Code in public/index.html sets up Connect CTE's landing page, allows user to login into website.              |
| [script.js](https://github.com/JuneKim0712/FBLA23/blob/master/public/script.js)   | Code in public/script.js drives user authentication via Firebase in the FBLA23 repository. It redirects users to index.html when signed in, improving user experience and security.                                                 |
| [home.html](https://github.com/JuneKim0712/FBLA23/blob/master/public/home.html)   | Code in public/home.html: Initialize Firebase Auth, Firestore, and Functions, enabling user authentication and real-time database updates. Enhances user experience by handling authentication and data synchronization seamlessly. |
| [help.html](https://github.com/JuneKim0712/FBLA23/blob/master/public/help.html)   | Code in `public/help.html` enhances UI by displaying Connect CTE information.                                                                       |
| [app.js](https://github.com/JuneKim0712/FBLA23/blob/master/public/app.js)         | Code snippet in public/app.js manages user authentication and Firestore database connections. Handles user sign-in/out UI state changes. Key elements: authentication, Firestore DB. Supports user interaction on web app.          |

</details>

<details closed><summary>test</summary>

| File                                                                                          | Summary                                                                                                                                                                                                                                           |
| ---                                                                                           | ---                                                                                                                                                                                                                                               |
| [test.js](https://github.com/JuneKim0712/FBLA23/blob/master/test/test.js)                     | Emulates behavior of the code using `mocha` and test the if the code is error free and does all necessary functionality.                                                                                                       |

</details>

---

## Website URL
[fbla23jk.web.app](https://fbla23jk.web.app/index.html)

---

##  Getting Started

If you want to make changes to the code:

***Requirements***

Ensure you have the following dependencies installed on your system:

* **firebase**: `version 13.5.2`
* **mocha**: `version 10.3.0`
* **node.js**: `version 20.11.0`
* **avj**: `version 6.12.4`



###  Installation

1. Clone the FBLA23 repository:

```sh
git clone https://github.com/JuneKim0712/FBLA23
```

2. Change to the project directory:

```sh
cd FBLA23
```

3. Install the dependencies:

```sh
> npm install -g firebase-tools
> npm install -g mocha
> npm install -g avj
```

###  Tests

To execute tests, run:

```sh
> npm run test
```

---

##  License

This project is protected under the [GPL-3.0](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

##  Copyright Information
The Connect CTE website was created entirely by Junwoo Kim and Gabriel Atienza. The website was developed through Visual Studio Code by Microsoft Corporation.

The Logo of Connect CTE was created entirely by Gabriel Atienza using Canva Pty Ltd.

Firebase by Alphabet Inc. was used to store the website's data, including information about the school's career and technical education department's business and community partners and permission to access individual email accounts.

Firebase, through Google Analytics for Firebase, may log user actions such as click events, average engagement time, app stability, and more.
                        
Any analytical data collected on the user can not be used to identify the user in any way.                         

The App does not question the user for any personal information and does not log or store any personal information relating to the user locally or in an online backend.

Firebase is a trademark of Google, LLC.
                        
Google Analytics is a trademark of Google, LLC.

