	
The Chinese University of Hong Kong places very high importance on honesty in academic work submitted by students, and adopts a policy of zero tolerance on academic dishonesty. While "academic dishonesty" is the overall name, there are several sub-categories as follows:

(i)	Plagiarism
(ii)	Undeclared multiple submissions
(iii)	Employing or using services provided by a third party to undertake ones’ submitted work, or providing services as a third party
(iv)	Distribution/ Sharing/ Copying of teaching materials without the consent of the course teachers to gain unfair academic advantage in the courses
(v)	Violating rules 15 or 16 of the University's Examination Rules (Annex 1) or rule 9 or 10 of the University's Online Examination Rules (Annex 2)
(vi)	Cheating in tests and examinations (including violation of rules 17 or 18 of the University’s Examination Rules or rule 11, 12, 13, 14 or 16 of the University's Online Examination Rules)
(vii)	Impersonation fraud in tests and examinations (including violation of rule 19 of the University's Examination Rules or rule 15 of the University's Online Examination Rules)
(viii)	All other acts of academic dishonesty
Any related offence will lead to disciplinary action including termination of studies at the University.

Everyone should make himself/herself familiar with the content of this website and thereby help avoid any practice that would not be acceptable.

# Project Name

CSCI2720 Project

## Getting Started

These instructions will help you set up the project on your local machine.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm: Comes with Node.js installation
- MongoDB: [Download and Install MongoDB](https://www.mongodb.com/try/download/community)

### Installing Dependencies

To set up the front-end, run the following command in your terminal:

```bash
cd front-end
npm install
npm start
```

To set up the back-end, run the following command in your terminal:

```bash
cd back-end
npm install
node server.js
```

#### URL
```http://localhost:3000/```

#### Handle MongoDB Error

You can ignore this if you don't meet error.

As I said in Whatsapp, it can be solved by changing localhost to 127.0.0.1 in server.js. However, here is the alternative way.

At

```bash
C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg
```

Change

```bash
net:
  port: 27017
  bindIp: 127.0.0.1
```

To

```bash
net:
  port: 27017
  bindIp: 127.0.0.1,::1
  ipv6: true
  bindIpAll: true
```
You may need to restart MongoDB after changes.

# Admin Panel Guide

Welcome to the Admin Panel of our website! This guide will help you navigate through the panel and manage events and users effectively.

## Getting Started

After logging in as an administrator, you will be directed to the admin dashboard. The dashboard is divided into two main sections: Event Management and User Management.

### Event Management

In this section, you can create, view, update, and delete events.

#### Creating an Event

1. Fill in the event details in the provided form fields (Event ID, Title, Venue ID, Date, Description, Presenter, and Price).
2. Click the 'Create Event' button to add the event to the system.

#### Viewing Events

- All the events are listed in the table below the event form. You can view all the details of each event here.

#### Updating an Event

1. To update an event, first locate the event in the table.
2. Change the details in the form fields to the updated values.(the update form field is same with the create one)
3. Click the 'Update' button next to the corresponding event.

#### Deleting an Event

- To delete an event, find the event in the table and click the 'Delete' button next to it.

### User Management

This section allows you to manage user accounts. (similar to event)

#### Creating a User

1. Fill in the user details in the form fields (Username and Password).
2. Click the 'Create User' button to add the user to the system.

#### Viewing Users

- All users are displayed in the table below the user form. You can see the username and password for each user.

#### Updating a User

1. To update a user, find the user in the user table.
2. Change the details in the form fields to the new values. (the update form fieldd is same with the create one)
3. Click the 'Update' button next to the corresponding user.

#### Deleting a User

- To delete a user, find the user in the table and click the 'Delete' button next to their name.

### Logging Out

- You can log out of the admin panel at any time by clicking the 'Logout' button located at the top of the page.

## Support

If you encounter any issues or have questions, please contact 1155174712.

Thank you for using our admin panel!

