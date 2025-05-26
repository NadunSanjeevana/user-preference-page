# User Preferences Application

A modern, responsive user preferences management application built with Webix framework. This application allows users to customize their experience through various settings categories including account management, notifications, theme customization, and privacy controls.

## Features

- **Account Settings**
  - Manage user profile information
  - Update contact details
  - Change password
  - Account deletion

- **Notification Settings**
  - Email notifications
  - Push notifications
  - SMS notifications
  - Notification frequency control
  - Marketing preferences

- **Theme Settings**
  - Color scheme selection
  - Font size adjustment
  - Layout customization
  - Animation controls
  - Compact mode

- **Privacy Settings**
  - Profile visibility control
  - Data sharing preferences
  - Analytics tracking
  - Location sharing
  - Activity status

## Technical Features

- Responsive design for all devices
- Accessibility compliance (WCAG 2.1)
- Form validation
- Error handling
- Auto-save functionality
- Data import/export
- Keyboard navigation
- Screen reader support

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # UI components
│   ├── account/     # Account-related components
│   ├── notifications/ # Notification components
│   ├── theme/       # Theme components
│   └── privacy/     # Privacy components
├── styles/          # CSS styles
│   ├── themes/      # Theme-specific styles
│   └── components/  # Component-specific styles
├── utils/           # Utility functions
│   ├── validation/  # Form validation
│   └── error-handling/ # Error handling
├── services/        # Services
│   ├── api/         # API integration
│   └── storage/     # Local storage
├── config/          # Configuration files
└── tests/           # Test files
    ├── unit/        # Unit tests
    └── integration/ # Integration tests
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Accessibility

This application follows WCAG 2.1 guidelines and includes:

- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion support
- ARIA labels and roles
- Focus management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Webix Framework](https://webix.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) 