# Decisions API

## 📖 Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Cloning this repository](#cloning)
  - [Installing dependencies](#dependencies)
- [Database Management](#database-management)
  - [Database setup](#database-setup)
  - [Database seeding](#database-seeding)
  - [Running a local server](#running-a-local-server)
- [Special Thanks](#special-thanks)

## ❓ About <a name = "about"></a>

This RESTful API has been built to access application data programmatically using CRUD operations.

The intention is to create a dynamic system for storing and sharing user-generated data, which provides information to frontend architecture. 

It allows a client to perform create, read, update and delete (CRUD) operations on user accounts (with appropriate permissions!) and user groups, as well as customising personal lists of options to use in collaborative decision-making processes with other users. It accepts complex database queries using parametric endpoints, manipulating data to sort and filter the response.

The project has been designed with the Model View Controller (MVC) pattern, and developed using Test-Driven Development (TDD).

A hosted version of this project is [available online here](https://decisions-api-vlyb.onrender.com/api).

The frontend component of this project [can be viewed here](https://github.com/dhiransodha/decisions-fe)

**Please be patient when clicking links for live versions, as they can take a minute or two to spin up for the first time!**

_Please note: Your browser may require an extension to format the JSON file to be a little easier to read. For Chrome users, [this one](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en&pli=1) comes highly recommended!_

## 🚀 Getting Started <a name = "getting-started"></a>

These instructions will get a copy of this project running on your local machine for development and testing purposes.

Further documentation on API endpoints, schemas & more can be viewed [in our GitBook](https://app.gitbook.com/o/9FGTwThaMGurW0n6vxZB/s/ijTpUNRfiUUA7V7rmX39/introduction/about)

### ⛏️ Prerequisites <a name = "prerequisites"></a>

We need to create a clone of the repository, install some dependencies and set up our testing and development databases.

This API uses Node.js and MongoDB for database interactions, so please ensure your installation meets the following minimum requirements:

```bash
- Node v22.8.0
- MongoDB v6.12.0
```

### 🐏 Cloning this repository <a name = "cloning"></a>

Open your terminal, navigate to the directory where you'd like to copy this repo, and run the following command:

```bash
git clone https://github.com/smlbrd/decisions-api.git
```

### ⛓️ Installing dependencies <a name = "dependencies"></a>

To run this API, we'll need to install some dependencies using the following terminal command:

```bash
npm install
```

## 🗄 Database Management <a name = "database-management"></a>

### 📂 Database setup <a name = "database-setup"></a>

To set up test and development databases and run this API, create these 2 files in the root of your directory:

- `.env.test`

  - This file should contain: `MONGODB_URI`

- `.env.development`
  - This file should contain: `MONGODB_URI`

Now we're ready to seed our databases!

### 🌱 Database seeding <a name = "database-seeding"></a>

Now we have our databases set up, we can seed them with the following command:

```bash
npm run [DEV DATABASE SEED COMMAND]
```

## 🧪 Testing <a name = "testing"></a>

The test suite for this project can be run with the following command:

```bash
npm test
```

## 🧑‍💻 Running a local server <a name = "running-a-local-server"></a>

That's it - you're good to go! Run the following command to start your local server:

```bash
npm start
```

Have fun, and thank so much for taking a look at our work! 🙌

## 🎉 Special Thanks <a name = "special-thanks"></a>

This project gratefully depends on the work of:

- [dotenv](https://github.com/motdotla/dotenv#readme)
- [koa.js](https://koajs.com/)
- [jest](https://jestjs.io/)
- [mongoDB Atlas](https://www.mongodb.com/atlas)
- [mongoDB](https://www.mongodb.com/)
- [mongoose](https://mongoosejs.com/)
- [node.js](https://nodejs.org/en)
- [nodemon](https://nodemon.io/)
- [render](https://render.com/)

---

This group project was built by [Abby Davis](https://github.com/absydavsy), [Alexandre Izumi](https://github.com/alexizumi), [Dhiran Sodha](https://github.com/dhiransodha), [James Sewter](https://github.com/JamesSewter), [Wren Hawthorne](https://github.com/smlbrd) & [Zeineb Mukhtar](https://github.com/ZeiMu) as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
