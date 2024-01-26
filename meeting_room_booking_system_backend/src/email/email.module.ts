import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
@Global()
@Module({
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
