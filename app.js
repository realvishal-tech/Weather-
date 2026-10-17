const $=id=>document.getElementById(id);
let weather=null, fahrenheit=false;
const n=(v,fallback="—")=>v===undefined||v===null||v===""?fallback:v;
const toF=c=>Math.round(Number(c)*9/5+32);
const degrees=c=>fahrenheit?toF(c):Math.round(Number(c));
function status(message,type=""){const el=$("status");el.textContent=message;el.className=type;}
function uvLabel(v){v=Number(v);if(!Number.isFinite(v))return"Not available";if(v<=2)return"Low exposure";if(v<=5)return"Moderate exposure";if(v<=7)return"High exposure";if(v<=10)return"Very high exposure";return"Extreme exposure";}
function render(data){
 weather=data;const l=data.location||{},c=data.current||{};
 if(!l.name||c.temperature===undefined)throw new Error("The provider returned incomplete weather data.");
 const loc=[l.name,l.region].filter(Boolean).join(", ");
 $("place").textContent=loc;$("placeMeta").textContent=[l.country,l.localtime?`Local time ${l.localtime}`:"",l.timezone_id].filter(Boolean).join(" · ");
 $("temp").textContent=degrees(c.temperature);$("unitLabel").textContent=fahrenheit?"F":"C";
 $("description").textContent=c.weather_descriptions?.[0]||"Current conditions";
 $("feels").textContent=`Feels like ${degrees(c.feelslike)}°${fahrenheit?"F":"C"}`;
 $("observed").textContent=`Observed ${n(c.observation_time)}`;
 $("windHero").textContent=`Wind ${n(c.wind_speed)} km/h`;
 $("humidityHero").textContent=`Humidity ${n(c.humidity)}%`;
 $("humidity").textContent=`${n(c.humidity)}%`;$("humidityBar").style.width=`${Math.min(100,Math.max(0,Number(c.humidity)||0))}%`;
 $("wind").textContent=`${n(c.wind_speed)} km/h`;$("windBar").style.width=`${Math.min(100,Math.max(4,Number(c.wind_speed)||0))}%`;
 $("uv").textContent=n(c.uv_index);$("uvLabel").textContent=uvLabel(c.uv_index);$("uvBar").style.width=`${Math.min(100,Math.max(0,(Number(c.uv_index)||0)/11*100))}%`;
 $("visibility").textContent=`${n(c.visibility)} km`;$("visibilityBar").style.width=`${Math.min(100,Math.max(0,(Number(c.visibility)||0)/10*100))}%`;
 $("pressure").innerHTML=`${n(c.pressure)} <i>mb</i>`;$("precip").innerHTML=`${n(c.precip)} <i>mm</i>`;$("cloud").innerHTML=`${n(c.cloudcover)}<i>%</i>`;$("gust").innerHTML=`${n(c.wind_speed)} <i>km/h</i>`;
 $("detailPlace").textContent=`${loc} · Latest observation`;
 document.querySelectorAll(".detail-line i")[0].style.width=`${Math.min(100,Math.max(10,Number(c.pressure||1013)/1100*100))}%`;
 document.querySelectorAll(".detail-line i")[1].style.width=`${Math.min(100,Math.max(5,Number(c.precip||0)*10))}%`;
 document.querySelectorAll(".detail-line i")[2].style.width=`${Math.min(100,Math.max(0,Number(c.cloudcover)||0))}%`;
 document.querySelectorAll(".detail-line i")[3].style.width=`${Math.min(100,Math.max(5,Number(c.wind_speed)||0))}%`;
 const icon=c.weather_icons?.[0]; if(icon){document.querySelector(".weather-art").style.setProperty("--weather-icon",`url("${icon}")`);}
 status(`Live current conditions loaded for ${loc}.`,"success");
 $("unit").innerHTML=fahrenheit?'°F <span>/</span> °C':'°C <span>/</span> °F';
}
async function loadWeather(query){
 query=String(query||"").trim();if(!query)return;
 status(`Finding current conditions for ${query}…`);
 const btn=$("searchForm").querySelector("button");btn.disabled=true;
 try{
  const response=await fetch(`/api/weather?query=${encodeURIComponent(query)}`,{headers:{Accept:"application/json"}});
  const data=await response.json();
  if(!response.ok||data.error)throw new Error(data?.error?.info||"Unable to retrieve weather.");
  render(data);
 }catch(e){status(e.message||"Weather service unavailable. Please try again.","error");}
 finally{btn.disabled=false;}
}
$("searchForm").addEventListener("submit",e=>{e.preventDefault();loadWeather($("city").value);});
$("unit").addEventListener("click",()=>{fahrenheit=!fahrenheit;$("unit").innerHTML=fahrenheit?'°F <span>/</span> °C':'°C <span>/</span> °F';if(weather)render(weather);});
$("refresh").addEventListener("click",()=>loadWeather($("city").value));
$("locate").addEventListener("click",()=>{
 if(!navigator.geolocation){status("Location is not supported by this browser.","error");return;}
 status("Requesting your location…");
 navigator.geolocation.getCurrentPosition(pos=>{
   loadWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
 },()=>status("Location permission was denied. Search for a city instead.","error"),{timeout:10000,maximumAge:300000});
});
$("theme").addEventListener("click",()=>{document.body.classList.toggle("light");$("theme").textContent=document.body.classList.contains("light")?"☾":"☼";});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("/sw.js").catch(()=>{});
loadWeather($("city").value);
