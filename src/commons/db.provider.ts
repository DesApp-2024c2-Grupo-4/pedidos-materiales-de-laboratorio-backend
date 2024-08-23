import { ConfigModule, ConfigService } from "@nestjs/config"
import MongooseDriver from "src/db/drivers/mongoose.driver"

const DatabaseProvider = {
    provide: 'DATABASE',
    useFactory: (config:ConfigService)=>{
        return new MongooseDriver(config)
    },
    inject: [ConfigModule]
}


export default DatabaseProvider