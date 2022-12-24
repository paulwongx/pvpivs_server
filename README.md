# Pokemon GO PVP IV Data

Cost of storage
File size = 1.5MB
Number of pokemon (excl shadows) = 1079
Total = 1.62 GB

TODO:
- [DONE] Filter to remove shadow pokemon when getting popular pokemon
- [DONE] Check that the number of pokmeon in the gameMaster didn't change
- [DONE] If a new GameMaster is downloaded, update the summary IVs
- Optimize the json file such that the summary and each data are just arrays with an object that shows the key in order to minimize the file size

Notes:
- Need to use `node-fetch` because it is one of the only options that can use `commonjs`
  - Need to install `node-fetch@2.0` though and not the latest, otherwise it won't work
