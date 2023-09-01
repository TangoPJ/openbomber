import { Server } from "http";
import { Server as SocketIO } from "socket.io";
import { createLogger } from "vite";

import { calc, makeData } from "../core/verify";
import { verifyApi } from "../shared/api";
import { MAX_ADDRESS_CONNECT } from "../shared/config";
import { Game } from "./class/Game";
import { IS_DEV } from "./env";

const logger = createLogger('info', { allowClearScreen: true });

export function game(server: Server) {
  const socketio = new SocketIO(server);
  const addresses = new Map<string, number>();

  const game = new Game({
    fillAchivments: IS_DEV ? .9999 : .55,
    fillBlocks: .4
  });

  socketio.on('connection', async socket => {
    const api = verifyApi.use(socket);
    const nums = makeData();
    const address = socket.handshake.headers['x-real-ip'] as string;

    addresses.set(
      address,
      (addresses.get(address) ?? 0) + 1
    );

    socket.once('disconnect', () => {
      api();
      game.leave(socket);
      addresses.set(
        address,
        (addresses.get(address) ?? 0) - 1
      );
    });

    if (await api.verify(nums) !== calc(nums))
      return socket.disconnect();

    const count = addresses.get(address) ?? 0;

    if (count > MAX_ADDRESS_CONNECT) {
      logger.info(`Address block ${address}`);
      api.addressBlock(MAX_ADDRESS_CONNECT);
      return;
    }

    game.join(socket);
  });
}