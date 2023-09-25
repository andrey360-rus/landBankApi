import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json as expressJson, urlencoded as expressUrlEncoded } from "express";
import messages from "./common/config/messages";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function start() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix("api");

  const swaggerConfig = new DocumentBuilder()
    .setTitle(messages.API_TITLE)
    .setDescription(messages.API_DESCRIPTION)
    .setVersion(messages.API_VERSION)
    .addBearerAuth({ in: "header", type: "http" })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("api/swagger", app, document, {
    swaggerOptions: {
      uiConfig: {
        docExpansion: "none",
      },
    },
  });

  app.use(expressJson({ limit: "50mb" }));
  app.use(expressUrlEncoded({ limit: "50mb", extended: true }));
  await app.listen(PORT, () => console.log(`started on port - ${PORT}`));
}

start();
