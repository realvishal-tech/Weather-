export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/api/weather") {
   if (request.method !== "GET") return Response.json({error:{info:"Method not allowed."}},{status:405});
   const query=(url.searchParams.get("query")||"").trim();
   if(!query||query.length>120)return Response.json({error:{info:"Enter a valid city or location."}},{status:400});
   if(!env.WEATHERSTACK_API_KEY)return Response.json({error:{info:"Weather API key is missing. Add WEATHERSTACK_API_KEY under Worker secrets."}},{status:500});
   try{
    const api=new URL("https://api.weatherstack.com/current");
    api.searchParams.set("access_key",env.WEATHERSTACK_API_KEY);api.searchParams.set("query",query);
    const upstream=await fetch(api.toString(),{headers:{Accept:"application/json"},signal:AbortSignal.timeout(12000)});
    const data=await upstream.json();
    if(!upstream.ok||data.error)return Response.json({error:{info:data?.error?.info||"Weather provider request failed."}},{status:502,headers:{"Cache-Control":"no-store"}});
    return Response.json(data,{headers:{"Cache-Control":"public, max-age=300","Access-Control-Allow-Origin":"*"}});
   }catch{return Response.json({error:{info:"Weather service is temporarily unavailable. Check connection and try again."}},{status:502});}
  }
  const response=await env.ASSETS.fetch(request);
  if(response.status!==404)return response;
  return new Response("Not found",{status:404,headers:{"Content-Type":"text/plain; charset=utf-8"}});
 }
};