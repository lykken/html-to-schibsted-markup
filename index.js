module.exports = (html) => {
  return extract(html);
};

function extract(html) {
  const links = extractLinks(html);
  const styles = []
    .concat(extractTag(html, "em"))
    .concat(extractTag(html, "strong"))
    .concat(extractTag(html, "sub", "subscript"))
    .concat(extractTag(html, "sup", "superscript"))
    .concat(extractTag(html, "hightlight")) // TODO: I don't think we can grab this from something predefined
    .concat(extractTag(html, "symbol"))
    .concat(extractTag(html, "u", "underline")); // TODO: Probably not very common, but it's the best match in HTML5

  return {
    value: stripTags(html),
    markup: links.concat(styles),
  };
}

/**
 * Extracts a elements from html.
 * @param {*} html
 */
function extractLinks(html) {
  const regex = /<a.*?href=['"](.*?)['"]>(.*?)<\/a>/gi;
  const links = extractByRegex(html, regex);

  return links.map((link) => {
    return {
      type: "link:external", // TODO: detect internal links
      offset: stripTags(link.input.slice(0, link.index)).length,
      length: link[2].length,
      uri: link[1],
    };
  });
}

function extractTag(html, tag, styleName = tag) {
  const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, "gi");

  const tags = extractByRegex(html, regex);

  return tags.map((tag) => {
    return {
      type: `style:${styleName}`,
      length: stripTags(tag[1]).length,
      offset: stripTags(tag.input.slice(0, tag.index)).length,
    };
  });
}

function stripTags(html) {
  return html.replace(/<[^>]*>?/gm, "");
}

function extractByRegex(html, regex) {
  const result = [];
  let m;

  while ((m = regex.exec(html)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    result.push(m);
  }

  return result;
}
