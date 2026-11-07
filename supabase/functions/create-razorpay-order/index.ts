import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 try{
  const env=(k:string)=>Deno.env.get(k)||"";
  const url=env("SUPABASE_URL"),service=env("SUPABASE_SERVICE_ROLE_KEY"),key=env("RAZORPAY_KEY_ID"),secret=env("RAZORPAY_KEY_SECRET");
  if(!url||!service||!key||!secret)return json({error:"Payment gateway is not configured. Ask the site administrator to add Razorpay secrets."},503);
  const body=await req.json(),orderId=String(body.orderId||"");
  if(!/^JFW(?:-C)?-\d{8}-[A-Z0-9]{4,6}$/.test(orderId))return json({error:"Invalid Joel order reference."},400);
  const db=createClient(url,service);
  const {data:order,error}=await db.from("customer_orders").select("order_id,total_price,status,payment_status,razorpay_order_id").eq("order_id",orderId).maybeSingle();
  if(error||!order)return json({error:"Saved order was not found."},404);
  if(order.payment_status==="paid")return json({error:"This order is already paid."},409);
  const amount=Math.round(Number(order.total_price)*100);
  if(!Number.isFinite(amount)||amount<100)return json({error:"Invalid order amount."},400);
  const auth=btoa(key+":"+secret);
  const rp=await fetch("https://api.razorpay.com/v1/orders",{method:"POST",headers:{"Authorization":"Basic "+auth,"Content-Type":"application/json"},body:JSON.stringify({amount,currency:"INR",receipt:orderId,notes:{joel_order_id:orderId}})});
  const payment=await rp.json();
  if(!rp.ok)return json({error:payment.error?.description||"Razorpay could not create the payment order."},502);
  const {error:updateError}=await db.from("customer_orders").update({razorpay_order_id:payment.id,payment_status:"pending",status:"payment_pending",customer_name:String(body.customer?.name||""),customer_phone:String(body.customer?.phone||""),customer_address:String(body.customer?.address||"")}).eq("order_id",orderId);
  if(updateError)return json({error:"Could not update saved order for payment."},500);
  return json({keyId:key,razorpayOrderId:payment.id,amount:payment.amount,currency:payment.currency});
 }catch(e){return json({error:e instanceof Error?e.message:"Unexpected payment error."},500)}
});