import mongoose from 'mongoose'
import handlePromise from '../../utils/promise'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class MongooseDriver {
  constructor(private readonly config:ConfigService){
    this.connect()
  }

  async connect(){
    const connectionString = this.getConnectionString()

    const [_, err] = await handlePromise(mongoose.connect(connectionString))

    if(err) return console.log(`Error al conectarse a mongo (${connectionString})`, err)

    console.log(`Conexion a mongo con exito`)
  }

  private getConfig(){
    const host = this.config['DB_HOST'] || 'localhost'
    const port = this.config['DB_PORT']  || '27017'
    const username = this.config['DB_USERNAME']  || 'root'
    const password = this.config['DB_PASSWORD']  || 'example'
    const collection = this.config['DB_COLLECTION']  || 'alumnos'
    const authSource = this.config['DB_AUTH_SOURCE']  || 'admin'

    return {
        host,
        port,
        username: encodeURIComponent(username),
        password: encodeURIComponent(password),
        collection: encodeURIComponent(collection),
        authSource: encodeURIComponent(authSource),
    }
  }

  private getConnectionString(): string {
    const {
        host,
        port,
        username,
        password,
        collection,
        authSource,
    } = this.getConfig()

    return `mongodb://${username}:${password}@${host}:${port}/${collection}?authSource=${authSource}`
  }
}