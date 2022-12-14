const https = require('https');
const fs = require('fs');

module.exports = {
    async execute(constellation) {
        let path = __dirname.split(/\\/gm);
        path.pop();
        path = path.join('/');
        const constList = require(`${path}/constellations.json`);
        if (!fs.existsSync(`${path}/cache/constellations`)) {
            fs.mkdirSync('./cache/constellations')
        };
        let constNames = []
        for (let i = 0; i < constList.length; i++) {
            constNames.push(`${constList[i].abbr.toLocaleLowerCase()}`)
        }
        if (!constNames.includes(constellation)) {
            return console.log('Invalid input.')
        }
        if (!fs.existsSync(`${path}/cache/constellations/${constellation.toLocaleUpperCase()}.gif`)) {
            const file = fs.createWriteStream(`${path}/cache/constellations/${constellation.toLocaleUpperCase()}.gif`);
            const request = https.get(`https://www.iau.org/static/public/constellations/gif/${constellation.toLocaleUpperCase()}.gif`, function (response) {
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                });
            });
            return console.log('Success!')
        } else if (fs.existsSync(`${path}/cache/constellations/${constellation.toLocaleUpperCase()}.gif`)) {
            return console.log('Success!')
        }
    }
}