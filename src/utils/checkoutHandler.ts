// utils/checkoutHandler.ts
export function openCheckoutModal(selectedTrack: any, licenseType: 'basic' | 'exclusive' = 'basic') {
  // Dynamically pull the correct locked price from your Supabase pipeline object
  const finalPrice = licenseType === 'exclusive' 
    ? selectedTrack.exclusivePrice 
    : selectedTrack.basicPrice;

  console.log(`Loading checkout for: ${selectedTrack.title} at $${finalPrice}`);
  
  // Render your dynamic price right into the checkout UI element
  const priceDisplay = document.getElementById('checkout-display-price');
  if (priceDisplay) {
    priceDisplay.innerText = `$${finalPrice.toFixed(2)}`;
  }
}
