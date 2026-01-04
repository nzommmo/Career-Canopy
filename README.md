# Career Canopy

> A comprehensive job application tracking platform to streamline your job search journey

Career Canopy is a modern web application that helps job seekers efficiently track and manage their job applications. Built with Django and Django REST Framework, it provides a centralized platform to log applications, upload documents, track interview rounds, and monitor application statuses throughout your job search process.

## ✨ Features

### Application Management
- Create and manage detailed job applications with company information, position details, and application dates
- Track application status through multiple stages: Applied, Interviewing, Offer, Rejected, and Withdrawn
- Securely upload and store resumes and cover letters for each application
- Filter and search applications by status for quick access

### Interview Tracking
- Add multiple interview rounds for each application
- Record interview types (phone screen, technical, behavioral, final round)
- Track interview dates and add detailed notes
- Monitor your progress through the hiring pipeline

### Dashboard & Analytics
- View comprehensive summaries of all applications at a glance
- Track key metrics: total applications, offers received, rejections, and active interviews
- Visualize your job search progress with intuitive status counts

### Secure File Management
- Encrypted storage for sensitive documents
- Easy upload and download of resumes and cover letters
- Direct file access from the dashboard

### RESTful API
- Fully functional API for programmatic access
- Support for all CRUD operations on applications and interviews
- Easy integration with other tools and services

## 🛠️ Tech Stack

- **Backend:** Django 4.x, Django REST Framework
- **Frontend:** React.js (optional integration)
- **Database:** SQLite (default), PostgreSQL, or MySQL
- **Authentication:** JWT or Django Session Authentication
- **File Storage:** Encrypted local storage with optional cloud storage support
- **Styling:** Tailwind CSS
- **Icons:** Lucide Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.10 or higher
- pip (Python package manager)
- virtualenv (recommended)
- Node.js & npm (only if using the React frontend)
- Git

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/career-canopy.git
cd career-canopy
```

### 2. Set Up Virtual Environment

```bash
# Create virtual environment
python -m venv env

# Activate virtual environment
# On Linux/Mac:
source env/bin/activate

# On Windows:
env\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Database

```bash
# Run migrations to set up the database
python manage.py migrate
```

### 5. Create Admin User (Optional)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account for accessing the Django admin panel.

### 6. Run the Development Server

```bash
python manage.py runserver
```

The application will be available at `http://127.0.0.1:8000/`

The admin panel can be accessed at `http://127.0.0.1:8000/admin/`

## 📚 API Documentation

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications/` | List all applications |
| POST | `/api/applications/` | Create a new application |
| GET | `/api/applications/<id>/` | Retrieve a specific application |
| PUT | `/api/applications/<id>/` | Update an application |
| PATCH | `/api/applications/<id>/` | Partially update an application |
| DELETE | `/api/applications/<id>/` | Delete an application |

### Interviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications/<application_id>/interviews/` | List all interviews for an application |
| POST | `/api/applications/<application_id>/interviews/` | Add a new interview round |
| GET | `/api/interviews/<id>/` | Retrieve a specific interview |
| PUT | `/api/interviews/<id>/` | Update an interview round |
| DELETE | `/api/interviews/<id>/` | Delete an interview round |

### File Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications/<id>/resume/` | Download resume file |
| GET | `/api/applications/<id>/cover_letter/` | Download cover letter file |

## 📁 Project Structure

```
career-canopy/
│
├── career_canopy/          # Django project configuration
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── jobs/                   # Main application
│   ├── migrations/         # Database migrations
│   ├── models.py          # Data models
│   ├── views.py           # API views
│   ├── serializers.py     # DRF serializers
│   ├── urls.py            # URL routing
│   └── utils/             # Utility functions (encryption, etc.)
│
├── frontend/              # React frontend (optional)
│
├── media/                 # Uploaded files storage
├── static/                # Static files (CSS, JS, images)
├── requirements.txt       # Python dependencies
├── manage.py             # Django management script
└── README.md             # Project documentation
```

## 💡 Usage

1. **Add a New Application:** Use the web interface or API to create a new job application with company details, position, and application date.

2. **Upload Documents:** Attach your resume and cover letter to each application for easy reference.

3. **Track Interviews:** Add interview rounds as they're scheduled, including type, date, and notes about each interaction.

4. **Monitor Progress:** Use the dashboard to view summaries, filter by status, and track your overall job search metrics.

5. **Download Documents:** Access your uploaded resumes and cover letters directly from the application details page.

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Django](https://www.djangoproject.com/) - The web framework for perfectionists with deadlines
- [Django REST Framework](https://www.django-rest-framework.org/) - Powerful and flexible toolkit for building Web APIs
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icon toolkit

## 📧 Contact

For questions, suggestions, or issues, please open an issue on GitHub or contact the maintainers.

---

**Happy Job Hunting! 🎯**