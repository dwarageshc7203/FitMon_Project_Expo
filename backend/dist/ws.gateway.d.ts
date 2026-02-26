import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private clientRoom;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinSession(client: Socket, payload: {
        code: string;
        role: string;
    }): {
        success: boolean;
        room: string;
    };
    handleLeaveSession(client: Socket, payload: {
        code: string;
    }): {
        success: boolean;
    };
    handleCVUpdate(client: Socket, payload: {
        reps: number;
        formAccuracy: number;
        timestamp?: number;
    }): {
        success: boolean;
    };
    broadcastSensorData(data: {
        timestamp: number;
        value: number;
        pulse?: number;
    }, code?: string): void;
    broadcastCVData(data: {
        reps: number;
        formAccuracy: number;
        timestamp: number;
    }, code?: string): void;
    getConnectedClientsCount(): number;
}
