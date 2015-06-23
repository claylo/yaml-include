# Example

This an example based on the main reason this package was written: modularizing a Swagger API spec.

Take a look at `swagger/spec.yaml`, which contains several include tags.

To see the resulting Swagger JSON, use your terminal to run:

```shell
$ node build
```

The generated JSON file will be dumped to `stdout`.