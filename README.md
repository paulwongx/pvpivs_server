Cost of storage

File size = 1.5MB
Number of pokemon (excl shadows) = 1079

Total = 1.62 GB

TODO:
- Filter to remove shadow pokemon when getting popular pokemon
- Check that the number of pokmeon in the gameMaster didn't change

Fixes:
- Fix the following pokemon that cannot be mapped
```
Could not map the following pokemon to speciesId: {
    "dex": 487,
    "name": "Giratina (Altered Forme)",
    "sel": []
}
Could not map the following pokemon to speciesId: {
    "dex": 150,
    "name": "Shadow Mewtwo",
    "sel": []
}
Could not map the following pokemon to speciesId: {
    "dex": 555,
    "name": "Galarian Darmanitan",
    "sel": []
}
Could not map the following pokemon to speciesId: {
    "dex": 208,
    "name": "Shadow Steelix",
    "sel": []
}
Could not map the following pokemon to speciesId: {
    "dex": 487,
    "name": "Giratina (Origin Forme)",
    "sel": []
}
```

Notes:
- Need to use `node-fetch` because it is one of the only options that can use `commonjs`
  - Need to install `node-fetch@2.0` though and not the latest, otherwise it won't work
