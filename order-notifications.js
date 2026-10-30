/* Supabase-only order storage and WhatsApp notification. */
(function () {
  function getConfig() { return window.JOEL_SUPABASE_CONFIG || {}; }
  function client() {
    const config = getConfig();
    if (!window.supabase || !config.url || !config.anonKey) throw new Error("Supabase is not configured. Check supabase-config.js and script loading order.");
    return window.supabase.createClient(config.url, config.anonKey);
  }
  function openWhatsApp(message) {
    const orderConfig = window.JOEL_ORDER_CONFIG || {};
    const phone = String(orderConfig.ownerWhatsApp || "918610493135").replace(/[^0-9]/g, "");
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
    const tab = window.open(url, "_blank");
    if (!tab) window.location.assign(url);
  }
  async function uploadOrderFiles(args) {
    const config = getConfig();
    const db = client();
    const bucket = config.bucket || "joel-site-media";
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