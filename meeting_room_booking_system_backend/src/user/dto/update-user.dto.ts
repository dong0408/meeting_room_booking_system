import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  headPic: string;
  @ApiProperty({ example: '德玛西亚之力' })
  nickName: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  @ApiProperty({ example: 'gailun@qq.com' })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty({ example: '123456  ' })
  captcha: string;
}
