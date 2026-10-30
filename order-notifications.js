/* Supabase-only order storage and WhatsApp notification. */
(function () {
  const supaConfig = window.JOEL_SUPABASE_CONFIG || {};
  const orderConfig = window.JOEL_ORDER_CONFIG || {};
  function client() {
    if (!window.supabase || !supaConfig.url || !supaConfig.anonKey) throw new Error("Supabase is not configured. Refresh and try again.");
    return window.supabase.createClient(supaConfig.url, supaConfig.anonKey);
  }
  function openWhatsApp(message) {
    const phone = String(orderConfig.ownerWhatsApp || "918610493135").replace(/[^0-9]/g, "");
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
    const tab = window.open(url, "_blank");
    if (!tab) window.location.assign(url);
  }
  async function uploadOrderFiles(args) {
    const db = client();
    const bucket = supaConfig.bucket || "joel-site-media";
    const files = args.files || [];
    const result = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const safe = String(file.name || ("image-" + (i + 1) + ".png")).replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = "orders/" + args.orderId + "/" + String(i + 1).padStart(2, "0") + "-" + safe;
      const uploaded = await db.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type || "application/octet-stream", cacheControl: "3600" });
      if (uploaded.error) throw new Error("Image upload failed: " + uploaded.error.message);
      const link = db.storage.from(bucket).getPublicUrl(path);
      result.push({ name: file.name, url: link.data.publicUrl, path: path });
    }
    return result;
  }
  async function saveOrder(order) {
    const db = client();
    const result = await db.from("customer_orders").insert({
      order_id: order.orderId, order_type: order.orderType,
      customer_name: order.customer.name, customer_phone: order.customer.phone,
      customer_address: order.customer.address, total_price: order.totalPrice,
      order_details: order.details, image_links: order.imageLinks, status: "new"
    });
    if (result.error) throw new Error("Order database save failed: " + result.error.message);
  }
  window.JoelOrderNotifications = { uploadOrderFiles: uploadOrderFiles, saveOrder: saveOrder, openWhatsApp: openWhatsApp };
})();