# Job Portal - React Application

A comprehensive job portal built with React.js, Tailwind CSS, and modern web technologies. This application provides a complete platform for job seekers and employers to connect and find opportunities.

## 🚀 Features

### For Job Seekers
- **User Registration & Authentication**: Secure signup/login system
- **Profile Management**: Create and edit personal profiles
- **Job Search**: Advanced search with filters (location, job type, experience level)
- **Job Applications**: Apply to jobs with resume upload and cover letter
- **Application Tracking**: Monitor application status and history
- **Saved Jobs**: Bookmark interesting positions for later

### For Employers
- **Company Registration**: Register as an employer
- **Job Posting**: Create detailed job listings
- **Applicant Management**: View and manage job applications
- **Dashboard Analytics**: Track job performance and applicant metrics
- **Company Profile**: Manage company information

### General Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS
- **Real-time Search**: Instant job search with filters
- **Protected Routes**: Role-based access control
- **Form Validation**: Comprehensive input validation

## 🛠️ Tech Stack

- **Frontend**: React.js 18
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
job-portal/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/            # React Context for state management
│   │   └── AuthContext.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── JobListings.jsx
│   │   ├── JobDetail.jsx
│   │   ├── JobSeekerDashboard.jsx
│   │   ├── EmployerDashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── utils/              # Utility functions
│   ├── assets/             # Static assets
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 Key Components

### Authentication System
- **AuthContext**: Manages user authentication state
- **ProtectedRoute**: Route protection based on user type
- **Login/Register**: User authentication forms

### Job Management
- **JobListings**: Browse and search jobs
- **JobDetail**: Detailed job view with application form
- **JobSeekerDashboard**: Track applications and saved jobs
- **EmployerDashboard**: Manage posted jobs and applicants

### User Interface
- **Navbar**: Responsive navigation with user menu
- **Forms**: Consistent form styling with validation
- **Cards**: Reusable card components for content display

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom components defined in `src/index.css`. You can customize:

- **Colors**: Modify the primary color palette in `tailwind.config.js`
- **Components**: Add custom component classes in `src/index.css`
- **Layout**: Adjust responsive breakpoints and spacing

### Configuration
- **Vite Config**: Modify build settings in `vite.config.js`
- **Tailwind Config**: Customize Tailwind settings in `tailwind.config.js`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload the `dist` folder to S3 bucket
- **Heroku**: Deploy using Heroku CLI

## 🔮 Future Enhancements

### Planned Features
- **Real-time Chat**: Communication between employers and candidates
- **Email Notifications**: Job alerts and application updates
- **Resume Builder**: Built-in resume creation tool
- **AI Job Matching**: Smart job recommendations
- **Video Interviews**: Integrated video calling
- **Analytics Dashboard**: Advanced reporting for employers

### Technical Improvements
- **Backend Integration**: Connect to Node.js/Express API
- **Database**: MongoDB or PostgreSQL integration
- **File Upload**: Cloudinary for resume storage
- **Email Service**: Nodemailer for notifications
- **Payment Integration**: Stripe for premium features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Email: support@jobportal.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

---

**Built with ❤️ using React.js and Tailwind CSS** 