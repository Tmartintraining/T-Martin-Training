import { SquareClient, SquareEnvironment } from "square";

// Central Square client. Uses sandbox by default so you can test with
// fake cards before flipping to production once you're ready to go live.
export function getSquareClient() {
  const environment =
    process.env.SQUARE_ENV === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox;

  return new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN!,
    environment,
  });
}
