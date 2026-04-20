# Kiosk - Unauthenticated User Experience

We want the McDonald's self-ordering kiosks: the large touchscreen screens where customers place their own orders.

Their rollout was part of a broader corporate modernization initiative known as the "Experience of the Future" (EOTF)

## Visual Design

The visual design of McDonald's self-ordering kiosks is a heavily engineered psychological and functional experience aimed at making the ordering process feel effortless while subtly encouraging larger purchases.

### 1. High-Fidelity Food Photography

* "Appetite Stimulation": Images use "Dynamic Contrast" to maximize the perceived texture of items, such as the dew on cold cups or the steam from a burger.
* Time-Adaptive Visuals: The brightness of images and the featured menu items (e.g., coffee in the morning vs. family bundles at night) are adjusted based on the time of day to match your circadian rhythm and appetite.

### 2. Behavioral Design and "Nudges"

* Guided Discovery: The interface follows a linear path (Meal → Customize → Sides → Drinks) to reduce decision fatigue and guide you naturally toward add-ons.
* Strategic Upselling: Upsell options often feature larger, brighter buttons for "YES" (like "Make it a Meal"), while "No" or decline options are smaller and more subdued.
* Price Anchoring: Combo meals are often displayed first with "best value" tags. This sets a mental reference point that makes individual add-ons feel cheaper by comparison.

### 3. Accessibility Features

To ensure the design works for everyone, the kiosks include specialized visual modes:

* Reach Mode: This lowers the entire interface to the bottom half of the 32-inch screen so that all buttons are within reach for wheelchair users or shorter individuals.
* Magnification Mode: Users can zoom into any part of the screen to enlarge text and food icons for better legibility.
* Color Contrast: The UI uses high-contrast colors and the official brand font (Speedee) to ensure information is clear and readable.

### 4. Interactive Feedback

* Dopamine Triggers: Every action—like adding an item to the cart—is met with a "micro-celebration" animation (typically lasting 400 milliseconds) and a soft "reward tone" to provide positive reinforcement.
* Progress Indicators: Visual cues show you exactly where you are in the ordering process, which reduces the "pain of paying" and makes the experience feel like a game.

## Rewards Program

The MyMcDonald’s Rewards program is visually woven into the kiosk journey through three distinct phases: identification, personalized browsing, and the "Earn & Burn" checkout.

### 1. The Identification Stage (Entry Point)
Before you even touch the menu, the kiosk uses high-contrast prompts to invite you to sign in: 

* Omnichannel Identity: A prominent "Earn Points" or "I'm a Rewards Member" button appears on the home screen.
* QR/Code Scanning: The UI displays a clear instruction to scan your phone's app QR code or enter a 4-digit code generated in the McDonald's App.
* Welcome Feedback: Once scanned, a personalized greeting (e.g., "Welcome back, [Name]") appears, signaling that the kiosk has successfully synced your profile and point balance.

### 2. Personalized Menu Navigation
Once logged in, the standard visual hierarchy shifts to prioritize your history:

* Dynamic Dashboards: A real-time points tracker is often pinned to the corner of the screen, showing exactly how many points you have and how close you are to your next reward tier. 
* "Favorites" Section: A dedicated visual category for "Recent Orders" and "Favorites" appears at the top of the menu, significantly reducing your time-to-order. 
* Animated Rewards: Items you have enough points to "buy" are often highlighted with "heroic" animations or special frames to make them stand out from standard paid items. 

### 3. "Earn & Burn" Checkout Flow
The final stages of the checkout process are designed to celebrate point accumulation:

* One-Tap Redemption: During the final order review, available rewards appear as "one-tap" buttons. Redemptions are confirmed with animated micro-interactions (like sparkling or pulsing effects) to provide a sense of "winning" or achievement.
* Points Real-Time Preview: Before hitting "Pay," the kiosk shows you a visual preview of exactly how many points you will earn from the current transaction, reinforcing the value of the purchase.
* Exclusive Digital Offers: App-exclusive coupons and "Deals" are automatically applied and visually called out in the cart summary with strikethrough pricing to show your savings.

