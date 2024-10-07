import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfig(app) {
  const config = new DocumentBuilder()
    .setTitle('Link Tracker Starter Node Challenger | Bidcom')
    .setDescription(
      'Link Tacker is a system to track masked URLs and to get analytics on how many times each link was called. how many times each link was called, as well as adding business rules for the redirect operation. redirect operation.',
    )
    .setVersion('1.0')
    //.addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
