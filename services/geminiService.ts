
import { GoogleGenAI, Type } from "@google/genai";
import { OrderData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export interface ImageInput {
  base64: string;
  mimeType: string;
}

export const extractOrderData = async (images: ImageInput[], platform: string): Promise<OrderData[]> => {
  const model = "gemini-2.5-flash";

  const imageParts = images.map((img) => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mimeType,
    },
  }));

  // Platform specific hints to improve accuracy
  let idHint = "Order ID is usually found at the top.";
  if (platform === 'Shopee') {
    idHint = "Shopee Order IDs are typically alphanumeric strings (e.g. 2309...).";
  } else if (platform === 'Lazada') {
    idHint = "Lazada Order IDs are typically long numeric strings. Distinguish them from Tracking Numbers.";
  } else if (platform === 'Tiktok') {
    idHint = "TikTok Shop Order IDs are typically long numeric strings (often starting with 57...).";
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        ...imageParts,
        {
          text: `Analyze these ${platform} waybill images. Each image represents a separate order or waybill. Extract data for EACH image and return a list of orders.
          
          For each order, specifically extract:
          1. **Order ID**: ${idHint} Map this to 'invoiceNumber'.
          2. **Customer Name**: The 'To' or 'Consignee' name.
          3. **Courier Service**: Look for logos or text indicating the carrier. Common ${platform} carriers include SPX, J&T, FLASH, LEX DO, YTO, Kerry, Ninja Van, XDE.
          4. **Items**: Extract Product Name, Quantity, and specifically look for **Variation** (e.g., Color, Size, Model) if mentioned near the product name.
          
          Also extract standard invoice fields if visible (totals, dates).
          `
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            invoiceNumber: { type: Type.STRING, description: "The Order ID found at the top of the image" },
            date: { type: Type.STRING },
            customerName: { type: Type.STRING, description: "The Consignee or 'To' name" },
            customerAddress: { type: Type.STRING },
            customerEmail: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING, description: "Product Name" },
                  variation: { type: Type.STRING, description: "Product Variation (e.g. Size, Color, Type)" },
                  quantity: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER },
                  total: { type: Type.NUMBER },
                  sku: { type: Type.STRING },
                },
              },
            },
            subtotal: { type: Type.NUMBER },
            tax: { type: Type.NUMBER },
            shippingCost: { type: Type.NUMBER },
            grandTotal: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            trackingNumber: { type: Type.STRING },
            carrier: { type: Type.STRING, description: "One of: SPX, J&T, FLASH, LEX DO, YTO, Ninja Van, Kerry, etc" },
            weight: { type: Type.STRING },
          },
          required: ["invoiceNumber", "customerName"],
        },
      },
    },
  });

  if (!response.text) {
    throw new Error("No data returned from Gemini");
  }

  try {
    const data: OrderData[] = JSON.parse(response.text);
    return data;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Failed to parse extracted data.");
  }
};
