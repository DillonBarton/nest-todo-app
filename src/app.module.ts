import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { PostgresModule } from './postgres/postgres.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'PRODUCTION'
          ? '.env.production'
          : '.env.development',
    }),
    TodoModule,
    PostgresModule,
  ],
})
export class AppModule {}
