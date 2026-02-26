import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * WebSocket Gateway — room-based session model.
 * Each session code becomes a Socket.IO room: `session-{CODE}`.
 * Doctor and patient both join the same room so events are scoped per session.
 */
@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // clientId → session room name
  private clientRoom = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log(`🔌 Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const room = this.clientRoom.get(client.id);
    if (room) {
      client.to(room).emit('peer-left', { timestamp: Date.now() });
      this.clientRoom.delete(client.id);
      console.log(`🔌 ${client.id} left room ${room}`);
    }
    console.log(`🔌 Disconnected: ${client.id}`);
  }

  /**
   * join-session — client joins a named session room.
   * Payload: { code: string; role: 'doctor' | 'patient' }
   */
  @SubscribeMessage('join-session')
  handleJoinSession(client: Socket, payload: { code: string; role: string }) {
    const room = `session-${(payload.code || '').toUpperCase()}`;
    client.join(room);
    this.clientRoom.set(client.id, room);
    // Tell the other party that a peer connected
    client.to(room).emit('peer-joined', {
      role: payload.role,
      timestamp: Date.now(),
    });
    console.log(`📡 ${payload.role} ${client.id} joined room ${room}`);
    return { success: true, room };
  }

  /**
   * leave-session — explicitly leave the room.
   */
  @SubscribeMessage('leave-session')
  handleLeaveSession(client: Socket, payload: { code: string }) {
    const room = `session-${(payload.code || '').toUpperCase()}`;
    client.leave(room);
    this.clientRoom.delete(client.id);
    client.to(room).emit('peer-left', { timestamp: Date.now() });
    return { success: true };
  }

  /**
   * cv-update — patient sends pose data; broadcast to the same session room.
   */
  @SubscribeMessage('cv-update')
  handleCVUpdate(
    client: Socket,
    payload: { reps: number; formAccuracy: number; timestamp?: number },
  ) {
    const data = {
      reps: payload.reps ?? 0,
      formAccuracy: payload.formAccuracy ?? 0,
      timestamp: payload.timestamp ?? Date.now(),
    };
    const room = this.clientRoom.get(client.id);
    if (room) {
      client.to(room).emit('cv-update', data); // only to the doctor in this session
    } else {
      this.server.emit('cv-update', data); // fallback: no room yet
    }
    console.log(`🎥 cv-update from ${client.id} → room ${room ?? 'broadcast'}`);
    return { success: true };
  }

  /**
   * Broadcast sensor data from IoT controller to the relevant session room.
   * If no code is provided, falls back to global broadcast.
   */
  broadcastSensorData(data: { timestamp: number; value: number; pulse?: number }, code?: string) {
    if (code) {
      this.server.to(`session-${code.toUpperCase()}`).emit('sensor-data', data);
    } else {
      this.server.emit('sensor-data', data);
    }
    console.log(`📊 sensor-data → ${code ? `session-${code}` : 'broadcast'}: ${data.value}`);
  }

  broadcastCVData(data: { reps: number; formAccuracy: number; timestamp: number }, code?: string) {
    if (code) {
      this.server.to(`session-${code.toUpperCase()}`).emit('cv-update', data);
    } else {
      this.server.emit('cv-update', data);
    }
  }

  /**
   * Get number of connected doctor clients
   */
  getConnectedClientsCount(): number {
    return this.clientRoom.size;
  }
}

