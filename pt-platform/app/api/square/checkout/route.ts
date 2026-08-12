import { NextRequest, NextResponse } from "next/server";
import { getSquareClient } from "@/lib/square";
import { createAdminSupabase } from "@/lib/supabase";

// Called from the client signup page after Supabase auth account is created.
// Creates a Square customer + a recurring monthly subscription, then
// stores the Square IDs on the client's row.
export async function POST(req: NextRequest) {
  try {
    const { clientId, fullName, email, cardNonce } = await req.json();

    if (!clientId || !fullName || !email || !cardNonce) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const square = getSquareClient();

    // 1. Create (or reuse) the Square customer
    const customerResp = await square.customers.create({
      givenName: fullName,
      emailAddress: email,
    });
    const squareCustomerId = customerResp.customer?.id;
    if (!squareCustomerId) throw new Error("Failed to create Square customer");

    // 2. Save the card on file against that customer
    const cardResp = await square.cards.create({
      idempotencyKey: crypto.randomUUID(),
      sourceId: cardNonce,
      card: { customerId: squareCustomerId },
    });
    const cardId = cardResp.card?.id;
    if (!cardId) throw new Error("Failed to save card");

    // 3. Create the recurring monthly subscription
    // NOTE: replace planVariationId with the ID of the subscription plan
    // variation you create in the Square Dashboard under Subscriptions.
    const subscriptionResp = await square.subscriptions.create({
      idempotencyKey: crypto.randomUUID(),
      locationId: process.env.SQUARE_LOCATION_ID!,
      planVariationId: process.env.SQUARE_PLAN_VARIATION_ID!,
      customerId: squareCustomerId,
      cardId,
    });

    // 4. Save everything to Supabase
    const admin = createAdminSupabase();
    await admin
      .from("clients")
      .update({
        square_customer_id: squareCustomerId,
        square_subscription_id: subscriptionResp.subscription?.id,
        subscription_status: "active",
        status: "active",
      })
      .eq("id", clientId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Square checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
