// Import vitest and your function
import { expect, test, it, beforeEach } from 'vitest';
import { getHeaders, getUrl } from '../utils/helper';

beforeEach(() => {
  window.sessionStorage.clear();
});

test('getHeaders', () => {
  it('should return headers with the token if it exists', () => {
    const mockToken = 'test-token';
    window.sessionStorage.setItem('lib-token', mockToken);

    const headers = getHeaders();
    expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });
});

test('getUrl', () => {
  it('should create URL with no query parameters if query is not provided', () => {
    const baseUrl = 'https://example.com';
    expect(getUrl(baseUrl).toString()).toBe(baseUrl);
  });

  it('should create URL with query parameters', () => {
    const baseUrl = 'https://example.com';
    const query = { name: 'test', age: 30 };
    expect(getUrl(baseUrl, query).toString()).toBe('https://example.com/?name=test&age=30');
  });

  it('should ignore null, undefined, and empty string values in query', () => {
    const baseUrl = 'https://example.com';
    const query = { name: '', age: null, city: undefined, country: 'USA' };
    expect(getUrl(baseUrl, query).toString()).toBe('https://example.com/?country=USA');
  });

  it('should convert number values in special keys to Unix timestamps', () => {
    const baseUrl = 'https://example.com';
    const date = new Date('2023-01-01T00:00:00Z');
    const query = { updated_at: date.getTime(), last_read: date.getTime() };
    expect(getUrl(baseUrl, query).toString()).toBe(`https://example.com/?updated_at=${date.getTime() / 1000}&last_read=${date.getTime() / 1000}`);
  });
});
