import type { ObjectDefinition } from "@meta-system/object-definition";

export const stubDefinition : ObjectDefinition = {
  "aProp": {
      "type": "object",
      "required": true,
      "subtype": {
          "inner": {
              "type": "array",
              "required": false,
              "subtype": {
                          "4321": {
                              "type": "number",
                              "required": false
                          },
                          "test": {
                              "type": "object",
                              "required": false,
                              "subtype": {
                                  "This is a deep test bro": {
                                      "type": "boolean",
                                      "required": false
                                  }
                              }
                          },
                          "again": {
                              "type": "date",
                              "required": false
                          }
                      }
          }
      }
  }
};