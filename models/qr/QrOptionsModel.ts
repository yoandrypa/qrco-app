import dynamoose from '../../libs/gateways/dynamodb/dynamoose';

const CornersSchema = new dynamoose.Schema({
  topL: String,
  topR: String,
  bottom: String
});

const QrOptionsSchema = new dynamoose.Schema({
  id: {
    hashKey: true,
    type: String
  },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  type: { type: String, required: true },
  data: { type: String, required: true },
  image: String,
  margin: { type: Number, required: true },
  qrOptions: {
    type: Object,
    required: true,
    schema: {
      typeNumber: { type: Number, required: true },
      mode: { type: String, required: true },
      errorCorrectionLevel: { type: String, required: true }
    }
  },
  imageOptions: {
    type: Object,
    required: true,
    schema: {
      hideBackgroundDots: { type: Boolean, required: true, default: true },
      imageSize: { type: Number, required: true },
      margin: { type: Number, required: true },
      crossOrigin: { type: String, required: true }
    }
  },
  dotsOptions: {
    type: Object,
    required: true,
    schema: {
      color: { type: String, required: true },
      type: { type: String, required: true }
    }
  },
  backgroundOptions: {
    type: Object,
    required: true,
    schema: {color: { type: String, required: true }}
  },
  cornersSquareOptions: {
    type: Object,
    required: true,
    schema: {
      color: { type: String, required: true },
      type: { type: String, required: true }
    }
  },
  cornersDotOptions: {
    type: Object,
    required: true,
    schema: {
      color: { type: String, required: true },
      type: { type: String, required: true }
    }
  },
  background: {
    type: Object,
    required: false,
    schema: {
      type: String,
      opacity: Number,
      size: Number,
      file: String,
      x: Number,
      y: Number,
      imageSize: Number,
      invert: { type: Boolean, required: false, default: false },
      backColor: String
    }
  },
  frame: {
    type: Object,
    required: false,
    schema: {
      type: String,
      text: String,
      color: String,
      textColor: String,
      textUp: { type: Boolean, required: false, default: false }
    }
  },
  corners: {
    type: Object,
    required: false,
    schema: CornersSchema
  },
  cornersDot: {
    type: Object,
    required: false,
    schema: CornersSchema
  }
}, {
  "timestamps": true
});

// create a model from schema and export it
export const QrOptionsModel = dynamoose.model("qr_options", QrOptionsSchema);
