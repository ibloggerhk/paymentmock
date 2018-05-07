![](https://raw.githubusercontent.com/ibloggerhk/paymentmock/master/animate.gif)

***Payment Mock*** 
=======================

**Video Demo**: https://raw.githubusercontent.com/ibloggerhk/paymentmock/master/video_demo.mov

**Live Demo**: https://enigmatic-mountain-19044.herokuapp.com

A payment gateway mock, that could handle payments with Paypal

When I started this test, my focus was on **simplicity** and support **heroku** .


### System Flow
![](https://raw.githubusercontent.com/ibloggerhk/paymentmock/master/systemflow.png)


Prerequisites
-------------

- [MongoDB](https://www.mongodb.org/downloads)
- [Node.js 8.0+](http://nodejs.org)
Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone https://github.com/ibloggerhk/paymentmock-starter.git myproject

# Change directory
cd myproject

# Install NPM dependencies
npm install

# Then simply start your app
node app.js
```
**Make sure you’ve set MONGODB_URI and paypal config in .env**

Project Structure
-----------------

| Name                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| **views**/app.ejs                 | Home page template.                                          |
| .env.                              | Paypay development clinet id and database URI.           |
| app.js                             | The main application file.                                   |
| package.json                       | NPM dependencies.                                            |


List of Packages
----------------

| Package                         | Description                                                             |
| ------------------------------- | ------------------------------------------------------------------------|
| body-parser                     | Node.js body parsing middleware.                                        |
| dotenv                          | Loads environment variables from .env file.                             |
| express                         | Node.js web framework.                                                  |
| mongoose                        | MongoDB ODM.                                                            |
| paypal-rest-sdk                 | PayPal APIs library.                                                    |
