# People I Knotebook

Excuse the punny title. This is a basic contacts management app that connects to a Flask backend through a REST API. The backend uses SQLite to access contact data in a local database, with SQLAlchemy providing the object-relational mapping between Python objects and database tables. Users can create, view, update, delete, search for, sort, and export contacts as a CSV file. Each contact has an "initials dot" icon, giving the table a cheeky "notebook" look.

### Screenshots

<div align="center">
  <table>
    <tr>
      <td><a href="https://github.com/user-attachments/assets/43496fa2-f1d0-41cf-9e31-8beea02020fd"><img width="450" alt="df-image-1" src="https://github.com/user-attachments/assets/43496fa2-f1d0-41cf-9e31-8beea02020fd" /></a></td>
      <td><a href="https://github.com/user-attachments/assets/1c4deea8-01e2-4505-9426-ca83ece1bc75"><img width="450" alt="df-image-2" src="https://github.com/user-attachments/assets/1c4deea8-01e2-4505-9426-ca83ece1bc75" /></a></td>
    </tr>
  </table>
</div>

# Technical Info

This project has been forked from the [Python + JavaScript - Full Stack App](https://github.com/techwithtim/Flask-React-Full-Stack-App) tutorial. 
That template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

### The following features have been added:
- Additional table fields and validation
- Toast message on save/update and delete
- Confirmation on delete to prevent accidental contact removal
- Contacts search and sort
- Downloadable CSV
- Updated "notebook" styling using Tailwind CSS

### Core Technologies, Frameworks & Libraries:
- Python
- JavaScript
- React templating syntax
- Tailwind CSS
- REST API
- Vite 
- ESLint
- React 19
- Flask
- SQLite
- SQLAlchemy
