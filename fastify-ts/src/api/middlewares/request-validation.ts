/**
 * Used when validating request `body` for `multipart/form-data` content type
 * on route with method `POST` or another route that really required request body.
 *
 * Ref: How do I test for an empty JavaScript object?
 * https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
 *
 */
export const isBodyEmpty: (body: Record<string, unknown>) => boolean = function isBodyEmpty(body) {
  if (!body) return true;

  if (body && Object.keys(body).length === 0 && body.constructor === Object) return true;

  return false;
};

export default isBodyEmpty;
