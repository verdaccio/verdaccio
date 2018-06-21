---
id: use-cases
title: "Casos de Usos"
---
## Uso de paquetes privados

Puede agregar usuarios y administrar qué usuarios pueden acceder a cuáles paquetes.

Se recomienda que defina un prefijo para sus paquetes privados, por ejemplo "local", así que todos sus elementos privados se verán así: `local-foo`. De esta manera puede separar claramente los paquetes públicos de los privados.

## Uso de paquetes públicos desde npmjs.org

Si algún paquete no existe en el almacenamiento, el servidor intentará recuperarlo desde npmjs.org. Si npmjs.org está fuera de línea, este proporciona paquetes desde el caché que simulan que no existen otros paquetes. Verdaccio descargará solo los que necesita (los solicitados por los clientes), y esta información se almacenará en caché, entonces si un cliente pregunta lo mismo por segunda vez, puede ser atendido sin preguntar a npmjs.org por eso.

Ejemplo: si solicita exitosamente express@3.0.1 desde este servidor una vez, podrá hacerlo nuevamente (con todas sus dependencias) en cualquier momento incluso si npmjs.org está fuera de línea. Pero digamos que express@3.0.0 no se descargará hasta que realmente alguien lo necesite. Y si npmjs.org no está conectado, este servidor diría que solo express@3.0.1 (únicamente lo que está en caché) se publicará, pero nada más.

## Anular paquetes públicos

Si quiere utilizar una versión modificada de algún paquete público `foo`, puede sólo publicarlo en su servidor local, así que cuando escriba `npm install foo`, lo considerará instalando su versión.

Hay dos opciones aquí:

1. Quiere crear una bifurcación separada y detener la sincronización con la versión pública.
    
    Si quiere hacer eso, debe modificar su archivo de configuración para que verdaccio nunca más realice solicitudes en cuanto a este paquete en npmjs. Agregue una entrada separada para este paquete a *config.yaml* y elimine `npmjs` desde la lista `proxy` y reinicie el servidor.
    
    Cuando publique su paquete localmente, probablemente deberá iniciar con la cadena de versión superior a la existente, para que no entre en conflicto con el paquete existente en caché.

2. Quiere utilizar temporalmente su versión, pero regresar a la pública tan pronto como se actualice.
    
    A fin de evitar conflictos de versiones, debería utilizar un sufijo personalizado previo al lanzamiento de la siguiente versión del parche. Por ejemplo, si un paquete público tiene la versión 0.1.2, puede cargar 0.1.3-my-temp-fix. De esta manera su paquete se utilizará hasta que el desarrollador original cargue su paquete público al 0.1.3.