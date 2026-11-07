import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const hex=(buffer:ArrayBuffer)=>Array.from(new Uint8Array(buffer)).map(b=>b.toString(16).padStart(2,"0")).join("");
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 try{
  const env=(k:string)=>Deno.env.get(k)||"",url=env("SUPABASE_URL"),service=env("SUPABASE_SERVICE_ROLE_KEY"),secret=env("RAZORPAY_KEY_SECRET");
  if(!url||!service||!secret)return json({error:"Payment verification is not configured."},503);
  const body=await req.json(),orderId=String(body.orderId||""),rpOrder=String(body.razorpayOrderId||""),paymentId=String(body.razorpayPaymentId||""),signature=String(body.razorpaySignature||"");
  if(!orderId||!rpOrder||!paymentId||!signature)return json({error:"Missing payment verification details."},400);
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const expected=hex(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(rpOrder+"|"+paymentId)));
  if(expected.length!==signature.length)return json({verified:false,error:"Payment signature is invalid."},400);
  let mismatch=0;for(let i=0;i<expected.length;i++)mismatch|=expected.charCodeAt(i)^signature.toLowerCase().charCodeAt(i);
  if(mismatch!==0)return json({verified:false,error:"Payment signature is invalid."},400);
  const db=createClient(url,service);
  const {data:order,error}=await db.from("customer_orders").select("order_id,razorpay_order_id,payment_status").eq("order_id",orderId).maybeSingle();
  if(error||!order||order.razorpay_order_id!==rpOrder)return json({verified:false,error:"Payment order does not match the saved order."},400);
  const {error:updateError}=await db.from("customer_orders").update({payment_status:"paid",razorpay_payment_id:paymentId,status:"paid"}).eq("order_id",orderId);
  if(updateError)return json({verified:false,error:"Payment verified, but order status update failed. Contact support."},500);
  return json({verified:true,orderId});
 }catch(e){return json({verified:false,error:e instanceof Error?e.message:"Unexpected verification error."},500)}
});