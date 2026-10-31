# MindCare — Mental Wellness Website

A responsive front-end project rebuilt from the uploaded HTML and CSS design. It uses HTML5, CSS3 and vanilla JavaScript (no framework or build step required).

## Run the project
1. Extract the ZIP file.
2. Open the `mindcare-mental-wellness` folder in VS Code.
3. Open `index.html` in a browser, or use the VS Code **Live Server** extension.
4. Internet access is needed for Google Fonts, Font Awesome and the remote Unsplash demo photos.

## Project structure
```text
mindcare-mental-wellness/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## JavaScript features
- Responsive mobile navigation with open/close and active-section states
- Appointment modal with required-field validation, date restriction and specialist preselection
- Appointment requests saved to browser `localStorage`
- Specialist search by name and speciality
- Previous/next testimonial slider
- Contact form validation and local demo message storage
- Scroll reveal animations, back-to-top control, toast messages and dynamic footer year
- Escape-key modal close and basic keyboard focus handling

## Important demo limitations
This is a front-end-only learning project. Appointment and contact form data are saved only in the visitor's browser (`localStorage`). No email is sent, no real appointment is booked, and there is no database, authentication, payment, or admin panel. The specialist profiles and testimonials are illustrative demo content. Do not enter sensitive health information.

## Customisation
- Update colours in `css/style.css` under `:root`.
- Edit page content and demo profiles in `index.html`.
- Add or change interactions in `js/script.js`.
- Replace remote Unsplash image URLs with your own licensed images if desired.
