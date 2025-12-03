# Blood Donor Management System

### [API Documentation](https://documenter.getpostman.com/view/49556725/2sB3dMxr7U)

Through this system we manage our blood donating program. People who are willing to donate blood can register as a donors, and those in need of blood can find available donors. The admin will be manage everything from their dashboard.

## Technology Used

-NodeJS
-Express
-zod
-mongodb
-mongoose

## User roles, Their permissions and Features

### Super Admin

-The super admin can assign any donor as an admin
-The super admin can block any admin and remove their admin role, reverting them back to a donor.
-The super admin can perform all the tasks that an admin can.

### Main Admin

-The main admin can perform all the actions of both the super admin and the admin.

### Admin

-The admin can view the information of all users.
-The admin can view all donors and search for donors using advanced queries.
-The admin can block and unblock both donors and finders.
-The admin can add information for new donors.

### Donor

-A donor can add their blood group, address, and contact information.
-A donor can add their donation date.
-If a donor has donated blood within the last 90 days, they will automatically become unavailable.
-After 90 days, the donor will automatically become available again.
--A donor can view their donation list.
-If a donor ever needs blood, they can search for information about other donors.

### Finder

-A finder can search for donors of the required blood group.
-A finder can become a donor if they want.

### Basic Features

-Donors and finders can sign up through the website.
-After signing up, they must verify their email. An OTP will be sent to their email, which they can use for verification.
-All users can sign in and access all their features from their dashboard.

## How to run the application locally?

If you need to run this application locally so follow this process.

Clone this application from GitHub. using this code:
`git clone git@github.com:inzamulhaque/blood-donor-system-server.git`  
Or  
`git clone https://github.com/inzamulhaque/blood-donor-system-server.git`

When applications are cloned successfully applications open with VSCode or author text editor. Open the terminal or command prompt at this project. Install all necessary dependencies.  
For installing all dependencies run this command:
`npm install`

Create .env file in root of the project
Setup All environment variable.

Environment variable name:

```
NODE_ENV=development
PORT="Port Number"
DATABASE_URL="Database URL"
BCRYPT_SALT_ROUNDS="Salt number for bcrypt
JWT_ACCESS_SECRET="Secret for JWT access token"
JWT_ACCESS_EXPIRES_IN="JWT access token time"
JWT_REFRESH_EXPIRES_IN="JWT refresh token time"
SUPER_ADMIN_NAME="Super admin name"
SUPER_ADMIN_EMAIL="super admin email"
SUPER_ADMIN_PASSWORD="super admin password"
SUPER_ADMIN_ROLE="Super admin role"
SUPER_ADMIN_TRACKING_NUMBER="Super admin tracking number"
MAIN_ADMIN_NAME="Main admin name"
MAIN_ADMIN_EMAIL="Main admin email"
MAIN_ADMIN_PASSWORD="Main admin password"
MAIN_ADMIN_ROLE="Main admin role"
MAIN_ADMIN_TRACKING_NUMBER="main admin tracking number"
EMAIL_ADDRESS="Email address"
EMAIL_PASSWORD="App password for email address"
```

run application in a development environment:  
`npm run dev`

for build production level application please run the command  
` npm run build`

for check production level build run the command  
`npm start`

### Thank you
