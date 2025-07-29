# Research Database Management System

A comprehensive research database management system built with React, Node.js, and PostgreSQL. This project provides a complete solution for managing researchers, their publications, bibliographies, and organizational hierarchies with a modern web interface and robust backend API.

## Features

- **Researcher Management**: Add, view, update, and delete researcher profiles
- **Publication Tracking**: Manage and search through researcher publications and articles
- **Bibliography System**: Generate and search bibliographies based on various criteria
- **Organizational Hierarchy**: View and manage researcher hierarchies within laboratories
- **History Tracking**: Automatic tracking of researcher data changes with triggers
- **Search Functionality**: Advanced search capabilities across researchers and publications
- **Modern Web Interface**: Responsive React-based UI with intuitive navigation
- **RESTful API**: Complete backend API for all database operations

## Tech Stack

### Frontend
- **React 18.3.1** - Modern JavaScript library for building user interfaces
- **Bootstrap 5.3.3** - CSS framework for responsive design
- **Styled Components 6.1.13** - CSS-in-JS styling solution
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.1** - Web application framework
- **CORS 2.8.5** - Cross-origin resource sharing middleware
- **Body Parser** - Request body parsing middleware

### Database
- **PostgreSQL** - Relational database management system
- **pg 8.13.1** - PostgreSQL client for Node.js
- **PL/pgSQL** - Procedural language for PostgreSQL triggers and functions

### Development Tools
- **React Scripts 5.0.1** - Development and build tools
- **Jest** - Testing framework
- **ESLint** - Code linting

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database server
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd PLSQL
```

### Step 2: Install Dependencies

#### Root Dependencies
```bash
npm install
```

#### React App Dependencies
```bash
cd mynode/my-react-app
npm install
```

#### Research Database Dependencies
```bash
cd ../../my-research-database
npm install
```

### Step 3: Database Setup
1. Create a PostgreSQL database
2. Import the SQL trigger files:
   ```bash
   psql -d your_database_name -f firstQuestTriggers.sql
   psql -d your_database_name -f secondQuestTriggers.sql
   psql -d your_database_name -f thirdQuestTriggers.sql
   psql -d your_database_name -f fourthQuestTriggers.sql
   ```

### Step 4: Configure Database Connection
Update the database connection settings in:
- `my-research-database/db.js`
- `mynode/my-react-app/db.js`

Set your PostgreSQL connection parameters:
```javascript
const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'your_database_name',
  user: 'your_username',
  password: 'your_password'
});
```

## Usage

### Starting the Application

#### Option 1: React App (Recommended)
```bash
cd mynode/my-react-app
npm start
```
The React application will be available at `http://localhost:3000`

#### Option 2: Research Database Server
```bash
cd my-research-database
node server.js
```
The server will run on `http://localhost:5050`

### Using the System

1. **Researchers Table**: View all researchers in a tabular format with search and filter capabilities
2. **Researcher Articles**: Browse publications and articles by specific researchers
3. **Bibliography**: Search and generate bibliographies based on various criteria
4. **Hierarchy**: View organizational hierarchies within laboratories
5. **Add Researcher**: Create new researcher profiles with all necessary information

### API Endpoints

The system provides the following RESTful API endpoints:

- `GET /api/researchers` - Get all researchers
- `POST /api/addResearcher` - Add a new researcher
- `PUT /api/researchers/:chno` - Update researcher information
- `DELETE /api/researchers/:chno` - Delete a researcher
- `GET /api/researcher/articles` - Get articles by researcher ID
- `GET /api/publications` - Search publications
- `GET /api/bibliography` - Search bibliographies
- `GET /api/hierarchy/:labno` - Get researcher hierarchy by lab

## Folder Structure

```
PLSQL/
├── mynode/
│   └── my-react-app/          # Main React application
│       ├── src/
│       │   ├── components/     # React components
│       │   │   ├── AddResearcher.js
│       │   │   ├── Bibliography.js
│       │   │   ├── Hierarchy.js
│       │   │   ├── ResearcherArticles.js
│       │   │   └── ResearchersTable.js
│       │   ├── App.js         # Main application component
│       │   └── index.js       # Application entry point
│       ├── public/            # Static assets
│       ├── server.js          # Express server for React app
│       └── db.js             # Database connection and queries
├── my-research-database/      # Alternative backend implementation
│   ├── server.js             # Express server
│   ├── db.js                 # Database operations
│   └── index.html            # Simple HTML interface
├── js/                       # Additional JavaScript utilities
├── *.sql                     # PostgreSQL trigger files
│   ├── firstQuestTriggers.sql
│   ├── secondQuestTriggers.sql
│   ├── thirdQuestTriggers.sql
│   └── fourthQuestTriggers.sql
├── package.json              # Root package configuration
└── test.js                   # Test utilities
```

## Database Triggers

The system includes comprehensive database triggers for data integrity:

- **Before Update Triggers**: Track changes to researcher data
- **Before Delete Triggers**: Maintain history of deleted records
- **History Tables**: Automatic logging of all data modifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and structure
- Add appropriate error handling for new features
- Include comments for complex database operations
- Test thoroughly before submitting changes

## Support

For questions or issues, please:
1. Check the existing documentation
2. Review the database schema and triggers
3. Test with the provided sample data
4. Create an issue with detailed information about the problem

---

**Note**: Make sure to configure your database connection properly before running the application. The system requires a PostgreSQL database with the appropriate schema and triggers installed. 
