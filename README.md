# 🎬 Mobinime API - Anime Streaming Endpoint

A fast and simple anime streaming API built with Node.js, Express, and EJS.

## Features
- 📚 **6 API Endpoints** - Homepage, genres, list, search, detail, stream
- ⚡ **Fast Response** - Optimized for performance
- 🎨 **Responsive Documentation** - Beautiful, mobile-friendly UI
- 🚀 **Vercel Ready** - Easy deployment
- 💨 **Lightweight** - Minimal dependencies

## Quick Start

### Local Development
```bash
npm install
npm start
```
Server runs on `http://localhost:5000`

### Deployed on Vercel
1. Push to GitHub
2. Import repo to Vercel
3. Set Framework: "Other" (Node.js)
4. Deploy!

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Documentation page |
| `/api/homepage` | GET | Featured anime |
| `/api/genres` | GET | All genres |
| `/api/anime/list` | GET | Anime list by type |
| `/api/anime/search` | GET | Search anime |
| `/api/anime/detail/:id` | GET | Anime details |
| `/api/anime/stream/:id/:epsid` | GET | Stream URL |

## Query Parameters

### List Anime
```
?type=series|movie|ova|live-action&page=0&count=15&genre=action
```

### Search
```
?q=naruto&page=0&count=25
```

### Stream
```
?quality=HD
```

## Example Usage

**JavaScript:**
```javascript
fetch('/api/anime/search?q=one-piece')
  .then(res => res.json())
  .then(data => console.log(data));
```

**cURL:**
```bash
curl "http://localhost:5000/api/anime/list?type=series&count=10"
```

## Technologies
- **Node.js** - Runtime
- **Express** - Web framework
- **EJS** - Templating
- **Axios** - HTTP client

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy with one click
4. Get instant live URL

### Other Platforms
Works with any Node.js hosting:
- Heroku, Railway, Render, etc.
- Just use `npm start`

## Response Format
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

## Notes
- API uses external anime data source
- Ensure stable internet connection
- Request limits may apply from source API

## License
MIT

---
**Made with ❤️ | Fast Anime Streaming API**
