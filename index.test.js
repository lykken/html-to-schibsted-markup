const converter = require(".");

describe("html-to-schibsted-markup tests", () => {
  test("no html to convert", () => {
    const html = "hello world";

    const result = converter(html);
    expect(result).toEqual({
      value: "hello world",
      markup: [],
    });
  });

  test("convert an external link", () => {
    const html =
      'De fleste regioner i Spania har likevel «grønne» tall, men<a href="https://www.aftenposten.no/norge/i/70EPdv/nordmenn-skynder-seg-hjem-og-regjeringens-ordning-skaper-debatt-slik"> det er ikke aktuelt å komme med lokale unntak i Spania</a> slik det er blitt gjort med de nordiske landene, ifølge Helsedepartementet. ';

    const result = converter(html);
    expect(result).toEqual({
      value:
        "De fleste regioner i Spania har likevel «grønne» tall, men det er ikke aktuelt å komme med lokale unntak i Spania slik det er blitt gjort med de nordiske landene, ifølge Helsedepartementet. ",
      markup: [
        {
          type: "link:external",
          offset: 58,
          length: 55,
          uri:
            "https://www.aftenposten.no/norge/i/70EPdv/nordmenn-skynder-seg-hjem-og-regjeringens-ordning-skaper-debatt-slik",
        },
      ],
    });
  });

  test("convert two external links", () => {
    const html =
      'Ifølge OECD utgjør<a href="http://www.oecd.org/industry/tourism/"> turisme 12 prosent </a>av Spanias BNP. 23 prosent av alle overnattinger på turiststeder rundt om i Europa (under et vanlig år) finner sted i Spania,<a href="https://ec.europa.eu/eurostat/statistics-explained/pdfscache/1171.pdf"> viser statistikk fra EU</a>. Det er klart mest av alle europeiske land.';

    const result = converter(html);
    expect(result).toEqual({
      value:
        "Ifølge OECD utgjør turisme 12 prosent av Spanias BNP. 23 prosent av alle overnattinger på turiststeder rundt om i Europa (under et vanlig år) finner sted i Spania, viser statistikk fra EU. Det er klart mest av alle europeiske land.",
      markup: [
        {
          type: "link:external",
          offset: 18,
          length: 20,
          uri: "http://www.oecd.org/industry/tourism/",
        },
        {
          type: "link:external",
          offset: 163,
          length: 24,
          uri:
            "https://ec.europa.eu/eurostat/statistics-explained/pdfscache/1171.pdf",
        },
      ],
    });
  });

  test("convert a mailto link", () => {
    const html =
      'Prøv gjerne å <a href="mailto:julenissen@nordpolen.no">sende en mail til julenissen</a> hvis du vil';

    const result = converter(html);
    expect(result).toEqual({
      value: "Prøv gjerne å sende en mail til julenissen hvis du vil",
      markup: [
        {
          type: "link:external", // TODO: Or something else?
          offset: 14,
          length: 28,
          uri: "mailto:julenissen@nordpolen.no",
        },
      ],
    });
  });

  test("convert a mailto link, this time in english :smile:", () => {
    const html =
      'Try <a href="mailto:julenissen@nordpolen.no">sending an email to Santa Claus</a> if you like!';

    const result = converter(html);
    expect(result).toEqual({
      value: "Try sending an email to Santa Claus if you like!",
      markup: [
        {
          type: "link:external", // TODO: Or something else?
          offset: 4,
          length: 31,
          uri: "mailto:julenissen@nordpolen.no",
        },
      ],
    });
  });

  test("convert an em to style:em", () => {
    const html = "<em>– Er du mest bekymret for koronaen eller økonomien?</em>";

    const result = converter(html);
    expect(result).toEqual({
      value: "– Er du mest bekymret for koronaen eller økonomien?",
      markup: [
        {
          type: "style:em",
          offset: 0,
          length: 51,
        },
      ],
    });
  });

  test("convert styles em and strong to schibsted markup", () => {
    const html =
      "<em>– Er du mest bekymret for koronaen eller <strong>økonomien</strong>?</em>";

    const result = converter(html);
    expect(result).toEqual({
      value: "– Er du mest bekymret for koronaen eller økonomien?",
      markup: [
        {
          type: "style:em",
          offset: 0,
          length: 51,
        },
        {
          type: "style:strong",
          offset: 41,
          length: 9,
        },
      ],
    });
  });
});
