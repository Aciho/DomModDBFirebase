import Ember from 'ember';
import JSZip from 'jszip';
import random from 'random';

export default Ember.Component.extend({
  title: null,
  subtitle: null,
  version: null,
  type: null,
  description: null,
  firebaseApp: Ember.inject.service(),
  ajax: Ember.inject.service(),
  actions: {
    closeDialog(param) {
      this.get('doClose')(param)
    },
    uploadArchiveAction(event) {
      this.file = event.currentTarget.files[0];

      const toHex = (floatString) => {
        const val = parseFloat(floatString)*256;
        const fixed = Math.round(val);
        const hex = fixed.toString(16);
        console.log(val, fixed, hex);
        return hex;
      };

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.zipFile = event.target.result;
          // First unzip the file and find a dm
          JSZip.loadAsync(this.zipFile)
            .then((zip) => {
              console.log('zip parsed', zip);
              Ember.set(this, 'disableForm', false);

              let dmFiles = zip.file(/^[^/]+\.dm/);

              if (dmFiles.length !== 1) {
                //Something went wrong
                console.log("Can't find one dm", dmFiles, this.zipFile);
                Ember.set(this, 'title', this.zipFile.name.split('.')[0]);
                reject("Can't find one dm");
              }
              else {
                console.log(dmFiles[0]);
                return dmFiles[0].async("string");
              }
            })
            // If we can find one, fill out the form fields
            .then((data) => {
              let mod = String(data);
              const version = /#version\s*(.*)/.exec(mod);
              Ember.set(this, 'version', version[1]);

              const foundNations = mod.match(/#selectnation|#newnation/);
              console.log(foundNations);
              if (foundNations.length === 1) {
                // Strip out everything between selectnation/newnation and #end
                mod = mod.substr(foundNations['index']);
                const endNation = mod.match(/#end/);
                mod = mod.substr(0, endNation['index']);
                console.log(mod);

                // Go through line by line
                const nationName = mod.match(/#name \"([^\"]+)/);
                if (nationName.length > 1) {
                  Ember.set(this, 'title', nationName[1]);
                }
                const nationSub = mod.match(/#epithet \"([^\"]+)/);
                if (nationSub.length > 1) {
                  Ember.set(this, 'subtitle', nationSub[1]);
                }
                const nationEra = mod.match(/#era (.)/);
                if (nationEra.length > 1) {
                  switch (nationEra[1]) {
                    case '0':
                      Ember.set(this, 'type', 'Early Era');
                      break;
                    case '1':
                      Ember.set(this, 'type', 'Middle Era');
                      break;
                    case '2':
                      Ember.set(this, 'type', 'Late Era');
                      break;
                  }
                }
                const nationDesc = mod.match(/#descr \"([^\"]+)/);
                if (nationDesc.length > 1) {
                  Ember.set(this, 'description', nationDesc[1].substr(0, 1000));
                }

                const nationColorBg = mod.match(/#color ([0-9\.]+) ([0-9\.]+) ([0-9\.]+)/);
                const nationColorFg = mod.match(/#secondarycolor ([0-9\.]+) ([0-9\.]+) ([0-9\.]+)/);

                console.log(nationColorBg);
                console.log(nationColorFg);

                if (nationColorBg && nationColorBg.length === 4) {
                  const bgColor = '#' + toHex(nationColorBg[1]) + toHex(nationColorBg[2]) + toHex(nationColorBg[3]);
                  console.log(bgColor);
                  if (bgColor.length === 7) {
                    Ember.set(this, 'bgColor', bgColor);
                  }
                }
                if (nationColorFg && nationColorFg.length === 4) {
                  const fgColor = '#' + toHex(nationColorFg[1]) + toHex(nationColorFg[2]) + toHex(nationColorFg[3]);
                  console.log(fgColor);
                  if (fgColor.length === 7) {
                    Ember.set(this, 'fgColor', fgColor);
                  }
                }
              }
              else {
                const titles = /#modname\s*["'`]([^"'`]+)/.exec(mod);
                const titleText = titles[1].split(',');
                console.log(titleText);
                Ember.set(this, 'title', titleText[0].trim());
                if (titleText.length > 1) {
                  Ember.set(this, 'subtitle', titleText[1].trim());
                }
              }
            })
            .then(resolve);
        };
        reader.readAsArrayBuffer(this.file);
      });
    },
    submitFormAction() {
      const store = this.get('_targetObject.store');
      //Choose a random slug
      const fileName = random(6) + '_' + this.file.name.split('/').pop().replace(/\s/g,'');

      // Check for duplicate name/version pair
      store.query('dom-mod', {
        filter: {
          version: this.version,
          title: this.title
        }
      })
      .then((queryResult) => {
        console.log(queryResult);
        if (queryResult.length > 0) {
          reject('This version and mod name already exists');
        }
        console.log('query ok');
      })
      .then(() => {
        const storageRef = this.get('firebaseApp').storage().ref();
        const fileRef = storageRef.child(`uploads/${fileName}`);

        return fileRef.put(this.zipFile);
      })
      .then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
      })
      .then((result) => {
        console.log('newmod', result);
        const newMod = store.createRecord('dom-mod', {
          title: this.title,
          subtitle: this.subtitle,
          type: this.type,
          version: this.version,
          description: this.description,
          filename: fileName,
          fgColor: this.fgColor,
          bgColor: this.bgColor
        });
        newMod.save();
        return newMod;
      })
      .then((result) => {
        console.log('result', result);
        this.get('doClose')(true);
      });
    }
  },
  groupedTypes: [
    {groupName: 'Nation Mods', options: ['Early Era', 'Middle Era', 'Late Era', 'Other Era']},
    {groupName: 'Other Mods', options: ['Balance Mod', 'Total Conversion', 'NationGen', 'Additional Content', 'Other']}
  ],
  disableForm: true
});


// Store the zip file ready for the DB submit


// const file = event.currentTarget.files[0];
// const url = 'https://us-central1-dom4modbrowser.cloudfunctions.net/upload';
// console.log(file);
//
// return new Promise((resolve, reject) => {
//   const promises = [];
//   console.log("promise 0");
//
//   // promises.push((data) => {
//   //   console.log("promise 1");
//   //   return this.get('ajax').request(url, {
//   //       method: 'POST',
//   //       data: {
//   //         name: file.name,
//   //         data: data
//   //       }
//   //     })
//   //       .then((data) =>
//   //       {
//   //         console.log("promise 1b");
//   //         console.log(data);
//   //         this.filename = data.filename;
//   //         return(data.filename);
//   //       });
//   //   }
//   // );
//
//   promises.push((data) => {
//     console.log("promise 2");
//     return JSZip.loadAsync(data)
//     .then((zip) => {
//       console.log('zip parsed', zip);
//       let dmFiles = zip.file(/^[^/]+\.dm/);
//
//       if (dmFiles.length !== 1) {
//         //Something went wrong
//         console.log("Can't find one dm", dmFiles);
//         reject("Can't find one dm");
//       }
//       else {
//         console.log(dmFiles[0]);
//         return dmFiles[0].async("string");
//       }
//     })
//     .then((data)=> {
//       console.log(`Parse complete`);
//       return data;
//     })}
//   );
//
//   const reader = new FileReader();
//   reader.onload = (event) => {
//     Promise.all(promises.map(callback => callback(event.target.result)))
//       .then((data) => {
//         const mod = String(data);
//         const version = /#version\s*(.*)/.exec(mod);
//         Ember.set(this, 'version', version[1]);
//
//         const numNations = mod.match(/#selectnation|#newnation/).length;
//         if (numNations === 1) {
//           // We can get extra data
//         }
//         else {
//           const titles = /#modname\s*["'`]([^"'`]+)/.exec(mod);
//           const titleText = titles[1].split(',');
//           console.log(titleText);
//           Ember.set(this, 'title', titleText[0].trim());
//           if (titleText.length > 1) {
//             Ember.set(this, 'subtitle', titleText[1].trim());
//           }
//         }
//       })
//       .then(resolve);
//   };
//   reader.readAsArrayBuffer(file);
// });

// reader.onload = ((response) => {
//   return )
// }).then((data) => { ; })
//   .then((zip) => {
//     console.log('zip parsed', zip);
//     let sequence = Promise.resolve();
//     zip.file(/\.dm/).forEach((zipEntry) => {
//       if (!zipEntry.dir) {
//         sequence = sequence.then(function() {
//           return zip.generateInternalStream({type:"nodebuffer"}).accumulate();
//         })
//           .then((zipData) => {
//             console.log(zipData);
//             count++;
//           });
//       }
//     });
//     return sequence;
//   })
//   .then(()=> {
//     console.log(`Upload complete, ${count} files decompressed`);
//   })
//   .catch((err) => {
//     console.error('caught promise error', err);
//   });

// const storageRef = this.get('firebaseApp').storage().ref();
// const fileRef = storageRef.child(`uploads/${randomId(6,'Aa0')}_${file.name}`);
//
// fileRef.put(file).then((snapshot) => {
//   console.log('Uploaded a blob or file!', snapshot, snapshot.a.fullPath);
//   this.filePath = snapshot.a.fullPath;
// });
