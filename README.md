# html-to-schibsted-markup

The html-to-schibsted-markup module will try to create a Schibsted markup object from a HTML fragment.

## Install

```
npm i html-to-schibsted-markup
```

## Usage

```javascript
const converter = require('html-to-schibsted-markup');
const obj = converter(
  'Try <a href="mailto:julenissen@nordpolen.no">sending an email to Santa Claus</a> if you like!';
);
```

`obj` should now be as follows:

```javascript
{
  value: "Try sending an email to Santa Claus if you like!",
  markup: [
    {
      type: "link:external",
      offset: 4,
      length: 31,
      uri: "mailto:julenissen@nordpolen.no",
    },
  ],
}
```

## Contributing

PRs accepted.

## License

MIT © Fædrelandsvennen
