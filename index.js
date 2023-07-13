// index.js
const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch');
const MUSTACHE_MAIN_DIR = './main.mustache';

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

const getArticles = async () => {
    const result = await fetch('https://rkkoranteng.com/wp-json/wp/v2/posts')
        .then(response => response.json())

    return result.posts.map(({ title, slug }) => ({ title, slug }));
}

const generateReadMe = async () => {
    const readMeData = {
        posts: (await getArticles()).slice(0, 5)
    };

    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), readMeData);
        fs.writeFileSync('README.md', output);
    });
}

generateReadMe();
