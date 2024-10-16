import type { IServerEvents } from "../events";
import { MAX_PLAYERS } from "@ob/shared/config";
import type { TCustomEventListener } from "@ob/core/Events";
import { Webhook } from "simple-discord-webhooks";
import { events } from "../events";
import { trim } from "@ob/core/trim";

const { DISCORD_HOOK_URL = '' } = process.env;

export async function run(): Promise<void | Function> {
  try {

    const hook = new Webhook(new URL(DISCORD_HOOK_URL));
    await hook.send('', [
      {
        title: "💣 Обновление состояния игры",
        description: trim`
          Сервер был перезапущен!

          https://openbomber.ru/
        `,
        url: "https://openbomber.ru/",
        image: {
          url: "https://openbomber.ru/images/screen.gif"
        }
      }
    ]);

    const handler: TCustomEventListener<IServerEvents, 'changePlayes'> = ({ data: { nickname, type, totalCount } }) => {
      hook.send('', [
        {
          title: "💣 Обновление состояния игры",
          description: trim`
          ** Игрок || ${nickname.replaceAll('|', ':')} || ${type === 'in' ? 'подключился' : 'отключился'} **
          Сейчас в игре ${totalCount} из ${MAX_PLAYERS}

          https://openbomber.ru/
        `,
          url: "https://openbomber.ru/",
          image: {
            url: "https://openbomber.ru/images/screen.gif"
          }
        }
      ]).catch(console.error);
    };

    events.on('changePlayes', handler);

    return () => {
      events.off('changePlayes', handler);
    };
  }
  catch (e) {
    console.log('Ignore webhook');
  }
}
