# subgram-typescript-sdk

## Installation
For npm users
```bash
npm install @subgram/sdk
```
For yarn users
```bash
yarn add @subgram/sdk
```
For bun users
```bash
bun install @subgram/sdk
```

## Usage
Get your Subgram API token and create a new instance of Subgram API class 
```typescript
import Subgram from "@subgram/sdk"

if (!process.env.SUBGRAM_API_TOKEN) {
  throw new Error("SUBGRAM_API_TOKEN is not defined");
}

export const SubgramAPI = new Subgram(process.env.SUBGRAM_API_TOKEN!);
```

## Examples

### telegraf.js
If your Telegram bot is built with `telegraf.js`, you can integrate Subgram API with your bot using this example:

```typescript
import Subgram from "@subgram/sdk";
import { Telegraf, Context } from "telegraf";

const SUBGRAM_PRODUCT_ID = <YOUR_PRODUCT_ID>;

if (!process.env.SUBGRAM_API_TOKEN) {
  throw new Error("SUBGRAM_API_TOKEN is not defined");
}

const SubgramAPI = new Subgram(process.env.SUBGRAM_API_TOKEN!);
const bot = new Telegraf<Context>(process.env.BOT_TOKEN!);

bot.start(async (ctx: Context) => {
  const buttons = [{ text: "Subscribe to Pro", action: "SUBSCRIBE" }];
  const keyboard = Markup.inlineKeyboard(
    buttons.map((button) => Markup.button.callback(button.text, button.action))
  );
  return ctx.reply("Welcome to my bot! Subscribe using the button below", keyboard);
})

bot.action("SUBSCRIBE", async (ctx: Context) => {
  const hasAccess = await SubgramAPI.hasAccess(ctx.from.id, SUBGRAM_PRODUCT_ID);
  const { checkout_url: checkoutUrl } = await SubgramAPI.createCheckoutPage(SUBGRAM_PRODUCT_ID, ctx.from.id, ctx.from.username, "en")
  if (hasAccess) {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp('🔐 Manage subscription', checkoutUrl)],
    ]);
    return ctx.reply("You are already subscribed! Click the button below to manage subscription", keyboard);
  } else {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp('💎 Subscribe', checkoutUrl)],
    ]);
    return ctx.reply("Click the button below to subscribe", keyboard);
  }
})
```

## Contributing
We welcome contributions to Subgram SDK. Please fork this repository, make your changes, and open a pull request.

You can install the dependencies using `bun` and `node 18+`:
```bash
bun install
```