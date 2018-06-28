/**
 * Mock response for logo api
 * @returns {promise}
 */
export default function() {
  const response = {
    text(){
      return 'http://xyz.com/image.jpg';
    }
  };
  return Promise.resolve(response);
}
