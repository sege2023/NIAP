
export async function onRequest(context: any) {
  const { request, env } = context;
  
  const BACKEND_URL = env.VITE_API_URL || '';
  
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/api/').slice(1);
  const backendPath = pathSegments.join('/api/');
  
  // Construct the backend URL
  const backendUrl = `${BACKEND_URL}/api/${backendPath}${url.search}`;
  
  try {
    // Forward the request to your backend
    const backendRequest = new Request(backendUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.text() 
        : undefined,
    });
    
    // Get response from backend
    const backendResponse = await fetch(backendRequest);
    
    // Create a new response with the backend's data
    const response = new Response(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: backendResponse.headers,
    });
    
    response.headers.set('Access-Control-Allow-Origin', url.origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    return response;
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Proxy error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions(context: any) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': new URL(context.request.url).origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}