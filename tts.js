const gtts = require('gtts');

function generateMp3(filename, speech, lang) {
    const speechObj = new gtts(speech, lang=lang);
    speechObj.save('' + filename, (error, result) => {
        if (error) {
            throw new Error(error);
        }
        console.log('made a mp3');
    });
}

async function getLanguages() {
    // grrr.. have to instantiate to grab the languages
    var temp = gtts('temp','en',false);
    return temp.LANGUAGES;
}

exports.generateMp3 = generateMp3;
exports.getLanguages = getLanguages;