While the [McDonald's App](https://www.mcdonalds.com/us/en-us/download-app.html) is the primary gateway for all savings, the way deals are applied and fulfilled creates distinct differences between app-only experiences and kiosk-integrated offers.
## 1. App-Only Deals (Mobile Order & Pay)
These offers are strictly designed for the "Mobile Order & Pay" ecosystem.

* Redemption Only via Phone: These deals must be activated and added to your cart within the app. They cannot be "sent" to a kiosk for fulfillment.
* Pick-up Flexibility: Once ordered, you can choose to pick up via Curbside, Drive-Thru, or In-Store pickup without ever interacting with a kiosk.
* High Personalization: Many of these are "Personalized Deals" based on your specific purchase history (e.g., getting a deal on a Big Mac because you buy them frequently).
* Time-Sensitive Activation: Once you hit "Redeem" in the app, you often have a strict 10–15 minute window to complete the transaction before the code expires.

## 2. Kiosk-Integrated Offers
These are deals that appear on the kiosk screen once you log in with your app code.

* Login to Reveal: To see these, you must tap "Earn Points" on the kiosk and scan your 4-digit code. The kiosk then pulls your eligible "App Exclusive Deals" onto its large display.
* The "Kiosk Trick" (Bypassing Cooldowns): A major difference is that using deals directly on the kiosk can sometimes bypass the standard 15-minute cooldown between offers. Users often place back-to-back orders at the kiosk by refreshing their "Earn Points" code for each transaction.
* Physical Item Integration: Kiosks are often used for promotions involving physical tokens, such as Monopoly pieces or paper coupons, which the mobile app may not support for digital-only orders.

### Comparison Summary

| Feature | App-Only Deals | Kiosk-Integrated Offers |
|---|---|---|
| Activation | Within the App UI | On the Kiosk Screen after login |
| Pick-up | Curbside, Drive-Thru, or Pickup | In-store pickup only |
| Cooldown | Strict 15-minute wait | Can often be bypassed via re-login |
| Payments | Saved in-app digital card | Physical card, cash, or digital wallet |

## Security Measures

When you scan your app at a McDonald's kiosk, several layers of security work together to protect your account and data.

### 1. Dynamic Authentication Codes

Instead of a static username or password, the app generates a one-time, time-sensitive 4-digit code or QR code.

* 15-Minute Expiry: Once generated, the code is typically active for only 15 minutes. If it isn't used within that window, it expires and becomes useless to anyone who might have seen or photographed it.
* Unique Generation: A fresh code is generated for every visit, preventing "replay attacks" where a previous code could be reused.

### 2. Location-Based Verification

The system often uses geolocation to ensure the person using the code is actually at the restaurant.

* Geofencing: Codes are often tied to the specific geographic location of the store. This prevents someone from stealing a code remotely and using it at a different McDonald’s.
* Scanning Proximity: For QR codes, the physical requirement to be inches away from the kiosk's scanner provides a natural layer of security compared to remote digital logins.

### 3. Session Management and Data Purging

To protect users from the "next person in line," the kiosks are equipped with automatic session timeouts.

* Session Purge: Once a transaction is completed or the screen has been idle for a set period, the kiosk automatically logs you out and purges your session data.
* No Stored Credentials: The kiosk acts as a temporary window into your account; it does not store your app login credentials locally on the machine.

### 4. Backend Infrastructure Security

The communication between the kiosk and McDonald's servers is heavily protected:

* Encryption: Data transmitted between the kiosk and the cloud is encrypted using industry standards like HTTPS and PCI DSS (for payment-related data).
* Zero Trust Architecture: Modern kiosk systems increasingly use "Zero Trust" models, which assume no device is safe and require continuous authentication for every action.
* Firewalls and Secure Servers: McDonald's stores your actual rewards and profile data on secure, controlled servers rather than on the individual kiosk itself.

If you'd like, I can:

* Explain the privacy settings in the app to control what data is collected.
* Detail the difference between app-only deals and kiosk-exclusive offers.
* Walk through what to do if you suspect unauthorized charges on your account. 
* Compare how other fast-food kiosks (like Starbucks) handle loyalty visuals.
* Detail the psychological impact of real-time point tracking on spending habits.
* Explain the step-by-step process for the "kiosk trick" to use multiple deals.
* Detail which specific menu items (like Large Fries) are often restricted to the app.
* Help you set up your payment methods in the app for faster kiosk login.
