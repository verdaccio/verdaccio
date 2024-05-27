export function cleanDescription(description: string) {
  let output = description;
  // remove html tags from description (e.g. <h1...>)
  output = output.replace(/<[^>]*>?/gm, '');
  // remove markdown links from description (e.g. [link](url))
  output = output.replace(/\(.*?\)/gm, '').replace(/(\[!?|\])/gm, '');
  return output;
}
