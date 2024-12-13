# VagaGO - Frontend Application

This is a React-based frontend application for VagaGO, a platform designed to list job opportunities. The project includes a responsive design, job filtering, and detailed job modals.

## Features

- **Job Listing**: Displays jobs fetched from an API or mock data.
- **Job Filters**: Filter jobs by skills and expertise level.
- **Responsive Design**: Supports desktop (3-column grid) and mobile (1-column grid) layouts.
- **Job Details Modal**: View detailed job information by clicking on a job card.
- **Toggle Mock Data**: Switch between mock data and API data.

---

## Technologies Used

- **React**: Framework for building user interfaces.
- **TypeScript**: For static typing.
- **Axios**: For API requests.
- **React-Modal**: To create modals for detailed job views.
- **CSS**: For styling and responsiveness.

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ghiberti85/inf332-pratica4-apifront.git
   cd inf332-pratica4-apifront
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Application**
   ```bash
   npm start
   ```

The application will be accessible at `http://localhost:3000`.

---

## API Integration

The application fetches job data from the VagaGO API. Make sure to set the correct API base URL:

```typescript
const API_BASE_URL = "https://your-api-domain.com/api/v1";
```

Replace the `API_BASE_URL` with the actual API URL for the production environment.

---

## File Structure

```plaintext
├── public
├── src
│   ├── components
│   ├── App.tsx        # Main application component
│   ├── App.css        # Application styles
│   ├── index.tsx      # Entry point
├── package.json
├── README.md          # Project documentation
```

---

## Usage

### Toggle Mock Data
Use the toggle switch on the UI to switch between mock data and API data for job listings.

### Filter Jobs
- Enter skills in the search bar to filter jobs based on skills.
- Select expertise level (Junior, Mid, Senior) to narrow down results.

### View Job Details
Click on a job card to open a modal displaying detailed job information.

---

## Contributing

1. **Fork the Repository**
2. **Create a Branch**
   ```bash
   git checkout -b feature-branch-name
   ```
3. **Commit Changes**
   ```bash
   git commit -m "Describe your changes"
   ```
4. **Push to Your Fork**
   ```bash
   git push origin feature-branch-name
   ```
5. **Create a Pull Request**

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- Built for the INF332 course practical exercise.
