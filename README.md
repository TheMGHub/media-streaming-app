# Media Streaming App

## Setup Instructions

To get started with the Media Streaming App, follow these steps:

1. **Clone the Repository**:  
   ```bash  
   git clone https://github.com/TheMGHub/media-streaming-app.git  
   cd media-streaming-app  
   ```  

2. **Install Dependencies**:  
   ```bash  
   npm install  
   ```  

3. **Run the Application**:  
   ```bash  
   npm start  
   ```

## Features

- Stream videos from Google Drive
- Custom video controls
- Supports keyboard shortcuts
- Responsive design

## Usage Guide

### Adding Google Drive Videos
- To add videos from Google Drive, obtain the shareable link and insert it into the application.

### Video Controls
- Play/Pause: Use the space bar or click the play button.
- Seek: Click on the timeline or use the left/right arrow keys.

## Project Structure

```
media-streaming-app/
├── src/
│   ├── components/
│   ├── services/
│   ├── styles/
│   └── App.js
└── public/
    └── index.html
```

## Configuration Details

- Configuration settings can be found in the `src/config.js` file.

## Troubleshooting

1. **Video Not Playing**: Ensure the video link is accessible and in the correct format.
2. **App Crashes on Start**: Check the console for errors and ensure all dependencies are installed.

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch:  
   ```bash  
   git checkout -b feature-name  
   ```  
3. Make your changes and commit them:  
   ```bash  
   git commit -m "Add some feature"  
   ```  
4. Push to the branch:  
   ```bash  
   git push origin feature-name  
   ```  
5. Open a pull request.

## FAQ

**Q: How do I set up the environment?**  
A: Follow the setup instructions above and ensure Node.js is installed.

**Q: What API does the app use?**  
A: The app uses the Google Drive API for video streaming.