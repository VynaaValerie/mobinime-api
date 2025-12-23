const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mobinime Class
class Mobinime {
    constructor() {
        this.inst = axios.create({
            baseURL: 'https://air.vunime.my.id/mobinime',
            headers: {
                'accept-encoding': 'gzip',
                'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                host: 'air.vunime.my.id',
                'user-agent': 'Dart/3.3 (dart:io)',
                'x-api-key': 'ThWmZq4t7w!z%C*F-JaNdRgUkXn2r5u8'
            }
        });
    }
    
    homepage = async function () {
        try {
            const { data } = await this.inst.get('/pages/homepage');
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    animeList = async function (type, { page = '0', count = '15', genre = '' } = {}) {
        try {
            const types = {
                series: '1',
                movie: '3',
                ova: '2',
                'live-action': '4'
            };
            
            if (!types[type]) throw new Error(`Available types: ${Object.keys(types).join(', ')}.`);
            if (isNaN(page)) throw new Error('Invalid page.');
            if (isNaN(count)) throw new Error('Invalid count.');
            
            const genres = await this.genreList();
            const gnr = genres.find(g => g.title.toLowerCase().replace(/\s+/g, '-') === genre.toLowerCase())?.id || null;
            if (!gnr && genre) throw new Error(`Available genres: ${genres.map(g => g.title.toLowerCase().replace(/\s+/g, '-')).join(', ')}.`);
            
            const { data } = await this.inst.post('/anime/list', {
                perpage: count?.toString(),
                startpage: page?.toString(),
                userid: '',
                sort: '',
                genre: gnr || '',
                jenisanime: types[type]
            });
            
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    genreList = async function () {
        try {
            const { data } = await this.inst.get('/anime/genre');
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    search = async function (query, { page = '0', count = '25' } = {}) {
        try {
            if (!query) throw new Error('Query is required.');
            if (isNaN(page)) throw new Error('Invalid page.');
            if (isNaN(count)) throw new Error('Invalid count.');
            
            const { data } = await this.inst.post('/anime/search', {
                perpage: count?.toString(),
                startpage: page?.toString(),
                q: query
            });
            
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    detail = async function (id) {
        try {
            if (isNaN(id)) throw new Error('Invalid id.');
            const { data } = await this.inst.post('/anime/detail', { id: id?.toString() });
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    stream = async function (id, epsid, { quality = 'HD' } = {}) {
        try {
            if (!id || !epsid) throw new Error('Anime id & episode id is required.');
            
            const { data: srv } = await this.inst.post('/anime/get-server-list', {
                id: epsid?.toString(),
                animeId: id?.toString(),
                jenisAnime: '1',
                userId: ''
            });
            
            const { data } = await this.inst.post('/anime/get-url-video', {
                url: srv.serverurl,
                quality: quality,
                position: '0'
            });
            
            if (!data?.url) throw new Error('Stream url not found.');
            return data.url;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const mobinime = new Mobinime();

// Helper for error responses
const errorResponse = (res, message, status = 400) => {
    res.status(status).json({ success: false, error: message });
};

// Routes

// Documentation Page
app.get('/', (req, res) => {
    res.render('index');
});

// Test/Playground Page
app.get('/test', (req, res) => {
    res.render('test');
});

// API: Homepage
app.get('/api/homepage', async (req, res) => {
    try {
        const data = await mobinime.homepage();
        res.json({ success: true, data });
    } catch (error) {
        errorResponse(res, error.message);
    }
});

// API: Genre List
app.get('/api/genres', async (req, res) => {
    try {
        const data = await mobinime.genreList();
        res.json({ success: true, data });
    } catch (error) {
        errorResponse(res, error.message);
    }
});

// API: Anime List
app.get('/api/anime/list', async (req, res) => {
    try {
        const { type = 'series', page = '0', count = '15', genre = '' } = req.query;
        const data = await mobinime.animeList(type, { page, count, genre });
        res.json({ success: true, data });
    } catch (error) {
        errorResponse(res, error.message);
    }
});

// API: Search
app.get('/api/anime/search', async (req, res) => {
    try {
        const { q, page = '0', count = '25' } = req.query;
        if (!q) return errorResponse(res, 'Query parameter (q) is required');
        
        const data = await mobinime.search(q, { page, count });
        res.json({ success: true, data });
    } catch (error) {
        errorResponse(res, error.message);
    }
});

// API: Detail
app.get('/api/anime/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return errorResponse(res, 'Anime ID is required');
        
        const data = await mobinime.detail(id);
        res.json({ success: true, data });
    } catch (error) {
        errorResponse(res, error.message);
    }
});

// API: Stream URL
app.get('/api/anime/stream/:id/:epsid', async (req, res) => {
    try {
        const { id, epsid } = req.params;
        const { quality = 'HD' } = req.query;
        
        if (!id || !epsid) return errorResponse(res, 'Anime ID and Episode ID are required');
        
        const url = await mobinime.stream(id, epsid, { quality });
        res.json({ success: true, url, quality });
    } catch (error) {
        errorResponse(res, error.message);
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mobinime API Server running at http://0.0.0.0:${PORT}`);
});
