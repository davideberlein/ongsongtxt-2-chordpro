# OnSong text 2 chord pro converter
Simple node tool that allows to to convert song sheets in [OnSong](https://onsongapp.com/) text format to chordpro so they can be used by apps like [MobileSheets](https://www.zubersoft.com/mobilesheets/).
This allows sharing one set of sheets between iOS (OnSong) and Android (MobileSheets) devices.

# Installation & Running

## Installation
Onsongtxt 2 chordpro can be installed as a global npm module so it can be used from every folder.
```
npm install ongsongtxt-2-chordpro -g
```

## Usage
Calling the command:
```
onsongtxt2chordpro -i <input folder> -o <output folder>
```
will convert every `*.txt` file found in the _input folder_ from its OnSong text format to the chordpro format and will save the converted file to the _output folder_.
The file names will be kept but the extention will be changed to `*.chordpro` so you can use the same folder as source and destination.
## Options
```
  -i, --input    Input directory to look for *.txt files [default: "./src"]
  -o, --output   Output directory to to save thr *.chordpro files to [default: "./build"]
```
 