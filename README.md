Vehicle Rental System

This project is a full-stack Vehicle Rental System that allows users to rent vehicles, owners to list and manage vehicles, and administrators to control and monitor the platform.
The system supports vehicle listings, bookings, payments, reviews, and maintenance tracking with proper role-based access control.

👥 User Roles in the System

The application supports three types of users, each with specific responsibilities and access.

1️⃣ Renter

A renter is a customer who books vehicles.

Renter can:

View all approved vehicles

Search vehicles using filters like location, type, and price

View detailed information of a vehicle

Book a vehicle for selected dates

Make payment for bookings

View booking history

View payment history

Add reviews after completing a booking

2️⃣ Owner

An owner is a vehicle provider who lists vehicles for rent.

Owner can:

Add vehicles with images

View all their listed vehicles

Edit vehicle details

Delete vehicles (if no active bookings exist)

View bookings made for their vehicles

Add maintenance records

Mark maintenance as completed

View maintenance history

3️⃣ Admin

An admin manages the entire system.

Admin can:

View all registered users

Block or unblock users

View all vehicle listings

Approve or reject vehicles

View all bookings

View all payments

Moderate reviews (approve or reject)

🔐 Authentication & Authorization

Users register and log in using email and password.

JWT (JSON Web Token) is used for authentication.

After login, the token is stored in the browser.

Protected routes require a valid token.

Role-based access ensures:

Renters cannot access owner or admin pages

Owners cannot access renter or admin pages

Admin has full access

Blocked users are prevented from logging in or accessing APIs.

🚘 Vehicle Management

Owners can add vehicles with details like:

Make

Model

Year

Type

Price per day

Location

Description

Images

Vehicle images are uploaded and stored using Cloudinary.

Newly added vehicles are not visible to renters until approved by the admin.

Admin approves or rejects vehicles.

Renters can only view approved and available vehicles.

📅 Booking System

Renters can select start and end dates to book a vehicle.

The system checks for overlapping bookings to avoid double booking.

If available, a booking is created with status pending_payment.

Booking statuses include:

pending_payment

booked

completed

cancelled

Completed bookings allow renters to add reviews.

💳 Payment System

Razorpay is used for payment processing (test mode).

After booking creation:

A payment order is generated.

Razorpay checkout opens on the frontend.

Payment is verified on the backend.

After successful payment:

Payment status is marked as paid.

Booking status is updated to booked.

Renters can view their payment history.

Admin can view all payments.

⭐ Review System

Reviews can only be added after a booking is completed.

Each review includes:

Rating (1–5)

Optional comment

Reviews are not published immediately.

Admin must approve reviews before they become visible.

Only approved reviews appear on vehicle detail pages.

🛠 Maintenance Management

Owners can add maintenance records for their vehicles.

Maintenance includes:

Description

Cost

Status

When a vehicle is under maintenance:

It becomes unavailable for booking.

After marking maintenance as completed:

The vehicle becomes available again.

Maintenance history is preserved and viewable by the owner.

🖥 Frontend Features

Clean role-based dashboards for:

Admin

Owner

Renter

Reusable components for:

Vehicle cards

Booking cards

Forms

Protected routes to prevent unauthorized access.

Responsive UI using Tailwind CSS.

Image previews for vehicles.

Loading and error handling states.

📧 Email Notifications

Email confirmation is sent after successful payment.

Email service is integrated using Brevo (Sendinblue).

Emails include booking confirmation details.
