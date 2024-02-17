## About this folder

This folder contains multiple entities used throughout the whole repository. They are organized in the following manner:
- **Controllers**: Are the entity that connects all the other ones. They can access all the other files, but should not have imports from Svelte.
- **Models**: Business entities for the repository. They may contain specific Business rules for that single entity.
- **Mutations**: Contain static class that mutate (manipulate) the data in stores. 
- **Stores**: Entities that store the data that will be used by the frontend.
---
