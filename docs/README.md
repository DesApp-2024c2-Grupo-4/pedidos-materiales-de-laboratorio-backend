# Documentación del proyecto

## Contenido
- Estructura de directorios
    - Documentación
    - Código
- [Estructura de un módulo](./module/README.md)
- [Comunicación por websockets](./websockets/README.md)

## Estructura de archivos

### Tipos de archivo


### Documentación
```
    .docs
    +-- README.md 
    +-- insomnia
    |   +-- example-env.json
    |   +-- Insomnia.json
    +-- DOC_A
    |   +-- img
    |   |   +-- img_A.ts
    |   |   +-- img_B.ts
    |   +-- README.md 
    +-- DOC_B
    |   +-- img
    |   |   +-- img_A.ts
    |   |   +-- img_B.ts
    |   +-- README.md 
    +-- img
    |   +-- img_A.ts
    |   +-- img_B.ts
```

### Código
```
    .src
    +-- main.ts
    +-- app.moodule.ts
    +-- auth
    |   +-- providers
    |   |   +-- auth-A.provider.ts
    |   |   +-- B.metadata.ts
    |   +-- register-token
    |   |   +-- register-token-db.service.ts
    |   |   +-- register-token.dto.ts
    |   |   +-- register-token.erros.ts
    |   +-- strategies
    |   |   +-- authStrat_A.guard.ts
    |   |   +-- authStrat_A.strategy.ts
    |   |   +-- authStrat_B.guard.ts
    |   |   +-- authStrat_B.strategy.ts
    |   +-- auth-socketio.adapter.ts
    |   +-- auth.controller.ts
    |   +-- auth.module.ts
    |   +-- auth.service.ts
    +-- config
    |   +-- commonConfig_A.provider.ts
    |   +-- commonConfig_B.provider.ts
    +-- const
    |   +-- commonConst_A.const.ts
    |   +-- commonConst_B.const.ts
    +-- dto
    |   +-- commonDto_A.dto.ts
    |   +-- commonDto_B.dto.ts
    +-- REST module A
    |   +-- module_A-db.service.ts
    |   +-- module_A.const.ts
    |   +-- module_A.controller.ts
    |   +-- module_A.dto.ts
    |   +-- module_A.erros.ts
    |   +-- module_A.module.ts
    |   +-- module_A.service.ts
    +-- WS module B
    |   +-- module_A-db.service.ts
    |   +-- module_A.const.ts
    |   +-- module_A.gateway.ts
    |   +-- module_A.dto.ts
    |   +-- module_A.erros.ts
    |   +-- module_A.module.ts
    |   +-- module_A.service.ts
    +-- schemas
    |   +-- common
    |   |   +-- commonSchema_A.schema.ts
    |   |   +-- commonSchema_B.schema.ts
    |   +-- schema_A.schema.ts
    |   +-- schema_B.schema.ts
    +-- shared
    |   +-- sharedLib_A.ts
    |   +-- sharedLib_B.ts
    +-- types
    |   +-- type_A.ts
    |   +-- type_B.ts
    +-- utils
    |   +-- validation
    |   |   +-- val_A.validator.ts
    |   |   +-- val_B.validator.ts
    |   +-- util_A.ts
    |   +-- util_B.ts
    
```


