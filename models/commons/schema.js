import dynamoose from "../../libs/gateways/dynamodb/dynamoose";

const { Schema: BaseSchema } = dynamoose;

export default class Schema extends BaseSchema {
  constructor(definition, settings = {}) {
    super(definition, settings);
    //  TODO: Customize schema class
  }
}
