const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    async execute(input) {
        let path = __dirname.split(/\\/gm);
        path.pop();
        path = path.join('/');
        function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        }
        if (!fs.existsSync(`${path}/cache/launches`)) {
            fs.mkdirSync(`${path}/cache/launches`)
            fs.writeFileSync(`${path}/cache/launches/limit.json`, JSON.stringify({
                "left": 15,
                "timestamp": Date.now()
            }))
        } else if (!fs.existsSync(`${path}/cache/launches/limit.json`)) {
            fs.writeFileSync(`${path}/cache/launches/limit.json`, JSON.stringify({
                "left": 15,
                "timestamp": Date.now()
            }))
        };
        const limit = require(`${path}/cache/launches/limit.json`)
        if (limit.left === 0) {
            return console.log('Rate limited.');
        } else if (Date.now() > limit.timestamp + 3600000 || limit.left != 0){
            if (Date.now() > limit.timestamp + 3600000) {
                fs.writeFileSync(`${path}/cache/launches/limit.json`, JSON.stringify({
                    "left": 15,
                    "timestamp": Date.now()
                }))
            }

            function updateLimit() {
                let limitData = JSON.parse(fs.readFileSync(`${path}/cache/launches/limit.json`))
                const newLim = require(`${path}/cache/launches/limit.json`)
                limitData.left = newLim.left - 1
                fs.writeFileSync(`${path}/cache/launches/limit.json`, JSON.stringify(limitData))
            }

            if (input === 'nasa') {
                if (fs.existsSync(`${path}/cache/launches/nasa.json`)) {
                    let jsonData = JSON.parse(fs.readFileSync(`${path}/cache/launches/nasa.json`, 'utf-8'))
                    if (Date.parse(jsonData[0].date) < Date.now()) {
                        await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=NASA').then(handleResponse).then(data => {
                            let writeData = [];
                            for (let i = 0; i < data.results.length; i++) {
                                let pushObj = {
                                    date: data.results[i]?.window_end,
                                    name: data.results[i]?.name,
                                    rocket: data.results[i].rocket.configuration?.full_name,
                                    mission: data.results[i].mission?.name || "Not specified",
                                    missionDesc: data.results[i].mission?.description || "Not specified",
                                    padName: data.results[i]?.pad.name,
                                    padLocation: data.results[i]?.pad.location.name,
                                    country: data.results[i]?.country_code,
                                    image: data.results[i]?.image
                                }
                                writeData.push(pushObj)
                            }
                            fs.writeFileSync(`${path}/cache/launches/nasa.json`, JSON.stringify(writeData))
                            console.log('Success!')
                            updateLimit();
                        })
                    } else if (Date.parse(jsonData[0].date) > Date.now()) {
                        return console.log('Success!')
                    }
                } else if (!fs.existsSync(`${path}/cache/launches/nasa.json`) || (fs.existsSync(`${path}/cache/launches/nasa.json`) && fs.readFileSync(`${path}/cache/launches/nasa.json`).length === 0)) {
                    await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=NASA').then(handleResponse).then(data => {
                        let writeData = [];
                        for (let i = 0; i < data.results.length; i++) {
                            let pushObj = {
                                date: data.results[i]?.window_end,
                                name: data.results[i]?.name,
                                rocket: data.results[i].rocket.configuration?.full_name,
                                mission: data.results[i].mission?.name || "Not specified",
                                missionDesc: data.results[i].mission?.description || "Not specified",
                                padName: data.results[i]?.pad.name,
                                padLocation: data.results[i]?.pad.location.name,
                                country: data.results[i]?.country_code,
                                image: data.results[i]?.image
                            }
                            writeData.push(pushObj)
                        }
                        fs.writeFileSync(`${path}/cache/launches/nasa.json`, JSON.stringify(writeData));
                        console.log('Success!');
                        updateLimit();
                    })
                }
            } else if (input === 'spacex') {
                if (fs.existsSync(`${path}/cache/launches/spacex.json`)) {
                    let jsonData = JSON.parse(fs.readFileSync(`${path}/cache/launches/spacex.json`, 'utf-8'))
                    if (Date.parse(jsonData[0].date) < Date.now()) {
                        await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=SpaceX').then(handleResponse).then(data => {
                            let writeData = [];
                            for (let i = 0; i < data.results.length; i++) {
                                let pushObj = {
                                    date: data.results[i]?.window_end,
                                    name: data.results[i]?.name,
                                    rocket: data.results[i].rocket.configuration?.full_name,
                                    mission: data.results[i].mission?.name || "Not specified",
                                    missionDesc: data.results[i].mission?.description || "Not specified",
                                    padName: data.results[i]?.pad.name,
                                    padLocation: data.results[i]?.pad.location.name,
                                    country: data.results[i]?.country_code,
                                    image: data.results[i]?.image
                                }
                                writeData.push(pushObj)
                            }
                            fs.writeFileSync(`${path}/cache/launches/spacex.json`, JSON.stringify(writeData));
                            console.log('Success!');
                            updateLimit();
                        })
                    } else if (Date.parse(jsonData[0].date) > Date.now()) {
                        return console.log('Success!')
                    }
                } else if (!fs.existsSync(`${path}/cache/launches/spacex.json`) || (fs.existsSync(`${path}/cache/launches/spacex.json`) && fs.readFileSync(`${path}/cache/launches/spacex.json`).length === 0)) {
                    await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=SpaceX').then(handleResponse).then(data => {
                        let writeData = [];
                        for (let i = 0; i < data.results.length; i++) {
                            let pushObj = {
                                date: data.results[i]?.window_end,
                                name: data.results[i]?.name,
                                rocket: data.results[i].rocket.configuration?.full_name,
                                mission: data.results[i].mission?.name || "Not specified",
                                missionDesc: data.results[i].mission?.description || "Not specified",
                                padName: data.results[i]?.pad.name,
                                padLocation: data.results[i]?.pad.location.name,
                                country: data.results[i]?.country_code,
                                image: data.results[i]?.image
                            }
                            writeData.push(pushObj)
                        }
                        fs.writeFileSync(`${path}/cache/launches/spacex.json`, JSON.stringify(writeData));
                        console.log('Success!')
                        updateLimit();
                    })
                }
            } else if (input === 'isro') {
                if (fs.existsSync(`${path}/cache/launches/isro.json`)) {
                    let jsonData = JSON.parse(fs.readFileSync(`${path}/cache/launches/isro.json`, 'utf-8'))
                    if (Date.parse(jsonData[0].date) < Date.now()) {
                        await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=ISRO').then(handleResponse).then(data => {
                            let writeData = [];
                            for (let i = 0; i < data.results.length; i++) {
                                let pushObj = {
                                    date: data.results[i]?.window_end,
                                    name: data.results[i]?.name,
                                    rocket: data.results[i].rocket.configuration?.full_name,
                                    mission: data.results[i].mission?.name || "Not specified",
                                    missionDesc: data.results[i].mission?.description || "Not specified",
                                    padName: data.results[i]?.pad.name,
                                    padLocation: data.results[i]?.pad.location.name,
                                    country: data.results[i]?.country_code,
                                    image: data.results[i]?.image
                                }
                                writeData.push(pushObj)
                            }
                            fs.writeFileSync(`${path}/cache/launches/isro.json`, JSON.stringify(writeData))
                            console.log('Success!')
                            updateLimit();
                        })
                    } else if (Date.parse(jsonData[0].date) > Date.now()) {
                        return console.log('Success!')
                    }
                } else if (!fs.existsSync(`${path}/cache/launches/isro.json`) || (fs.existsSync(`${path}/cache/launches/isro.json`) && fs.readFileSync(`${path}/cache/launches/isro.json`).length === 0)) {
                    await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=ISRO').then(handleResponse).then(data => {
                        let writeData = [];
                        for (let i = 0; i < data.results.length; i++) {
                            let pushObj = {
                                date: data.results[i]?.window_end,
                                name: data.results[i]?.name,
                                rocket: data.results[i].rocket.configuration?.full_name,
                                mission: data.results[i].mission?.name || "Not specified",
                                missionDesc: data.results[i].mission?.description || "Not specified",
                                padName: data.results[i]?.pad.name,
                                padLocation: data.results[i]?.pad.location.name,
                                country: data.results[i]?.country_code,
                                image: data.results[i]?.image
                            }
                            writeData.push(pushObj)
                        }
                        fs.writeFileSync(`${path}/cache/launches/isro.json`, JSON.stringify(writeData));
                        console.log('Success!')
                        updateLimit();
                    })
                }
            }
        }
    }
}