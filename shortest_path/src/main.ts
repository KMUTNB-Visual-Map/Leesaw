import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GraphModule } from './graph/graph.module';
import { Logger } from '@nestjs/common';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Virtual Map API')
    .setDescription('API for Graph Construction, Coordinate Snapping, and Pathfinding (Task 1.4)')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  const logger = new Logger('Bootstrap');
  logger.log('Virtual Map API Server is running on: http://localhost:3000');
  logger.log('Swagger UI is available at: http://localhost:3000/api-docs');
}
bootstrap();





