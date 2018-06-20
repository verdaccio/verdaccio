---
id: use-cases
title: "Casos de Usos"
---
## Uso de paquetes privados

Puede agregar usuarios y administrar qué usuarios pueden acceder a cuál paquete.

Se recomienda que defina un prefijo para sus paquetes privados, por ejemplo "local", así que todos sus elementos privados se verán así: `local-foo`. De esta manera puede separar claramente los paquetes públicos de los privados.

## Uso de paquetes públicos desde npmjs.org

Si algún paquete no existe en el almacenamiento, el servidor intentará recuperarlo desde npmjs.org. Si npmjs.org está fuera de línea, proporciona paquetes desde el caché que simulan que no existen otros paquetes. Verdaccio descargará solo los que necesita (los solicitados por los clientes), y esta información se almacenará en caché, entonces si un cliente pregunta lo mismo por segunda vez, puede ser atendido sin preguntar a npmjs.org por eso.

Ejemplo: si solicita exitosamente express@3.0.1 desde este servidor una vez, podrá hacerlo nuevamente (con todas sus dependencias) en cualquier momento incluso si npmjs.org está fuera de línea. Pero digamos que express@3.0.0 no se descargará hasta que realmente alguien lo necesite. Y si npmjs.org no está conectado, este servidor diría que solo express@3.0.1 (únicamente lo que está en caché) se publicará, pero nada más.

## Anular paquetes públicos

Si quiere utilizar una versión modificada de algún paquete público `foo`, puede sólo publicarlo en su servidor local, así que cuando escriba `npm install foo`, lo considerará instalando su versión.

There's two options here:

1. You want to create a separate fork and stop synchronizing with public version.
    
    If you want to do that, you should modify your configuration file so verdaccio won't make requests regarding this package to npmjs anymore. Add a separate entry for this package to *config.yaml* and remove `npmjs` from `proxy` list and restart the server.
    
    When you publish your package locally, you should probably start with version string higher than existing one, so it won't conflict with existing package in the cache.

2. You want to temporarily use your version, but return to public one as soon as it's updated.
    
    In order to avoid version conflicts, you should use a custom pre-release suffix of the next patch version. For example, if a public package has version 0.1.2, you can upload 0.1.3-my-temp-fix. This way your package will be used until its original maintainer updates his public package to 0.1.3.