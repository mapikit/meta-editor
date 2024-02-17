## About this folder
This folder contains Stores to **hold** UI State. This contains many Svelte stores to enable watching values.

For manipulation, rules, and helpers, refer to the `./mutations` folder. Additionally, classes in these files may have getters for accessing or computing information more easily. They also may export a singleton.

Classes should follow the naming pattern of "<NAME>Store" in PascalCase.

When CONTROLLERS require accessing store values, a getter or a method should be made available so the CONTROLLER does not import svelte stuff.
