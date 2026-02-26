"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let WsGateway = class WsGateway {
    constructor() {
        this.clientRoom = new Map();
    }
    handleConnection(client) {
        console.log(`🔌 Connected: ${client.id}`);
    }
    handleDisconnect(client) {
        const room = this.clientRoom.get(client.id);
        if (room) {
            client.to(room).emit('peer-left', { timestamp: Date.now() });
            this.clientRoom.delete(client.id);
            console.log(`🔌 ${client.id} left room ${room}`);
        }
        console.log(`🔌 Disconnected: ${client.id}`);
    }
    handleJoinSession(client, payload) {
        const room = `session-${(payload.code || '').toUpperCase()}`;
        client.join(room);
        this.clientRoom.set(client.id, room);
        client.to(room).emit('peer-joined', {
            role: payload.role,
            timestamp: Date.now(),
        });
        console.log(`📡 ${payload.role} ${client.id} joined room ${room}`);
        return { success: true, room };
    }
    handleLeaveSession(client, payload) {
        const room = `session-${(payload.code || '').toUpperCase()}`;
        client.leave(room);
        this.clientRoom.delete(client.id);
        client.to(room).emit('peer-left', { timestamp: Date.now() });
        return { success: true };
    }
    handleCVUpdate(client, payload) {
        const data = {
            reps: payload.reps ?? 0,
            formAccuracy: payload.formAccuracy ?? 0,
            timestamp: payload.timestamp ?? Date.now(),
        };
        const room = this.clientRoom.get(client.id);
        if (room) {
            client.to(room).emit('cv-update', data);
        }
        else {
            this.server.emit('cv-update', data);
        }
        console.log(`🎥 cv-update from ${client.id} → room ${room ?? 'broadcast'}`);
        return { success: true };
    }
    broadcastSensorData(data, code) {
        if (code) {
            this.server.to(`session-${code.toUpperCase()}`).emit('sensor-data', data);
        }
        else {
            this.server.emit('sensor-data', data);
        }
        console.log(`📊 sensor-data → ${code ? `session-${code}` : 'broadcast'}: ${data.value}`);
    }
    broadcastCVData(data, code) {
        if (code) {
            this.server.to(`session-${code.toUpperCase()}`).emit('cv-update', data);
        }
        else {
            this.server.emit('cv-update', data);
        }
    }
    getConnectedClientsCount() {
        return this.clientRoom.size;
    }
};
exports.WsGateway = WsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-session'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WsGateway.prototype, "handleJoinSession", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-session'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WsGateway.prototype, "handleLeaveSession", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('cv-update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], WsGateway.prototype, "handleCVUpdate", null);
exports.WsGateway = WsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', credentials: true },
        transports: ['websocket', 'polling'],
        allowEIO3: true,
    })
], WsGateway);
//# sourceMappingURL=ws.gateway.js.map