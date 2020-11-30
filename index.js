const glob = require('glob');
const fs = require('fs');
const path = require('path');
const ongsongTxt2Chordpro = require('./onsongtxt2chordpro');


const INPUT_DIR = `${__dirname}/src/**/*.txt`;
const OUTPUT_DIR = `${__dirname}/build/`;

function replaceFileContent(file, searchValue, replacment) {
    file.contents = String(file.contents).replace(searchValue, replacment);
    return file;
}


// getting all html files
glob.sync(INPUT_DIR)
    .map(absoluteFilePath => ({ name: path.basename(absoluteFilePath), contents: fs.readFileSync(absoluteFilePath, { encoding: "utf8" }) }))
    .map(file => ({ name: file.name, contents: ongsongTxt2Chordpro(file.name, file.contents) }))
    .map(file => replaceFileContent(file, /^(.*)\n/g, '{title:$1}\n'))
    .map(file => replaceFileContent(file, /}\n(.*)\n/g, '}\n{copyright:$1}\n'))
    .map(file => replaceFileContent(file, /^Key:(.*?)$/mg, '{key:$1}'))
    .map(file => replaceFileContent(file, /^Tempo:(.*)$/mg, '{tempo:$1}'))
    .map(file => replaceFileContent(file, /^Time:(.*)$/mg, '{time:$1}'))
    .map(file => replaceFileContent(file, /(\{key:(.*?)}\n\{tempo:(.*?)}\n\{time:(.*?)})/g, '{subtitle:key: $2 | tempo: $3 | time: $4}\n$1'))
    .map(file => replaceFileContent(file, /(.+:)\n/g, '{comment_italic:$1}\n'))
    .map(file => ({ ...file, name: file.name.replace('\.txt', '.chordpro') }))
    .forEach(file => fs.writeFileSync(OUTPUT_DIR + file.name, file.contents, { encoding: "utf8" }));