# FixBuddy Backend

The core API service for the FixBuddy platform, handling authentication, data management, and real-time communication.

## 🛠 Tech Stack
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB Atlas with Prisma ORM
-   **Messaging**: Socket.io for real-time chat and updates
-   **Communication**: Nodemailer + SMTP for OTP and notification emails
-   **Media**: Cloudinary SDK for image processing

## 📁 Key Directories
-   `src/controllers/`: Business logic for Auth, Users, Captains, and Jobs.
-   `src/routes/`: API endpoint definitions.
-   `src/utils/`: Shared utilities (Mail, Cloudinary, JWT, OTP, Validators).
-   `src/sockets/`: WebSocket event handling.
-   `prisma/`: Database schema and Prisma client configuration.

## ⚙️ Environment Variables (`.env`)
```env
PORT=5000
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
SOURCE_DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<database>"
JWT_SECRET="your-secure-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Nodemailer / SMTP
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
MAIL_REPLY_TO=
MAIL_APP_NAME=FixBuddy
```

## 🚀 Running Locally
1.  `npm install`
2.  `npx prisma db push`
3.  `npx prisma generate`
4.  Configure the SMTP mail variables above
5.  `npm run dev`

## Data Migration
To migrate data from the old PostgreSQL database into MongoDB Atlas:

1.  Set `SOURCE_DATABASE_URL` to the old PostgreSQL connection string.
2.  Run `npm install`
3.  Run `npm run data:migrate`

If the Mongo target already contains imported data, run `npm run data:migrate -- --force-reset`.

---
API Documentation is available via the source routes.
