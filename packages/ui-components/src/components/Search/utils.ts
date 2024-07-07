function removeHtmlTags(input: string): string {
  let previous;
  do {
    previous = input;
    input = input.replace(/<[^>]*>?/gm, '');
  } while (input !== previous);
  return input;
}

export function cleanDescription(description: string): string {
  let output = description;
  // remove html tags from description (e.g. <h1...>)
  output = removeHtmlTags(output);
  // remove markdown links from description (e.g. [link](url))
  output = output.replace(/\(.*?\)/gm, '').replace(/(\[!?|\])/gm, '');
  return output;
}
