# Joel Frame Work's — V5

Champagne Elegance photo-frame selling website.

## Homepage sections
- 3-slide hero
- Individual frame products with Show Details links
- Frame Gallery with asset slots
- Why Joel Frame Work's
- Our Projects showcase
- 4 video asset slots
- Services
- Testimonials
- Sizes & pricing
- Location / map
- WhatsApp + Instagram floating actions
- Image-based chat assistant

## Product ordering
Product cards open `product.html?id=...`.
Customers can select finish, upload required photos, preview the image, enter details, generate an Order ID and send the order summary to the owner's WhatsApp.

## Assets to replace later
- `assets/logo.svg`
- `assets/hero-01.jpg` / `hero-02.jpg` / `hero-03.jpg`
- `assets/gallery-01.jpg` … `gallery-06.jpg`
- `assets/project-01.jpg` … `project-04.jpg`
- `assets/video-01.mp4` … `video-04.mp4`
- `assets/product-01.jpg` … `product-10.jpg`
- Social/chat assets are already included from the provided references.

## Combo offers (new)
- Homepage now has five combo offer cards immediately above `OUR FRAME COLLECTION`.
- Each card opens `combo.html?id=combo-1` through `combo-5`.
- The combo customiser walks customers through one frame at a time, with the required size, one photo upload, eight moulding choices, live preview, and a frame-by-frame summary.
- Customer name, mobile and address are collected before preparing the WhatsApp order message.
- WhatsApp web links cannot attach local image files automatically. Customers must attach the selected photo files in the same frame order after WhatsApp opens; the message lists each photo filename and chosen frame design.
- Offer creatives are in `assets/combo-offer-1.jpg` through `assets/combo-offer-5.jpg`.


## Email attachments + WhatsApp order notification

Both Combo Offers and individual items in **OUR FRAME COLLECTION** now prepare an order email for `designsabhinav@gmail.com`. The email bundle contains the original uploaded photo(s), generated frame preview image(s), and an `ORDER-DETAILS.txt`; a preview image is also attached separately. The website then opens a WhatsApp chat with the owner at +91 86104 93135 and a pre-filled notification. The customer must press Send in WhatsApp; websites cannot silently send WhatsApp messages using a normal link.

### Required one-time EmailJS setup

The email integration needs your own EmailJS account keys before live emails can be delivered:
1. Create an EmailJS service connected to the owner's Gmail account.
2. Create an email template with **To Email** set to `{{to_email}}`, subject `{{subject}}`, and body `{{{order_message}}}` (or `{{order_message}}` for plain text).
3. In the template's **Attachments** tab add two **Variable Attachments**: parameter name `order_bundle` (filename `{{attachment_filename}}`, type ZIP/application-zip) and parameter name `order_preview` (filename `{{preview_filename}}`, type PNG/image/png). The EmailJS account must allow attachments.
4. Edit `order-config.js` and replace `YOUR_EMAILJS_SERVICE_ID`, `YOUR_EMAILJS_TEMPLATE_ID`, and `YOUR_EMAILJS_PUBLIC_KEY`. Keep `ownerEmail` as `designsabhinav@gmail.com` and confirm `ownerWhatsApp` is the owner's WhatsApp number in country-code format without `+`.
5. Upload the full website folder to hosting and test both a combo order and an individual frame order. If email setup is incomplete or sending fails, the website downloads the files so they can be attached manually.

The EmailJS public key is intended for browser use. Do not add a private key or Gmail password to website files. The site uses a ZIP attachment for all originals and per-frame previews to keep the order files together; the combined/individual preview is also attached separately.


## Fix for the Chrome canvas export error
If you see “Tainted canvases may not be exported”, you opened the page directly from a file:/// path. Extract the ZIP and double-click `START-JOEL-WEBSITE.bat`, then use `http://localhost:8000/index.html`. Keep the server window open. See `LOCAL-TESTING-FIX.txt`.

## V15 mobile product ordering flow
- Mobile product personalisation is organised into three steps: choose frame size/design/finish, upload a photo and inspect the live preview, then enter customer details and press Order Now.
- The mobile-only wizard is implemented in `mobile-product-wizard.js` and the corresponding responsive styles in `styles.css`.
- Desktop product ordering remains on the existing full form layout.


## Admin portal and Supabase

Open `SUPABASE-ADMIN-SETUP.txt` and follow the setup steps. The admin portal is `admin.html`; run `supabase-schema.sql` in the Supabase SQL Editor, then configure `supabase-config.js`. Do not put a Supabase service-role key in browser code.
