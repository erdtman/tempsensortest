/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const crypto = require('crypto');
const querystring = require('querystring');
const express = require('express');
const router = express.Router();


const redirect_uri = 'http://127.0.0.1:5000/shotgun/callback';

router.get('/', async (req, resp) => {
    resp.render('shotgun');
});


const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.randomBytes(length);
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

router.get('/login', function (req, res) {
    const state = generateRandomString(16);
    const scope = 'user-read-playback-state user-modify-playback-state';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

router.get('/callback', async function (req, res) {
    const code = req.query.code || null;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const client_id = process.env.SPOTIFY_CLIENT_ID;

    const url = 'https://accounts.spotify.com/api/token';
    const formdata = querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    });
    console.log('formdata', formdata);

    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        body: formdata
    })
    const authstuff = await resp.json()
    console.log('authstuff', authstuff);

    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.COOKIE_SECRET, 'hex'), Buffer.alloc(16, 0));
    let encrypted = cipher.update(JSON.stringify(authstuff), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    res.cookie('authstuff', encrypted, { httpOnly: true, secure: false });

    res.redirect('/shotgun');
});

router.post('/skip/next', async function (req, res) {
    console.log("skipping next");

    const encrypted = req.cookies.authstuff;
    if (!encrypted) {
        return res.status(401).send('Not authenticated');
    }

    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.COOKIE_SECRET, 'hex'), Buffer.alloc(16, 0));
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        const authstuff = JSON.parse(decrypted);
        const url = 'https://api.spotify.com/v1/me/player/next';

        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authstuff.access_token}`
            }
        });

        res.send('ok');
    } catch (err) {
        return res.status(400).send('Invalid auth cookie');
    }
});



router.post('/add/to/queue/:id', async function (req, res) {
    console.log("add to queue");

    const encrypted = req.cookies.authstuff;
    if (!encrypted) {
        return res.status(401).send('Not authenticated');
    }

    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.COOKIE_SECRET, 'hex'), Buffer.alloc(16, 0));
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        const authstuff = JSON.parse(decrypted);
        const id = req.params.id;
        const query = querystring.stringify({
            uri: `spotify:episode:${id}`,
        });
        const url = `https://api.spotify.com/v1/me/player/queue?${query}`;
        console.log('url', url);

        await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authstuff.access_token}`
            }
        });

        res.send('ok');
    } catch (err) {
        return res.status(400).send('Invalid auth cookie');
    }
});

router.get('/show', async function (req, res) {
    console.log("get show");

    const encrypted = req.cookies.authstuff;
    if (!encrypted) {
        return res.status(401).send('Not authenticated');
    }

    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.COOKIE_SECRET, 'hex'), Buffer.alloc(16, 0));
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        const authstuff = JSON.parse(decrypted);
        const show_id = '5RkAV0qTjjskJEvYvFIvhJ';
        const url = `https://api.spotify.com/v1/shows/${show_id}`;
        console.log('url', url);

        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authstuff.access_token}`
            }
        });

        const data = await resp.json();
        res.send(data);
    } catch (err) {
        return res.status(400).send('Invalid auth cookie');
    }
});

module.exports = router;
