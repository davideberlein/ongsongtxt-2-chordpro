# OnSong text 2 chord pro converter
Simple node tool that allows to to convert song sheets in [OnSong](https://onsongapp.com/) text format to chordpro so they can be used by apps like [MobileSheets](https://www.zubersoft.com/mobilesheets/).
This allows sharing one set of sheets between iOS (OnSong) and Android (MobileSheets) devices.

# Installation & Running

**For now:**
Simply clone this repo and run:
```
npm install
```
for installation, after that you can call 
```
npm run build
```
Every time you want to convert your files. This will automatically take every **.txt* file from the `src` folder, convert it to `*.chordpro` and save it in the `build` folder.

**In the works:**
Proper npm and command line usage is in the works.
<!---`npm install ongsongtxt-2-chordpro -g`--->
