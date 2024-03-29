import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReqCreateLiveDto {
    @ApiProperty({
        required: true,
        example: 'imageUrl://',
        description: '라이브 썸네일',
    })
    @IsString()
    @IsNotEmpty()
    thumbnail: string;

    @ApiProperty({
        required: true,
        example: '[LIVE] 실시간 스트리밍',
        description: '라이브 제목',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        required: true,
        example: '최수영',
        description: '사용자 닉네임',
    })
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({
        required: true,
        example: '최수영',
        description: '사용자 닉네임',
    })
    @IsString()
    @IsNotEmpty()
    userImage: string;
}

export class ReqUpdateLiveDto extends PartialType(ReqCreateLiveDto) {
    @ApiProperty({
        example: 'imageUrl://',
        description: '라이브 썸네일',
    })
    @IsString()
    @IsOptional()
    thumbnail?: string;

    @ApiProperty({
        example: '[LIVE] 실시간 스트리밍',
        description: '라이브 제목',
    })
    @IsString()
    @IsOptional()
    title?: string;
}
