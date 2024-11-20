**Backend**

# Project Description: E-Commerce Application

## Project Title: AgroHub: A Comprehensive Agricultural E-Commerce Platform

**Overview:** AgriHub is an innovative web-based platform designed to revolutionize the agricultural marketplace by seamlessly connecting farmers, buyers, and stakeholders. Tailored to meet the unique demands of the agriculture industry, AgriHub provides a streamlined and efficient solution for purchasing farm products, managing farmer profiles, and fostering a dynamic agricultural ecosystem.

## Key Features:

### User Authentication and Role Management:

AgriHub incorporates a robust user authentication system to ensure security and tailored access. The platform supports multiple user roles, including administrators, farmers, and buyers, each with distinct access permissions and functionalities. Role-based management ensures that users can efficiently perform their specific tasks, enhancing productivity and maintaining data integrity.

### Farm Product Purchase:

The core of AgriHub is its e-commerce functionality, enabling buyers to browse, search, and purchase farm products directly from farmers. With real-time inventory updates, transparent pricing, and secure payment gateways, the platform simplifies the procurement process. This feature bridges the gap between farmers and consumers, ensuring fair trade and promoting sustainable agricultural practices.

### Farmer Management:

AgriHub empowers administrators and buyers with an intuitive farmer management system. Administrators can register, verify, and oversee farmer accounts, while buyers can view farmer profiles to learn more about their practices, product quality, and location. This feature fosters trust and strengthens relationships between stakeholders.

### User-Friendly Interface:

The platform is designed with a focus on simplicity and ease of use. Its intuitive layout ensures seamless navigation, whether users are browsing products, managing accounts, or viewing analytics. The responsive design guarantees accessibility across devices, enabling users to engage with AgriHub from desktops, tablets, or mobile devices.

### Why AgriHub?

AgriHub stands as a one-stop solution for the agricultural industry, addressing the pain points of traditional marketplaces. By integrating advanced e-commerce capabilities with a focus on user experience, AgriHub enables efficient farm product transactions, builds trust within the community, and promotes transparency.

AgriHub is not just a platform—it’s a gateway to modernizing agriculture, empowering farmers, and ensuring buyers have access to high-quality farm products with ease.

## **Project Requirements:**

1. **Node.js and Express Setup:**

   - **Express Application:**
     - Set up an Express.js project structure.
     - Implement routing for different parts of the application (e.g., `/buyers`, `/farmers`, `/product`, `/admin`).

2. **User Management and Authentication:**

   - **Buyer Registration and Login:**

     - **Registration:** Allow buyers to create an account by providing their personal details and setting a password. Store passwords securely using hashing (e.g., bcrypt).
     - **Login:** Implement a login system that authenticates buyers using their email and password. Upon successful login, start a session for the buyer.
     - **Profile Management:** Allow logged-in buyers to view and update their profile information (excluding their email and password).

   - **Session Management:**
     - Use session cookies to manage buyer sessions.
     - Implement session-based authentication to protect routes that require login (e.g., make purchase, initiate shipments).
     - Provide a logout functionality that ends the buyer’s session.

3. **Core Features Implementation:**

   - **Buyer Management:**

     - **Create:** Buyers can register and create an account.
     - **Read:** Display a list of buyers (admin level 1 and 2 only), with search and filter options.
     - **Update:** Buyers can update their profile information.
     - **Delete:** Implement a feature for buyers to delete their accounts.

   - **Farmer Management:**

     - **Create:** Farmers can register, but registration should be validated by admin.
     - **Read:** Display a list of farmers with their products.
     - **Update:** Allow farmers or admin(level 1 and 2 only) to update profile information.
     - **Delete:** Implement a feature to deactivate(admin level 1 and 2 only) or delete farmer profiles (both farmers and admin level 1 and 2).

   - **Products:**

     - **Create:** Farmers can upload products.
     - **Read:** Users and Admin can view all products, Farmers can view their products.
     - **Update:** Farmers can update product information.
     - **Delete:** Farmers and admon can delete products.

   - **Cart:**

     - **Create:** Buyers can add items to cart.
     - **Read:** Buyers can view the items in the cart.
     - **Update:** Buyers  can remove items from cart.
     - **Delete:** Buyers can clear cart.


   - **Shipment:**

     - **Create:** Buyers can initiate shipment by selecting a checking out of the cart to finalise purchase.
     - **Read:** Display a list of upcoming shipments for buyers and farmers. Admin can view all shipments.
     - **Update:** Allow admin to be able cancel shipments at buyer's request.
     - **Delete:** Allow admin to cancel shipments, updating the status to "cancelled."

- **Admin Management:**

  - **Create:** Admin level 1 can register and assign access level to admin.
  - **Read:** Admin level 1 can view all admin
  - **Update:** Admin can update their profile
  - **Delete:** Admin level 1 can disable or delete an admin.

- **Admin action**

  - **Create:** Record every administrative action.
  - **Read:** Admin can view their actions. Admin level 1 can view all actions.

4. **Interactivity and User Experience:**
   - Provide real-time feedback for form submissions (e.g., success messages, error handling).
