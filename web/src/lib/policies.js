export const SHOP = {
  name: "ChoClo",
  email: "prerakshrestha2026.com", 
  phone: "9860858803", 
  location: "Kathmandu, Nepal", 
  deliveryValley: "1 to 3 working days", 
  deliveryOutside: "3 to 7 working days", 
  deliveryFee: "Delivery charges, if any, are shown before you place your order.", 
  returnDays: 3, 
  refundMethod: "a bank or mobile wallet transfer", 
  refundTime: "5 to 7 working days", 
  updated: "November 2026",
};

const { name, email, phone } = SHOP;
const contact = `You can reach us at ${email} or ${phone}.`;

export const POLICIES = {
  shipping: {
    title: "Shipping policy",
    intro: `This page explains how ${name} delivers your order.`,
    sections: [
      {
        heading: "Where we deliver",
        paragraphs: ["We currently deliver within Nepal."],
      },
      {
        heading: "How your order reaches you",
        items: [
          "You place your order on our website.",
          "We call or text you to confirm the order and your delivery details.",
          "We dispatch your order.",
          "You pay in cash when it arrives.",
        ],
      },
      {
        heading: "Delivery times",
        items: [
          `Kathmandu Valley: ${SHOP.deliveryValley}.`,
          `Outside the Valley: ${SHOP.deliveryOutside}.`,
        ],
        paragraphs: [
          "These are estimates and start from the moment we confirm your order. Delays can happen during festivals, bad weather or road closures.",
        ],
      },
      {
        heading: "Delivery charges",
        paragraphs: [SHOP.deliveryFee],
      },
      {
        heading: "Please keep your phone on",
        paragraphs: [
          "We contact you before we ship, and the courier may call before delivery. If we cannot reach you, or the order is refused at the door, we may cancel it.",
        ],
      },
      {
        heading: "Your address",
        paragraphs: [
          "Please give a complete and correct address and phone number. We are not responsible for delays or failed deliveries caused by incorrect details.",
        ],
      },
      {
        heading: "Tracking your order",
        paragraphs: [
          "Log in and open My orders to see the current status of each order.",
        ],
      },
      { heading: "Questions", paragraphs: [contact] },
    ],
  },

  refunds: {
    title: "Refunds and cancellation",
    intro: "How to cancel an order, return an item, and get your money back.",
    sections: [
      {
        heading: "Cancelling an order",
        paragraphs: [
          "You can cancel an order any time before it has been shipped. Contact us with your order number and we will cancel it. Once an order has shipped, please follow the returns steps below.",
        ],
      },
      {
        heading: "Returns",
        paragraphs: [
          `You can return an item within ${SHOP.returnDays} days of receiving it if it is unused, unwashed and in its original condition.`,
          "If an item is damaged, defective or not what you ordered, you can always return it, and we will cover the cost of the return.",
        ],
      },
      {
        heading: "How to return an item",
        items: [
          "Contact us with your order number and, if the item is damaged or wrong, a photo.",
          "We will confirm the return and tell you how to send the item back.",
          "Once we receive and check the item, we will process your refund.",
        ],
      },
      {
        heading: "Refunds",
        paragraphs: [
          `Because we take payment in cash on delivery, refunds are sent by ${SHOP.refundMethod}. Refunds are processed within ${SHOP.refundTime} after we approve the return.`,
        ],
      },
      {
        heading: "Exchanges",
        paragraphs: [
          "We are happy to exchange an item for a different size or color, subject to stock. Contact us within the return period.",
        ],
      },
      { heading: "Contact", paragraphs: [contact] },
    ],
  },

  terms: {
    title: "Terms and conditions",
    intro: `By using this website and placing an order, you agree to these terms with ${name}.`,
    sections: [
      {
        heading: "Your account",
        paragraphs: [
          "You are responsible for keeping your password private and for everything done through your account. Please give accurate information when you register and when you order.",
        ],
      },
      {
        heading: "Orders",
        paragraphs: [
          "Placing an order is a request to buy. We accept an order when we confirm it with you by phone or text and dispatch it. We may decline or cancel an order, for example if an item is out of stock, a price was shown incorrectly, or we cannot reach you to confirm.",
        ],
      },
      {
        heading: "Prices and payment",
        paragraphs: [
          "Prices are shown in Nepali rupees. We currently accept cash on delivery only. We may change prices at any time, but the price you saw when you placed your order is the price we confirm, unless it was a clear mistake.",
        ],
      },
      {
        heading: "Products",
        paragraphs: [
          "We try to show colors and details accurately, but they can look slightly different on different screens.",
        ],
      },
      {
        heading: "Our content",
        paragraphs: [
          `The designs, text and images on this website belong to ${name} or are used with permission. Please do not copy them without asking.`,
        ],
      },
      {
        heading: "Limits of our responsibility",
        paragraphs: [
          "We do our best to keep the website available and accurate, but we cannot promise it will always be free of errors or interruptions. To the extent allowed by law, our responsibility for any order is limited to the amount you paid for it.",
        ],
      },
      {
        heading: "Changes to these terms",
        paragraphs: [
          "We may update these terms from time to time. The date at the top of this page shows the latest version.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: ["These terms are governed by the laws of Nepal."],
      },
      { heading: "Contact", paragraphs: [contact] },
    ],
  },

  privacy: {
    title: "Privacy policy",
    intro: `This page explains what information ${name} collects and how we use it.`,
    sections: [
      {
        heading: "What we collect",
        items: [
          "Account details: your name, email address and a password that we store only in scrambled (hashed) form, so we cannot read it.",
          "Order details: the name, address, city and phone number you give us for delivery, and what you ordered.",
          "Your cart, so it is still there when you come back.",
        ],
      },
      {
        heading: "How we use it",
        items: [
          "To process, confirm and deliver your orders.",
          "To contact you about your order.",
          "To keep your account secure and show your order history.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "We use one cookie to keep you logged in. It is needed for the site to work, and it cannot be read by scripts running on the page. We do not currently use advertising or analytics cookies.",
        ],
      },
      {
        heading: "Who we share it with",
        paragraphs: [
          "We share your name, address and phone number with the courier only so they can deliver your order. We use service providers to host this website, store our data and host product pictures. We do not sell your personal information.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "We keep your account while you use it, and keep order records as long as we need them for delivery, returns and our own records.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          `You can ask us to show, correct or delete the information we hold about you. ${contact}`,
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "We may update this policy as the website grows, for example if we add online payments or analytics. The date at the top shows the latest version.",
        ],
      },
    ],
  },
};