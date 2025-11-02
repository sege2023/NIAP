
// const BASE_URL = import.meta.env.VITE_API_URL || '';

// type RequestOptions = {
//   method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
//   headers?: Record<string, string>;
//   body?: unknown;
//   credentials?: RequestCredentials;
// };

// export const fetchAPI = async (
//   endpoint: string,
//   { method = 'GET', headers = {}, body, credentials = 'include' }: RequestOptions = {}
// ) => {
//   const url = `${BASE_URL}${endpoint}`;
//   const response = await fetch(url, {
//     method,
//     headers: {
//       'Content-Type': 'application/json',
//       ...headers,
//     },
//     credentials,
//     body: body !== undefined ? JSON.stringify(body) : undefined,
//   });

//   if (!response.ok) {
//     const errorBody = await response.text();
//     let errorMessage = `API Error: ${response.status} ${response.statusText}`;
//     try {
//         const jsonError = JSON.parse(errorBody);
//         errorMessage = jsonError.message || errorMessage; 
//     } catch (e) {
//     }
//     throw new Error(errorMessage);
// }
// const contentType = response.headers.get("content-type");
// if (contentType && contentType.includes("application/json")) {
//     return response.json();
// }else{
//   return{}
// }
// };

// utils/api.ts

// IMPORTANT: Set this to empty string or '/' to use relative URLs (same domain)
// This way all requests go through your CF Pages domain, hitting the proxy
const BASE_URL = ''; // Changed from your Render URL

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  credentials?: RequestCredentials;
};

export const fetchAPI = async (
  endpoint: string,
  { method = 'GET', headers = {}, body, credentials = 'include' }: RequestOptions = {}
) => {
  // endpoint will be like "/api/v1/verifycode"
  // With BASE_URL = '', this becomes a relative URL on the same domain
  // CF Pages will route /api/* to your proxy function
  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials, // This will now work since same domain!
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const jsonError = JSON.parse(errorBody);
      errorMessage = jsonError.message || errorMessage;
    } catch (e) {
      // Ignore if error body isn't JSON
    }
    throw new Error(errorMessage);
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return {};
  }
};