import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { SearchDto } from './dto/chat.dto';
import { Server, Socket } from 'socket.io';
import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { EnterRoomSuccessDto } from './types/res.types';
import { WsGuard } from 'src/auth/guards/chat.guard';
import { AhoCorasick } from 'aho-corasick';
import { searchProhibitedWords } from './forbidden.words';

@WebSocketGateway({
    cors: {
        //origin: ['ws://localhost:3002/api/live'],
        origin: '*',
    },
})
@UseGuards(WsGuard)
export class ChatGateway {
    @WebSocketServer() server: Server;
    constructor(private readonly chatService: ChatService) {}

    @SubscribeMessage('enter_room')
    async enterLiveRoomChat(client: Socket, liveId: string): Promise<EnterRoomSuccessDto> {
        //@Param('liveId') liveId: string,
        const chat = await this.chatService.enterLiveRoomChat(liveId, client);
        return {
            statusCode: 200,
            message: '채팅방 입장 성공',
        };
    }

    @SubscribeMessage('new_message')
    async createChat(client: Socket, [value, liveId]: [value: string, liveId: string]) {
        console.log(client.handshake, 'client.id', client.id);
        const { userId, nickname } = client.handshake.auth.user;
        console.log(userId, nickname);
        const filterWord = await searchProhibitedWords(value);
        console.log('=====>', filterWord);
        if (filterWord) {
            return this.server.to(client.id).emit('alert', '허용하지 않는 단어입니다.');
        }
        //유저가 30초동안 20개 이상의 메세지를 보내면 채팅 1분간 정지.
        //데이터베이스에서 확인.
        //현재 요청 시점 기준으로 유저아이디에 해당하는 유저의 데이터가 20개 이상일때/
        //근데 이렇게 하면 너무 많은 조회 발생.
        //30초 간격으로 유저가 메세지 보낼때 변수에 count해주고
        //30초가 지나면

        //정지는 정지가 발생한 시점으로부터 timeout걸어서 1분간 alert발생(채팅 도배로 잠시 채팅을 입력할 수 없습니다)
        //정지당했던 유저가 또다시 30초 동안 20개 이상의 메세지를 보내면 3분간 정지
        //또다시 보내면 5분간 정지

        //
        const saveChat = await this.chatService.createChat(client, value, liveId, userId, nickname);
        console.log('saveChat', saveChat, client.handshake.auth.user.nickname);
        return this.server.to(liveId).emit('sending_message', saveChat.content, nickname);
    }

    @SubscribeMessage('get_all_chat_by_liveId')
    async getAllChatByLiveId(client: Socket, liveId: string) {
        console.log('--');
        const socketId = client.id;
        const messages = await this.chatService.getAllChatByLiveId(liveId);
        console.log('messages', messages);
        return this.server.emit('receive_all_chat', messages);
    }

    @SubscribeMessage('getSearchChatMessage')
    async getSearchChatMessage(@MessageBody() searchDto: SearchDto, payload: { liveId: string }) {
        const { liveId } = payload;
        const findMessage = this.chatService.getSearchChatMessage(searchDto.searchValue, liveId);
        return this.server.emit('receiveGetSearchChatMessage', findMessage);
    }

    //수정 기능 고민중
    //@SubscribeMessage('updateChat')
    //async updateChat(@MessageBody() updateChatDto: UpdateChatDto, payload: { userId: number; liveId: string }) {
    //  const {userId, liveId} = payload;
    //  const updateChat = await this.chatService.updateChat(userId, liveId);

    //  return this.server.emit('receiveUpdateChat')
    //}
}
