# Refract

## 🎮 [Try the Demo](https://eatyourpeas.github.io/refract/)

**Note**: The online demo is a standalone version without user accounts or leaderboard features. The full application includes authentication, score tracking, and competitive gameplay.

---

## Authors: [Simon Chapman](https://twitter.com/eatyourpeas) and [Andy Gridley](https://personalpages.manchester.ac.uk/advanced.php?dn=cn%3DAndrew+Gridley%2Bumanroleid%3D99194%2Cou%3DDivision+of+Pharmacy+%26+Optometry%2Cou%3DSchool+of+Health+Sciences%2Cou%3DFaculty+of+Biology%5C%2C+Medicine+and+Health%2Cou%3DPeople%2Co%3DUniversity+of+Manchester%2Cc%3DGB&employeeType=&action=read&form_input=Submit)

## Background
Teaching optometry students how to work out refractive errors in the clinical setting is like teaching doctors physical examination or bakers-to-be how to use an oven. It is a core skill and needs to be done well. Andy Gridley has been doing this for years as a University Lecturer and wanted to gamify the process, to allow students to practice on a computer to maximise the face to face time they have with volunteer patients.

## ✨ Recent Modernization (October 2025)

This application has been **completely modernized** from Meteor 1.4.1.2 to **Meteor 3.3.2** with the following improvements:

### 🔧 Technical Upgrades
- **Meteor 3.3.2**: Updated from legacy 1.4.1.2 to latest stable version
- **Modern Routing**: Replaced Iron Router with FlowRouter and Session-based rendering
- **Authentication System**: Rebuilt user authentication with Bootstrap modal UI
- **Package Updates**: Resolved all deprecated package conflicts
- **Docker Support**: Enhanced Docker configuration for development
- **Template System**: Fixed Blaze template conflicts and modernized helpers

### 🎯 Features
- **User Authentication**: Clean login/signup system with email/password
- **Responsive Design**: Bootstrap-based UI with mobile support
- **Game Integration**: Canvas-based refraction training game
- **Leaderboard**: Personal and global scoring system
- **Navigation**: Modern single-page application routing

### 🏗️ Architecture
- **Frontend**: Blaze templates with Bootstrap 3, FontAwesome icons
- **Backend**: Meteor methods with MongoDB collections
- **Game Engine**: CreateJS for interactive game mechanics
- **Routing**: FlowRouter with Session state management
- **Authentication**: Meteor accounts-password with custom UI

### 🔒 Security
- **Enterprise-Grade Protection**: Comprehensive security measures implemented
- **Rate Limiting**: Protection against brute force and abuse
- **Input Validation**: All user input sanitized and validated
- **Audit Logging**: Security events tracked and monitored
- **Data Protection**: User isolation and access controls

**📖 [View Complete Security Policy](./docs/security-policy.md)**

## Tools
Refract is written in **Meteor 3.3.2** and JavaScript using [CreateJS](https://createjs.com/) for the game engine.

## Rules
The student has to work out the refractive error of the patient by dragging lenses of different strengths onto the frame and assessing the reported refractive error from the Snellen chart. A timer logs the time taken to get a correct prescription. Fastest times are logged to a leader board.

## 🚀 Development Setup

### Prerequisites
- **Node.js** 18+ 
- **Meteor 3.3.2**
- **Docker** (optional, for containerized development)

### Quick Start
```bash
# Install Meteor (if not already installed)
curl https://install.meteor.com/ | sh

# Clone and run
git clone https://github.com/eatyourpeas/refract.git
cd refract
meteor npm install
meteor
```

### Docker Development (Recommended)
```bash
# Using Docker Compose
docker-compose up meteor-app

# App will be available at http://localhost:3000
```

### Database
- **MongoDB**: Automatically configured with Meteor
- **Collections**: `players` for storing scores and user data
- **Authentication**: Built-in Meteor accounts system

## 🎮 Usage

1. **Sign Up**: Create an account with email/password
2. **Play Game**: Navigate to "Games" → "Play Refract"  
3. **Practice**: Drag lenses to correct refractive errors
4. **Compete**: Check leaderboard for top scores
5. **Learn**: Review rules and techniques

## 📁 Project Structure
```
refract/
├── .meteor/           # Meteor configuration
├── public/           # Static assets (images, sounds, fonts)
├── server/           # Server-side configuration  
├── refract.html      # Blaze templates
├── refract.js        # Client/server logic
├── refract.less      # Styling (legacy)
├── refract_game.js   # Game engine logic
└── docker-compose.yml # Docker configuration
```

## 🔧 Technical Details

### Routing System
- **FlowRouter**: Modern client-side routing
- **Session**: State management for current page
- **Templates**: Conditional rendering based on route

### Authentication Flow
- **Signup**: Email, password, name/alias
- **Login**: Email/password authentication  
- **Session**: Persistent login state
- **Profile**: User name and scoring history

### Game Mechanics
- **Canvas**: HTML5 canvas with CreateJS
- **Drag & Drop**: Lens placement interaction
- **Scoring**: Time-based performance tracking
- **Leaderboard**: Personal best and global rankings

## 🚀 Deployment Options

### Production Ready

- **Railway**: Modern hosting with automatic deployment ($10/month)
- **Meteor Galaxy**: Official Meteor hosting (paid)
- **Heroku**: Free tier available with MongoDB addon
- **DigitalOcean**: App Platform deployment

**📖 [See Complete Deployment Guide](./docs/deployment.md)** for setup instructions, CI/CD configuration, and troubleshooting.

### Environment Variables

```bash
MONGO_URL=mongodb://localhost:27017/refract
ROOT_URL=http://localhost:3000
```

---

## 📝 License

Educational project for optometry training.

## 🤝 Contributing

This is an educational project. For improvements or issues, please open a GitHub issue or pull request.
