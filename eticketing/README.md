# eTicketing Project

## Overview
The eTicketing project is a ticket booking system that allows users to book tickets for events. It utilizes Supabase for backend services, including database management and serverless functions.

## Project Structure
```
eticketing
├── supabase
│   ├── functions
│   │   └── book-ticket
│   │       └── index.ts
│   ├── migrations
│   │   └── 20240101000000_initial_schema.sql
│   └── config.toml
├── src
│   └── index.ts
├── package.json
└── README.md
```

## Setup Instructions

1. **Create a Supabase Account**
   - Go to [Supabase](https://supabase.io) and sign up for a new account.

2. **Create a New Project**
   - After logging in, create a new project in the Supabase dashboard.

3. **Configure Database**
   - Navigate to the SQL editor in your Supabase project and run the SQL schema located in `supabase/migrations/20240101000000_initial_schema.sql` to set up the necessary tables.

4. **Deploy Functions**
   - In the Supabase dashboard, go to the Functions section and deploy the function defined in `supabase/functions/book-ticket/index.ts`.

5. **Configure Environment Variables**
   - Update the `supabase/config.toml` file with any necessary environment variables for your functions.

6. **Install Dependencies**
   - Navigate to the project directory and run:
     ```
     npm install
     ```

7. **Run the Application**
   - Start the application by running:
     ```
     npm start
     ```

## Usage
- Users can book tickets by calling the booking function, which processes the request and interacts with the database to manage ticket availability.

## Contributing
- Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
- This project is licensed under the MIT License.