# Use Case: Modular Swagger

I started developing this package because I wanted to manage large Swagger specifications in a modular way.

The fixtures in this directory reflect the classic Swagger 2.0 Petstore example, as provided by the [Swagger Editor](http://editor.swagger.io/) project in June 2015. `petstore-swagger.json` is what the editor gave via `File > Download JSON`, and the subdirectories in this folder mirror the YAML version in the editor, broken up into more manageable (to me, anyway) chunks.

The test for this use case uses `should.eql` to do a deep comparison on the objects loaded via the `inc/dir` and `inc/file` YAML types, and the complete exported Swagger definition.