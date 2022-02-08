## Charcode pictures generator

This script will generate a picture of a unicode character in the `out` folder at the root of the repo.

⚠️ By default it will try to generate all unicode characters, it can take some space on your computer. If you only want a part of the unicode range, update the constants `UNICODE_START_RANGE` and `UNICODE_END_RANGE` (you can use https://jrgraphix.net/research/unicode_blocks.php to check available ranges).

```bash
yarn install

yarn start
```

## Known issues

- The default font used do not contains infos about all unicode chars. You will probably need to use a custom one according to your needs.