import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase";
import crypto from "crypto";

// Square calls this URL whenever a subscription's status changes
// (payment succeeded, payment failed, subscription cancelled, etc).
// Register this URL in the Square Developer Dashboard under Webhooks:
// https://yourdomain.com/api/square/webhook
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify the request actually came from Square
  const signature = req.headers.get("x-square-hmacsha256-signature") || "";
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!;
  const notificationUrl = process.env.SQUARE_WEBHOOK_URL!; // full URL Square is configured to call

  const hmac = crypto.createHmac("sha256", signatureKey);
  hmac.update(notificationUrl + rawBody);
  const expected = hmac.digest("base64");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const type = event.type;
  const subscription = event.data?.object?.subscription;

  if (subscription?.id) {
    const admin = createAdminSupabase();

    let subscription_status = "active";
    if (type === "subscription.updated") {
      const state = subscription.status; // ACTIVE, CANCELED, PAUSED, etc.
      if (state === "CANCELED") subscription_status = "cancelled";
      else if (state === "PAUSED") subscription_status = "past_due";
      else subscription_status = "active";
    }

    await admin
      .from("clients")
      .update({ subscription_status })
      .eq("square_subscription_id", subscription.id);
  }

  return NextResponse.json({ received: true });
}
