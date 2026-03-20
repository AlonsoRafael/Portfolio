import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express, { Express } from 'express';

let cachedApp;

async function createApp() {
  const expressApp: Express = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.init();
  return expressApp;
}

export default async (req, res) => {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  
  return cachedApp(req, res);
};